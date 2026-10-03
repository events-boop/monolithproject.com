// Browser-only transport: secrets, release/workspace IDs and upstream URLs stay server-side.
export function prepareMonolithSignup(
  {
    email,
    phone = "",
    instagram = "",
    choices = { email: false, sms: false },
    honeypot = "",
  },
  context = { landingPage: location.href, referrer: document.referrer },
) {
  return {
    submissionId: crypto.randomUUID(),
    occurredAt: new Date().toISOString(),
    email,
    phone,
    instagram,
    choices: { email: choices.email === true, sms: choices.sms === true },
    landingPage: context.landingPage,
    referrer: context.referrer,
    honeypot,
  };
}
// Keep the prepared payload while retrying; prepare a new one only after a successful
// acknowledgment or an edit to the form. Do not attach pixel/Lead or send behavior here.
export async function submitMonolithSignup(payload, { fetcher = fetch } = {}) {
  try {
    const response = await fetcher("/api/audience-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "same-origin",
      redirect: "error",
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      void response.body?.cancel().catch(() => {});
      return {
        ok: false,
        retryable: response.status === 429 || response.status >= 500,
      };
    }
    const data = await response.json();
    if (
      data.status !== "received" ||
      data.submissionId !== payload.submissionId ||
      typeof data.duplicate !== "boolean"
    )
      return { ok: false, retryable: true };
    return { ok: true, message: "Thanks — we’ve received your signup." };
  } catch {
    return { ok: false, retryable: true };
  }
}
