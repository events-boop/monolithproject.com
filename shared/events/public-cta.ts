import { getEventWindowStatus, isTicketOnSale } from "./lifecycle";
import {
  SUNSETS_JULY4_TICKET_PATH,
  SUNSETS_TICKET_CTA_LABEL,
} from "./sunsets-ticketing";
import type { EventCta, EventSeries, ScheduledEvent } from "./types";

const CTA_LABELS = {
  tickets: "Get Tickets",
  schedule: "See The Schedule",
  unlockPresale: "Get First Access",
  joinWaitlist: "Join The Waitlist",
  claimLast: "Final Release",
  nextSignal: "Get Alerts First",
} as const;

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href) || href.startsWith("/go/");
}

function getSeriesFunnelHref(series: EventSeries) {
  switch (series) {
    case "chasing-sunsets":
      return "/sunsets#updates";
    case "untold-story":
      return "/story#untold-funnel";
    default:
      return "/tickets#tickets-funnel";
  }
}

function isEventLowInventory(event?: ScheduledEvent | null) {
  if (!event) return false;
  if (event.inventoryState === "low") return true;

  const capacity = event.capacity?.toLowerCase();
  if (!capacity) return false;

  return /(low|last|final|sold out 9\d%|9\d%\s+sold)/.test(capacity);
}

export function resolveEventPrimaryCta(
  event?: ScheduledEvent | null,
  now: Date = new Date()
): EventCta {
  const fallback: EventCta = {
    label: CTA_LABELS.schedule,
    href: "/schedule",
    tool: "posh",
    isExternal: false,
  };

  if (!event) return fallback;

  const windowStatus = getEventWindowStatus(event, now);
  const onSale = isTicketOnSale(event, now);

  if (["EventCancelled", "EventPostponed"].includes(event.eventStatus || "")) {
    return {
      label: "Event update",
      href:
        event.id === "css-sep19"
          ? "/sunsets#event-status"
          : `/events/${event.slug || event.id}`,
      tool: "posh",
      isExternal: false,
    };
  }

  if (windowStatus === "past") {
    return {
      label: "View archive",
      href:
        event.recapUrl ||
        (event.archiveSlug ? `/archive/${event.archiveSlug}` : "/archive"),
      tool: "laylo",
      isExternal: false,
    };
  }

  if (event.status === "sold-out") {
    return {
      label: CTA_LABELS.joinWaitlist,
      href: getSeriesFunnelHref(event.series),
      tool: "laylo",
      isExternal: false,
    };
  }

  if (onSale && isEventLowInventory(event)) {
    const href = event.ticketUrl || "/schedule";
    return {
      label:
        event.id === "css-jul04"
          ? SUNSETS_TICKET_CTA_LABEL
          : CTA_LABELS.claimLast,
      href,
      tool: href.startsWith("https://allevents.in/") ? "allevents" : "posh",
      isExternal: isExternalHref(href),
    };
  }

  if (onSale) {
    const href = event.ticketUrl || "/schedule";
    return {
      label:
        href === SUNSETS_JULY4_TICKET_PATH || event.id === "css-jul04"
          ? SUNSETS_TICKET_CTA_LABEL
          : CTA_LABELS.tickets,
      href,
      tool: href.startsWith("https://allevents.in/") ? "allevents" : "posh",
      isExternal: isExternalHref(href),
    };
  }

  return {
    label: CTA_LABELS.unlockPresale,
    href: getSeriesFunnelHref(event.series),
    tool: "laylo",
    isExternal: false,
  };
}
