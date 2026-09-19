import type { ScheduledEvent } from "./types";

export type EventWindowStatus = "upcoming" | "live" | "past" | "unscheduled";
const parse = (value?: string) =>
  value && Number.isFinite(Date.parse(value)) ? new Date(value) : null;

// Date-only records use Chicago midnight for catalogue selection only.
// Unconfirmed hours never become machine-readable performance times.
function chicagoMidnight(date: Date) {
  const midnight = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    timeZoneName: "shortOffset",
  });
  let candidate = midnight;
  // Resolve the offset at local midnight, including daylight-saving transitions.
  for (let attempt = 0; attempt < 3; attempt++) {
    const offset = formatter
      .formatToParts(new Date(candidate))
      .find(part => part.type === "timeZoneName")?.value;
    const hours = Number(offset?.replace("GMT", "") || -6);
    const corrected = midnight - hours * 3600000;
    if (corrected === candidate) break;
    candidate = corrected;
  }
  return new Date(candidate);
}
export function getEventWindow(event?: ScheduledEvent | null) {
  const hasDay = /^(?:[A-Za-z]+ \d{1,2}, \d{4}|\d{4}-\d{2}-\d{2})$/.test(
    event?.date || ""
  );
  const date = hasDay
    ? parse(`${event?.date} UTC`) || parse(event?.date)
    : null;
  const start = parse(event?.startsAt) || (date ? chicagoMidnight(date) : null);
  let end = parse(event?.endsAt);
  if (!end && date) {
    const next = new Date(date);
    next.setUTCDate(next.getUTCDate() + 1);
    end = chicagoMidnight(next);
  }
  return { start, end };
}
export function getEventWindowStatus(
  event?: ScheduledEvent | null,
  now = new Date()
): EventWindowStatus {
  if (event?.status === "past") return "past";
  if (
    event?.eventStatus === "EventCancelled" ||
    event?.eventStatus === "EventPostponed"
  )
    return "unscheduled";
  const { start, end } = getEventWindow(event);
  if (end && now >= end) return "past";
  if (!start) return "unscheduled";
  return now >= start ? "live" : "upcoming";
}
export function isTicketOnSale(
  event?: ScheduledEvent | null,
  now = new Date()
) {
  return Boolean(
    event?.ticketUrl &&
    event.status === "on-sale" &&
    ["upcoming", "live"].includes(getEventWindowStatus(event, now))
  );
}
export function isUpcomingEvent(event: ScheduledEvent, now = new Date()) {
  return (
    !["draft", "hidden", "past"].includes(event.status) &&
    ["upcoming", "live"].includes(getEventWindowStatus(event, now))
  );
}
