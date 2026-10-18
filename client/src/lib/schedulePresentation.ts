import type { ScheduledEvent } from "@shared/events/types";
import { getEventWindow } from "@shared/events/lifecycle";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Month-only announcements sort within their month without inventing a show date.
export function getScheduleDate(event: ScheduledEvent) {
  if (
    event.confirmationStatus === "pending" &&
    event.eventStatus !== "EventPostponed"
  ) {
    return {
      key: "unannounced",
      month: "TO BE ANNOUNCED",
      label: "Date TBA",
      heading: "DATES TO BE ANNOUNCED",
      sort: Infinity,
      hasDay: false,
    };
  }
  const label = event.date.trim();
  const named = label.match(/^([A-Za-z]+)\s+(?:(\d{1,2}),?\s+)?(\d{4})$/);
  const iso = label.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  let month = named
    ? MONTHS.findIndex(value => value.toLowerCase() === named[1].toLowerCase())
    : iso
      ? Number(iso[2]) - 1
      : -1;
  let year = Number(named?.[3] || iso?.[1]);
  let day = named?.[2] ? Number(named[2]) : iso ? Number(iso[3]) : undefined;
  if (
    month < 0 &&
    event.startsAt &&
    Number.isFinite(Date.parse(event.startsAt))
  ) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      month: "numeric",
      day: "numeric",
      year: "numeric",
    }).formatToParts(new Date(event.startsAt));
    const part = (name: string) =>
      Number(parts.find(value => value.type === name)?.value);
    month = part("month") - 1;
    year = part("year");
    day = part("day");
  }
  if (
    month < 0 ||
    month > 11 ||
    !year ||
    (day !== undefined &&
      (day < 1 || day > new Date(Date.UTC(year, month + 1, 0)).getUTCDate()))
  ) {
    return {
      key: "unannounced",
      month: "TO BE ANNOUNCED",
      label: "Date TBA",
      heading: "DATES TO BE ANNOUNCED",
      sort: Infinity,
      hasDay: false,
    };
  }
  const name = MONTHS[month];
  return {
    key: `${year}-${String(month + 1).padStart(2, "0")}`,
    month: name.toUpperCase(),
    label: day ? `${name.slice(0, 3)} ${day}` : `${name.slice(0, 3)} ${year}`,
    heading: `${name.toUpperCase()} ${year}`,
    sort: year * 10000 + (month + 1) * 100 + (day ?? 32),
    hasDay: day !== undefined,
  };
}

export function compareScheduleEvents(a: ScheduledEvent, b: ScheduledEvent) {
  const difference = getScheduleDate(a).sort - getScheduleDate(b).sort;
  return (
    (Number.isNaN(difference) ? 0 : difference) ||
    a.title.localeCompare(b.title)
  );
}

export function canAddEventToCalendar(event: ScheduledEvent) {
  if (
    event.confirmationStatus === "pending" ||
    ["EventPostponed", "EventCancelled"].includes(event.eventStatus || "")
  )
    return false;
  const { start, end } = getEventWindow(event);
  return getScheduleDate(event).hasDay && Boolean(start && end && end > start);
}

export function getScheduleVenue(event: ScheduledEvent) {
  return /^(?:tba|tbd|to be announced|venue reveal soon)$/i.test(
    event.venue.trim()
  ) || !event.venue.trim()
    ? "Venue to be announced"
    : event.venue;
}
