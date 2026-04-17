import { Router } from "express";
import { createHash, randomUUID } from "crypto";
import { contactSchema } from "../lib/schemas";
import { logEvent } from "../lib/logging";
import { asyncHandler } from "../lib/async";
import { scrubEmail } from "../lib/security";
import { getDatabase } from "../db/client";
import { contactSubmissions } from "../db/schema";
import { eq } from "drizzle-orm";
import { resolveSubmissionOutcome } from "../services/submission-delivery";
import { createRateLimitMiddleware } from "../services/rate-limit";
import { honeypotFieldName, readHoneypotValue } from "../lib/honeypot";

const router = Router();

const WEBHOOK_TIMEOUT_MS = 8_000;
const contactLimiter = createRateLimitMiddleware({
  scope: "api:contact",
  windowMs: 15 * 60 * 1000,
  limit: 8,
  message: "Too many contact attempts. Please wait 15 minutes before trying again.",
});

router.post("/api/contact", contactLimiter, asyncHandler(async (req, res) => {
  const requestId = randomUUID();
  const honeypotValue = readHoneypotValue(req.body);
  if (honeypotValue) {
    logEvent("bot.honeypot_triggered", {
      requestId,
      route: "/api/contact",
      field: honeypotFieldName,
      valueLength: honeypotValue.length,
    });
    return res.status(200).json({ ok: true, message: "Message received", requestId });
  }

  const parsed = contactSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      requestId,
      error: {
        code: "VALIDATION_ERROR",
        message: "A couple things left to fill in.",
        retryable: false,
      },
    });
  }

  const contact = parsed.data;
  const email = scrubEmail(contact.email);
  const emailHash = createHash("sha256").update(email).digest("hex").slice(0, 12);
  const webhook = process.env.CONTACT_WEBHOOK_URL || process.env.BOOKING_WEBHOOK_URL;
  const db = getDatabase();
  const dbRecordId = randomUUID();
  const receivedAt = new Date().toISOString();
  let dbPersisted = false;

  // 1. Persist to DB first — this is the audit trail
  if (db) {
    try {
      await db.insert(contactSubmissions).values({
        id: dbRecordId,
        name: contact.name,
        email,
        subject: contact.subject,
        message: contact.message,
        webhookStatus: "pending",
        metadata: { requestId, receivedAt, deliveryState: "pending" },
      });
      dbPersisted = true;
    } catch (err) {
      logEvent("contact.db_write_failed", {
        requestId,
        message: err instanceof Error ? err.message : "Unknown error",
      });
      // Continue — webhook delivery can still work without DB
    }
  }

  // 2. Deliver webhook — awaited, with timeout
  if (!webhook && process.env.NODE_ENV === "production") {
    logEvent("contact.unconfigured", { requestId, subject: contact.subject, dbPersisted });
  }

  let webhookOk = false;
  let webhookError: string | null = null;
  let lastWebhookAttemptAt: string | null = null;

  if (webhook) {
    try {
      lastWebhookAttemptAt = new Date().toISOString();
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contact,
          email,
          requestId,
          receivedAt,
          type: "contact_form",
        }),
        signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
      });

      if (!response.ok) {
        throw new Error(`Webhook returned status ${response.status}`);
      }

      webhookOk = true;
    } catch (err) {
      webhookError = err instanceof Error ? err.message : "Unknown error";
      logEvent("contact.webhook_failed", {
        requestId,
        message: webhookError,
      });
    }
  }

  const outcome = resolveSubmissionOutcome({
    acceptedMessage: "Message received",
    deliveryFailedMessage: "We couldn't deliver your message right now. Please try again.",
    unavailableMessage: "Contact is temporarily unavailable. Please try again later.",
    successStatus: 200,
    webhookConfigured: Boolean(webhook),
    webhookDelivered: webhookOk,
    dbPersisted,
  });

  // 3. Update DB with webhook delivery status
  if (db && dbPersisted) {
    db.update(contactSubmissions)
      .set({
        webhookStatus: outcome.webhookStatus,
        metadata: {
          requestId,
          receivedAt,
          deliveryState: outcome.deliveryState,
          webhookConfigured: Boolean(webhook),
          lastWebhookAttemptAt,
          lastWebhookError: webhookError,
        },
      })
      .where(eq(contactSubmissions.id, dbRecordId))
      .catch(() => {});
  }

  logEvent("contact.received", {
    requestId,
    subject: contact.subject,
    hash: emailHash,
    deliveryState: outcome.deliveryState,
    webhookDelivered: webhookOk,
    dbPersisted,
  });

  if (outcome.deliveryState === "failed") {
    return res.status(outcome.responseStatus).json({
      ok: false,
      requestId,
      error: {
        code: Boolean(webhook) ? "DELIVERY_FAILED" : "UNAVAILABLE",
        message: outcome.responseMessage,
        retryable: outcome.retryable,
      },
    });
  }

  return res.status(outcome.responseStatus).json({
    ok: true,
    requestId,
    message: outcome.responseMessage,
    deliveryState: outcome.deliveryState,
  });
}));

export default router;
