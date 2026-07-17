import { describe, expect, it } from "vitest";
import { buildPublicSiteData } from "../data/public-site-data";

// SUN(SETS) I (css-jul04) is past and SUN(SETS) II (css-aug22) is the
// featured record. Aug 22 is announced but not on sale, so every featured
// CTA funnels to the Lake List until its gates pass.
const expectedSunsetsCta = {
  label: "Get First Access",
  href: "/go/waitlist/chasing-sunsets",
  tool: "laylo",
};

describe("buildPublicSiteData", () => {
  it("returns a lean public season profile for the homepage", () => {
    const data = buildPublicSiteData("/");
    const featuredUntold = data.events.find(event => event.id === "us-s3e3");
    const featuredSunsets = data.featuredEvents.hero;

    expect(data.path).toBe("/");
    expect(data.events.length).toBeGreaterThan(5);
    expect(data.featuredEvents.hero?.id).toBe("css-aug22");
    expect(featuredSunsets?.primaryCta).toMatchObject(expectedSunsetsCta);
    expect(featuredSunsets?.lineup).toBe("TBA");
    // Not on sale yet: no checkout path or price may leak into the payload.
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
    const untoldEvent = data.events.find(event => event.id === "us-s3e3");

    expect(
      data.events.every(event =>
        ["untold-story", "chasing-sunsets"].includes(event.series)
      )
    ).toBe(true);
    expect(data.events.some(event => event.id === "us-s3e3")).toBe(true);
    expect(data.events.some(event => event.id === "css-aug22")).toBe(true);
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
    const scheduleUntold = data.events.find(event => event.id === "us-s3e3");
    const seasonFinale = data.events.find(event => event.id === "css-sep19");

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
    expect(seasonFinale?.lineup).toBe(
      "Joezi x Massuma (UK) · Special Guests TBA"
    );
  });

  it("keeps the homepage calendar event set aligned with the schedule page", () => {
    const homeData = buildPublicSiteData("/");
    const scheduleData = buildPublicSiteData("/schedule");
    const homeIds = homeData.events.map(event => event.id);
    const scheduleIds = scheduleData.events.map(event => event.id);

    expect(homeIds).toEqual(scheduleIds);
    expect(homeData.events.map(event => event.slug)).toEqual(
      scheduleData.events.map(event => event.slug)
    );
  });

  it("publishes the Kashmir residency series in chronological order", () => {
    const data = buildPublicSiteData("/schedule");
    const residencyEvents = data.events.filter(
      event => event.venue === "Kashmir"
    );

    expect(residencyEvents.map(event => event.id)).toEqual([
      "mpr-kashmir-jul24",
      "hof-kashmir-jul31",
      "mpr-kashmir-aug15",
    ]);
    expect(residencyEvents[0]?.lineup).toBe("ERIK THE DJ · AMAR · FRANK BONO");
    expect(residencyEvents[1]).toMatchObject({
      title: "HOUSE OF FRIENDS POP-UP",
      lineup: "ERIK THE DJ · SPECIAL GUEST",
      time: "Time TBA",
      status: "coming-soon",
    });
    expect(
      residencyEvents[1]?.artistImages?.map(image => image.artist)
    ).toEqual(["ERIK THE DJ"]);
    expect(residencyEvents[2]?.lineup).toBe("ERIK THE DJ B2B AMARI");
  });

  it("returns event-specific maps and live inventory for the VIP route", () => {
    const data = buildPublicSiteData("/vip");
    const vipIds = data.events.map(event => event.id);
    const featuredSunsets = data.events.find(event => event.id === "css-aug22");

    expect(vipIds).toEqual(["css-aug22", "css-sep19"]);
    expect(vipIds).not.toContain("us-s3e3");
    expect(featuredSunsets?.primaryCta).toMatchObject(expectedSunsetsCta);
    expect(featuredSunsets?.venueMap).toMatchObject({
      id: "castaways-sunsets-ii-2026",
      venueId: "castaways-chicago",
      address: "1603 N Lake Shore Dr, Chicago, IL 60611",
      illustrative: true,
    });
    expect(featuredSunsets?.vipPackages?.map(item => item.size)).toEqual([
      "small",
      "medium",
      "large",
    ]);
    expect(
      featuredSunsets?.vipPackages?.map(item => item.availability)
    ).toEqual(["available", "available", "limited"]);
    expect(featuredSunsets?.tableReservationEmail).toBe(
      "vip@chasingsunsets.music"
    );
    expect(featuredSunsets?.startingPrice).toBeUndefined();
    expect(featuredSunsets?.ticketUrl).toBeUndefined();
    expect(featuredSunsets?.ticketTiers).toBeUndefined();
    expect(data.featuredEvents.ticket?.ticketTiers).toBeUndefined();
  });

  it("never ships draft events in any public payload", () => {
    const draftEvent = {
      id: "test-draft",
      series: "chasing-sunsets" as const,
      episode: "TEST",
      title: "Draft Event",
      date: "December 1, 2026",
      time: "TBD",
      venue: "TBA",
      location: "Chicago, IL",
      status: "draft" as const,
    };
    const data = buildPublicSiteData("/schedule", [draftEvent]);
    expect(data.events.some(event => event.id === "test-draft")).toBe(false);
  });

  it("keeps hidden events out of list payloads but in event pages", () => {
    const hiddenEvent = {
      id: "test-hidden",
      series: "chasing-sunsets" as const,
      episode: "TEST",
      title: "Hidden Event",
      slug: "hidden-event",
      date: "December 1, 2026",
      time: "TBD",
      venue: "TBA",
      location: "Chicago, IL",
      status: "hidden" as const,
    };
    const listData = buildPublicSiteData("/schedule", [hiddenEvent]);
    expect(listData.events.some(event => event.id === "test-hidden")).toBe(
      false
    );

    const pageData = buildPublicSiteData("/events/hidden-event", [hiddenEvent]);
    expect(pageData.events.some(event => event.id === "test-hidden")).toBe(
      true
    );
  });
});
