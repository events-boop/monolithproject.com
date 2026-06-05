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

  it("fails closed for Sun(Sets) ticket rails until the official Posh URL is configured", async () => {
    process.env.POSH_TICKET_URL = "https://tickets.example.com/featured";
    delete process.env.OUTBOUND_TICKETS_CSS_JUL04_URL;
    delete process.env.NEXT_PUBLIC_POSH_SUNSETS_JULY4_URL;
    delete process.env.OUTBOUND_TICKETS_CSS_AUG22_URL;
    delete process.env.OUTBOUND_TICKETS_CSS_SEP19_URL;
    const { resolveOutboundDestination, TICKETS_COMING_SOON } = await importOutbound();
    expect(resolveOutboundDestination("tickets", "css-jul04")).toBe(TICKETS_COMING_SOON);
    expect(resolveOutboundDestination("tickets", "css-aug22")).toBe(TICKETS_COMING_SOON);
    expect(resolveOutboundDestination("tickets", "css-sep19")).toBe(TICKETS_COMING_SOON);
  });

  it("resolves Sun(Sets) tickets only from their official event env vars", async () => {
    process.env.OUTBOUND_TICKETS_CSS_JUL04_URL = "https://posh.vip/e/sunsets-july-4";
    process.env.OUTBOUND_TICKETS_CSS_AUG22_URL = "https://posh.vip/e/sunsets-august-22";
    process.env.OUTBOUND_TICKETS_CSS_SEP19_URL = "https://posh.vip/e/sunsets-september-19";
    const { resolveOutboundDestination } = await importOutbound();
    expect(resolveOutboundDestination("tickets", "css-jul04")).toBe(
      "https://posh.vip/e/sunsets-july-4",
    );
    expect(resolveOutboundDestination("tickets", "css-aug22")).toBe(
      "https://posh.vip/e/sunsets-august-22",
    );
    expect(resolveOutboundDestination("tickets", "css-sep19")).toBe(
      "https://posh.vip/e/sunsets-september-19",
    );
  });

  it("resolves named waitlist redirects", async () => {
    const { resolveOutboundDestination } = await importOutbound();
    expect(resolveOutboundDestination("waitlist", "untold-story")).toMatch(/^https:\/\//);
    expect(resolveOutboundDestination("waitlist", "sunsets-manychat")).toContain("laylo.com");
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

  it("locks Sun(Sets) July 4 outbound Posh UTMs while preserving click IDs", async () => {
    const { decorateOutboundDestination } = await importOutbound();
    const destination = decorateOutboundDestination("https://posh.vip/e/sunsets-july-4?foo=bar", {
      session_id: "sess_123",
      event_slug: "incoming-event",
      utm_source: "instagram",
      utm_medium: "dm",
      utm_campaign: "manychat",
      utm_content: "sun_keyword",
      ref: "ig_dm_sun",
      fbclid: "fbclid-1",
    }, { group: "tickets", key: "css-jul04" });

    expect(destination).toBe(
      "https://posh.vip/e/sunsets-july-4?foo=bar&utm_source=sunsetsvip&utm_medium=linkinbio&utm_campaign=sunsets_2026_07_04&utm_content=buy_tickets_primary&event_slug=chasing-sunsets-july-4-2026&session_id=sess_123&ref=ig_dm_sun&fbclid=fbclid-1",
    );
  });

  it("preserves UTM and click-id params on outbound redirects", async () => {
    const { decorateOutboundDestination } = await importOutbound();
    const destination = decorateOutboundDestination("https://tickets.example.com/event?utm_source=posh", {
      session_id: "sess_123",
      event_slug: "chasing-sunsets-july-4-2026",
      utm_source: "instagram",
      utm_medium: "social",
      utm_campaign: "season-launch",
      ref: "ig_dm_sun",
      fbclid: "fbclid-1",
    });

    expect(destination).toBe(
      "https://tickets.example.com/event?utm_source=posh&session_id=sess_123&event_slug=chasing-sunsets-july-4-2026&ref=ig_dm_sun&utm_medium=social&utm_campaign=season-launch&fbclid=fbclid-1",
    );
  });

  it("truncates long tracking params without carrying partial query-like fragments", async () => {
    const { decorateOutboundDestination } = await importOutbound();
    const safePrefix = "a".repeat(190);
    const destination = decorateOutboundDestination("https://tickets.example.com/event", {
      ref: `${safePrefix}&utm_campaign=poisoned${"b".repeat(80)}`,
      fbclid: `${"c".repeat(199)}%2F`,
    });
    const url = new URL(destination);

    expect(url.searchParams.get("ref")).toBe(safePrefix);
    expect(url.searchParams.get("fbclid")).toBe("c".repeat(199));
    expect(destination).not.toContain("poisoned");
    expect(destination).not.toContain("%25");
  });
});
