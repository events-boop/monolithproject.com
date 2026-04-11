import type { EventCta, EventSeries, ScheduledEvent } from "../../shared/events/types";

const CTA_LABELS = {
  tickets: "Secure Access",
  schedule: "View Schedule",
  unlockPresale: "Request Presale Access",
  joinWaitlist: "Register For The Next Drop",
  claimLast: "Secure Final Entry",
  nextSignal: "Get First Access To Next Signal",
} as const;

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

function getSeriesFunnelHref(series: EventSeries) {
  switch (series) {
    case "chasing-sunsets":
      return "/chasing-sunsets#chasing-funnel";
    case "untold-story":
      return "/story#untold-funnel";
    default:
      return "/tickets#tickets-funnel";
  }
}

function isValidDate(value?: string) {
  if (!value) return false;
  return !Number.isNaN(new Date(value).getTime());
}

function parseEventDate(value?: string) {
  if (!value || !isValidDate(value)) return null;
  return new Date(value);
}

function getEventWindow(event?: ScheduledEvent | null) {
  const explicitStart = parseEventDate(event?.startsAt);
  const fallbackStart = parseEventDate(event?.date);
  const start = explicitStart ?? fallbackStart;
  const explicitEnd = parseEventDate(event?.endsAt);

  let end = explicitEnd;
  if (!end && start) {
    end = new Date(start);
    if (explicitStart) {
      end.setHours(end.getHours() + 6);
    } else {
      end.setHours(23, 59, 59, 999);
    }
  }

  return { start, end };
}

function getEventWindowStatus(event?: ScheduledEvent | null, now: Date = new Date()) {
  const { start, end } = getEventWindow(event);

  if (!start) return "unscheduled";
  if (end && now > end) return "past";
  if (now >= start) return "live";
  return "upcoming";
}

function isTicketOnSale(event?: ScheduledEvent | null, now: Date = new Date()) {
  if (!event?.ticketUrl) return false;
  if (event.status !== "on-sale") return false;

  const windowStatus = getEventWindowStatus(event, now);
  return windowStatus !== "past";
}

function isEventLowInventory(event?: ScheduledEvent | null) {
  if (!event) return false;
  if (event.inventoryState === "low") return true;

  const capacity = event.capacity?.toLowerCase();
  if (!capacity) return false;

  return /(low|last|final|sold out 9\d%|9\d%\s+sold)/.test(capacity);
}

export function resolveEventPrimaryCta(event?: ScheduledEvent | null, now: Date = new Date()): EventCta {
  const fallback: EventCta = {
    label: CTA_LABELS.schedule,
    href: "/schedule",
    tool: "posh",
    isExternal: false,
  };

  if (!event) return fallback;

  const windowStatus = getEventWindowStatus(event, now);
  const onSale = isTicketOnSale(event, now);

  if (windowStatus === "past") {
    return {
      label: CTA_LABELS.nextSignal,
      href: getSeriesFunnelHref(event.series),
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
      label: CTA_LABELS.claimLast,
      href,
      tool: "posh",
      isExternal: isExternalHref(href),
    };
  }

  if (onSale) {
    const href = event.ticketUrl || "/schedule";
    return {
      label: CTA_LABELS.tickets,
      href,
      tool: "posh",
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
