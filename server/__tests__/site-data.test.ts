import { describe, expect, it } from "vitest";
import { buildPublicSiteData } from "../data/public-site-data";

describe("buildPublicSiteData", () => {
  it("returns a lean public season profile for the homepage", () => {
    const data = buildPublicSiteData("/");
    const featuredUntold = data.events.find((event) => event.id === "us-s3e2");
    const featuredSunsets = data.featuredEvents.hero;

    expect(data.path).toBe("/");
    expect(data.events.length).toBeGreaterThan(5);
    expect(data.featuredEvents.hero?.id).toBe("css-jul04");
    expect(featuredSunsets?.primaryCta).toMatchObject({
      label: "Unlock Presale Access",
      href: "/chasing-sunsets#chasing-funnel",
      tool: "laylo",
    });
    expect(featuredUntold?.ticketTiers).toBeUndefined();
    expect(featuredUntold?.whatToExpect).toBeUndefined();
    expect(featuredUntold?.tablePackages).toBeUndefined();
    expect(featuredUntold?.faqs).toBeUndefined();
    expect(featuredUntold?.activeFunnels).toBeUndefined();
    expect(featuredUntold?.tableReservationEmail).toBe("events@monolithproject.com");
  });

  it("limits untold pages to the featured payload plus untold events", () => {
    const data = buildPublicSiteData("/story");
    const richUntoldEvent = data.events.find((event) => event.id === "us-s3e2");
    const upcomingUntoldEvent = data.events.find((event) => event.id === "us-s3e3");

    expect(data.events.every((event) => ["untold-story", "chasing-sunsets"].includes(event.series))).toBe(true);
    expect(data.events.some((event) => event.id === "us-s3e3")).toBe(true);
    expect(data.events.some((event) => event.id === "css-jul04")).toBe(true);
    expect(upcomingUntoldEvent?.primaryCta).toMatchObject({
      label: "Unlock Presale Access",
      href: "/story#untold-funnel",
      tool: "laylo",
    });
    expect(richUntoldEvent?.ticketTiers?.length).toBeGreaterThan(0);
    expect(richUntoldEvent?.whatToExpect?.length).toBeGreaterThan(0);
  });

  it("returns summary-only season data for the schedule page", () => {
    const data = buildPublicSiteData("/schedule");
    const scheduleUntold = data.events.find((event) => event.id === "us-s3e2");
    const upcomingUntoldEvent = data.events.find((event) => event.id === "us-s3e3");

    expect(data.events.length).toBeGreaterThan(5);
    expect(scheduleUntold?.sound).toBeDefined();
    expect(scheduleUntold?.lineup).toBeDefined();
    expect(upcomingUntoldEvent?.primaryCta).toMatchObject({
      label: "Unlock Presale Access",
      href: "/story#untold-funnel",
      tool: "laylo",
    });
    expect(scheduleUntold?.ticketTiers).toBeUndefined();
    expect(scheduleUntold?.faqs).toBeUndefined();
    expect(scheduleUntold?.tablePackages).toBeUndefined();
    expect(scheduleUntold?.activeFunnels).toBeUndefined();
  });

  it("falls back to featured events for non-season routes", () => {
    const data = buildPublicSiteData("/vip");

    expect(data.events.map((event) => event.id)).toContain("css-jul04");
    expect(data.events.length).toBe(1);
    expect(data.events[0]?.primaryCta).toMatchObject({
      label: "Unlock Presale Access",
      href: "/chasing-sunsets#chasing-funnel",
      tool: "laylo",
    });
    expect(data.events[0]?.ticketTiers).toBeUndefined();
    expect(data.featuredEvents.ticket?.ticketTiers).toBeUndefined();
  });
});
