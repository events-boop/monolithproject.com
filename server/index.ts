import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createHash, randomUUID } from "crypto";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const idempotencyTtlMs = 24 * 60 * 60 * 1000;
const idempotencyCache = new Map<string, { status: number; body: unknown; expiresAt: number }>();
const idempotencyInFlight = new Map<string, Promise<{ status: number; body: unknown }>>();

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
  if (provider === "mailchimp" || provider === "beehiiv" || provider === "convertkit" || provider === "hubspot") {
    return provider;
  }
  throw new Error("Unsupported LEAD_PROVIDER. Use mailchimp, beehiiv, convertkit, or hubspot.");
}

function scrubEmail(email: string) {
  return email.trim().toLowerCase();
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

async function startServer() {

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

  const server = createServer(app);

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

if (process.env.NODE_ENV !== "production") {
  startServer().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export { app, startServer };
