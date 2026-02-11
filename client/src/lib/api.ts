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

interface ApiError {
  error?: {
    message?: string;
  };
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
    throw new Error(body.error?.message || "We couldn't subscribe you right now. Please try again.");
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
