import { Router } from "express";
import { createHash, randomUUID } from "crypto";
import { poshWebhookPayloadSchema } from "../lib/schemas";
import { logEvent } from "../lib/logging";
import { secureCompare } from "../lib/security";
import { pickString, pickQuantity } from "../lib/payload";
import { hasDatabase } from "../db/client";
import {
  insertSocialEchoActivity,
  readSocialEchoEventByKey,
  upsertSocialEchoEventStats,
  type SocialEchoEventStatsRow,
} from "../db/socialEchoRepo";
import {
  socialEchoByEvent,
  socialEchoActivity,
  rememberSocialActivity,
  pruneSocialEchoByEvent,
} from "../services/social-echo";

const router = Router();

router.post("/api/webhooks/posh", async (req, res) => {
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

  pruneSocialEchoByEvent();

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

export default router;
