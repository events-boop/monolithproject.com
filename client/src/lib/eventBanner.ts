export type EventBannerStatus = "upcoming" | "live" | "past";

import {
  getEventEyebrow,
  getEventVenueLabel,
  getExperienceEvent,
  getEventWindowStatus,
  getPrimaryTicketUrl,
  isTicketOnSale,
} from "@/lib/siteExperience";

const BANNER_ENABLED_PATHS = new Set([
  "/",
  "/tickets",
  "/chasing-sunsets",
  "/story",
  "/untold-story-deron-juany-bravo",
  "/lineup",
  "/schedule",
  "/radio",
]);

export function getEventBannerStatus(now: Date = new Date()): EventBannerStatus {
  const event = getExperienceEvent("banner");
  const status = getEventWindowStatus(event, now);

  if (status === "unscheduled") return "past";
  return status;
}

function normalizePathname(pathname: string) {
  const clean = pathname.split("?")[0]?.split("#")[0] || "/";
  if (clean.length > 1 && clean.endsWith("/")) return clean.slice(0, -1);
  return clean || "/";
}

export function isEventBannerRouteEligible(pathname: string) {
  return BANNER_ENABLED_PATHS.has(normalizePathname(pathname));
}

export function isEventBannerVisible(pathname?: string, now: Date = new Date()) {
  if (getEventBannerStatus(now) === "past") return false;
  if (!pathname) return true;
  return isEventBannerRouteEligible(pathname);
}

export function getEventBannerPayload(now: Date = new Date()) {
  const event = getExperienceEvent("banner");
  const status = getEventBannerStatus(now);

  if (!event) {
    return null;
  }

  const headline = (event.headline || event.title).toUpperCase();
  const eyebrow = getEventEyebrow(event).toUpperCase();
  const venue = getEventVenueLabel(event).toUpperCase();
  const message =
    `${event.date.toUpperCase()} — ${venue} — ${headline} — ${eyebrow} — ` +
    `${isTicketOnSale(event, now) ? "TICKETS ON SALE NOW" : "SAVE THE DATE"}`;
  const liveMessage = `LIVE NOW — ${headline} — ${venue}`;

  return {
    event,
    status,
    text: status === "live" ? liveMessage : message,
    ticketUrl: getPrimaryTicketUrl(event),
  };
}
