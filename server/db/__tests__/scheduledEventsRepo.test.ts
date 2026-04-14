import { describe, expect, it } from "vitest";
import { upcomingEvents } from "../../data/public-site-data";
import { mergeScheduledEvents } from "../scheduledEventsRepo";
import type { ScheduledEvent } from "../../../shared/events/types";

describe("mergeScheduledEvents", () => {
  it("overlays database-backed event fields without dropping static-only metadata", () => {
    const merged = mergeScheduledEvents(upcomingEvents, [
      {
        id: "us-s3e3",
        series: "untold-story",
        episode: "SEASON III · EPISODE III",
        title: "ERAN HERSH",
        date: "May 17, 2026",
        time: "10:00 PM — Late",
        venue: "Neon Venue",
        location: "Chicago, IL",
        status: "on-sale",
        description: "Updated from Neon",
        ticketUrl: "/go/tickets/us-s3e3-neon",
      },
    ]);

    const event = merged.find((item) => item.id === "us-s3e3");

    expect(event?.date).toBe("May 17, 2026");
    expect(event?.venue).toBe("Neon Venue");
    expect(event?.ticketUrl).toBe("/go/tickets/us-s3e3-neon");
    expect(event?.ticketTiers?.length).toBeGreaterThan(0);
    expect(event?.activeFunnels).toContain("waitlist-untold");
    expect(event?.startsAt).toBe("2026-05-16T21:00:00-05:00");
  });

  it("appends database events that do not exist in the static catalog", () => {
    const dbOnlyEvent: ScheduledEvent = {
      id: "mp-dec31",
      series: "monolith-project",
      episode: "NEW YEAR",
      title: "MONOLITH NEW YEAR",
      date: "December 31, 2026",
      time: "10:00 PM — Late",
      venue: "Secret Warehouse",
      location: "Chicago, IL",
      status: "coming-soon",
    };

    const merged = mergeScheduledEvents(upcomingEvents, [dbOnlyEvent]);

    expect(merged.find((item) => item.id === "mp-dec31")).toMatchObject({
      id: "mp-dec31",
      title: "MONOLITH NEW YEAR",
      series: "monolith-project",
    });
  });
});
