// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  withPublicEventIntegrity,
  uniqueHistoricalNights,
} from "../events/publicIntegrity";
import {
  getPublishedCatalogue,
  getPublishedEventState,
} from "../events/publishedState";
import { getEventWindowStatus, isTicketOnSale } from "../events/lifecycle";
import type { ScheduledEvent } from "../events/types";

const now = new Date("2026-11-16T12:00:00Z");
const record: ScheduledEvent = {
  id: "proposed-afterparty",
  title: "Proposed after-party",
  episode: "Afterparty",
  series: "untold-story",
  venue: "Venue to be announced",
  location: "Chicago",
  date: "July 4, 2026",
  time: "10:30 PM",
  startsAt: "2026-07-04T22:30:00-05:00",
  endsAt: "2026-07-05T04:00:00-05:00",
  status: "past",
  confirmationStatus: "pending",
  recapUrl: "/chasing-sunsets/sunsets-i-2026",
  archiveSlug: "lakefront-show",
  ticketUrl: "https://example.com/checkout",
};

describe("public event integrity", () => {
  it("does not turn an expired provisional announcement into a performance or receipt", () => {
    const event = withPublicEventIntegrity(record);
    expect(event.status).toBe("coming-soon");
    expect(event.recapUrl).toBeUndefined();
    expect(event.archiveSlug).toBeUndefined();
    expect(event.ticketUrl).toBeUndefined();
    expect(getEventWindowStatus(event, now)).toBe("unscheduled");
    expect(getPublishedEventState(event, now)).toMatchObject({
      kind: "first-access",
      listed: false,
    });
    expect(getPublishedCatalogue([event], now)).toMatchObject({
      site: "between-shows",
      upcoming: [],
      past: [],
    });
    expect(record.status).toBe("past");
  });
  it("prevents even a stale on-sale API record from selling an unconfirmed show", () => {
    const event = {
      ...record,
      status: "on-sale" as const,
      startsAt: "2027-07-04T22:30:00-05:00",
      endsAt: "2027-07-05T04:00:00-05:00",
    };
    expect(isTicketOnSale(event, now)).toBe(false);
    expect(getPublishedEventState(event, now)).toMatchObject({
      listed: false,
      kind: "first-access",
    });
  });
  it("preserves postponed ticket-holder support even with details pending", () => {
    const event = withPublicEventIntegrity({
      ...record,
      status: "coming-soon",
      eventStatus: "EventPostponed",
      ticketHolderNotice: "Read the update",
      statusUrl: "/sunsets#event-update",
    });
    expect(getPublishedCatalogue([event], now).notices).toHaveLength(1);
    expect(getPublishedEventState(event, now)).toMatchObject({
      kind: "postponed",
      ticketHolders: true,
      statusUrl: "/sunsets#event-update",
    });
  });
  it("keeps confirmed historical records and their receipts unchanged", () => {
    const event = { ...record, confirmationStatus: "confirmed" as const };
    expect(withPublicEventIntegrity(event)).toBe(event);
    expect(getPublishedEventState(event, now).kind).toBe("past");
  });
  it("deduplicates only matching dates, rooms, and specific receipts", () => {
    const one = {
      ...record,
      confirmationStatus: "confirmed" as const,
      venue: "Alhambra Palace",
    };
    expect(
      uniqueHistoricalNights([one, { ...one, id: "alternate-dossier" }])
    ).toHaveLength(1);
    expect(
      uniqueHistoricalNights([
        one,
        { ...one, id: "another-room", venue: "Kashmir" },
      ])
    ).toHaveLength(2);
    expect(
      uniqueHistoricalNights([
        { ...one, archiveSlug: undefined, recapUrl: "/archive" },
        {
          ...one,
          id: "other-night",
          archiveSlug: undefined,
          recapUrl: "/archive",
        },
      ])
    ).toHaveLength(2);
  });
});
