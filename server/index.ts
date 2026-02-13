import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createHash, randomUUID, timingSafeEqual } from "crypto";
import { z } from "zod";
import { hasDatabase } from "./db/client";
import {
  insertSocialEchoActivity,
  readSocialEchoEventByKey,
  readSocialEchoSnapshot,
  upsertSocialEchoEventStats,
  type SocialEchoActivityRow,
  type SocialEchoEventStatsRow,
} from "./db/socialEchoRepo";
import { getDatabase } from "./db/client";
import { leads } from "./db/schema";
import { eq } from "drizzle-orm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type LeadProvider = "mailchimp" | "beehiiv" | "convertkit" | "hubspot" | "brevo" | "emailoctopus";

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

const sponsorAccessSchema = z.object({
  password: z.string().trim().min(1).max(256),
});
const poshWebhookPayloadSchema = z.record(z.string(), z.unknown());

const idempotencyTtlMs = 24 * 60 * 60 * 1000;
const idempotencyCache = new Map<string, { status: number; body: unknown; expiresAt: number }>();
const idempotencyInFlight = new Map<string, Promise<{ status: number; body: unknown }>>();
const sponsorSessionTtlMs = 30 * 60 * 1000;
const sponsorSessionCookieName = "monolith_sponsor_session";
const sponsorDeckFilename = "Chasing Sun(Sets) 2026 Pitch Deck (Upgraded).pdf";
const sponsorDeckPath = path.resolve(__dirname, "..", "private", "documents", sponsorDeckFilename);
const sponsorSessions = new Map<string, number>();
const socialEchoByEvent = new Map<string, SocialEchoEventStatsRow>();
const socialEchoActivity = new Map<string, SocialEchoActivityRow>();
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

function readProvider(): LeadProvider {
  const provider = (process.env.LEAD_PROVIDER || "mailchimp").toLowerCase();
  if (provider === "mailchimp" || provider === "beehiiv" || provider === "convertkit" || provider === "hubspot" || provider === "brevo" || provider === "emailoctopus") {
    return provider;
  }
  throw new Error("Unsupported LEAD_PROVIDER. Use mailchimp, beehiiv, convertkit, hubspot, brevo, or emailoctopus.");
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
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
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

function rememberSocialActivity(activity: SocialEchoActivityRow) {
  socialEchoActivity.set(activity.id, activity);
  if (socialEchoActivity.size <= socialEchoActivityMaxItems) return;

  const ordered = Array.from(socialEchoActivity.values()).sort((a, b) => b.at.localeCompare(a.at));
  const keep = new Set(ordered.slice(0, socialEchoActivityMaxItems).map((item) => item.id));
  socialEchoActivity.forEach((_value, key) => {
    if (!keep.has(key)) socialEchoActivity.delete(key);
  });
}

function readInMemorySocialEchoSnapshot() {
  const events = Array.from(socialEchoByEvent.values()).sort((a, b) => {
    const scoreA = a.goingCount * 1000 + a.pendingCount * 100;
    const scoreB = b.goingCount * 1000 + b.pendingCount * 100;
    if (scoreA !== scoreB) return scoreB - scoreA;
    return b.updatedAt.localeCompare(a.updatedAt);
  });
  const activity = Array.from(socialEchoActivity.values())
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 30);

  const totalGoing = events.reduce((sum, event) => sum + event.goingCount, 0);
  const totalPending = events.reduce((sum, event) => sum + event.pendingCount, 0);

  return {
    now: new Date().toISOString(),
    summary: {
      totalGoing,
      totalPending,
      liveEvents: events.length,
    },
    events,
    activity,
  };
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

// ... (existing code)

// ... (existing code)

async function subscribeEmailOctopus(lead: z.infer<typeof leadSchema>) {
  const apiKey = process.env.EMAILOCTOPUS_API_KEY;
  const listId = process.env.EMAILOCTOPUS_LIST_ID;
  if (!apiKey || !listId) {
    throw new Error("EMAILOCTOPUS_API_KEY and EMAILOCTOPUS_LIST_ID are required");
  }

  const endpoint = `https://emailoctopus.com/api/1.6/lists/${listId}/contacts`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: apiKey,
      email_address: scrubEmail(lead.email),
      fields: {
        FirstName: lead.firstName || "",
        LastName: lead.lastName || "",
        Source: lead.source || "website",
      },
      status: "SUBSCRIBED",
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    if (data.error && data.error.code === "MEMBER_EXISTS_WITH_EMAIL_ADDRESS") return;
    throw new Error(data.error?.message || "EmailOctopus subscription failed");
  }
}

async function subscribeBrevo(lead: z.infer<typeof leadSchema>) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is required");
  }

  const endpoint = "https://api.brevo.com/v3/contacts";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      email: scrubEmail(lead.email),
      updateEnabled: true,
      attributes: {
        FIRSTNAME: lead.firstName || "",
        LASTNAME: lead.lastName || "",
        SOURCE: lead.source || "website",
      },
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    // Ignore if contact already exists (error code duplicate_parameter usually)
    if (data.code === "duplicate_parameter") return;
    throw new Error(data.message || "Brevo subscription failed");
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
  if (provider === "brevo") return subscribeBrevo(lead);
  if (provider === "emailoctopus") return subscribeEmailOctopus(lead);
  return subscribeConvertKit(lead);
}

const app = express();
let appConfigured = false;

function configureApp() {
  if (appConfigured) return;
  appConfigured = true;

  logEvent("database.mode", { provider: "neon-postgres", configured: hasDatabase() });

  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );

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
      const dbLeadId = randomUUID();
      const db = getDatabase();

      try {
        // 1. Backup to DB first (Critical)
        if (db) {
          await db.insert(leads).values({
            id: dbLeadId,
            email: email,
            firstName: parsed.data.firstName,
            lastName: parsed.data.lastName,
            source: parsed.data.source || "website",
            provider: provider,
            providerStatus: "pending",
            metadata: parsed.data,
          }).catch(err => console.error("Failed to backup lead to DB:", err));
        }

        await subscribeLead(provider, parsed.data);

        // 2. Update DB status on success
        if (db) {
          // Fire and forget update
          db.update(leads)
            .set({ providerStatus: "success" })
            .where(eq(leads.id, dbLeadId))
            .catch(() => { });
        }

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

        // 3. Update DB status on failure
        if (db) {
          db.update(leads)
            .set({ providerStatus: "failed", metadata: { ...parsed.data, error: message } })
            .where(eq(leads.id, dbLeadId))
            .catch(() => { });
        }

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
      logEvent("booking.inquiry_unconfigured", {
        requestId,
        type: inquiry.type,
      });

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
        logEvent("booking.inquiry_failed", {
          requestId,
          type: inquiry.type,
          message,
        });

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
    });

    return res.status(202).json({
      ok: true,
      requestId,
      message: "Inquiry received",
    });
  });

  app.post("/api/webhooks/posh", async (req, res) => {
    const requestId = randomUUID();
    const configuredSecret = process.env.POSH_WEBHOOK_SECRET?.trim();

    if (!configuredSecret) {
      logEvent("posh.webhook_unconfigured", { requestId });
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
      logEvent("posh.webhook_denied", { requestId });
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
      logEvent("posh.webhook_invalid_payload", { requestId });
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
    const inferredEventType = pickString(payload, ["type", "event", "webhookType"]) || "unknown";
    const inferredEventId = pickString(payload, ["event.id", "eventId", "event_id", "event.slug", "eventSlug"]);
    const inferredEventTitle = pickString(payload, ["event.name", "eventName", "event_title", "name"]);
    const inferredCity = pickString(payload, ["event.city", "city", "venue.city", "event.location.city"]);
    const inferredStatus = pickString(payload, ["status", "order.status", "orderStatus"]);
    const quantity = pickQuantity(payload);
    const providerEventId =
      pickString(payload, ["id", "webhook_id", "eventWebhookId", "order.id", "orderId"]) ||
      `${inferredEventType}:${inferredEventId || inferredEventTitle || "unknown"}:${quantity}`;

    const eventKey = inferredEventId || inferredEventTitle || "unknown";
    const activityId = createHash("sha256")
      .update(`${providerEventId}:${inferredEventType}:${eventKey}`)
      .digest("hex");
    const attendeeAlias = `guest-${activityId.slice(0, 4).toLowerCase()}`;
    const normalizedEventType = inferredEventType.toLowerCase();
    const normalizedStatus = (inferredStatus || "").toLowerCase();

    let inserted = true;
    if (hasDatabase()) {
      inserted = await insertSocialEchoActivity({
        id: activityId,
        at: new Date().toISOString(),
        eventType: inferredEventType,
        eventKey,
        eventId: inferredEventId,
        eventTitle: inferredEventTitle,
        city: inferredCity,
        status: inferredStatus,
        quantity,
        attendeeAlias,
        rawPayload: payload,
      });
    } else if (socialEchoActivity.has(activityId)) {
      inserted = false;
    } else {
      rememberSocialActivity({
        id: activityId,
        at: new Date().toISOString(),
        eventType: inferredEventType,
        eventKey,
        eventId: inferredEventId,
        eventTitle: inferredEventTitle,
        city: inferredCity,
        status: inferredStatus,
        quantity,
        attendeeAlias,
        rawPayload: payload,
      });
    }

    if (!inserted) {
      logEvent("posh.webhook_duplicate_ignored", {
        requestId,
        activityId,
        providerEventId,
        eventType: inferredEventType,
      });
      return res.status(200).json({ ok: true, requestId, duplicate: true });
    }

    const existingStats =
      socialEchoByEvent.get(eventKey) || (hasDatabase() ? await readSocialEchoEventByKey(eventKey) : null);

    const baseStats: SocialEchoEventStatsRow = existingStats || {
      eventKey,
      eventId: inferredEventId,
      eventTitle: inferredEventTitle,
      city: inferredCity,
      goingCount: 0,
      pendingCount: 0,
      updatedAt: new Date().toISOString(),
    };

    let goingDelta = 0;
    let pendingDelta = 0;

    if (normalizedEventType.includes("pending")) {
      pendingDelta += quantity;
    } else if (normalizedEventType.includes("updated")) {
      if (
        normalizedStatus.includes("refund") ||
        normalizedStatus.includes("cancel") ||
        normalizedStatus.includes("void")
      ) {
        goingDelta -= quantity;
      } else if (
        normalizedStatus.includes("approved") ||
        normalizedStatus.includes("accept") ||
        normalizedStatus.includes("complete") ||
        normalizedStatus.includes("paid")
      ) {
        pendingDelta -= quantity;
        goingDelta += quantity;
      }
    } else if (
      normalizedEventType.includes("new order") ||
      normalizedEventType.includes("new_order") ||
      normalizedEventType.includes("new")
    ) {
      goingDelta += quantity;
    } else if (normalizedEventType.includes("order")) {
      goingDelta += quantity;
    }

    const nextStats: SocialEchoEventStatsRow = {
      ...baseStats,
      eventId: baseStats.eventId || inferredEventId,
      eventTitle: baseStats.eventTitle || inferredEventTitle,
      city: baseStats.city || inferredCity,
      goingCount: Math.max(0, baseStats.goingCount + goingDelta),
      pendingCount: Math.max(0, baseStats.pendingCount + pendingDelta),
      updatedAt: new Date().toISOString(),
    };

    socialEchoByEvent.set(eventKey, nextStats);
    if (hasDatabase()) {
      await upsertSocialEchoEventStats(nextStats);
    }

    logEvent("posh.webhook_received", {
      requestId,
      eventType: inferredEventType,
      eventId: inferredEventId,
      eventTitle: inferredEventTitle,
      city: inferredCity,
      status: inferredStatus,
      quantity,
      goingCount: nextStats.goingCount,
      pendingCount: nextStats.pendingCount,
      persistence: hasDatabase() ? "database" : "memory",
    });

    return res.status(200).json({ ok: true, requestId });
  });

  app.get("/api/social/echo", async (_req, res) => {
    try {
      const snapshot = hasDatabase() ? await readSocialEchoSnapshot() : null;
      if (snapshot) {
        return res.status(200).json({ ok: true, ...snapshot });
      }

      return res.status(200).json({ ok: true, ...readInMemorySocialEchoSnapshot() });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      logEvent("social.echo_read_failed", { message });
      return res.status(500).json({
        ok: false,
        error: {
          code: "SOCIAL_ECHO_UNAVAILABLE",
          message: "Unable to load live social activity right now.",
        },
      });
    }
  });

  app.post("/api/sponsor-access", sponsorAccessLimiter, (req, res) => {
    const requestId = randomUUID();
    const parsed = sponsorAccessSchema.safeParse(req.body);
    if (!parsed.success) {
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
      logEvent("sponsor.access_unconfigured", { requestId });
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
      logEvent("sponsor.access_denied", { requestId });
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
    logEvent("sponsor.access_granted", { requestId });
    return res.status(200).json({ ok: true, requestId, sessionExpiresInSec: Math.floor(sponsorSessionTtlMs / 1000) });
  });

  app.get("/api/sponsor-deck", (req, res) => {
    const requestId = randomUUID();
    const sessionToken = parseCookieHeader(req.header("cookie"))[sponsorSessionCookieName];

    if (!sessionToken || !hasValidSponsorSession(sessionToken)) {
      res.setHeader("Set-Cookie", buildSponsorSessionCookie("", 0));
      logEvent("sponsor.deck_denied", { requestId });
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
        logEvent("sponsor.deck_downloaded", { requestId });
        return;
      }

      const code = (error as NodeJS.ErrnoException).code || "UNKNOWN";
      const isMissing = code === "ENOENT";
      logEvent("sponsor.deck_download_failed", { requestId, code, message: error.message });

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
