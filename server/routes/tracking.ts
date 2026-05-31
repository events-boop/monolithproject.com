import { Router } from "express";
import { randomUUID } from "crypto";
import { asyncHandler } from "../lib/async";
import { clickCaptureSchema, pageViewCaptureSchema } from "../lib/schemas";
import { getDatabase } from "../db/client";
import { contactEventInterest, contentEngagement, funnelPageViews, linkClicks } from "../db/schema";
import { createRateLimitMiddleware, getClientIdentifier } from "../services/rate-limit";
import { logEvent } from "../lib/logging";
import { sendLeadConversion } from "../services/meta-capi";
import { parseCookieHeader } from "../lib/cookies";

const router = Router();

// Dedicated Dataset for the paid Sun(Sets) "Lake" campaign. Hard-coded to match
// the browser pixel; overridable via env without a redeploy of marketing logic.
const LAKE_PIXEL_ID = process.env.META_LAKE_PIXEL_ID?.trim() || "1049241148606250";

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

const trackingLimiter = createRateLimitMiddleware({
  scope: "api:tracking",
  windowMs: 15 * 60 * 1000,
  limit: 240,
  message: "Too many tracking events. Please wait 15 minutes before trying again.",
});

function contentTypeForInterest(interestType?: string) {
  if (interestType === "recap_click") return "youtube_recap";
  if (interestType === "gallery_click") return "photo_gallery";
  if (interestType === "soundcloud_click") return "soundcloud_mix";
  return undefined;
}

router.post("/api/track/page-view", trackingLimiter, asyncHandler(async (req, res) => {
  const requestId = randomUUID();
  const parsed = pageViewCaptureSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      requestId,
      error: { code: "VALIDATION_ERROR", message: "Invalid page view payload.", retryable: false },
    });
  }

  const db = getDatabase();
  if (db) {
    await db.insert(funnelPageViews).values({
      id: randomUUID(),
      contactId: parsed.data.contactId || null,
      anonymousSessionId: parsed.data.anonymousSessionId || parsed.data.sessionId || null,
      pagePath: parsed.data.pagePath,
      eventSlug: parsed.data.eventSlug || null,
      source: parsed.data.source || null,
      utmSource: parsed.data.utmSource || parsed.data.lastUtmSource || parsed.data.firstUtmSource || null,
      utmMedium: parsed.data.utmMedium || parsed.data.lastUtmMedium || parsed.data.firstUtmMedium || null,
      utmCampaign: parsed.data.utmCampaign || parsed.data.lastUtmCampaign || parsed.data.firstUtmCampaign || null,
      utmContent: parsed.data.utmContent || parsed.data.lastUtmContent || parsed.data.firstUtmContent || null,
      utmTerm: parsed.data.utmTerm || parsed.data.lastUtmTerm || parsed.data.firstUtmTerm || null,
      metadata: parsed.data,
    }).catch((error) => {
      logEvent("tracking.page_view_db_failed", {
        requestId,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    });
  }

  return res.status(202).json({ ok: true, requestId });
}));

router.post("/api/track/link-click", trackingLimiter, asyncHandler(async (req, res) => {
  const requestId = randomUUID();
  const parsed = clickCaptureSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      requestId,
      error: { code: "VALIDATION_ERROR", message: "Invalid click payload.", retryable: false },
    });
  }

  const data = parsed.data;
  const anonymousSessionId = data.anonymousSessionId || data.sessionId || null;
  const utmSource = data.utmSource || data.lastUtmSource || data.firstUtmSource || null;
  const utmCampaign = data.utmCampaign || data.lastUtmCampaign || data.firstUtmCampaign || null;
  const db = getDatabase();

  if (db) {
    await db.insert(linkClicks).values({
      id: randomUUID(),
      contactId: data.contactId || null,
      anonymousSessionId,
      buttonName: data.buttonName,
      destinationUrl: data.destinationUrl,
      pagePath: data.pagePath,
      eventSlug: data.eventSlug || null,
      interestType: data.interestType || null,
      channel: data.channel || null,
      utmSource,
      utmMedium: data.utmMedium || data.lastUtmMedium || data.firstUtmMedium || null,
      utmCampaign,
      utmContent: data.utmContent || data.lastUtmContent || data.firstUtmContent || null,
      utmTerm: data.utmTerm || data.lastUtmTerm || data.firstUtmTerm || null,
      metadata: data,
    }).catch((error) => {
      logEvent("tracking.link_click_db_failed", {
        requestId,
        buttonName: data.buttonName,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    });

    if (data.eventSlug && data.interestType) {
      await db.insert(contactEventInterest).values({
        id: randomUUID(),
        contactId: data.contactId || null,
        anonymousSessionId,
        eventSlug: data.eventSlug,
        eventDate: data.eventDate || null,
        interestType: data.interestType,
        source: data.source || utmSource || data.channel || null,
        metadata: data,
      }).catch((error) => {
        logEvent("tracking.contact_event_interest_db_failed", {
          requestId,
          buttonName: data.buttonName,
          message: error instanceof Error ? error.message : "Unknown error",
        });
      });
    }

    const contentType = contentTypeForInterest(data.interestType);
    if (contentType) {
      await db.insert(contentEngagement).values({
        id: randomUUID(),
        contentId: data.eventSlug || data.buttonName.toLowerCase().replace(/\s+/g, "-"),
        contentType,
        title: data.buttonName,
        platform: data.channel || null,
        clickedFrom: data.pagePath,
        contactId: data.contactId || null,
        anonymousSessionId,
        metadata: data,
      }).catch((error) => {
        logEvent("tracking.content_engagement_db_failed", {
          requestId,
          buttonName: data.buttonName,
          message: error instanceof Error ? error.message : "Unknown error",
        });
      });
    }
  }

  logEvent("tracking.link_click", {
    requestId,
    buttonName: data.buttonName,
    eventSlug: data.eventSlug || null,
    interestType: data.interestType || null,
    utmSource,
    utmCampaign,
  });

  return res.status(202).json({ ok: true, requestId });
}));

// Server-side Meta CAPI Lead for the Lake campaign. The browser fires a pixel
// Lead with the same `eventId`; Meta deduplicates the pair by event_id. The CAPI
// access token lives server-side only and never reaches the client.
router.post("/api/track/lead", trackingLimiter, asyncHandler(async (req, res) => {
  const requestId = randomUUID();
  const eventId = asString(req.body?.eventId);

  if (!eventId) {
    return res.status(400).json({
      ok: false,
      requestId,
      error: { code: "VALIDATION_ERROR", message: "Missing eventId.", retryable: false },
    });
  }

  const cookies = parseCookieHeader(req.header("cookie"));

  void sendLeadConversion({
    eventId,
    pixelId: LAKE_PIXEL_ID,
    email: asString(req.body?.email),
    phone: asString(req.body?.phone),
    eventSourceUrl: asString(req.body?.eventSourceUrl),
    clientIp: getClientIdentifier(req),
    userAgent: req.header("user-agent") || undefined,
    fbp: cookies._fbp,
    fbc: cookies._fbc,
    fbclid: asString(req.body?.fbclid),
    customData: {
      content_name: "First Access Signup - Chasing Sun(Sets)",
      content_category: "Waitlist",
      lead_source: "sunsets_lake_first_access",
    },
  });

  logEvent("tracking.lead_conversion", { requestId, eventId, pixelId: LAKE_PIXEL_ID });

  return res.status(202).json({ ok: true, requestId, eventId });
}));

export default router;
