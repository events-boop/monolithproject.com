import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { currentSunsets } from "../../shared/events/sunsets-current";
import { buildPublicSiteData } from "../data/public-site-data";

// The public finale uses the same approved publication as /sunsets.
const expectedSunsetsCta = {
  label: "Event update",
  href: "/sunsets#event-status",
  tool: "posh",
};

describe("buildPublicSiteData", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-18T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it("returns a lean public season profile for the homepage", () => {
    const data = buildPublicSiteData("/");
    const featuredUntold = data.events.find(event => event.id === "us-s3e3");
    const featuredSunsets = data.featuredEvents.hero;

    expect(data.path).toBe("/");
    expect(data.events.length).toBeGreaterThan(5);
    expect(data.featuredEvents.hero?.id).toBe("css-sep19");
    expect(featuredSunsets?.primaryCta).toMatchObject(expectedSunsetsCta);
    expect(featuredSunsets?.lineup).toBe(
      [...currentSunsets.headliners, ...currentSunsets.support].join(" · ")
    );
    // Pricing stays at checkout; only the approved ticket destination is exposed.
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
    expect(data.events.some(event => event.id === "css-sep19")).toBe(true);
    expect(untoldEvent?.primaryCta).toMatchObject({
      label: "View archive",
      href: "/archive",
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
      label: "View archive",
      href: "/archive",
      tool: "laylo",
    });
    expect(scheduleUntold?.ticketUrl).toBeUndefined();
    expect(scheduleUntold?.ticketTiers).toBeUndefined();
    expect(scheduleUntold?.faqs).toBeUndefined();
    expect(scheduleUntold?.tablePackages).toBeUndefined();
    expect(scheduleUntold?.activeFunnels).toBeUndefined();
    expect(seasonFinale?.lineup).toBe(
      [...currentSunsets.headliners, ...currentSunsets.support].join(" · ")
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
      status: "past",
    });
    expect(
      residencyEvents[1]?.artistImages?.map(image => image.artist)
    ).toEqual(["ERIK THE DJ"]);
    expect(residencyEvents[2]?.lineup).toBe("ERIK THE DJ B2B AMARI");
  });

  it("returns the approved venue without unverified VIP inventory", () => {
    const data = buildPublicSiteData("/vip");
    const vipIds = data.events.map(event => event.id);
    const featuredSunsets = data.events.find(event => event.id === "css-sep19");

    expect(vipIds).toEqual(["css-sep19"]);
    expect(vipIds).not.toContain("us-s3e3");
    expect(featuredSunsets?.primaryCta).toMatchObject(expectedSunsetsCta);
    expect(featuredSunsets?.venueMap).toMatchObject({
      id: "castaways-sunsets-iii-2026",
      venueId: "castaways-chicago",
      address: currentSunsets.address,
      illustrative: true,
    });
    expect(featuredSunsets?.vipPackages).toBeUndefined();
    expect(featuredSunsets?.tableReservationEmail).toBe(
      "events@monolithproject.com"
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

  it("keeps the postponed event update featured after its original date", () => {
    // Fast-forward past September 19, 2026 to verify automated date sweep engine
    vi.setSystemTime(new Date("2026-09-20T12:00:00Z"));
    const data = buildPublicSiteData("/");
    const featuredSunsets = data.featuredEvents.hero;

    expect(featuredSunsets?.id).toBe("css-sep19");
    expect(featuredSunsets?.primaryCta).toMatchObject({
      label: "Event update",
      href: "/sunsets#event-status",
      tool: "posh",
    });
  });
  it("keeps stale database content from replacing the approved public finale", () => {
    const stale = {
      ...buildPublicSiteData("/").featuredEvents.hero!,
      status: "coming-soon" as const,
      venue: "Old venue",
      lineup: "TBA",
      ticketUrl: "https://posh.vip/old",
    };
    const event = buildPublicSiteData("/", [stale]).featuredEvents.hero;
    expect(event).toMatchObject({
      venue: currentSunsets.venueName,
      status: "coming-soon",
      eventStatus: "EventPostponed",
      ticketUrl: undefined,
      startsAt: currentSunsets.start,
      endsAt: currentSunsets.end,
    });
  });
});
