export type EventBannerStatus = "upcoming" | "live" | "past";

export const EVENT_BANNER_HEIGHT_PX = 48; // Tailwind h-12

const EVENT_DATE = new Date("2026-03-06T19:00:00-06:00");
const EVENT_END = new Date("2026-03-07T04:00:00-06:00");

export function getEventBannerStatus(now: Date = new Date()): EventBannerStatus {
  if (now >= EVENT_DATE && now <= EVENT_END) return "live";
  if (now > EVENT_END) return "past";
  return "upcoming";
}

export function isEventBannerVisible(now: Date = new Date()): boolean {
  return getEventBannerStatus(now) !== "past";
}
