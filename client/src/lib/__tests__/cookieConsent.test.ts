import { beforeEach, describe, expect, it } from "vitest";
import {
  COOKIE_CONSENT_STORAGE_KEY,
  getCookieConsentState,
  hasAnalyticsConsent,
} from "../cookieConsent";

describe("cookieConsent", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns null when consent has not been set", () => {
    expect(getCookieConsentState()).toBeNull();
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it("returns accepted when the user has opted in", () => {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "accepted");

    expect(getCookieConsentState()).toBe("accepted");
    expect(hasAnalyticsConsent()).toBe(true);
  });

  it("returns declined when the user has opted out", () => {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "declined");

    expect(getCookieConsentState()).toBe("declined");
    expect(hasAnalyticsConsent()).toBe(false);
  });
});
