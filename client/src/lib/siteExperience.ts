import type { ScheduledEvent, SiteExperienceSlot } from "@shared/events/types";
import { getFeaturedEventForSlot, getPublicEvents } from "./siteData";
import {
  MONOLITH_ORANGE,
  MONOLITH_ORANGE_ON_LIGHT,
  SERIES_COLORS,
  SERIES_COLORS_ON_LIGHT,
} from "./brand";

export type EventWindowStatus = "upcoming" | "live" | "past" | "unscheduled";

function isValidDate(value?: string) {
  if (!value) return false;
  return !Number.isNaN(new Date(value).getTime());
}

function parseEventDate(value?: string) {
  if (!isValidDate(value)) return null;
  return new Date(value!);
}

function compareEvents(a: ScheduledEvent, b: ScheduledEvent) {
  const aStart = getEventStartTimestamp(a) ?? Number.POSITIVE_INFINITY;
  const bStart = getEventStartTimestamp(b) ?? Number.POSITIVE_INFINITY;

  if (aStart !== bStart) return aStart - bStart;
  return a.title.localeCompare(b.title);
}

export function getEventById(eventId?: string | null) {
  if (!eventId) return undefined;
  return getPublicEvents().find((event) => event.id === eventId);
}

export function getEventWindow(event?: ScheduledEvent | null) {
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

export function getEventStartTimestamp(event?: ScheduledEvent | null) {
  const { start } = getEventWindow(event);
  return start ? start.getTime() : null;
}

export function getEventWindowStatus(
  event?: ScheduledEvent | null,
  now: Date = new Date(),
): EventWindowStatus {
  const { start, end } = getEventWindow(event);

  if (!start) return "unscheduled";
  if (end && now > end) return "past";
  if (now >= start) return "live";
  return "upcoming";
}

export function isTicketOnSale(event?: ScheduledEvent | null, now: Date = new Date()) {
  if (!event?.ticketUrl) return false;
  if (event.status !== "on-sale") return false;

  const windowStatus = getEventWindowStatus(event, now);
  return windowStatus !== "past";
}

export function getScheduledEvents(now: Date = new Date()) {
  return [...getPublicEvents()]
    .filter((event) => getEventWindowStatus(event, now) !== "past")
    .sort(compareEvents);
}

export function getSeriesEvents(
  series: ScheduledEvent["series"],
  now: Date = new Date(),
) {
  return getScheduledEvents(now).filter((event) => event.series === series);
}

export function getSeriesExperienceEvent(
  series: ScheduledEvent["series"],
  slot: SiteExperienceSlot = "hero",
  now: Date = new Date(),
) {
  const configuredEvent = getFeaturedEventForSlot(slot);
  if (
    configuredEvent?.series === series &&
    getEventWindowStatus(configuredEvent, now) !== "past"
  ) {
    return configuredEvent;
  }

  const seriesEvents = getSeriesEvents(series, now);
  return (
    seriesEvents.find((event) => isTicketOnSale(event, now)) ??
    seriesEvents.find((event) => event.activeFunnels?.length) ??
    seriesEvents[0] ??
    [...getPublicEvents()]
      .filter((event) => event.series === series)
      .sort(compareEvents)[0]
  );
}

export function getExperienceEvent(
  slot: SiteExperienceSlot,
  now: Date = new Date(),
) {
  const configuredEvent = getFeaturedEventForSlot(slot);
  if (configuredEvent && getEventWindowStatus(configuredEvent, now) !== "past") {
    return configuredEvent;
  }

  const scheduledEvents = getScheduledEvents(now);
  return (
    scheduledEvents.find((event) => isTicketOnSale(event, now)) ??
    scheduledEvents[0] ??
    [...getPublicEvents()].sort(compareEvents)[0]
  );
}

export function getPrimaryTicketUrl(event?: ScheduledEvent | null) {
  return event?.ticketUrl;
}

export function getEventVenueLabel(event?: ScheduledEvent | null) {
  if (!event) return "Venue TBA";

  if (!event.location) return event.venue;
  if (event.location.toLowerCase().includes(event.venue.toLowerCase())) {
    return event.location;
  }

  return `${event.venue}, ${event.location}`;
}

export function getSeriesLabel(series: ScheduledEvent["series"]) {
  switch (series) {
    case "chasing-sunsets":
      return "Chasing Sun(Sets)";
    case "untold-story":
      return "Untold Story";
    default:
      return "The Monolith Project";
  }
}

/** Canonical series accent color used across the site. Reads from `brand.ts`. */
export function getSeriesColor(series?: ScheduledEvent["series"]): string {
  if (!series) return MONOLITH_ORANGE;
  return SERIES_COLORS[series] ?? MONOLITH_ORANGE;
}

/** Darkened series accent for use on warm cream / light backgrounds (WCAG contrast). */
export function getSeriesColorOnLight(series?: ScheduledEvent["series"]): string {
  if (!series) return MONOLITH_ORANGE_ON_LIGHT;
  return SERIES_COLORS_ON_LIGHT[series] ?? MONOLITH_ORANGE_ON_LIGHT;
}

/** Return up to `limit` upcoming events, sorted chronologically. */
export function getUpcomingEvents(limit = 2) {
  return getScheduledEvents().slice(0, limit);
}

export function getEventEyebrow(event?: ScheduledEvent | null) {
  if (!event) return "Featured Experience";

  if (event.subtitle) return event.subtitle;
  if (event.episode) return `${getSeriesLabel(event.series)} ${event.episode}`;
  return getSeriesLabel(event.series);
}
