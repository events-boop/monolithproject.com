import { describe, expect, it } from "vitest";
import type { ScheduledEvent } from "@shared/events/types";
import {
  buildScheduledEventSchema,
  buildScheduleSchema,
  buildSitewideIdentitySchema,
} from "../schema";

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
      {
        "@type": "MusicGroup",
        "@id": "https://monolithproject.com/artists/erikthedj#artist",
        name: "ERIK THE DJ",
        url: "https://monolithproject.com/artists/erikthedj",
      },
    ]);
    expect(schema.location).toMatchObject({
      "@type": "Place",
      name: "Kashmir",
      address: {
        "@type": "PostalAddress",
        streetAddress: "1436 W Randolph St",
        postalCode: "60607",
      },
    });
  });

  it("links paired headliners to canonical artist entities while keeping uncataloged artists plain", () => {
    const event: ScheduledEvent = {
      id: "paired-test",
      series: "chasing-sunsets",
      episode: "TEST",
      title: "SUN(SETS) TEST",
      date: "September 19, 2026",
      time: "Golden Hour",
      venue: "Castaways",
      location: "Chicago, IL",
      lineup: "Joezi x Massuma (UK) · Resident Guest",
      status: "coming-soon",
    };

    const schema = buildScheduledEventSchema(event, "/events/paired-test");

    expect(schema.performer).toEqual([
      {
        "@type": "MusicGroup",
        "@id": "https://monolithproject.com/artists/joezi#artist",
        name: "Joezi",
        url: "https://monolithproject.com/artists/joezi",
      },
      {
        "@type": "MusicGroup",
        "@id": "https://monolithproject.com/artists/massuma#artist",
        name: "Massuma (UK)",
        url: "https://monolithproject.com/artists/massuma",
      },
      {
        "@type": "MusicGroup",
        name: "Resident Guest",
      },
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

it("never exposes checkout offers for a postponed record carrying a stale on-sale state", () => {
  const event = {
    ...pending,
    confirmationStatus: "confirmed" as const,
    status: "on-sale" as const,
    eventStatus: "EventPostponed" as const,
    ticketUrl: "https://example.com/old-checkout",
  };
  expect(
    buildScheduledEventSchema(event, "/events/postponed")
  ).not.toHaveProperty("offers");
});

it("connects both event series to the Monolith parent organization", () => {
  const graph = buildSitewideIdentitySchema()["@graph"];
  const parent = graph.find(node => node["@id"].endsWith("/#organization"));
  expect(parent?.["@type"]).toBe("Organization");
  expect(parent).toHaveProperty("brand", [
    { "@id": "https://monolithproject.com/#brand-chasing-sunsets" },
    { "@id": "https://monolithproject.com/#brand-untold-story" },
  ]);
});

it("keeps the July 4 parent event historical without stale ticket offers or a September guide URL", () => {
  const event: ScheduledEvent = {
    ...pending,
    id: "us-jul04",
    confirmationStatus: "confirmed",
    date: "July 4, 2026",
    status: "past",
  };
  const schema = buildScheduledEventSchema(event, "/events/us-jul04");
  expect(JSON.stringify(schema)).not.toContain('"offers"');
  expect(schema).toHaveProperty(
    "superEvent.url",
    "https://monolithproject.com/events/chasing-sunsets-july-4-2026"
  );
});
