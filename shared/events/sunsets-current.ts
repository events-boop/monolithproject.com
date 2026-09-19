import { resolveEventPrimaryCta } from "./public-cta";
import approved from "./sunsets-page.json";
import type { ScheduledEvent } from "./types";

// The homepage and public calendar use the same approved publication as /sunsets.
export const currentSunsets = approved;
export const sunsetsNeedsUpdate = ["EventPostponed", "EventCancelled"].includes(
  approved.status
);
export const sunsetsShowVisible = () =>
  sunsetsNeedsUpdate || Date.now() < Date.parse(approved.end);
const chicago = "America/Chicago";
export const sunsetsDateLabel = new Intl.DateTimeFormat("en-US", {
  timeZone: chicago,
  month: "long",
  day: "numeric",
  year: "numeric",
}).format(new Date(approved.start));
export const sunsetsShortDate = new Intl.DateTimeFormat("en-US", {
  timeZone: chicago,
  weekday: "short",
  month: "short",
  day: "numeric",
}).format(new Date(approved.start));
const timeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: chicago,
  hour: "numeric",
  minute: "2-digit",
});
export const sunsetsTimeLabel = `${timeFormat.format(new Date(approved.start))}–${timeFormat.format(new Date(approved.end))} Chicago time`;
export const sunsetsUpdatedLabel = new Intl.DateTimeFormat("en-US", {
  timeZone: chicago,
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
}).format(new Date(approved.updatedAt));
export function sunsetsStatusLabel(now = Date.now()) {
  if (approved.status === "EventCancelled") return "Cancelled";
  if (approved.status === "EventPostponed") return "Postponed";
  if (approved.status === "EventRescheduled") return "Rescheduled";
  return now >= Date.parse(approved.end) ? "Event ended" : "Scheduled";
}
export function sunsetsTicketsEnabled(now = Date.now()) {
  return (
    approved.salesEnabled &&
    ["EventScheduled", "EventRescheduled"].includes(approved.status) &&
    now < Date.parse(approved.end)
  );
}

export function withApprovedSunsets(
  event: ScheduledEvent,
  now = Date.now()
): ScheduledEvent {
  if (
    event.id !== "css-sep19" ||
    event.status === "draft" ||
    event.status === "hidden"
  )
    return event;
  const normalized: ScheduledEvent = {
    ...event,
    headline: approved.name,
    confirmationStatus: "confirmed",
    eventStatus: approved.status as ScheduledEvent["eventStatus"],
    date: sunsetsDateLabel,
    time: sunsetsTimeLabel,
    startsAt: approved.start,
    endsAt: approved.end,
    doors: timeFormat.format(new Date(approved.start)),
    venue: approved.venueName,
    location: approved.locationShort,
    age: "21+ · Valid photo ID",
    lineup: [...approved.headliners, ...approved.support].join(" · "),
    description: `The 2026 season finale with ${approved.headliners.join(" × ")} at ${approved.venueName}. ${approved.scheduleMessage}`,
    status:
      !sunsetsNeedsUpdate && now >= Date.parse(approved.end)
        ? "past"
        : sunsetsTicketsEnabled(now)
          ? "on-sale"
          : "coming-soon",
    ticketUrl: sunsetsTicketsEnabled(now) ? approved.ticketUrl : undefined,
    image: "/sunsets/assets/hero-960.webp",
    eventNotice: `${sunsetsStatusLabel(now)}. ${approved.statusMessage}`,
    tableReservationEmail: "events@monolithproject.com",
    // No inventory or VIP inclusions are approved in the current publication.
    vipPackages: undefined,
    tablePackages: undefined,
    startingPrice: undefined,
    ticketTiers: undefined,
    inventoryState: undefined,
    capacity: undefined,
    venueMap: event.venueMap
      ? { ...event.venueMap, address: approved.address }
      : undefined,
  };
  return {
    ...normalized,
    primaryCta: resolveEventPrimaryCta(normalized, new Date(now)),
  };
}
