import type { EventCta, FunnelTool, ScheduledEvent } from "@shared/events/types";

export type { EventCta, FunnelTool };

export const CTA_LABELS = {
  tickets: "Get Tickets",
  schedule: "View Schedule",
  collective: "View Artists",
  journal: "View Articles",
  radioHub: "Open Radio Show",
  listenNow: "Listen Now",
  archive: "View Event Archive",
  press: "View Press",
  pressKit: "Press Kit",
  network: "Meet The Network",
  sunSets: "Explore Sun(Sets)",
  untoldStory: "Enter Untold Story",
  innerCircle: "Get Updates",
  readFeature: "Read Feature",
  readEntry: "Read Entry",
  backToJournal: "Back to Articles",
  viewHome: "Back to Home",
  readFacts: "Fast Facts",
  contact: "Start Contact",
  viewPartners: "View Partners",
  openPressContext: "Open Press Context",
  getTicketsNow: "Get Tickets Now",
  moveTogether: "Explore The Movement",
  unlockPresale: "Unlock Presale Access",
  joinWaitlist: "Join Waitlist",
  claimLast: "Claim Last Tickets",
  nextSignal: "Get First Access To Next Signal",
  requestVip: "Request VIP Access",
} as const;

function getSeriesDetailsHref(series: ScheduledEvent["series"]) {
  switch (series) {
    case "chasing-sunsets":
      return "/chasing-sunsets";
    case "untold-story":
      return "/story";
    default:
      return "/tickets";
  }
}

export function getEventDetailsHref(event?: ScheduledEvent | null) {
  if (!event) return "/schedule";
  // Direct to God-Tier single event dossier
  return `/events/${event.slug || event.id}`;
}

export function isEventLowInventory(event?: ScheduledEvent | null) {
  if (!event) return false;
  if (event.inventoryState === "low") return true;

  const capacity = event.capacity?.toLowerCase();
  if (!capacity) return false;

  return /(low|last|final|sold out 9\d%|9\d%\s+sold)/.test(capacity);
}

/**
 * Returns the server-resolved primary CTA configuration for an event.
 */
export function getEventCta(event?: ScheduledEvent | null): EventCta {
  const fallback: EventCta = {
    label: CTA_LABELS.schedule,
    href: "/schedule",
    tool: "posh",
    isExternal: false,
  };

  return event?.primaryCta ?? fallback;
}
