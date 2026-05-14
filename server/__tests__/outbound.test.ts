import { afterEach, describe, expect, it, vi } from "vitest";

const originalEnv = { ...process.env };

async function importOutbound() {
  vi.resetModules();
  return import("../lib/outbound");
}

afterEach(() => {
  process.env = { ...originalEnv };
  vi.resetModules();
});

describe("resolveOutboundDestination", () => {
  it("resolves featured ticket redirects", async () => {
    const { resolveOutboundDestination } = await importOutbound();
    expect(resolveOutboundDestination("tickets", "featured")).toMatch(/^https:\/\//);
  });

  it("resolves event-specific ticket redirects with explicit mappings", async () => {
    process.env.OUTBOUND_TICKETS_US_S3E3_URL = "https://tickets.example.com/eran-hersh";
    const { resolveOutboundDestination } = await importOutbound();
    expect(resolveOutboundDestination("tickets", "us-s3e3")).toBe(
      "https://tickets.example.com/eran-hersh",
    );
  });

  it("resolves named waitlist redirects", async () => {
    const { resolveOutboundDestination } = await importOutbound();
    expect(resolveOutboundDestination("waitlist", "untold-story")).toMatch(/^https:\/\//);
  });

  it("resolves Sunsets media, gallery, form, and social redirects", async () => {
    const { resolveOutboundDestination } = await importOutbound();

    expect(resolveOutboundDestination("media", "sunsets-recap")).toContain("youtu");
    expect(resolveOutboundDestination("media", "sunsets-soundcloud")).toContain("soundcloud.com");
    expect(resolveOutboundDestination("gallery", "chasing-sunsets")).toContain("pic-time.com");
    expect(resolveOutboundDestination("forms", "sunsets-vip")).toContain("chasingsunsets.vip");
    expect(resolveOutboundDestination("social", "instagram-sunsets")).toContain("instagram.com");
  });

  it("rejects unsupported outbound groups", async () => {
    const { resolveOutboundDestination } = await importOutbound();
    expect(resolveOutboundDestination("unknown", "featured")).toBeNull();
  });

  it("preserves UTM and click-id params on outbound redirects", async () => {
    const { decorateOutboundDestination } = await importOutbound();
    const destination = decorateOutboundDestination("https://tickets.example.com/event?utm_source=posh", {
      utm_source: "instagram",
      utm_medium: "social",
      utm_campaign: "season-launch",
      fbclid: "fbclid-1",
    });

    expect(destination).toBe(
      "https://tickets.example.com/event?utm_source=posh&utm_medium=social&utm_campaign=season-launch&fbclid=fbclid-1",
    );
  });
});
