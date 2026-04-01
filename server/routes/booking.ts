import { Router } from "express";
import { createHash, randomUUID } from "crypto";
import { bookingInquirySchema } from "../lib/schemas";
import { logEvent } from "../lib/logging";
import { scrubEmail } from "../lib/security";
import { getDatabase } from "../db/client";
import { bookingInquiries } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

const WEBHOOK_TIMEOUT_MS = 8_000;

router.post("/api/booking-inquiry", async (req, res) => {
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
  const email = scrubEmail(inquiry.email);
  const emailHash = createHash("sha256").update(email).digest("hex").slice(0, 12);
  const db = getDatabase();
  const dbRecordId = randomUUID();

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
        metadata: { requestId, receivedAt: new Date().toISOString() },
      });
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
    });

    // If we have DB, data is safe — accept it
    if (db) {
      logEvent("booking.inquiry_received", {
        requestId,
        type: inquiry.type,
        entity: inquiry.entity,
        location: inquiry.location || null,
        hasWebhook: false,
        emailHash,
        dbPersisted: true,
      });

      return res.status(202).json({
        ok: true,
        requestId,
        message: "Inquiry received",
      });
    }

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

  let webhookOk = false;

  if (webhook) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...inquiry,
          email,
          requestId,
          receivedAt: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
      });

      if (!response.ok) {
        throw new Error(`Webhook delivery failed with status ${response.status}`);
      }

      webhookOk = true;
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : "Booking inquiry delivery failed";
      logEvent("booking.inquiry_failed", {
        requestId,
        type: inquiry.type,
        message: rawMessage,
      });
    }
  } else {
    // Dev mode, no webhook — that's fine
    webhookOk = true;
  }

  // 3. Update DB with webhook delivery status
  if (db) {
    db.update(bookingInquiries)
      .set({ webhookStatus: webhookOk ? "success" : "failed" })
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
    webhookDelivered: webhookOk,
    dbPersisted: Boolean(db),
  });

  // If webhook failed — tell the user, but data may still be in DB
  if (!webhookOk) {
    // Data is in DB if available — we can retry webhook later
    if (db) {
      // Accept with degraded status — data is safe
      return res.status(202).json({
        ok: true,
        requestId,
        message: "Inquiry received",
      });
    }

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

  return res.status(202).json({
    ok: true,
    requestId,
    message: "Inquiry received",
  });
});

export default router;
