import { getAttributionPayload } from "./attribution";
import { capturePostHogEvent } from "./posthog";
import type { HoneypotPayload } from "@shared/generated/hardening";

export type LeadPayload = HoneypotPayload & {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  instagramHandle?: string;
  consent: true;
  source: string;
  formType?: string;
  funnelId?: string;
  offerId?: string;
  eventInterest?: string;
  eventSeries?: string;
  eventTitle?: string;
  interestTags?: string[];
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  pageUrl?: string;
  sessionId?: string;
  landingPageUrl?: string;
  referrer?: string;
  referrerDomain?: string;
  firstReferrer?: string;
  firstReferrerDomain?: string;
  firstTouchAt?: string;
  lastTouchAt?: string;
  firstUtmSource?: string;
  firstUtmMedium?: string;
  firstUtmCampaign?: string;
  firstUtmTerm?: string;
  firstUtmContent?: string;
  lastUtmSource?: string;
  lastUtmMedium?: string;
  lastUtmCampaign?: string;
  lastUtmTerm?: string;
  lastUtmContent?: string;
  gclid?: string;
  fbclid?: string;
  ttclid?: string;
  msclkid?: string;
  firstGclid?: string;
  firstFbclid?: string;
  firstTtclid?: string;
  firstMsclkid?: string;
  lastGclid?: string;
  lastFbclid?: string;
  lastTtclid?: string;
  lastMsclkid?: string;
};

export interface TicketIntentPayload {
  source: string;
  eventId?: string;
  destinationUrl?: string;
  pageUrl?: string;
  sessionId?: string;
  landingPageUrl?: string;
  referrer?: string;
  referrerDomain?: string;
  firstReferrer?: string;
  firstReferrerDomain?: string;
  firstTouchAt?: string;
  lastTouchAt?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  firstUtmSource?: string;
  firstUtmMedium?: string;
  firstUtmCampaign?: string;
  firstUtmTerm?: string;
  firstUtmContent?: string;
  lastUtmSource?: string;
  lastUtmMedium?: string;
  lastUtmCampaign?: string;
  lastUtmTerm?: string;
  lastUtmContent?: string;
  gclid?: string;
  fbclid?: string;
  ttclid?: string;
  msclkid?: string;
  firstGclid?: string;
  firstFbclid?: string;
  firstTtclid?: string;
  firstMsclkid?: string;
  lastGclid?: string;
  lastFbclid?: string;
  lastTtclid?: string;
  lastMsclkid?: string;
}

export interface LinkClickPayload {
  contactId?: string;
  anonymousSessionId?: string;
  buttonName: string;
  destinationUrl: string;
  pagePath: string;
  eventSlug?: string;
  eventDate?: string;
  interestType?: string;
  channel?: string;
  source?: string;
}

export type AccessEventName =
  | "first_access_click"
  | "ticket_click"
  | "vip_inquiry_click"
  | "partner_inquiry_click"
  | "radio_click"
  | "archive_click"
  | "event_card_click"
  | "outbound_posh_click"
  | "outbound_laylo_click";

export interface AccessEventPayload {
  buttonName: string;
  destinationUrl: string;
  pagePath?: string;
  eventSlug?: string;
  eventDate?: string;
  channel?: string;
  source?: string;
}

export interface PageViewPayload {
  contactId?: string;
  anonymousSessionId?: string;
  pagePath: string;
  eventSlug?: string;
  source?: string;
}

export type BookingInquiryPayload = HoneypotPayload & {
  name: string;
  email: string;
  entity: string;
  type: "partner-on-location" | "artist-booking" | "sponsorship" | "general";
  location?: string;
  message: string;
};

export type ContactPayload = HoneypotPayload & {
  name: string;
  email: string;
  subject: string;
  message: string;
  source?: string;
  formType?: string;
  funnelId?: string;
  interestTags?: string[];
};

interface ApiError {
  message?: string;
  error?: {
    message?: string;
  };
}

function parseApiError(body: ApiError, fallback: string) {
  return body.error?.message || body.message || fallback;
}

export async function submitNewsletterLead(
  payload: LeadPayload,
  idempotencyKey: string
) {
  const url =
    typeof window !== "undefined" ? new URL(window.location.href) : null;
  const attribution = getAttributionPayload();
  const enrichedPayload: LeadPayload = {
    ...attribution,
    ...payload,
    eventInterest:
      payload.eventInterest ||
      url?.searchParams.get("event") ||
      url?.searchParams.get("eventId") ||
      url?.searchParams.get("eventInterest") ||
      undefined,
    pageUrl: payload.pageUrl || url?.href || attribution.pageUrl,
    utmSource:
      payload.utmSource ||
      url?.searchParams.get("utm_source") ||
      attribution.utmSource,
    utmMedium:
      payload.utmMedium ||
      url?.searchParams.get("utm_medium") ||
      attribution.utmMedium,
    utmCampaign:
      payload.utmCampaign ||
      url?.searchParams.get("utm_campaign") ||
      attribution.utmCampaign,
    utmTerm:
      payload.utmTerm ||
      url?.searchParams.get("utm_term") ||
      attribution.utmTerm,
    utmContent:
      payload.utmContent ||
      url?.searchParams.get("utm_content") ||
      attribution.utmContent,
  };

  const response = await fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(enrichedPayload),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiError;
    throw new Error(
      parseApiError(
        body,
        "We couldn't subscribe you right now. Please try again."
      )
    );
  }

  return response.json();
}

export async function submitBookingInquiry(payload: BookingInquiryPayload) {
  const response = await fetch("/api/booking-inquiry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiError;
    throw new Error(
      parseApiError(
        body,
        "We couldn't submit your inquiry right now. Please try again."
      )
    );
  }

  return response.json();
}

export async function submitContactForm(payload: ContactPayload) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiError;
    throw new Error(
      parseApiError(
        body,
        "We couldn't deliver your message right now. Please try again."
      )
    );
  }

  return response.json();
}

export async function verifySponsorAccess(password: string) {
  const response = await fetch("/api/sponsor-access", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiError;
    throw new Error(parseApiError(body, "Invalid access code."));
  }

  return response.json();
}

export async function trackTicketIntent(
  source: string,
  eventId?: string,
  destinationUrl?: string
) {
  const attribution = getAttributionPayload();
  const payload: TicketIntentPayload = {
    ...attribution,
    source,
    eventId,
    destinationUrl,
    pageUrl:
      attribution.pageUrl ||
      (typeof window !== "undefined" ? window.location.href : undefined),
  };

  await fetch("/api/ticket-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => undefined);
}

export function trackFunnelPageView(payload: PageViewPayload) {
  const attribution = getAttributionPayload();
  const enrichedPayload = {
    ...attribution,
    ...payload,
    anonymousSessionId: payload.anonymousSessionId || attribution.sessionId,
  };

  void fetch("/api/track/page-view", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(enrichedPayload),
    keepalive: true,
  }).catch(() => undefined);
}

// Server-side Meta CAPI Lead for the Lake campaign. `eventId` MUST match the
// browser pixel Lead's eventID so Meta deduplicates the pair. Fire-and-forget
// with keepalive so it survives the navigation to the outbound Laylo link.
export function trackLeadConversion(
  eventId: string,
  payload?: { eventSourceUrl?: string; email?: string; phone?: string }
) {
  const attribution = getAttributionPayload();

  void fetch("/api/track/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventId,
      email: payload?.email,
      phone: payload?.phone,
      eventSourceUrl:
        payload?.eventSourceUrl ||
        attribution.pageUrl ||
        (typeof window !== "undefined" ? window.location.href : undefined),
      fbclid:
        attribution.fbclid ||
        attribution.lastFbclid ||
        attribution.firstFbclid,
    }),
    keepalive: true,
  }).catch(() => undefined);
}

export function trackLinkClick(payload: LinkClickPayload) {
  const attribution = getAttributionPayload();
  const enrichedPayload = {
    ...attribution,
    ...payload,
    anonymousSessionId: payload.anonymousSessionId || attribution.sessionId,
  };

  void fetch("/api/track/link-click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(enrichedPayload),
    keepalive: true,
  }).catch(() => undefined);
}

export function trackAccessEvent(
  eventName: AccessEventName,
  payload: AccessEventPayload
) {
  const pagePath =
    payload.pagePath ||
    (typeof window !== "undefined" ? window.location.pathname : "/");

  trackLinkClick({
    ...payload,
    pagePath,
    interestType: eventName,
  });

  capturePostHogEvent(eventName, {
    button_name: payload.buttonName,
    destination_url: payload.destinationUrl,
    page_path: pagePath,
    event_slug: payload.eventSlug,
    event_date: payload.eventDate,
    channel: payload.channel,
    source: payload.source,
  });
}
