import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { appendFile, mkdir } from "fs/promises";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createHash, randomUUID, timingSafeEqual } from "crypto";
import { z } from "zod";
import Stripe from "stripe";
import { db } from "./db";
import { events, tickets, orders } from "./db/schema";
import { eq } from "drizzle-orm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  typescript: true,
});

type LeadProvider = "mailchimp" | "beehiiv" | "convertkit" | "hubspot";

const leadSchema = z.object({
  email: z.string().email(),
  firstName: z.string().trim().max(80).optional(),
  lastName: z.string().trim().max(80).optional(),
  consent: z.literal(true),
  source: z.string().trim().max(120).optional(),
  eventInterest: z.string().trim().max(120).optional(),
  utmSource: z.string().trim().max(120).optional(),
  utmMedium: z.string().trim().max(120).optional(),
  utmCampaign: z.string().trim().max(140).optional(),
  utmTerm: z.string().trim().max(140).optional(),
  utmContent: z.string().trim().max(140).optional(),
  pageUrl: z.string().url().max(500).optional(),
});

const ticketIntentSchema = z.object({
  source: z.string().trim().max(120),
  eventId: z.string().trim().max(120).optional(),
});

const bookingInquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(320),
  entity: z.string().trim().min(2).max(160),
  type: z.enum(["partner-on-location", "artist-booking", "sponsorship", "general"]),
  location: z.string().trim().max(180).optional(),
  message: z.string().trim().min(10).max(5000),
});

const poshWebhookPayloadSchema = z.record(z.string(), z.unknown());

const sponsorAccessSchema = z.object({
  password: z.string().trim().min(1).max(256),
});

const adminControlsSchema = z
  .object({
    protectedRoutesDisabled: z.boolean().optional(),
    clearSponsorSessions: z.boolean().optional(),
  })
  .refine(
    (value) => value.protectedRoutesDisabled !== undefined || value.clearSponsorSessions === true,
    "Provide at least one control change"
  );

const idempotencyTtlMs = 24 * 60 * 60 * 1000;
const idempotencyCache = new Map<string, { status: number; body: unknown; expiresAt: number }>();
const idempotencyInFlight = new Map<string, Promise<{ status: number; body: unknown }>>();
const sponsorSessionTtlMs = 30 * 60 * 1000;
const sponsorSessionCookieName = "monolith_sponsor_session";
const sponsorDeckFilename = "Chasing Sun(Sets) 2026 Pitch Deck (Upgraded).pdf";
const sponsorDeckPath = path.resolve(__dirname, "..", "private", "documents", sponsorDeckFilename);
const sponsorSessions = new Map<string, number>();
const auditLogPath = process.env.AUDIT_LOG_PATH || path.resolve(__dirname, "..", "private", "audit.log");
let auditLogPathReady: Promise<void> | undefined;
let protectedRoutesDisabled = process.env.PROTECTED_ROUTES_DISABLED === "true";

interface SocialEchoEventStats {
  eventKey: string;
  eventId: string | null;
  eventTitle: string | null;
  city: string | null;
  goingCount: number;
  pendingCount: number;
  updatedAt: string;
}

interface SocialEchoActivity {
  id: string;
  at: string;
  eventType: string;
  eventKey: string;
  eventId: string | null;
  eventTitle: string | null;
  city: string | null;
  status: string | null;
  quantity: number;
  attendeeAlias: string;
}

const socialEchoByEvent = new Map<string, SocialEchoEventStats>();
const socialEchoActivity: SocialEchoActivity[] = [];
const socialEchoActivityMaxItems = 120;

function logEvent(event: string, payload: Record<string, unknown>) {
  console.log(
    JSON.stringify({
      level: "info",
      ts: new Date().toISOString(),
      event,
      ...payload,
    })
  );
}

function ensureAuditLogPath() {
  if (!auditLogPathReady) {
    auditLogPathReady = mkdir(path.dirname(auditLogPath), { recursive: true }).then(() => undefined);
  }
  return auditLogPathReady;
}

function writeAuditEvent(event: string, payload: Record<string, unknown>) {
  const line = `${JSON.stringify({
    ts: new Date().toISOString(),
    event,
    ...payload,
  })}\n`;

  void ensureAuditLogPath()
    .then(() => appendFile(auditLogPath, line, "utf8"))
    .catch((error) => {
      const message = error instanceof Error ? error.message : String(error);
      logEvent("audit.write_failed", { auditEvent: event, message });
    });
}

function readProvider(): LeadProvider {
  const provider = (process.env.LEAD_PROVIDER || "mailchimp").toLowerCase();
  if (provider === "mailchimp" || provider === "beehiiv" || provider === "convertkit" || provider === "hubspot") {
    return provider;
  }
  throw new Error("Unsupported LEAD_PROVIDER. Use mailchimp, beehiiv, convertkit, or hubspot.");
}

function scrubEmail(email: string) {
  return email.trim().toLowerCase();
}

function parseCookieHeader(cookieHeader: string | undefined) {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  for (const segment of cookieHeader.split(";")) {
    const separator = segment.indexOf("=");
    if (separator < 0) continue;
    const key = segment.slice(0, separator).trim();
    const rawValue = segment.slice(separator + 1).trim();
    if (!key) continue;

    try {
      cookies[key] = decodeURIComponent(rawValue);
    } catch {
      cookies[key] = rawValue;
    }
  }

  return cookies;
}

function pruneSponsorSessions(now = Date.now()) {
  sponsorSessions.forEach((expiresAt, token) => {
    if (expiresAt <= now) sponsorSessions.delete(token);
  });
}

function buildSponsorSessionCookie(value: string, maxAgeSeconds: number) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${sponsorSessionCookieName}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/api; HttpOnly; SameSite=Strict${secure}`;
}

function issueSponsorSession() {
  pruneSponsorSessions();
  const token = randomUUID();
  sponsorSessions.set(token, Date.now() + sponsorSessionTtlMs);
  return token;
}

function hasValidSponsorSession(token: string | undefined) {
  if (!token) return false;
  pruneSponsorSessions();
  const expiresAt = sponsorSessions.get(token);
  if (!expiresAt) return false;
  if (expiresAt <= Date.now()) {
    sponsorSessions.delete(token);
    return false;
  }
  return true;
}

function secureCompare(input: string, expected: string) {
  const inputHash = createHash("sha256").update(input).digest();
  const expectedHash = createHash("sha256").update(expected).digest();
  return timingSafeEqual(inputHash, expectedHash);
}

function readAdminToken(req: express.Request) {
  const bearer = req.header("authorization");
  if (bearer?.toLowerCase().startsWith("bearer ")) {
    const token = bearer.slice(7).trim();
    if (token) return token;
  }
  return req.header("x-admin-token")?.trim();
}

function requestActor(req: express.Request) {
  const forwardedFor = req.header("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : req.ip || null;
  return {
    ip,
    userAgent: req.header("user-agent") || null,
  };
}

function readPath(payload: Record<string, unknown>, pathParts: string[]) {
  let current: unknown = payload;
  for (const part of pathParts) {
    if (typeof current !== "object" || current === null || !(part in current)) return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function pickString(payload: Record<string, unknown>, candidates: string[]) {
  for (const candidate of candidates) {
    const value = readPath(payload, candidate.split("."));
    if (typeof value === "string") {
      const normalized = value.trim();
      if (normalized) return normalized;
    }
  }
  return null;
}

function pickQuantity(payload: Record<string, unknown>) {
  const numericCandidates = [
    "quantity",
    "ticketQuantity",
    "tickets_count",
    "numTickets",
    "order.quantity",
    "order.ticketQuantity",
    "order.tickets_count",
  ];

  for (const candidate of numericCandidates) {
    const value = readPath(payload, candidate.split("."));
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      return Math.min(20, Math.floor(value));
    }
    if (typeof value === "string") {
      const parsed = Number.parseInt(value, 10);
      if (Number.isFinite(parsed) && parsed > 0) {
        return Math.min(20, parsed);
      }
    }
  }

  const tickets = readPath(payload, ["order", "tickets"]);
  if (Array.isArray(tickets) && tickets.length > 0) {
    return Math.min(20, tickets.length);
  }

  return 1;
}

function pushSocialActivity(activity: SocialEchoActivity) {
  socialEchoActivity.unshift(activity);
  if (socialEchoActivity.length > socialEchoActivityMaxItems) {
    socialEchoActivity.length = socialEchoActivityMaxItems;
  }
}

function requireAdminAccess(req: express.Request, res: express.Response, next: express.NextFunction) {
  const requestId = randomUUID();
  const configuredAdminToken = process.env.ADMIN_API_TOKEN?.trim();
  const actor = requestActor(req);

  if (!configuredAdminToken) {
    logEvent("admin.access_unconfigured", { requestId, ...actor });
    writeAuditEvent("admin.access_unconfigured", { requestId, ...actor });
    return res.status(503).json({
      ok: false,
      requestId,
      error: {
        code: "UNAVAILABLE",
        message: "Admin controls are unavailable.",
        retryable: false,
      },
    });
  }

  const providedToken = readAdminToken(req);
  if (!providedToken || !secureCompare(providedToken, configuredAdminToken)) {
    logEvent("admin.access_denied", { requestId, ...actor });
    writeAuditEvent("admin.access_denied", { requestId, ...actor });
    return res.status(401).json({
      ok: false,
      requestId,
      error: {
        code: "INVALID_CREDENTIALS",
        message: "Admin authorization failed.",
        retryable: false,
      },
    });
  }

  res.locals.adminRequestId = requestId;
  res.locals.adminActor = actor;
  return next();
}

function enforceProtectedRoutesEnabled(routeId: string, req: express.Request, res: express.Response) {
  if (!protectedRoutesDisabled) return true;

  const requestId = randomUUID();
  const actor = requestActor(req);
  logEvent("protected_route_disabled", { requestId, routeId, ...actor });
  writeAuditEvent("protected_route_disabled", { requestId, routeId, ...actor });
  res.status(503).json({
    ok: false,
    requestId,
    error: {
      code: "ROUTES_DISABLED",
      message: "This route is temporarily disabled by an administrator.",
      retryable: true,
    },
  });
  return false;
}

async function subscribeMailchimp(lead: z.infer<typeof leadSchema>) {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  const dc = process.env.MAILCHIMP_DC || apiKey?.split("-")[1];
  if (!apiKey || !listId || !dc) {
    throw new Error("MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID and MAILCHIMP_DC (or key suffix) are required");
  }

  const normalizedEmail = scrubEmail(lead.email);
  const subscriberHash = createHash("md5").update(normalizedEmail).digest("hex");
  const endpoint = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`;

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
    },
    body: JSON.stringify({
      email_address: normalizedEmail,
      status_if_new: "subscribed",
      status: "subscribed",
      merge_fields: {
        FNAME: lead.firstName || "",
        LNAME: lead.lastName || "",
      },
      tags: ["monolith-project", lead.source || "website"],
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || "Mailchimp subscription failed");
  }
}

async function subscribeBeehiiv(lead: z.infer<typeof leadSchema>) {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !publicationId) {
    throw new Error("BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID are required");
  }

  const endpoint = `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      email: scrubEmail(lead.email),
      reactivate_existing: true,
      send_welcome_email: true,
      utm_source: lead.source || "website",
      custom_fields: lead.firstName
        ? [{ name: "first_name", value: lead.firstName }]
        : [],
    }),
  });

  if (response.status === 409) {
    return;
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Beehiiv subscription failed");
  }
}

async function subscribeConvertKit(lead: z.infer<typeof leadSchema>) {
  const apiKey = process.env.CONVERTKIT_API_KEY;
  const formId = process.env.CONVERTKIT_FORM_ID;
  if (!apiKey || !formId) {
    throw new Error("CONVERTKIT_API_KEY and CONVERTKIT_FORM_ID are required");
  }

  const endpoint = `https://api.convertkit.com/v3/forms/${formId}/subscribe`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: apiKey,
      email: scrubEmail(lead.email),
      first_name: lead.firstName || undefined,
      fields: {
        source: lead.source || "website",
      },
    }),
  });

  if (response.status === 200 || response.status === 201 || response.status === 409) {
    return;
  }

  const data = await response.json().catch(() => ({}));
  throw new Error(data.message || "ConvertKit subscription failed");
}

async function subscribeHubSpot(lead: z.infer<typeof leadSchema>) {
  const portalId = process.env.HUBSPOT_PORTAL_ID;
  const formId = process.env.HUBSPOT_FORM_ID;
  if (!portalId || !formId) {
    throw new Error("HUBSPOT_PORTAL_ID and HUBSPOT_FORM_ID are required");
  }

  const endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;
  const fields = [
    { name: "email", value: scrubEmail(lead.email) },
    ...(lead.firstName ? [{ name: "firstname", value: lead.firstName }] : []),
    ...(lead.lastName ? [{ name: "lastname", value: lead.lastName }] : []),
  ];

  const contextUrl = lead.pageUrl || "https://themonolithproject.com";
  const context = {
    pageUri: contextUrl,
    pageName: lead.source || "website",
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields, context }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.inlineMessage || data.message || "HubSpot submission failed");
  }
}

async function subscribeLead(provider: LeadProvider, lead: z.infer<typeof leadSchema>) {
  if (provider === "mailchimp") return subscribeMailchimp(lead);
  if (provider === "beehiiv") return subscribeBeehiiv(lead);
  if (provider === "hubspot") return subscribeHubSpot(lead);
  return subscribeConvertKit(lead);
}

const app = express();
let appConfigured = false;

function configureApp() {
  if (appConfigured) return;
  appConfigured = true;

  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );

  // Stripe Webhook - Requires raw body for signature verification
  app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig as string, process.env.STRIPE_WEBHOOK_SECRET || "");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Webhook Error";
      console.error(`Webhook signature verification failed: ${message}`);
      return res.status(400).send(`Webhook Error: ${message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`[Stripe] Checkout session completed: ${session.id}`);

      // Basic Order Fulfillment
      if (session.amount_total) {
        try {
          await db.insert(orders).values({
            userId: session.metadata?.userId || null,
            stripeCheckoutId: session.id,
            amount: session.amount_total,
            status: "completed",
            customerEmail: session.customer_details?.email || null,
          });
          console.log(`[DB] Order created for session ${session.id}`);
        } catch (dbError) {
          console.error("[DB] Failed to create order", dbError);
        }
      }
    }

    res.json({ received: true });
  });

  app.use(express.json({ limit: "1mb" }));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  });
  app.use(limiter);

  const sponsorAccessLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      return res.status(429).json({
        ok: false,
        requestId: randomUUID(),
        error: {
          code: "RATE_LIMITED",
          message: "Too many access attempts. Please wait 15 minutes before retrying.",
          retryable: true,
        },
      });
    },
  });

  const adminControlsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      const requestId = randomUUID();
      const actor = requestActor(req);
      logEvent("admin.controls_rate_limited", { requestId, ...actor });
      writeAuditEvent("admin.controls_rate_limited", { requestId, ...actor });
      return res.status(429).json({
        ok: false,
        requestId,
        error: {
          code: "RATE_LIMITED",
          message: "Too many admin control requests. Please try again later.",
          retryable: true,
        },
      });
    },
  });

  app.get("/api/health", (_req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.json({ ok: true, service: "monolith-api", now: new Date().toISOString() });
  });

  app.post("/api/leads", async (req, res) => {
    const requestId = randomUUID();
    const parsed = leadSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        requestId,
        error: {
          code: "VALIDATION_ERROR",
          message: "Please provide a valid email and consent.",
          retryable: false,
        },
      });
    }

    const provider = readProvider();
    const email = scrubEmail(parsed.data.email);
    const incomingKey = req.header("Idempotency-Key")?.trim();
    const idempotencyKey = incomingKey || `${provider}:${email}`;

    const cached = idempotencyCache.get(idempotencyKey);
    if (cached && cached.expiresAt > Date.now()) {
      res.setHeader("X-Idempotent-Replay", "true");
      return res.status(cached.status).json(cached.body);
    }

    if (idempotencyInFlight.has(idempotencyKey)) {
      const pendingResult = await idempotencyInFlight.get(idempotencyKey)!;
      res.setHeader("X-Idempotent-Replay", "true");
      return res.status(pendingResult.status).json(pendingResult.body);
    }

    const operation = (async () => {
      try {
        await subscribeLead(provider, parsed.data);

        const body = {
          ok: true,
          requestId,
          provider,
          message: "Subscribed successfully",
        };

        logEvent("lead.subscribed", {
          requestId,
          provider,
          source: parsed.data.source || "website",
          eventInterest: parsed.data.eventInterest || null,
          utmSource: parsed.data.utmSource || null,
          utmMedium: parsed.data.utmMedium || null,
          utmCampaign: parsed.data.utmCampaign || null,
          emailHash: createHash("sha256").update(email).digest("hex").slice(0, 12),
        });

        return { status: 200, body };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Subscription failed";
        const body = {
          ok: false,
          requestId,
          error: {
            code: "PROVIDER_ERROR",
            message,
            retryable: true,
          },
        };

        logEvent("lead.subscription_failed", {
          requestId,
          provider,
          message,
        });

        return { status: 502, body };
      }
    })();

    idempotencyInFlight.set(idempotencyKey, operation);
    const result = await operation;
    idempotencyInFlight.delete(idempotencyKey);

    idempotencyCache.set(idempotencyKey, {
      status: result.status,
      body: result.body,
      expiresAt: Date.now() + idempotencyTtlMs,
    });

    return res.status(result.status).json(result.body);
  });

  app.post("/api/ticket-intent", (req, res) => {
    const parsed = ticketIntentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: "Invalid payload" });
    }

    logEvent("ticket.intent", {
      source: parsed.data.source,
      eventId: parsed.data.eventId || null,
      requestId: randomUUID(),
    });

    return res.status(202).json({ ok: true });
  });

  app.post("/api/booking-inquiry", async (req, res) => {
    const requestId = randomUUID();
    const parsed = bookingInquirySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        requestId,
        error: {
          code: "VALIDATION_ERROR",
          message: "Please complete all required fields.",
          retryable: false,
        },
      });
    }

    const webhook = process.env.BOOKING_WEBHOOK_URL;
    const inquiry = parsed.data;

    if (!webhook && process.env.NODE_ENV === "production") {
      const actor = requestActor(req);
      logEvent("booking.inquiry_unconfigured", {
        requestId,
        type: inquiry.type,
        ...actor,
      });
      writeAuditEvent("booking.inquiry_unconfigured", { requestId, type: inquiry.type, ...actor });

      return res.status(503).json({
        ok: false,
        requestId,
        error: {
          code: "UNAVAILABLE",
          message: "Booking inquiries are temporarily unavailable. Please try again later.",
          retryable: false,
        },
      });
    }

    if (webhook) {
      try {
        const response = await fetch(webhook, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...inquiry,
            requestId,
            receivedAt: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          throw new Error(`Webhook delivery failed with status ${response.status}`);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Booking inquiry delivery failed";
        const actor = requestActor(req);
        logEvent("booking.inquiry_failed", {
          requestId,
          type: inquiry.type,
          message,
          ...actor,
        });
        writeAuditEvent("booking.inquiry_failed", { requestId, type: inquiry.type, message, ...actor });

        return res.status(502).json({
          ok: false,
          requestId,
          error: {
            code: "DELIVERY_FAILED",
            message: "We couldn't submit your inquiry right now. Please try again.",
            retryable: true,
          },
        });
      }
    }

    logEvent("booking.inquiry_received", {
      requestId,
      type: inquiry.type,
      entity: inquiry.entity,
      location: inquiry.location || null,
      hasWebhook: Boolean(webhook),
      emailHash: createHash("sha256").update(scrubEmail(inquiry.email)).digest("hex").slice(0, 12),
      ...requestActor(req),
    });
    writeAuditEvent("booking.inquiry_received", {
      requestId,
      type: inquiry.type,
      entity: inquiry.entity,
      hasWebhook: Boolean(webhook),
      emailHash: createHash("sha256").update(scrubEmail(inquiry.email)).digest("hex").slice(0, 12),
      ...requestActor(req),
    });

    return res.status(202).json({
      ok: true,
      requestId,
      message: "Inquiry received",
    });
  });

  app.post("/api/webhooks/posh", (req, res) => {
    const requestId = randomUUID();
    const actor = requestActor(req);
    const configuredSecret = process.env.POSH_WEBHOOK_SECRET?.trim();

    if (!configuredSecret) {
      logEvent("posh.webhook_unconfigured", { requestId, ...actor });
      writeAuditEvent("posh.webhook_unconfigured", { requestId, ...actor });
      return res.status(503).json({
        ok: false,
        requestId,
        error: {
          code: "UNAVAILABLE",
          message: "Webhook handler is not configured.",
          retryable: false,
        },
      });
    }

    const providedSecret = req.header("Posh-Secret")?.trim();
    if (!providedSecret || !secureCompare(providedSecret, configuredSecret)) {
      logEvent("posh.webhook_denied", { requestId, ...actor });
      writeAuditEvent("posh.webhook_denied", { requestId, ...actor });
      return res.status(401).json({
        ok: false,
        requestId,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Webhook authorization failed.",
          retryable: false,
        },
      });
    }

    const parsed = poshWebhookPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      logEvent("posh.webhook_invalid_payload", { requestId, ...actor });
      writeAuditEvent("posh.webhook_invalid_payload", { requestId, ...actor });
      return res.status(400).json({
        ok: false,
        requestId,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid webhook payload.",
          retryable: false,
        },
      });
    }

    const payload = parsed.data;
    const inferredEventType =
      typeof payload.type === "string"
        ? payload.type
        : typeof payload.event === "string"
          ? payload.event
          : "unknown";
    const inferredEventId =
      typeof payload.id === "string" || typeof payload.id === "number"
        ? String(payload.id)
        : null;

    logEvent("posh.webhook_received", {
      requestId,
      ...actor,
      eventType: inferredEventType,
      eventId: inferredEventId,
    });
    writeAuditEvent("posh.webhook_received", {
      requestId,
      ...actor,
      eventType: inferredEventType,
      eventId: inferredEventId,
    });

    return res.status(200).json({ ok: true, requestId });
  });

  app.post("/api/sponsor-access", sponsorAccessLimiter, (req, res) => {
    if (!enforceProtectedRoutesEnabled("sponsor-access", req, res)) return;

    const requestId = randomUUID();
    const actor = requestActor(req);
    const parsed = sponsorAccessSchema.safeParse(req.body);
    if (!parsed.success) {
      writeAuditEvent("sponsor.access_validation_failed", { requestId, ...actor });
      return res.status(400).json({
        ok: false,
        requestId,
        error: {
          code: "VALIDATION_ERROR",
          message: "Enter a valid access code.",
          retryable: false,
        },
      });
    }

    const configuredPassword = process.env.SPONSOR_ACCESS_PASSWORD?.trim();
    if (!configuredPassword) {
      logEvent("sponsor.access_unconfigured", { requestId, ...actor });
      writeAuditEvent("sponsor.access_unconfigured", { requestId, ...actor });
      return res.status(503).json({
        ok: false,
        requestId,
        error: {
          code: "UNAVAILABLE",
          message: "Sponsor access is temporarily unavailable.",
          retryable: false,
        },
      });
    }

    const providedPassword = parsed.data.password.trim();
    if (!secureCompare(providedPassword, configuredPassword)) {
      res.setHeader("Set-Cookie", buildSponsorSessionCookie("", 0));
      logEvent("sponsor.access_denied", { requestId, ...actor });
      writeAuditEvent("sponsor.access_denied", { requestId, ...actor });
      return res.status(401).json({
        ok: false,
        requestId,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid access code.",
          retryable: true,
        },
      });
    }

    const sessionToken = issueSponsorSession();
    res.setHeader("Set-Cookie", buildSponsorSessionCookie(sessionToken, Math.floor(sponsorSessionTtlMs / 1000)));
    logEvent("sponsor.access_granted", { requestId, ...actor });
    writeAuditEvent("sponsor.access_granted", { requestId, ...actor });
    return res.status(200).json({ ok: true, requestId, sessionExpiresInSec: Math.floor(sponsorSessionTtlMs / 1000) });
  });

  app.get("/api/sponsor-deck", (req, res) => {
    if (!enforceProtectedRoutesEnabled("sponsor-deck", req, res)) return;

    const requestId = randomUUID();
    const actor = requestActor(req);
    const sessionToken = parseCookieHeader(req.header("cookie"))[sponsorSessionCookieName];

    if (!sessionToken || !hasValidSponsorSession(sessionToken)) {
      res.setHeader("Set-Cookie", buildSponsorSessionCookie("", 0));
      logEvent("sponsor.deck_denied", { requestId, ...actor });
      writeAuditEvent("sponsor.deck_denied", { requestId, ...actor });
      return res.status(401).json({
        ok: false,
        requestId,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Sponsor access required.",
          retryable: true,
        },
      });
    }

    sponsorSessions.set(sessionToken, Date.now() + sponsorSessionTtlMs);

    return res.download(sponsorDeckPath, sponsorDeckFilename, (error) => {
      if (!error) {
        logEvent("sponsor.deck_downloaded", { requestId, ...actor });
        writeAuditEvent("sponsor.deck_downloaded", { requestId, ...actor });
        return;
      }

      const code = (error as NodeJS.ErrnoException).code || "UNKNOWN";
      const isMissing = code === "ENOENT";
      logEvent("sponsor.deck_download_failed", { requestId, code, message: error.message, ...actor });
      writeAuditEvent("sponsor.deck_download_failed", { requestId, code, message: error.message, ...actor });

      if (res.headersSent) return;
      return res.status(isMissing ? 404 : 500).json({
        ok: false,
        requestId,
        error: {
          code: isMissing ? "DOCUMENT_NOT_FOUND" : "DOCUMENT_UNAVAILABLE",
          message: isMissing ? "Sponsor deck is unavailable." : "Unable to download sponsor deck right now.",
          retryable: !isMissing,
        },
      });
    });
  });

  app.get("/api/admin/controls", adminControlsLimiter, requireAdminAccess, (req, res) => {
    const requestId = (res.locals.adminRequestId as string) || randomUUID();
    const actor = (res.locals.adminActor as { ip: string | null; userAgent: string | null }) || requestActor(req);

    writeAuditEvent("admin.controls_read", {
      requestId,
      ...actor,
      protectedRoutesDisabled,
      activeSponsorSessions: sponsorSessions.size,
      sponsorSessionTtlMs,
    });

    return res.status(200).json({
      ok: true,
      requestId,
      controls: {
        protectedRoutesDisabled,
      },
      stats: {
        activeSponsorSessions: sponsorSessions.size,
        sponsorSessionTtlMs,
      },
    });
  });

  app.post("/api/admin/controls", adminControlsLimiter, requireAdminAccess, (req, res) => {
    const requestId = (res.locals.adminRequestId as string) || randomUUID();
    const actor = (res.locals.adminActor as { ip: string | null; userAgent: string | null }) || requestActor(req);
    const parsed = adminControlsSchema.safeParse(req.body);

    if (!parsed.success) {
      writeAuditEvent("admin.controls_invalid_payload", { requestId, ...actor });
      return res.status(400).json({
        ok: false,
        requestId,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid admin control payload.",
          retryable: false,
        },
      });
    }

    const changes: Record<string, unknown> = {};

    if (parsed.data.protectedRoutesDisabled !== undefined) {
      protectedRoutesDisabled = parsed.data.protectedRoutesDisabled;
      changes.protectedRoutesDisabled = protectedRoutesDisabled;
    }

    if (parsed.data.clearSponsorSessions) {
      const clearedSessions = sponsorSessions.size;
      sponsorSessions.clear();
      changes.clearedSponsorSessions = clearedSessions;
    }

    logEvent("admin.controls_updated", { requestId, ...actor, ...changes });
    writeAuditEvent("admin.controls_updated", { requestId, ...actor, ...changes });

    return res.status(200).json({
      ok: true,
      requestId,
      controls: {
        protectedRoutesDisabled,
      },
      ...changes,
    });
  });

  // ============================================
  // COMMERCE API
  // ============================================

  app.get("/api/events", async (_req, res) => {
    try {
      const allEvents = await db.select().from(events);
      res.json({ ok: true, data: allEvents });
    } catch (error) {
      console.error("[DB] Failed to fetch events", error);
      res.status(500).json({ ok: false, error: "Database error" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ ok: false, error: "Invalid ID" });

      const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
      if (!result.length) return res.status(404).json({ ok: false, error: "Event not found" });

      res.json({ ok: true, data: result[0] });
    } catch (error) {
      console.error("[DB] Failed to fetch event", error);
      res.status(500).json({ ok: false, error: "Database error" });
    }
  });

  app.post("/api/checkout/create-session", async (req, res) => {
    const { eventId, ticketTier, quantity = 1 } = req.body;
    const requestId = randomUUID();

    if (!eventId || !ticketTier) {
      return res.status(400).json({ ok: false, error: "Missing eventId or ticketTier" });
    }

    try {
      const id = parseInt(eventId);
      const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
      if (!result.length) return res.status(404).json({ ok: false, error: "Event not found" });

      const event = result[0];
      // Type assertion for simple JSON handling
      const ticketTypes = event.ticketTypes as Array<{ name: string; price: number }>;
      const selectedTier = ticketTypes.find((t) => t.name === ticketTier);

      if (!selectedTier) {
        return res.status(400).json({ ok: false, error: "Invalid ticket tier" });
      }

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${event.name} - ${ticketTier}`,
                metadata: {
                  eventId: event.id,
                  ticketTier: ticketTier,
                },
              },
              unit_amount: selectedTier.price, // Price in cents
            },
            quantity: quantity,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/order/canceled`,
        metadata: {
          requestId,
          eventId: event.id.toString(),
          ticketTier: ticketTier,
          // userId to be added in Phase 2
        },
      });

      logEvent("checkout.session_created", { requestId, eventId, ticketTier, amount: selectedTier.price });

      res.json({ ok: true, url: session.url });

    } catch (error) {
      const message = error instanceof Error ? error.message : "Checkout error";
      console.error("[Stripe] Checkout failed", error);
      res.status(500).json({ ok: false, error: message });
    }
  });

  // Never allow /api/* to fall through to SPA HTML.
  app.use("/api", (_req, res) => {
    res.status(404).json({
      ok: false,
      error: {
        code: "API_NOT_FOUND",
        message: "API endpoint not found",
      },
    });
  });

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

async function startServer() {
  configureApp();
  const server = createServer(app);
  const port = process.env.PORT || 3000;

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}/`);
      resolve();
    });
  });
}

configureApp();

const isMainModule =
  process.argv[1] !== undefined &&
  pathToFileURL(process.argv[1]).href === import.meta.url;

if (isMainModule) {
  startServer().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export { app, configureApp, startServer };
