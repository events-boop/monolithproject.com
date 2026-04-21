import { beforeEach, describe, expect, it } from "vitest";
import {
  appendAttributionQueryParams,
  clearAttributionState,
  getAttributionPayload,
  initAttributionTracking,
  syncAttributionForNavigation,
} from "@/lib/attribution";

function setReferrer(value: string) {
  Object.defineProperty(document, "referrer", {
    configurable: true,
    value,
  });
}

describe("attribution", () => {
  beforeEach(() => {
    clearAttributionState();
    window.history.replaceState({}, "", "/");
    setReferrer("");
  });

  it("captures first-touch attribution from the landing page", () => {
    setReferrer("https://instagram.com/monolith");
    window.history.replaceState(
      {},
      "",
      "/tickets?utm_source=instagram&utm_medium=social&utm_campaign=season-launch&utm_content=story-1&gclid=gclid-123",
    );

    initAttributionTracking();
    const payload = getAttributionPayload();

    expect(payload.sessionId).toBeTruthy();
    expect(payload.landingPageUrl).toContain("/tickets?");
    expect(payload.utmSource).toBe("instagram");
    expect(payload.firstUtmSource).toBe("instagram");
    expect(payload.gclid).toBe("gclid-123");
    expect(payload.firstReferrerDomain).toBe("instagram.com");
  });

  it("preserves acquisition fields across SPA navigation without new query params", () => {
    setReferrer("https://instagram.com/monolith");
    window.history.replaceState({}, "", "/?utm_source=instagram&utm_medium=social&utm_campaign=season-launch");
    initAttributionTracking();

    window.history.replaceState({}, "", "/newsletter");
    syncAttributionForNavigation();

    const payload = getAttributionPayload();
    expect(payload.pageUrl).toContain("/newsletter");
    expect(payload.landingPageUrl).toContain("/?utm_source=instagram");
    expect(payload.utmSource).toBe("instagram");
    expect(payload.lastUtmCampaign).toBe("season-launch");
  });

  it("keeps first touch while updating last touch when a new campaign arrives", () => {
    setReferrer("https://instagram.com/monolith");
    window.history.replaceState({}, "", "/?utm_source=instagram&utm_campaign=launch");
    initAttributionTracking();

    setReferrer("https://www.google.com/search?q=monolith");
    window.history.replaceState({}, "", "/tickets?utm_source=google&utm_medium=cpc&utm_campaign=retarget&gclid=gclid-2");
    syncAttributionForNavigation();

    const payload = getAttributionPayload();
    expect(payload.firstUtmSource).toBe("instagram");
    expect(payload.utmSource).toBe("google");
    expect(payload.lastUtmCampaign).toBe("retarget");
    expect(payload.gclid).toBe("gclid-2");
    expect(payload.firstReferrerDomain).toBe("instagram.com");
    expect(payload.referrerDomain).toBe("www.google.com");
  });

  it("decorates conversion URLs with the captured attribution query params", () => {
    window.history.replaceState(
      {},
      "",
      "/story?utm_source=instagram&utm_medium=social&utm_campaign=season-launch&fbclid=fbclid-1",
    );
    initAttributionTracking();

    const href = appendAttributionQueryParams("/go/tickets/us-s3e3");
    expect(href).toBe(
      "/go/tickets/us-s3e3?utm_source=instagram&utm_medium=social&utm_campaign=season-launch&fbclid=fbclid-1",
    );
  });

  it("keeps explicit conversion URL params when attribution is appended", () => {
    window.history.replaceState({}, "", "/?utm_source=instagram&utm_campaign=season-launch");
    initAttributionTracking();

    const href = appendAttributionQueryParams("/go/tickets/us-s3e3?utm_source=partner");
    expect(href).toContain("utm_source=partner");
    expect(href).toContain("utm_campaign=season-launch");
  });
});
