export interface LeadPayload {
  email: string;
  firstName?: string;
  lastName?: string;
  consent: true;
  source: string;
}

interface ApiError {
  error?: {
    message?: string;
  };
}

export async function submitNewsletterLead(payload: LeadPayload, idempotencyKey: string) {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(payload),
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
