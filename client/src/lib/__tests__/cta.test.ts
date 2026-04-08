import { describe, expect, it } from "vitest";
import type { ScheduledEvent } from "@/data/events";
import {
  getEventCta,
  getEventDetailsHref,
  isEventLowInventory,
} from "@/lib/cta";

const monolithLiveEvent: ScheduledEvent = {
  id: "mp-autograf-mar21",
  series: "monolith-project",
  episode: "SPECIAL EVENT",
  title: "AUTOGRAF",
  date: "March 21, 2026",
  time: "9:00 PM — Late",
  venue: "Alhambra Palace",
  location: "Chicago, IL",
  status: "on-sale",
  ticketUrl: "/go/tickets/mp-autograf-mar21",
};

const untoldUpcomingEvent: ScheduledEvent = {
  id: "us-s3e3",
  series: "untold-story",
  episode: "SEASON III · EPISODE III",
  title: "ERAN HERSH",
  date: "May 16, 2026",
  time: "9:00 PM — Late",
  venue: "Venue Reveal Soon",
  location: "Chicago, IL",
  status: "coming-soon",
  primaryCta: {
    label: "Unlock Presale Access",
    href: "/story#untold-funnel",
    tool: "laylo",
    isExternal: false,
  },
};

describe("cta", () => {
  it("routes monolith-project live event details to the tickets page", () => {
    expect(getEventDetailsHref(monolithLiveEvent)).toBe("/events/mp-autograf-mar21");
  });

  it("routes upcoming untold-story events to the onsite untold waitlist funnel", () => {
    expect(getEventCta(untoldUpcomingEvent)).toMatchObject({
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
      primaryCta: {
        label: "Join Waitlist",
        href: "/chasing-sunsets#chasing-funnel",
        tool: "laylo",
        isExternal: false,
      },
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
      primaryCta: {
        label: "Claim Last Tickets",
        href: "https://posh.vip/e/example",
        tool: "posh",
        isExternal: true,
      },
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
