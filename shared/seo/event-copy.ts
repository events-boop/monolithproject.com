import type { ScheduledEvent } from "../events/types";

export function buildEventSeoTitle(event: ScheduledEvent) {
  if (event.eventStatus === "EventPostponed")
    return `${event.headline || event.title} — Postponed`;
  if (event.eventStatus === "EventCancelled")
    return `${event.headline || event.title} — Cancelled`;
  if (event.confirmationStatus === "pending")
    return `${event.headline || event.title} | Details to be announced`;
  const shortDate = event.date.replace(/,\s*\d{4}$/, "");
  if (event.id === "us-s3e3")
    return `Eran Hersh at Hideaway Chicago | ${shortDate}`;
  const headline = event.headline || event.title;
  return /venue reveal soon/i.test(event.venue)
    ? `${headline} | ${shortDate}`
    : `${headline} at ${event.venue} | ${shortDate}`;
}

export function buildEventSeoDescription(event: ScheduledEvent) {
  if (event.eventStatus === "EventPostponed")
    return event.eventNotice || "Postponed. A new date is not yet confirmed.";
  if (event.eventStatus === "EventCancelled")
    return (
      event.eventNotice ||
      "This event was cancelled. Read the official event update."
    );
  if (event.confirmationStatus === "pending")
    return `The next announcement for ${event.title} will include the confirmed date, venue and lineup. Get official updates from The Monolith Project.`;
  const shortDate = event.date.replace(/,\s*\d{4}$/, "");
  if (event.status === "past")
    return `Archive details for ${event.headline || event.title} at ${event.id === "us-s3e3" ? "Hideaway Chicago" : event.venue} on ${shortDate}, from The Monolith Project.`;
  if (event.series === "chasing-sunsets")
    return `${event.title} brings open-air Chicago house music to ${event.venue} on ${shortDate}. Get lineup, timing, and event updates.`;
  if (event.series === "untold-story")
    return `${event.title} brings after-dark Chicago house music to ${event.venue} on ${shortDate}. Get timing and official event details.`;
  return `Get details and updates for ${event.title} at ${event.venue} in Chicago on ${shortDate} from The Monolith Project.`;
}
