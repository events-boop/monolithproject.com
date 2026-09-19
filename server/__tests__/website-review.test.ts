import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getEventWindow,
  getEventWindowStatus,
  isTicketOnSale,
  isUpcomingEvent,
} from "../../shared/events/lifecycle";
import { resolveEventPrimaryCta } from "../../shared/events/public-cta";
import {
  sunsetsTicketsEnabled,
  withApprovedSunsets,
} from "../../shared/events/sunsets-current";
import { buildEventCalendarFile } from "../../client/src/lib/calendar";
import { buildScheduledEventSchema } from "../../client/src/lib/schema";
import type { ScheduledEvent } from "../../shared/events/types";

// Lifecycle fixtures remain scheduled; publication-specific tests cover the approved postponement.
vi.mock("../../shared/events/sunsets-page.json", async importOriginal => {
  const actual = await importOriginal<{ default: Record<string, unknown> }>();
  return { default: { ...actual.default, status: "EventScheduled", salesEnabled: true, statusApproval: null } };
});

const base: ScheduledEvent = {
  id: "css-sep19",
  series: "chasing-sunsets",
  episode: "III",
  title: "Sun(Sets)",
  date: "September 19, 2026",
  time: "TBA",
  venue: "TBA",
  location: "Chicago",
  status: "on-sale",
  ticketUrl: "https://posh.vip/e/existing",
};
const now = new Date("2026-09-18T12:00:00-05:00");
afterEach(() => vi.useRealTimers());
describe("website review event regressions", () => {
  it("excludes expired July and August listings even if an old payload says on-sale", () => {
    for (const date of ["July 4, 2026", "August 22, 2026"]) {
      const event = { ...base, id: "older", date };
      expect(getEventWindowStatus(event, now)).toBe("past");
      expect(isTicketOnSale(event, now)).toBe(false);
      expect(isUpcomingEvent(event, now)).toBe(false);
      expect(resolveEventPrimaryCta(event, now)).toMatchObject({
        label: "View archive",
        href: "/archive",
      });
    }
  });
  it("ends September sales at 10 PM Chicago, regardless of viewer timezone", () => {
    const event = withApprovedSunsets(base, now.getTime());
    expect(isTicketOnSale(event, new Date("2026-09-20T02:59:59Z"))).toBe(true);
    expect(isUpcomingEvent(event, new Date("2026-09-20T03:00:00Z"))).toBe(
      false
    );
    expect(sunsetsTicketsEnabled(Date.parse("2026-09-20T03:00:00Z"))).toBe(
      false
    );
    expect(
      resolveEventPrimaryCta(event, new Date("2026-09-20T03:00:00Z")).label
    ).toBe("View archive");
  });
  it("cancellation and postponement override otherwise-live sales", () => {
    for (const eventStatus of ["EventCancelled", "EventPostponed"] as const) {
      const event = {
        ...withApprovedSunsets(base, now.getTime()),
        eventStatus,
      };
      expect(isTicketOnSale(event, now)).toBe(false);
      expect(isUpcomingEvent(event, now)).toBe(false);
      expect(resolveEventPrimaryCta(event, now).href).toBe(
        "/sunsets#event-status"
      );
    }
  });
  it("uses the approved primary checkout and positive duration with individual headliners", () => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
    const event = withApprovedSunsets(base, now.getTime());
    expect(resolveEventPrimaryCta(event, now)).toMatchObject({
      tool: "allevents",
      label: "Get Tickets",
      href: event.ticketUrl,
    });
    const schema = buildScheduledEventSchema(event, "/events/css-sep19") as any;
    expect(Date.parse(schema.endDate) - Date.parse(schema.startDate)).toBe(
      10 * 3600000
    );
    expect(schema.performer.map((p: any) => p.name)).toEqual(
      expect.arrayContaining(["JOEZI", "MASSUMA"])
    );
    const calendar = buildEventCalendarFile(event, now);
    expect(calendar).toContain("DTSTART;TZID=America/Chicago:20260919T120000");
    expect(calendar).toContain("DTEND;TZID=America/Chicago:20260919T220000");
  });
  it("does not invent hours or a zero-duration end for unconfirmed records", () => {
    const schema = buildScheduledEventSchema(
      { ...base, id: "tentative", status: "coming-soon", lineup: "TBA" },
      "/schedule"
    ) as any;
    expect(schema.startDate).toBe("2026-09-19");
    expect(schema.endDate).toBeUndefined();
    expect(schema.performer).toBeUndefined();
  });
  it("uses Chicago midnight across daylight-saving transitions", () => {
    const spring = getEventWindow({ ...base, date: "March 8, 2026" });
    expect(spring.start?.toISOString()).toBe("2026-03-08T06:00:00.000Z");
    expect(spring.end?.toISOString()).toBe("2026-03-09T05:00:00.000Z");
    const fall = getEventWindow({ ...base, date: "November 1, 2026" });
    expect(fall.start?.toISOString()).toBe("2026-11-01T05:00:00.000Z");
    expect(fall.end?.toISOString()).toBe("2026-11-02T06:00:00.000Z");
  });
  it("honors explicit archive state even if a placeholder date is in the future", () => {
    expect(isUpcomingEvent({ ...base, status: "past" }, now)).toBe(false);
  });
});
