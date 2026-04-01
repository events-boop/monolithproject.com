export const COOKIE_CONSENT_STORAGE_KEY = "monolith_cookie_consent";
export const COOKIE_CONSENT_RESOLVED_EVENT = "monolith:cookie-consent-resolved";

export type CookieConsentState = "accepted" | "declined" | null;

export function getCookieConsentState(): CookieConsentState {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    return stored === "accepted" || stored === "declined" ? stored : null;
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent() {
  return getCookieConsentState() === "accepted";
}
