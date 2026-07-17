import { describe, expect, it } from "vitest";
import type { ScheduledEvent } from "@shared/events/types";
import { buildEventCalendarFile, escapeIcsText } from "../calendar";

const dateOnlyEvent: ScheduledEvent = {
  id: "hof-kashmir-jul31",
  series: "monolith-project",
  episode: "HOUSE OF FRIENDS POP-UP / RESIDENCY 02",
  title: "HOUSE OF FRIENDS POP-UP",
  headline: "HOUSE OF FRIENDS POP-UP — ERIK THE DJ + SPECIAL GUEST",
  slug: "house-of-friends-kashmir-july-31-2026",
  date: "July 31, 2026",
  time: "Time TBA",
  venue: "Kashmir",
  location: "Chicago, IL",
  lineup: "ERIK THE DJ · SPECIAL GUEST",
  status: "coming-soon",
  description: "A give-back party at Kashmir.",
};

describe("buildEventCalendarFile", () => {
  it("exports time-TBA listings as date-only events", () => {
    const calendar = buildEventCalendarFile(
      dateOnlyEvent,
      new Date("2026-07-16T18:00:00.000Z")
    );

    expect(calendar).toContain("DTSTART;VALUE=DATE:20260731");
    expect(calendar).toContain("DTEND;VALUE=DATE:20260801");
    expect(calendar).not.toContain("DTSTART;TZID");
    expect(calendar).toContain(
      "SUMMARY:HOUSE OF FRIENDS POP-UP — ERIK THE DJ + SPECIAL GUEST"
    );
    expect(calendar).toContain("Lineup: ERIK THE DJ · SPECIAL GUEST");
    expect(calendar).toContain("Time: Time TBA");
  });

  it("preserves confirmed Chicago times when startsAt is present", () => {
    const calendar = buildEventCalendarFile(
      {
        ...dateOnlyEvent,
        startsAt: "2026-07-31T21:30:00-05:00",
        endsAt: "2026-08-01T02:00:00-05:00",
        time: "9:30 PM — 2:00 AM",
      },
      new Date("2026-07-16T18:00:00.000Z")
    );

    expect(calendar).toContain("DTSTART;TZID=America/Chicago:20260731T213000");
    expect(calendar).toContain("DTEND;TZID=America/Chicago:20260801T020000");
    expect(calendar).not.toContain("Time: Time TBA");
  });
});

describe("escapeIcsText", () => {
  it("escapes calendar delimiters and line breaks", () => {
    expect(escapeIcsText("A, B; C\nD\\E")).toBe("A\\, B\\; C\\nD\\\\E");
  });
});
