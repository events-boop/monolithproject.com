import { describe, expect, it } from "vitest";
import { buildPublicSiteData } from "../data/public-site-data";

describe("buildPublicSiteData", () => {
  it("returns a lean public season profile for the homepage", () => {
    const data = buildPublicSiteData("/");
    const featuredUntold = data.events.find((event) => event.id === "us-s3e3");
    const featuredSunsets = data.featuredEvents.hero;

    expect(data.path).toBe("/");
    expect(data.events.length).toBeGreaterThan(5);
    expect(data.featuredEvents.hero?.id).toBe("css-jul04");
    expect(featuredSunsets?.primaryCta).toMatchObject({
      label: "Get First Access",
      href: "/go/waitlist/chasing-sunsets",
      tool: "laylo",
    });
    expect(featuredSunsets?.startingPrice).toBeUndefined();
    expect(featuredSunsets?.ticketUrl).toBeUndefined();
    expect(featuredUntold?.ticketTiers).toBeUndefined();
    expect(featuredUntold?.whatToExpect).toBeUndefined();
    expect(featuredUntold?.tablePackages).toBeUndefined();
    expect(featuredUntold?.faqs).toBeUndefined();
    expect(featuredUntold?.activeFunnels).toBeUndefined();
    expect(featuredUntold?.lineup).toBeDefined();
    expect(featuredUntold?.status).toBe("past");
    expect(featuredUntold?.ticketUrl).toBeUndefined();
  });

  it("limits untold pages to the featured payload plus untold events", () => {
    const data = buildPublicSiteData("/story");
    const untoldEvent = data.events.find((event) => event.id === "us-s3e3");

    expect(data.events.every((event) => ["untold-story", "chasing-sunsets"].includes(event.series))).toBe(true);
    expect(data.events.some((event) => event.id === "us-s3e3")).toBe(true);
    expect(data.events.some((event) => event.id === "css-jul04")).toBe(true);
    expect(untoldEvent?.primaryCta).toMatchObject({
      label: "Get Alerts First",
      href: "/story#untold-funnel",
      tool: "laylo",
    });
    expect(untoldEvent?.ticketUrl).toBeUndefined();
    expect(untoldEvent?.ticketTiers?.length).toBeGreaterThan(0);
    expect(untoldEvent?.whatToExpect?.length).toBeGreaterThan(0);
  });

  it("returns summary-only season data for the schedule page", () => {
    const data = buildPublicSiteData("/schedule");
    const scheduleUntold = data.events.find((event) => event.id === "us-s3e3");

    expect(data.events.length).toBeGreaterThan(5);
    expect(scheduleUntold?.sound).toBeDefined();
    expect(scheduleUntold?.lineup).toBeDefined();
    expect(scheduleUntold?.primaryCta).toMatchObject({
      label: "Get Alerts First",
      href: "/story#untold-funnel",
      tool: "laylo",
    });
    expect(scheduleUntold?.ticketUrl).toBeUndefined();
    expect(scheduleUntold?.ticketTiers).toBeUndefined();
    expect(scheduleUntold?.faqs).toBeUndefined();
    expect(scheduleUntold?.tablePackages).toBeUndefined();
    expect(scheduleUntold?.activeFunnels).toBeUndefined();
  });

  it("falls back to featured events for non-season routes", () => {
    const data = buildPublicSiteData("/vip");
    const featuredIds = data.events.map((event) => event.id);
    const featuredSunsets = data.events.find((event) => event.id === "css-jul04");

    expect(featuredIds).toContain("css-jul04");
    expect(featuredIds).not.toContain("us-s3e3");
    expect(data.events.length).toBe(1);
    expect(featuredSunsets?.primaryCta).toMatchObject({
      label: "Get First Access",
      href: "/go/waitlist/chasing-sunsets",
      tool: "laylo",
    });
    expect(featuredSunsets?.startingPrice).toBeUndefined();
    expect(featuredSunsets?.ticketUrl).toBeUndefined();
    expect(featuredSunsets?.ticketTiers).toBeUndefined();
    expect(data.featuredEvents.ticket?.ticketTiers).toBeUndefined();
  });
});
