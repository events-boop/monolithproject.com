import { Router, type Request } from "express";
import { createHash, randomUUID } from "crypto";
import {
  layloWebhookPayloadSchema,
  poshWebhookPayloadSchema,
  type LeadProvider,
} from "../lib/schemas";
import { logEvent } from "../lib/logging";
import { asyncHandler } from "../lib/async";
import { secureCompare } from "../lib/security";
import { pickString, pickQuantity } from "../lib/payload";
import { getDatabase, hasDatabase } from "../db/client";
import { layloSignups } from "../db/schema";
import { createRateLimitMiddleware } from "../services/rate-limit";
import {
  markLeadCaptureProviderStatus,
  persistLeadCapture,
} from "../services/crm-store";
import { mirrorLeadToAirtable } from "../services/airtable-sync";
import { persistPoshWebhookPurchase } from "../services/posh-webhook-store";
import {
  SUNSETS_JULY4_EVENT_SLUG,
  SUNSETS_JULY4_EVENT_TITLE,
} from "@shared/events/sunsets-ticketing";
import {
  insertSocialEchoActivity,
  readSocialEchoEventByKey,
  upsertSocialEchoEventStats,
  type SocialEchoEventStatsRow,
} from "../db/socialEchoRepo";
import { z } from "zod";
import {
  socialEchoByEvent,
  socialEchoActivity,
  rememberSocialActivity,
  pruneSocialEchoByEvent,
} from "../services/social-echo";

// Strict Environment Validation for Webhooks
const WebhookEnvSchema = z.object({
  LAYLO_WEBHOOK_SECRET: z.string().min(1, "Missing LAYLO_WEBHOOK_SECRET"),
  POSH_WEBHOOK_SECRET: z.string().min(1, "Missing POSH_WEBHOOK_SECRET"),
});

let validatedEnv: z.infer<typeof WebhookEnvSchema> | null = null;
try {
  validatedEnv = WebhookEnvSchema.parse(process.env);
} catch (e) {
  console.warn("⚠️ Webhook secrets not fully configured in environment.");
}

const router = Router();
const layloWebhookLimiter = createRateLimitMiddleware({
  scope: "api:webhooks:laylo",
  windowMs: 15 * 60 * 1000,
  limit: 600,
  message: "Webhook capacity reached. Please retry shortly.",
});
const poshWebhookLimiter = createRateLimitMiddleware({
  scope: "api:webhooks:posh",
  windowMs: 15 * 60 * 1000,
  limit: 600,
  message: "Webhook capacity reached. Please retry shortly.",
});

function readLayloSecret(req: Request) {
  return (
    req.header("Laylo-Secret")?.trim() ||
    req.header("X-Laylo-Secret")?.trim() ||
    req.header("X-Webhook-Secret")?.trim() ||
    null
  );
}

function normalizedOptional(value: string | null) {
  return value?.trim() || undefined;
}

function hashWebhookId(prefix: string, value: string) {
  return createHash("sha256").update(`${prefix}:${value}`).digest("hex");
}

function buildLayloLead(payload: Record<string, unknown>) {
  const email = pickString(payload, [
    "email",
    "fan.email",
    "user.email",
    "subscriber.email",
    "contact.email",
    "signup.email",
    "lead.email",
    "customer.email",
  ]);
  const phone = pickString(payload, [
    "phone",
    "phoneNumber",
    "phone_number",
    "fan.phone",
    "user.phone",
    "subscriber.phone",
    "contact.phone",
    "signup.phone",
    "lead.phone",
  ]);
  const firstName = pickString(payload, [
    "firstName",
    "first_name",
    "fan.firstName",
    "user.firstName",
    "subscriber.firstName",
    "contact.firstName",
  ]);
  const lastName = pickString(payload, [
    "lastName",
    "last_name",
    "fan.lastName",
    "user.lastName",
    "subscriber.lastName",
    "contact.lastName",
  ]);
  const instagramHandle = pickString(payload, [
    "instagram",
    "instagramHandle",
    "instagram_handle",
    "fan.instagram",
    "user.instagram",
    "subscriber.instagram",
  ]);
  const layloUserId = pickString(payload, [
    "id",
    "userId",
    "user_id",
    "fan.id",
    "user.id",
    "subscriber.id",
    "contact.id",
  ]);
  const dropName =
    pickString(payload, [
      "drop.name",
      "dropName",
      "drop_name",
      "campaign.name",
    ]) || SUNSETS_JULY4_EVENT_TITLE;
  const dropSlug =
    pickString(payload, [
      "drop.slug",
      "dropSlug",
      "drop_slug",
      "campaign.slug",
    ]) || SUNSETS_JULY4_EVENT_SLUG;
  const signupChannel =
    pickString(payload, [
      "source",
      "channel",
      "signupChannel",
      "signup_channel",
      "utm_source",
    ]) || "laylo_webhook";

  return {
    email: normalizedOptional(email),
    phone: normalizedOptional(phone),
    firstName: normalizedOptional(firstName),
    lastName: normalizedOptional(lastName),
    instagramHandle: normalizedOptional(instagramHandle),
    layloUserId: normalizedOptional(layloUserId),
    dropName,
    dropSlug,
    signupChannel,
    utmSource: normalizedOptional(
      pickString(payload, ["utm_source", "utm.source", "utmSource"])
    ),
    utmMedium: normalizedOptional(
      pickString(payload, ["utm_medium", "utm.medium", "utmMedium"])
    ),
    utmCampaign: normalizedOptional(
      pickString(payload, ["utm_campaign", "utm.campaign", "utmCampaign"])
    ),
    utmContent: normalizedOptional(
      pickString(payload, ["utm_content", "utm.content", "utmContent"])
    ),
    ref: normalizedOptional(
      pickString(payload, ["ref", "reference", "referrer"])
    ),
  };
}

router.post(
  "/api/webhooks/laylo",
  layloWebhookLimiter,
  asyncHandler(async (req, res) => {
    const requestId = randomUUID();
    const configuredSecret =
      validatedEnv?.LAYLO_WEBHOOK_SECRET ||
      process.env.LAYLO_WEBHOOK_SECRET?.trim();

    if (!configuredSecret) {
      logEvent("laylo.webhook_unconfigured", { requestId });
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

    const providedSecret = readLayloSecret(req);
    if (!providedSecret || !secureCompare(providedSecret, configuredSecret)) {
      logEvent("laylo.webhook_denied", { requestId });
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

    const parsed = layloWebhookPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      logEvent("laylo.webhook_invalid_payload", { requestId });
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
    const signup = buildLayloLead(payload);
    if (!signup.email && !signup.phone && !signup.layloUserId) {
      logEvent("laylo.webhook_missing_contact", { requestId });
      return res.status(400).json({
        ok: false,
        requestId,
        error: {
          code: "MISSING_CONTACT",
          message: "Laylo webhook did not include a usable contact identifier.",
          retryable: false,
        },
      });
    }

    let contactId: string | undefined;
    let formSubmissionId: string | undefined;
    const provider: LeadProvider = "laylo";

    if (signup.email) {
      const lead = {
        email: signup.email,
        phone: signup.phone,
        firstName: signup.firstName,
        lastName: signup.lastName,
        instagramHandle: signup.instagramHandle,
        consent: true as const,
        source: "webhook",
        formType: "external_signup",
        funnelId: "chasing-sunsets-wrapper",
        offerId: "lake-list",
        eventInterest: signup.dropSlug,
        eventSeries: "chasing-sunsets",
        eventTitle: signup.dropName,
        interestTags: [
          "chasing_sunsets",
          "lake_list",
          "first_access_signup",
          "sunsets_wrapper",
        ],
        utmSource: signup.utmSource,
        utmMedium: signup.utmMedium,
        utmCampaign: signup.utmCampaign,
        utmContent: signup.utmContent,
      };
      const capture = await persistLeadCapture({
        lead,
        provider,
        idempotencyKey: `laylo:${signup.layloUserId || signup.email}:${signup.dropSlug}`,
        requestId,
      });
      contactId = capture.contactId;
      formSubmissionId = capture.formSubmissionId;
      void markLeadCaptureProviderStatus(capture, "success");
      void mirrorLeadToAirtable({
        lead,
        provider,
        requestId,
        idempotencyKey: `laylo:${signup.layloUserId || signup.email}:${signup.dropSlug}`,
      });
    }

    if (hasDatabase()) {
      const db = getDatabase();
      const dedupeKey = `${signup.layloUserId || signup.email || signup.phone}:${signup.dropSlug}`;
      await db
        ?.insert(layloSignups)
        .values({
          id: hashWebhookId("laylo_signup", dedupeKey),
          contactId: contactId || null,
          formSubmissionId: formSubmissionId || null,
          eventId: null,
          layloUserId: signup.layloUserId || null,
          dropName: signup.dropName,
          dropSlug: signup.dropSlug,
          signupChannel: signup.signupChannel,
          phone: signup.phone || null,
          email: signup.email || null,
          instagramHandle: signup.instagramHandle || null,
          utmSource: signup.utmSource || null,
          utmCampaign: signup.utmCampaign || null,
          layloUrl:
            process.env.OUTBOUND_LAYLO_URL ||
            process.env.OUTBOUND_LAYLO_SUNSETS_URL ||
            process.env.LAYLO_URL ||
            null,
          status: "success",
          metadata: {
            requestId,
            provider: "laylo",
            utmMedium: signup.utmMedium,
            utmContent: signup.utmContent,
            ref: signup.ref,
            payload,
          },
        })
        .onConflictDoNothing();
    }

    logEvent("laylo.webhook_received", {
      requestId,
      dropSlug: signup.dropSlug,
      emailProvided: Boolean(signup.email),
      phoneProvided: Boolean(signup.phone),
      layloUserProvided: Boolean(signup.layloUserId),
      persistence: hasDatabase() ? "database" : "memory",
    });

    return res.status(200).json({
      ok: true,
      requestId,
      persistence: hasDatabase() ? "database" : "memory",
      emailCaptured: Boolean(signup.email),
      phoneCaptured: Boolean(signup.phone),
    });
  })
);

router.post(
  "/api/webhooks/posh",
  poshWebhookLimiter,
  asyncHandler(async (req, res) => {
    const requestId = randomUUID();
    const configuredSecret =
      validatedEnv?.POSH_WEBHOOK_SECRET ||
      process.env.POSH_WEBHOOK_SECRET?.trim();

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
    const inferredEventType =
      pickString(payload, ["type", "event", "webhookType"]) || "unknown";
    const inferredEventId = pickString(payload, [
      "event.id",
      "eventId",
      "event_id",
      "event.slug",
      "eventSlug",
    ]);
    const inferredEventTitle = pickString(payload, [
      "event.name",
      "eventName",
      "event_name",
      "event_title",
      "name",
    ]);
    const inferredCity = pickString(payload, [
      "event.city",
      "city",
      "venue.city",
      "event.location.city",
    ]);
    const inferredStatus =
      pickString(payload, [
        "status",
        "order.status",
        "orderStatus",
        "action",
      ]) ||
      (payload.cancelled === true
        ? "cancelled"
        : payload.refunded === true
          ? "refunded"
          : payload.disputed === true
            ? "disputed"
            : typeof payload.partialRefund === "number" &&
                payload.partialRefund > 0
              ? "refunded"
              : null);
    const quantity = pickQuantity(payload);
    const providerEventId =
      pickString(payload, [
        "id",
        "webhook_id",
        "eventWebhookId",
        "order.id",
        "orderId",
        "order_number",
        "tracking_link",
      ]) ||
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
      let crmPersistence:
        | Awaited<ReturnType<typeof persistPoshWebhookPurchase>>
        | undefined;
      if (hasDatabase()) {
        try {
          crmPersistence = await persistPoshWebhookPurchase(payload, requestId);
        } catch (error) {
          logEvent("posh.webhook_crm_persist_failed", {
            requestId,
            eventType: inferredEventType,
            eventId: inferredEventId,
            providerEventId,
            duplicate: true,
            error: error instanceof Error ? error.message : "unknown",
          });
        }
      }

      logEvent("posh.webhook_duplicate_ignored", {
        requestId,
        activityId,
        providerEventId,
        eventType: inferredEventType,
        crmStatus: crmPersistence?.status,
      });
      return res.status(200).json({ ok: true, requestId, duplicate: true });
    }

    const existingStats =
      socialEchoByEvent.get(eventKey) ||
      (hasDatabase() ? await readSocialEchoEventByKey(eventKey) : null);

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
    } else if (
      normalizedEventType.includes("updated") ||
      normalizedEventType.includes("update")
    ) {
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

    let crmPersistence:
      | Awaited<ReturnType<typeof persistPoshWebhookPurchase>>
      | undefined;
    if (hasDatabase()) {
      try {
        crmPersistence = await persistPoshWebhookPurchase(payload, requestId);
      } catch (error) {
        logEvent("posh.webhook_crm_persist_failed", {
          requestId,
          eventType: inferredEventType,
          eventId: inferredEventId,
          providerEventId,
          error: error instanceof Error ? error.message : "unknown",
        });
      }
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
      crmStatus: crmPersistence?.status,
      persistence: hasDatabase() ? "database" : "memory",
    });

    return res.status(200).json({ ok: true, requestId });
  })
);

export default router;
