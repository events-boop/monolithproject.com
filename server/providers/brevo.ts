import { getBrevoBypassReason } from "../lib/env";

export class BrevoSubscriptionError extends Error {
  constructor(public code: "UNAVAILABLE" | "SUPPRESSED" | "DELIVERY_FAILED") {
    super(`Brevo subscription ${code.toLowerCase()}`);
  }
}
export function brevoListId(value?: string): number | null {
  if (!value || !/^[1-9]\d*$/.test(value.trim())) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}
export function brevoConfigured(listId: number | null) {
  return !getBrevoBypassReason() && listId !== null;
}

// Never unblacklist an address or subscribe it to an audience it did not select.
export async function subscribeBrevoList(input: {
  email: string;
  listId: number;
  firstName?: string;
  lastName?: string;
}) {
  if (!brevoConfigured(brevoListId(String(input.listId))))
    throw new BrevoSubscriptionError("UNAVAILABLE");
  const email = input.email.trim().toLowerCase();
  const headers = {
    "api-key": process.env.BREVO_API_KEY!.trim(),
    "Content-Type": "application/json",
  };
  const endpoint = `https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`;
  try {
    const existing = await fetch(endpoint, {
      headers,
      signal: AbortSignal.timeout(8000),
    });
    if (existing.ok) {
      const contact = await existing.json();
      if (contact.emailBlacklisted === true)
        throw new BrevoSubscriptionError("SUPPRESSED");
    } else if (existing.status !== 404)
      throw new BrevoSubscriptionError("DELIVERY_FAILED");
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers,
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        email,
        updateEnabled: true,
        listIds: [input.listId],
        attributes: {
          ...(input.firstName ? { FIRSTNAME: input.firstName } : {}),
          ...(input.lastName ? { LASTNAME: input.lastName } : {}),
        },
      }),
    });
    if (!response.ok) throw new BrevoSubscriptionError("DELIVERY_FAILED");
    const verification = await fetch(endpoint, {
      headers,
      signal: AbortSignal.timeout(8000),
    });
    if (!verification.ok) throw new BrevoSubscriptionError("DELIVERY_FAILED");
    const contact = await verification.json();
    if (contact.emailBlacklisted === true)
      throw new BrevoSubscriptionError("SUPPRESSED");
    if (
      contact.emailBlacklisted !== false ||
      !contact.listIds?.includes(input.listId)
    )
      throw new BrevoSubscriptionError("DELIVERY_FAILED");
  } catch (error) {
    if (error instanceof BrevoSubscriptionError) throw error;
    throw new BrevoSubscriptionError("DELIVERY_FAILED");
  }
}

const availabilityCache = new Map<number, { ready: boolean; until: number }>();
export async function isBrevoListReachable(listId: number) {
  if (!brevoConfigured(listId)) return false;
  const cached = availabilityCache.get(listId);
  if (cached && cached.until > Date.now()) return cached.ready;
  let ready = false;
  try {
    const response = await fetch(
      `https://api.brevo.com/v3/contacts/lists/${listId}`,
      {
        headers: { "api-key": process.env.BREVO_API_KEY!.trim() },
        signal: AbortSignal.timeout(4000),
      }
    );
    if (response.ok) ready = (await response.json()).id === listId;
    else {
      // Only log the status and an IP explicitly returned for authorization; never provider payloads.
      const detail = await response.json().catch(() => ({}));
      const message = typeof detail.message === "string" ? detail.message : "";
      const ip = /ip address/i.test(message)
        ? message.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/)?.[0]
        : undefined;
      console.warn(
        "Brevo availability:",
        response.status,
        ip ? `authorize server IP ${ip}` : "request rejected"
      );
    }
  } catch {
    /* Keep the email-request fallback visible when delivery cannot be checked. */
  }
  availabilityCache.set(listId, {
    ready,
    until: Date.now() + (ready ? 60000 : 5000),
  });
  return ready;
}
