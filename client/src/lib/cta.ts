import { ScheduledEvent } from "@/data/events";
import { getEventWindowStatus, isTicketOnSale } from "./siteExperience";

export const CTA_LABELS = {
  tickets: "Get Tickets",
  schedule: "View Schedule",
  collective: "Enter The Collective",
  journal: "Open Insights",
  radioHub: "Open Radio Show",
  listenNow: "Listen Now",
  archive: "Browse Archive",
  press: "View Press",
  pressKit: "Press Kit",
  network: "Meet The Network",
  sunSets: "Explore Sun(Sets)",
  untoldStory: "Enter Untold Story",
  innerCircle: "Request Access",
  readFeature: "Read Feature",
  readEntry: "Read Entry",
  backToJournal: "Back to Insights",
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

export const FUNNEL_TOOLS = {
  laylo: "laylo",
  posh: "posh",
  fillout: "fillout",
} as const;

export type FunnelTool = keyof typeof FUNNEL_TOOLS;

export interface EventCta {
  label: string;
  href: string;
  tool: FunnelTool;
  isExternal: boolean;
}

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

function getSeriesFunnelHref(series: ScheduledEvent["series"]) {
  switch (series) {
    case "chasing-sunsets":
      return "/chasing-sunsets#chasing-funnel";
    case "untold-story":
      return "/story#untold-funnel";
    default:
      return "/tickets#tickets-funnel";
  }
}

export function getEventDetailsHref(event?: ScheduledEvent | null) {
  if (!event) return "/schedule";
  return getSeriesDetailsHref(event.series);
}

export function isEventLowInventory(event?: ScheduledEvent | null) {
  if (!event) return false;
  if (event.inventoryState === "low") return true;

  const capacity = event.capacity?.toLowerCase();
  if (!capacity) return false;

  return /(low|last|final|sold out 9\d%|9\d%\s+sold)/.test(capacity);
}

/**
 * Returns the primary CTA configuration for an event based on its lifecycle state.
 */
export function getEventCta(event?: ScheduledEvent | null, now: Date = new Date()): EventCta {
  // Default fallback
  const fallback: EventCta = {
    label: CTA_LABELS.schedule,
    href: "/schedule",
    tool: "posh",
    isExternal: false
  };

  if (!event) return fallback;

  const windowStatus = getEventWindowStatus(event, now);
  const onSale = isTicketOnSale(event, now);

  // 1. POST-EVENT
  if (windowStatus === "past") {
    return {
      label: CTA_LABELS.nextSignal,
      href: getSeriesFunnelHref(event.series),
      tool: "laylo",
      isExternal: false
    };
  }

  // 2. SOLD OUT
  if (event.status === "sold-out") {
    return {
      label: CTA_LABELS.joinWaitlist,
      href: getSeriesFunnelHref(event.series),
      tool: "laylo",
      isExternal: false
    };
  }

  // 3. LOW INVENTORY
  if (onSale && isEventLowInventory(event)) {
    return {
      label: CTA_LABELS.claimLast,
      href: event.ticketUrl || "/schedule",
      tool: "posh",
      isExternal: true
    };
  }

  // 4. ON SALE (Live)
  if (onSale) {
    return {
      label: CTA_LABELS.tickets,
      href: event.ticketUrl || "/schedule",
      tool: "posh",
      isExternal: true
    };
  }

  // 5. UPCOMING (Presale/Hype)
  return {
    label: CTA_LABELS.unlockPresale,
    href: getSeriesFunnelHref(event.series),
    tool: "laylo",
    isExternal: false
  };
}
