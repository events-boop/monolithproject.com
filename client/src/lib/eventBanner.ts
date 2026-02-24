export type EventBannerStatus = "upcoming" | "live" | "past";

const EVENT_START_AT = new Date("2026-03-06T19:00:00-06:00");
const EVENT_END_AT = new Date("2026-03-07T04:00:00-06:00");
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
  if (now >= EVENT_START_AT && now <= EVENT_END_AT) return "live";
  if (now > EVENT_END_AT) return "past";
  return "upcoming";
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
