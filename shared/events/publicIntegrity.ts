import type { ScheduledEvent } from "./types";

/** Apply the same public safeguards to static, database, and cached API records. */
export function withPublicEventIntegrity(
  event: ScheduledEvent
): ScheduledEvent {
  if (event.confirmationStatus !== "pending") return event;
  return {
    ...event,
    // A provisional date expiring is not evidence of a completed performance.
    status:
      event.status === "past" ||
      event.status === "on-sale" ||
      event.status === "sold-out"
        ? "coming-soon"
        : event.status,
    ticketUrl: undefined,
    recapUrl: undefined,
    archiveSlug: undefined,
    startingPrice: undefined,
    ticketTiers: undefined,
    tablePackages: undefined,
    vipPackages: undefined,
  };
}

/** One calendar entry per documented night; every underlying URL stays intact. */
export function uniqueHistoricalNights<T extends ScheduledEvent>(
  events: T[]
): T[] {
  const seen = new Set<string>();
  return events.filter(event => {
    const receipt =
      event.archiveSlug ||
      (event.recapUrl !== "/archive" ? event.recapUrl : undefined);
    if (!receipt) return true;
    const key = `${receipt}|${event.date}|${event.venue}`.toLocaleLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
