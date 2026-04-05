import { describe, expect, it } from "vitest";
import { resolveOutboundDestination } from "../lib/outbound";

describe("resolveOutboundDestination", () => {
  it("resolves featured ticket redirects", () => {
    expect(resolveOutboundDestination("tickets", "featured")).toMatch(/^https:\/\//);
  });

  it("resolves event-specific ticket redirects with fallback support", () => {
    expect(resolveOutboundDestination("tickets", "us-s3e2")).toMatch(/^https:\/\//);
  });

  it("resolves named waitlist redirects", () => {
    expect(resolveOutboundDestination("waitlist", "untold-story")).toMatch(/^https:\/\//);
  });

  it("rejects unsupported outbound groups", () => {
    expect(resolveOutboundDestination("spotify", "featured")).toBeNull();
  });
});
