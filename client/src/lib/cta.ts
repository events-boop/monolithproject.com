import type { EventCta, FunnelTool, ScheduledEvent } from "@shared/events/types";

export type { EventCta, FunnelTool };

export const CTA_LABELS = {
  tickets: "Secure Access",
  schedule: "Explore The Season",
  collective: "View Artists",
  journal: "View Articles",
  radioHub: "Access The Archive",
  listenNow: "Hear The Rooms",
  archive: "Find Your Memory",
  press: "View Press",
  pressKit: "Press Kit",
  network: "Meet The Network",
  sunSets: "Explore Chasing Sun(Sets)",
  untoldStory: "Explore Untold Story",
  innerCircle: "Join The Inner Circle",
  readFeature: "Read Feature",
  readEntry: "Read Entry",
  backToJournal: "Back to Articles",
  viewHome: "Back to Home",
  readFacts: "Fast Facts",
  contact: "Start Contact",
  viewPartners: "View Partners",
  openPressContext: "Open Press Context",
  getTicketsNow: "Secure Access Now",
  moveTogether: "Explore The Ecosystem",
  unlockPresale: "Request Presale Access",
  joinWaitlist: "Register For The Next Drop",
  reserve: "Secure Access",
  claimLast: "Secure Final Entry",
  nextSignal: "Get First Access To Next Signal",
  requestVip: "Secure Stage Proximity",
  reserveEntry: "Reserve Entry",
  secureTier1: "Secure Tier 1 Access",
  viewSeasonArc: "View Full Season Arc",
  secureMembership: "Secure Season Membership",
  registerDrop: "Register For Drop",
  hearTheRooms: "Hear The Rooms",
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
