import { describe, expect, it } from "vitest";
import type { ScheduledEvent } from "@shared/events/types";
import {
  getDefaultVipPackage,
  getTicketAvailabilityLabel,
  getVipEventAvailability,
  getVipSelection,
  isVipPackageSoldOut,
} from "@/lib/vipExperience";

function buildEvent(overrides: Partial<ScheduledEvent> = {}): ScheduledEvent {
  return {
    id: "vip-test",
    series: "chasing-sunsets",
    episode: "TEST NIGHT",
    title: "VIP Test",
    date: "August 22, 2026",
    time: "Golden Hour",
    venue: "Castaways",
    location: "Chicago, IL",
    status: "on-sale",
    venueMap: {
      id: "castaways-sunsets-ii-2026",
      venueId: "castaways-chicago",
      address: "1603 N Lake Shore Dr, Chicago, IL 60611",
      illustrative: true,
    },
    vipPackages: [
      {
        size: "small",
        name: "Small",
        guestRange: "2–6 guests",
        description: "Small group",
        features: ["Priority entry"],
        availability: "available",
      },
      {
        size: "medium",
        name: "Medium",
        guestRange: "7–10 guests",
        description: "Medium group",
        features: ["Reserved space"],
        availability: "available",
        highlight: true,
      },
      {
        size: "large",
        name: "Large",
        guestRange: "11–15 guests",
        description: "Large group",
        features: ["Dedicated service"],
        availability: "limited",
      },
    ],
    ...overrides,
  };
}

describe("VIP experience helpers", () => {
  it("derives the event badge from package inventory", () => {
    const event = buildEvent();
    expect(getVipEventAvailability(event)).toBe("limited");

    const soldOutEvent = buildEvent({
      vipPackages: event.vipPackages?.map(item => ({
        ...item,
        availability: "sold-out" as const,
      })),
    });
    expect(getVipEventAvailability(soldOutEvent)).toBe("sold-out");
  });

  it("treats event-level sellout as authoritative", () => {
    const event = buildEvent({ status: "sold-out" });
    expect(isVipPackageSoldOut(event, event.vipPackages![0])).toBe(true);
    expect(getDefaultVipPackage(event)).toBeUndefined();
    expect(getTicketAvailabilityLabel(event.status)).toBe("Tickets sold out");
  });

  it("defaults to the highlighted package that remains bookable", () => {
    expect(getDefaultVipPackage(buildEvent())?.size).toBe("medium");
  });

  it("resolves the event map and placement zone independently of inventory", () => {
    const selection = getVipSelection(buildEvent(), "large");

    expect(selection.vipPackage?.availability).toBe("limited");
    expect(selection.map).toMatchObject({
      id: "castaways-sunsets-ii-2026",
      sceneId: "castaways-beach-club",
      version: 1,
    });
    expect(selection.zone).toMatchObject({
      id: "captains-cabana",
      packageSize: "large",
      premium: true,
    });
  });
});
