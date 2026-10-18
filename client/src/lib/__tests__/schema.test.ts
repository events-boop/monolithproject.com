import { describe, expect, it } from "vitest";
import type { ScheduledEvent } from "@shared/events/types";
import { buildScheduledEventSchema, buildScheduleSchema } from "../schema";

describe("buildScheduledEventSchema", () => {
  it("does not publish placeholder guests as performers", () => {
    const event: ScheduledEvent = {
      id: "hof-kashmir-jul31",
      series: "monolith-project",
      episode: "HOUSE OF FRIENDS POP-UP / RESIDENCY 02",
      title: "HOUSE OF FRIENDS POP-UP",
      date: "July 31, 2026",
      time: "Time TBA",
      venue: "Kashmir",
      location: "Chicago, IL",
      lineup: "ERIK THE DJ · SPECIAL GUEST",
      status: "coming-soon",
    };

    const schema = buildScheduledEventSchema(event, "/events/hof-test");

    expect(schema.performer).toEqual([
      { "@type": "MusicGroup", name: "ERIK THE DJ" },
    ]);
  });
});

const pending: ScheduledEvent = {
  id: "pending",
  series: "monolith-project",
  episode: "LAUNCH",
  title: "Next chapter",
  date: "October 10, 2026",
  time: "TBA",
  venue: "TBA",
  location: "Chicago",
  status: "coming-soon",
  confirmationStatus: "pending",
};
it("keeps provisional dates out of public event structured data", () => {
  expect(buildScheduledEventSchema(pending, "/events/pending")).toEqual({});
  expect(buildScheduleSchema([pending])["@graph"]).toEqual([]);
});
it("preserves the original date and postponement status in structured data", () => {
  const postponed = { ...pending, eventStatus: "EventPostponed" as const };
  const schema = buildScheduledEventSchema(postponed, "/events/pending");
  expect(schema.eventStatus).toBe("https://schema.org/EventPostponed");
  expect(schema.startDate).toBe("2026-10-10");
});
