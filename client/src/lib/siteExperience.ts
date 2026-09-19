import type { ScheduledEvent, SiteExperienceSlot } from "@shared/events/types";
import { getFeaturedEventForSlot, getPublicEvents } from "./siteData";
import {
  MONOLITH_ORANGE,
  MONOLITH_ORANGE_ON_LIGHT,
  SERIES_COLORS,
  SERIES_COLORS_ON_LIGHT,
} from "./brand";

import {
  getEventWindow,
  getEventWindowStatus,
  isTicketOnSale,
  isUpcomingEvent,
} from "@shared/events/lifecycle";
export {
  getEventWindow,
  getEventWindowStatus,
  isTicketOnSale,
} from "@shared/events/lifecycle";
export type { EventWindowStatus } from "@shared/events/lifecycle";

function compareEvents(a: ScheduledEvent, b: ScheduledEvent) {
  const aStart = getEventStartTimestamp(a) ?? Number.POSITIVE_INFINITY;
  const bStart = getEventStartTimestamp(b) ?? Number.POSITIVE_INFINITY;

  if (aStart !== bStart) return aStart - bStart;
  return a.title.localeCompare(b.title);
}

export function getEventById(eventId?: string | null) {
  if (!eventId) return undefined;
  return getPublicEvents().find(event => event.id === eventId);
}

export function getEventStartTimestamp(event?: ScheduledEvent | null) {
  const { start } = getEventWindow(event);
  return start ? start.getTime() : null;
}

export function getScheduledEvents(now: Date = new Date()) {
  return [...getPublicEvents()]
    .filter(
      event =>
        !["draft", "hidden", "past"].includes(event.status) &&
        getEventWindowStatus(event, now) !== "past"
    )
    .sort(compareEvents);
}

export function getSeriesEvents(
  series: ScheduledEvent["series"],
  now: Date = new Date()
) {
  return getScheduledEvents(now).filter(event => event.series === series);
}

export function getSeriesExperienceEvent(
  series: ScheduledEvent["series"],
  slot: SiteExperienceSlot = "hero",
  now: Date = new Date()
) {
  const configuredEvent =
    getPublicEvents().find(
      event =>
        event.id === "css-sep19" && event.eventStatus === "EventPostponed"
    ) || getFeaturedEventForSlot(slot);
  if (
    configuredEvent?.series === series &&
    (isUpcomingEvent(configuredEvent, now) ||
      configuredEvent.eventStatus === "EventPostponed")
  ) {
    return configuredEvent;
  }

  const seriesEvents = getSeriesEvents(series, now);
  return (
    seriesEvents.find(event => isTicketOnSale(event, now)) ??
    seriesEvents.find(event => event.activeFunnels?.length) ??
    seriesEvents[0] ??
    [...getPublicEvents()]
      .filter(event => event.series === series)
      .sort(compareEvents)[0]
  );
}

export function getExperienceEvent(
  slot: SiteExperienceSlot,
  now: Date = new Date()
) {
  const configuredEvent =
    getPublicEvents().find(
      event =>
        event.id === "css-sep19" && event.eventStatus === "EventPostponed"
    ) || getFeaturedEventForSlot(slot);
  if (
    configuredEvent &&
    (isUpcomingEvent(configuredEvent, now) ||
      configuredEvent.eventStatus === "EventPostponed")
  ) {
    return configuredEvent;
  }

  const scheduledEvents = getScheduledEvents(now);
  return (
    scheduledEvents.find(event => isTicketOnSale(event, now)) ??
    scheduledEvents[0]
  );
}

export function getPrimaryTicketUrl(event?: ScheduledEvent | null) {
  return isTicketOnSale(event) ? event?.ticketUrl : undefined;
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
export function getSeriesColorOnLight(
  series?: ScheduledEvent["series"]
): string {
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
