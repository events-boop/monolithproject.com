import { Router } from "express";
import { createHash, randomUUID } from "crypto";
import { contactSchema } from "../lib/schemas";
import { logEvent } from "../lib/logging";
import { scrubEmail } from "../lib/security";
import { getDatabase } from "../db/client";
import { contactSubmissions } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

const WEBHOOK_TIMEOUT_MS = 8_000;

router.post("/api/contact", async (req, res) => {
  const requestId = randomUUID();
  const parsed = contactSchema.safeParse(req.body);

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

  const contact = parsed.data;
  const email = scrubEmail(contact.email);
  const emailHash = createHash("sha256").update(email).digest("hex").slice(0, 12);
  const webhook = process.env.CONTACT_WEBHOOK_URL || process.env.BOOKING_WEBHOOK_URL;
  const db = getDatabase();
  const dbRecordId = randomUUID();

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
        metadata: { requestId, receivedAt: new Date().toISOString() },
      });
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
    logEvent("contact.unconfigured", { requestId, subject: contact.subject });
    // Still accept — data is in DB, webhook can be replayed later
  }

  let webhookOk = false;

  if (webhook) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contact,
          email,
          requestId,
          receivedAt: new Date().toISOString(),
          type: "contact_form",
        }),
        signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
      });

      if (!response.ok) {
        throw new Error(`Webhook returned status ${response.status}`);
      }

      webhookOk = true;
    } catch (err) {
      logEvent("contact.webhook_failed", {
        requestId,
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  } else {
    // No webhook configured — DB is the only record, that's fine
    webhookOk = true;
  }

  // 3. Update DB with webhook delivery status
  if (db) {
    db.update(contactSubmissions)
      .set({ webhookStatus: webhookOk ? "success" : "failed" })
      .where(eq(contactSubmissions.id, dbRecordId))
      .catch(() => {});
  }

  logEvent("contact.received", {
    requestId,
    subject: contact.subject,
    hash: emailHash,
    webhookDelivered: webhookOk,
    dbPersisted: Boolean(db),
  });

  // If webhook failed AND we have no DB — data is truly lost, tell the user
  if (!webhookOk && !db) {
    return res.status(502).json({
      ok: false,
      requestId,
      error: {
        code: "DELIVERY_FAILED",
        message: "We couldn't deliver your message right now. Please try again.",
        retryable: true,
      },
    });
  }

  return res.status(200).json({ ok: true, requestId });
});

export default router;
