import { describe, expect, it } from "vitest";
import type { ScheduledEvent } from "@shared/events/types";
import {
  compareScheduleEvents,
  getScheduleDate,
} from "../schedulePresentation";
import { buildEventCalendarFile } from "../calendar";
const event = (
  date: string,
  overrides: Partial<ScheduledEvent> = {}
): ScheduledEvent => ({
  id: date,
  title: date,
  series: "untold-story",
  episode: "II",
  date,
  time: "10 PM",
  venue: "TBA",
  location: "Chicago",
  status: "coming-soon",
  ...overrides,
});
describe("schedule announcements", () => {
  it("keeps month-only dates in chronological groups across years", () => {
    const dates = [
      "October 2026",
      "January 2027",
      "September 2026",
      "October 10, 2026",
      "September 26, 2026",
      "TBA",
    ];
    expect(
      dates
        .map(date => event(date))
        .sort(compareScheduleEvents)
        .map(item => item.date)
    ).toEqual([
      "September 26, 2026",
      "September 2026",
      "October 10, 2026",
      "October 2026",
      "January 2027",
      "TBA",
    ]);
    expect(getScheduleDate(event("September 2026")).label).toBe("Sep 2026");
  });
  it("does not present provisional dates as confirmed announcements", () => {
    expect(
      getScheduleDate(
        event("October 10, 2026", { confirmationStatus: "pending" })
      ).label
    ).toBe("Date TBA");
    expect(
      getScheduleDate(
        event("September 19, 2026", {
          confirmationStatus: "pending",
          eventStatus: "EventPostponed",
        })
      ).label
    ).toBe("Sep 19");
  });
  it("groups ISO dates with named dates without shifting their local day", () => {
    expect(getScheduleDate(event("2026-10-01")).key).toBe(
      getScheduleDate(event("October 1, 2026")).key
    );
    expect(getScheduleDate(event("2026-10-01")).label).toBe("Oct 1");
  });
  it.each([
    event("September 2026"),
    event("September 26, 2026", { confirmationStatus: "pending" }),
    event("September 19, 2026", { eventStatus: "EventPostponed" }),
    event("September 26, 2026", { eventStatus: "EventCancelled" }),
    event("February 30, 2026"),
  ])(
    "does not export an unconfirmed or invalid event: $date $eventStatus",
    item => {
      expect(buildEventCalendarFile(item)).toBeNull();
    }
  );
});
