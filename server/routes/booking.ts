import { Router } from "express";
import { createHash, randomUUID } from "crypto";
import { bookingInquirySchema } from "../lib/schemas";
import { logEvent } from "../lib/logging";
import { asyncHandler } from "../lib/async";
import { scrubEmail } from "../lib/security";
import { getDatabase } from "../db/client";
import { bookingInquiries } from "../db/schema";
import { eq } from "drizzle-orm";
import { resolveSubmissionOutcome } from "../services/submission-delivery";
import { createRateLimitMiddleware } from "../services/rate-limit";
import { honeypotFieldName, readHoneypotValue } from "../lib/honeypot";

const router = Router();

const WEBHOOK_TIMEOUT_MS = 8_000;
const bookingLimiter = createRateLimitMiddleware({
  scope: "api:booking-inquiry",
  windowMs: 15 * 60 * 1000,
  limit: 8,
  message: "Too many booking inquiries. Please wait 15 minutes before trying again.",
});

router.post("/api/booking-inquiry", bookingLimiter, asyncHandler(async (req, res) => {
  const requestId = randomUUID();
  const honeypotValue = readHoneypotValue(req.body);
  if (honeypotValue) {
    logEvent("bot.honeypot_triggered", {
      requestId,
      route: "/api/booking-inquiry",
      field: honeypotFieldName,
      valueLength: honeypotValue.length,
    });
    return res.status(202).json({ ok: true, requestId, message: "Inquiry received" });
  }

  const parsed = bookingInquirySchema.safeParse(req.body);
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

  const webhook = process.env.BOOKING_WEBHOOK_URL;
  const inquiry = parsed.data;
  const email = scrubEmail(inquiry.email);
  const emailHash = createHash("sha256").update(email).digest("hex").slice(0, 12);
  const db = getDatabase();
  const dbRecordId = randomUUID();
  const receivedAt = new Date().toISOString();
  let dbPersisted = false;

  // 1. Persist to DB first — audit trail
  if (db) {
    try {
      await db.insert(bookingInquiries).values({
        id: dbRecordId,
        name: inquiry.name,
        email,
        entity: inquiry.entity,
        type: inquiry.type,
        location: inquiry.location || null,
        message: inquiry.message,
        webhookStatus: "pending",
        metadata: { requestId, receivedAt, deliveryState: "pending" },
      });
      dbPersisted = true;
    } catch (err) {
      logEvent("booking.db_write_failed", {
        requestId,
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  // 2. Webhook delivery — with timeout
  if (!webhook && process.env.NODE_ENV === "production") {
    logEvent("booking.inquiry_unconfigured", {
      requestId,
      type: inquiry.type,
      dbPersisted,
    });
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
          ...inquiry,
          email,
          requestId,
          receivedAt,
        }),
        signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
      });

      if (!response.ok) {
        throw new Error(`Webhook delivery failed with status ${response.status}`);
      }

      webhookOk = true;
    } catch (error) {
      webhookError = error instanceof Error ? error.message : "Booking inquiry delivery failed";
      logEvent("booking.inquiry_failed", {
        requestId,
        type: inquiry.type,
        message: webhookError,
      });
    }
  }

  const outcome = resolveSubmissionOutcome({
    acceptedMessage: "Inquiry received",
    deliveryFailedMessage: webhook
      ? "We couldn't submit your inquiry right now. Please try again."
      : "Booking inquiries are temporarily unavailable. Please try again later.",
    successStatus: 202,
    webhookConfigured: Boolean(webhook),
    webhookDelivered: webhookOk,
    dbPersisted,
  });

  // 3. Update DB with webhook delivery status
  if (db && dbPersisted) {
    db.update(bookingInquiries)
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
      .where(eq(bookingInquiries.id, dbRecordId))
      .catch(() => {});
  }

  logEvent("booking.inquiry_received", {
    requestId,
    type: inquiry.type,
    entity: inquiry.entity,
    location: inquiry.location || null,
    hasWebhook: Boolean(webhook),
    emailHash,
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
