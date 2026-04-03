import { Router } from "express";
import { createHash, randomUUID } from "crypto";
import { leadSchema } from "../lib/schemas";
import { logEvent } from "../lib/logging";
import { asyncHandler } from "../lib/async";
import { scrubEmail } from "../lib/security";
import { readProvider } from "../lib/env";
import { getFromCache, setInCache, hasInFlight, setInFlight, resolveInFlight, deleteInFlight } from "../services/idempotency";
import { subscribeLead } from "../providers/lead-providers";
import { getDatabase } from "../db/client";
import { leads } from "../db/schema";
import { eq } from "drizzle-orm";
import { sendWelcomeEmail } from "../services/email";

const router = Router();

router.post("/api/leads", asyncHandler(async (req, res) => {
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

  const cached = getFromCache(idempotencyKey);
  if (cached) {
    res.setHeader("X-Idempotent-Replay", "true");
    return res.status(cached.status).json(cached.body);
  }

  if (hasInFlight(idempotencyKey)) {
    try {
      const pendingResult = await resolveInFlight(idempotencyKey);
      res.setHeader("X-Idempotent-Replay", "true");
      return res.status(pendingResult.status).json(pendingResult.body);
    } catch {
      return res.status(502).json({
        ok: false,
        requestId,
        error: { code: "PROVIDER_ERROR", message: "We couldn't process your request. Please try again.", retryable: true },
      });
    }
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

      const welcomeEmail = await sendWelcomeEmail(email, parsed.data.firstName).catch(err => {
        console.error(`[${requestId}] Failed to send welcome email:`, err);
        return null;
      });

      // 2. Update DB status on success
      if (db) {
        // Fire and forget update
        db.update(leads)
          .set({ providerStatus: "success" })
          .where(eq(leads.id, dbLeadId))
          .catch((err) => console.error(`[${requestId}] Failed to update lead status to 'success':`, err));
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
        sessionId: parsed.data.sessionId || null,
        landingPageUrl: parsed.data.landingPageUrl || null,
        referrerDomain: parsed.data.referrerDomain || parsed.data.firstReferrerDomain || null,
        utmSource: parsed.data.utmSource || null,
        utmMedium: parsed.data.utmMedium || null,
        utmCampaign: parsed.data.utmCampaign || null,
        firstUtmSource: parsed.data.firstUtmSource || null,
        lastUtmSource: parsed.data.lastUtmSource || null,
        emailHash: createHash("sha256").update(email).digest("hex").slice(0, 12),
      });

      return { status: 200, body };
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : "Subscription failed";

      // 3. Update DB status on failure
      if (db) {
        db.update(leads)
          .set({ providerStatus: "failed", metadata: { ...parsed.data, error: rawMessage } })
          .where(eq(leads.id, dbLeadId))
          .catch((err) => console.error(`[${requestId}] Failed to update lead status to 'failed':`, err));
      }

      const body = {
        ok: false,
        requestId,
        error: {
          code: "PROVIDER_ERROR",
          message: "We couldn't process your request. Please try again.",
          retryable: true,
        },
      };

      logEvent("lead.subscription_failed", {
        requestId,
        provider,
        message: rawMessage,
      });

      return { status: 502, body };
    }
  })();

  setInFlight(idempotencyKey, operation);
  try {
    const result = await operation;
    setInCache(idempotencyKey, result.status, result.body);
    return res.status(result.status).json(result.body);
  } finally {
    deleteInFlight(idempotencyKey);
  }
}));

export default router;
