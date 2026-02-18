export interface LeadPayload {
  email: string;
  firstName?: string;
  lastName?: string;
  consent: true;
  source: string;
  eventInterest?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  pageUrl?: string;
}

export interface BookingInquiryPayload {
  name: string;
  email: string;
  entity: string;
  type: "partner-on-location" | "artist-booking" | "sponsorship" | "general";
  location?: string;
  message: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ApiError {
  message?: string;
  error?: {
    message?: string;
  };
}

function parseApiError(body: ApiError, fallback: string) {
  return body.error?.message || body.message || fallback;
}

export async function submitNewsletterLead(payload: LeadPayload, idempotencyKey: string) {
  const url = typeof window !== "undefined" ? new URL(window.location.href) : null;
  const enrichedPayload: LeadPayload = {
    ...payload,
    pageUrl: payload.pageUrl || url?.href,
    utmSource: payload.utmSource || url?.searchParams.get("utm_source") || undefined,
    utmMedium: payload.utmMedium || url?.searchParams.get("utm_medium") || undefined,
    utmCampaign: payload.utmCampaign || url?.searchParams.get("utm_campaign") || undefined,
    utmTerm: payload.utmTerm || url?.searchParams.get("utm_term") || undefined,
    utmContent: payload.utmContent || url?.searchParams.get("utm_content") || undefined,
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
    throw new Error(parseApiError(body, "We couldn't subscribe you right now. Please try again."));
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
    throw new Error(parseApiError(body, "We couldn't submit your inquiry right now. Please try again."));
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
    throw new Error(parseApiError(body, "We couldn't submit your message right now. Please try again."));
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

export async function trackTicketIntent(source: string, eventId?: string) {
  await fetch("/api/ticket-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source, eventId }),
    keepalive: true,
  }).catch(() => undefined);
}
