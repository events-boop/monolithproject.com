import { describe, expect, it } from "vitest";
import { upcomingEvents, type ScheduledEvent } from "@/data/events";
import {
  getEventCta,
  getEventDetailsHref,
  isEventLowInventory,
} from "@/lib/cta";

describe("cta", () => {
  it("routes monolith-project live event details to the tickets page", () => {
    const event = upcomingEvents.find((entry) => entry.id === "mp-autograf-mar21");

    expect(getEventDetailsHref(event)).toBe("/tickets");
  });

  it("routes upcoming untold-story events to the onsite untold waitlist funnel", () => {
    const event = upcomingEvents.find((entry) => entry.id === "us-s3e3");

    expect(getEventCta(event)).toMatchObject({
      label: "Unlock Presale Access",
      href: "/story#untold-funnel",
      isExternal: false,
      tool: "laylo",
    });
  });

  it("routes sold-out events to the relevant series funnel instead of the generic Laylo landing page", () => {
    const event: ScheduledEvent = {
      id: "css-sold-out",
      series: "chasing-sunsets",
      episode: "SUMMER",
      title: "Chasing Sun(Sets)",
      date: "July 20, 2026",
      time: "Golden Hour",
      venue: "Chicago",
      location: "Chicago, IL",
      status: "sold-out",
    };

    expect(getEventCta(event)).toMatchObject({
      label: "Join Waitlist",
      href: "/chasing-sunsets#chasing-funnel",
      isExternal: false,
      tool: "laylo",
    });
  });

  it("treats explicit inventory state as the source of truth for low-inventory CTAs", () => {
    const event: ScheduledEvent = {
      id: "mp-low",
      series: "monolith-project",
      episode: "SPECIAL EVENT",
      title: "Monolith Low Inventory",
      date: "July 20, 2026",
      time: "10:00 PM",
      venue: "Chicago",
      location: "Chicago, IL",
      status: "on-sale",
      inventoryState: "low",
      ticketUrl: "https://posh.vip/e/example",
    };

    expect(isEventLowInventory(event)).toBe(true);
    expect(getEventCta(event)).toMatchObject({
      label: "Claim Last Tickets",
      href: "https://posh.vip/e/example",
      isExternal: true,
      tool: "posh",
    });
  });
});
