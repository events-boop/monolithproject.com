import { describe, expect, it } from "vitest";
import type { ScheduledEvent } from "@shared/events/types";
import { buildScheduledEventSchema } from "../schema";

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
