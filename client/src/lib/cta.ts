import type {
  EventCta,
  FunnelTool,
  ScheduledEvent,
} from "@shared/events/types";
import type { InquiryType } from "@/contexts/InquiryContext";

export type { EventCta, FunnelTool };

export const CTA_LABELS = {
  tickets: "Get Tickets",
  schedule: "See The Schedule",
  collective: "Meet The Artists",
  journal: "Read The Journal",
  radioHub: "Open The Radio Show",
  listenNow: "Hear The Rooms",
  archive: "See The Archive",
  press: "Press Room",
  pressKit: "Press Kit",
  network: "Meet The Network",
  sunSets: "Explore Chasing Sun(Sets)",
  untoldStory: "Explore Untold Story",
  innerCircle: "Newsletter",
  readFeature: "Read Feature",
  readEntry: "Read Entry",
  backToJournal: "Back to Journal",
  viewHome: "Back to Home",
  readFacts: "Fast Facts",
  contact: "Start Contact",
  viewPartners: "Our Partners",
  openPressContext: "Open Press Context",
  getTicketsNow: "On Sale",
  moveTogether: "Our Network",
  unlockPresale: "Unlock Presale",
  joinWaitlist: "Join The Waitlist",
  reserve: "Get In",
  claimLast: "Final Release",
  nextSignal: "Get Alerts First",
  requestVip: "VIP Access",
  reserveEntry: "VIP Access",
  secureTier1: "First Release",
  viewSeasonArc: "See All Dates",
  secureMembership: "Get Alerts First",
  registerDrop: "Get Alerts First",
  hearTheRooms: "Hear The Rooms",
  inquirySponsor: "Partner With Us",
  inquiryVenue: "Host At Your Space",
  inquiryArtist: "Submit Your Sound",
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

export function isInquiryHref(href: string) {
  return href.startsWith("inquiry://");
}

export function parseInquiryType(href: string) {
  const value = href.replace("inquiry://", "");
  return isInquiryType(value) ? value : "general";
}

function isInquiryType(value: string): value is InquiryType {
  return ["sponsor", "venue", "artist", "press", "general", "booking"].includes(
    value
  );
}
