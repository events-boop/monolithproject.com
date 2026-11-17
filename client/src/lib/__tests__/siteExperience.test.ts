import { beforeEach, describe, expect, it } from "vitest";
import type { PublicSiteData, ScheduledEvent } from "@shared/events/types";
import { primePublicSiteData } from "@/lib/siteData";
import {
  getEventById,
  getPastEvents,
  getScheduledEvents,
  getSeriesExperienceEvent,
} from "@/lib/siteExperience";

const TEST_NOW = new Date("2026-04-23T12:00:00-05:00");

const chasingWaitlistEvent: ScheduledEvent = {
  id: "css-jul04",
  series: "chasing-sunsets",
  episode: "INDEPENDENCE DAY",
  title: "CHASING SUN(SETS)",
  headline: "JULY 4TH OPEN-AIR EXPERIENCE",
  date: "July 4, 2026",
  time: "3:00 PM — 10:00 PM",
  startsAt: "2026-07-04T15:00:00-05:00",
  endsAt: "2026-07-04T22:00:00-05:00",
  venue: "Venue Reveal Soon",
  location: "Chicago, IL",
  status: "coming-soon",
  activeFunnels: ["waitlist-chasing"],
};

const chasingPlaceholderEvent: ScheduledEvent = {
  id: "css-jun07",
  series: "chasing-sunsets",
  episode: "SUMMER '26",
  title: "Chasing Sun(Sets)",
  date: "June 7, 2026",
  time: "Golden Hour",
  venue: "Venue Reveal Soon",
  location: "Chicago, IL",
  status: "coming-soon",
};

const untoldHeroEvent: ScheduledEvent = {
  id: "us-s3e3",
  series: "untold-story",
  episode: "SEASON III · EPISODE III",
  title: "ERAN HERSH",
  date: "May 16, 2026",
  time: "9:00 PM — Late",
  startsAt: "2026-05-16T21:00:00-05:00",
  venue: "Venue Reveal Soon",
  location: "Chicago, IL",
  status: "on-sale",
  ticketUrl: "/go/tickets/us-s3e3",
};

function seedSiteData(featuredEvents: PublicSiteData["featuredEvents"]) {
  primePublicSiteData({
    path: "/chasing-sunsets",
    events: [chasingPlaceholderEvent, chasingWaitlistEvent, untoldHeroEvent],
    featuredEvents,
  });
}

describe("siteExperience", () => {
  beforeEach(() => {
    seedSiteData({});
  });

  it("prefers the configured hero event when it matches the requested series", () => {
    seedSiteData({ hero: chasingWaitlistEvent });

    expect(
      getSeriesExperienceEvent("chasing-sunsets", "hero", TEST_NOW)?.id
    ).toBe("css-jul04");
  });

  it("falls back to the best series-specific event when the configured hero belongs to another series", () => {
    seedSiteData({ hero: untoldHeroEvent });

    expect(
      getSeriesExperienceEvent("chasing-sunsets", "hero", TEST_NOW)?.id
    ).toBe("css-jul04");
  });

  it("omits unconfirmed placeholder shows without losing their permanent records", () => {
    const placeholder: ScheduledEvent = {
      ...chasingPlaceholderEvent,
      confirmationStatus: "pending",
    };
    primePublicSiteData({
      path: "/schedule",
      events: [placeholder, untoldHeroEvent],
      featuredEvents: {},
    });

    expect(getScheduledEvents(TEST_NOW).map(event => event.id)).toEqual([
      untoldHeroEvent.id,
    ]);
    expect(getEventById(placeholder.id)).toEqual(placeholder);
  });

  it("keeps ticket-holder notices visible while their replacement date is unconfirmed", () => {
    const postponed: ScheduledEvent = {
      ...untoldHeroEvent,
      id: "postponed-show",
      confirmationStatus: "pending",
      eventStatus: "EventPostponed",
      ticketHolderNotice:
        "Existing tickets remain valid. Contact support for options.",
    };
    primePublicSiteData({
      path: "/schedule",
      events: [postponed],
      featuredEvents: {},
    });

    expect(getScheduledEvents(TEST_NOW).map(event => event.id)).toEqual([
      postponed.id,
    ]);
  });

  it("does not turn expired placeholders into completed shows", () => {
    const placeholder: ScheduledEvent = {
      ...chasingWaitlistEvent,
      confirmationStatus: "pending",
    };
    const now = new Date("2026-11-16T12:00:00-06:00");
    primePublicSiteData({
      path: "/schedule",
      events: [placeholder, untoldHeroEvent],
      featuredEvents: {},
    });

    expect(getPastEvents(now).map(event => event.id)).toEqual([
      untoldHeroEvent.id,
    ]);
    expect(getEventById(placeholder.id)).toEqual(placeholder);
  });
});
