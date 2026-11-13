/**
 * PublishedEventState — the single public projection of an event.
 *
 * Every surface (calendar, homepage, CTAs, prerender) asks this module what
 * an event IS for a visitor right now, instead of re-deriving it from
 * `status`, `eventStatus`, dates, and event ids.
 *
 * Two levels:
 *   1. Per event   — getPublishedEventState(event, now)
 *   2. Per site    — getPublishedCatalogue(events, now), which also answers
 *                    "are we between shows?" for the whole catalogue.
 *
 * Both are pure: same inputs, same output, no clock or network access beyond
 * the `now` argument. Callers that render at build time must pass (or
 * re-evaluate with) the visitor's `now`, never a build-time snapshot.
 */
import {
  getEventWindow,
  getEventWindowStatus,
  isTicketOnSale,
} from "./lifecycle";
import type { ScheduledEvent } from "./types";

/** What the primary button means. Labels live in PUBLISHED_CTA_LABELS. */
export type PublishedCtaIntent =
  | "get-tickets"
  | "get-first-access"
  | "join-waitlist"
  | "ticket-holder-update"
  | "event-update"
  | "view-archive";

/**
 * Canonical button copy. "Get First Access" is matched by the Meta Pixel
 * lead handler (MetaPixelGate), so that string must not drift.
 */
export const PUBLISHED_CTA_LABELS: Record<PublishedCtaIntent, string> = {
  "get-tickets": "Get Tickets",
  "get-first-access": "Get First Access",
  "join-waitlist": "Join The Waitlist",
  "ticket-holder-update": "Ticket-Holder Update",
  "event-update": "Event update",
  "view-archive": "View archive",
};

/** Checkout is live. `ticketUrl` is guaranteed, so "Get Tickets" cannot dead-end. */
export interface OnSaleState {
  kind: "on-sale";
  listed: true;
  cta: "get-tickets";
  ticketUrl: string;
}

/** Announced, checkout not open (or details pending). Funnel CTA only. */
export interface FirstAccessState {
  kind: "first-access";
  /** False only for `hidden` records, which resolve by direct link but stay out of lists. */
  listed: boolean;
  cta: "get-first-access";
}

/** Still happening, checkout closed. */
export interface SoldOutState {
  kind: "sold-out";
  listed: true;
  cta: "join-waitlist";
  badge: "Sold out";
}

/** Not happening on its published date. Never appears in an upcoming list. */
export interface DisruptedState {
  kind: "postponed" | "cancelled";
  listed: false;
  /** True when people hold tickets and are owed an update. */
  ticketHolders: boolean;
  cta: "ticket-holder-update" | "event-update";
  /** Where the update lives: the event's own status page, else its event page. */
  statusUrl: string;
}

/** Finished. Archive is the only destination. */
export interface PastState {
  kind: "past";
  listed: false;
  cta: "view-archive";
  archiveUrl: string;
}

/** Drafts and missing records. Nothing public may be rendered from these. */
export interface UnpublishedState {
  kind: "unpublished";
  listed: false;
  cta: null;
}

export type PublishedEventState =
  | OnSaleState
  | FirstAccessState
  | SoldOutState
  | DisruptedState
  | PastState
  | UnpublishedState;

export type PublishedEventKind = PublishedEventState["kind"];

function eventPath(event: ScheduledEvent) {
  return `/events/${event.slug || event.id}`;
}

function archivePath(event: ScheduledEvent) {
  return (
    event.recapUrl ||
    (event.archiveSlug ? `/archive/${event.archiveSlug}` : "/archive")
  );
}

function disrupted(
  kind: DisruptedState["kind"],
  event: ScheduledEvent
): DisruptedState {
  const ticketHolders = Boolean(event.ticketHolderNotice?.trim());
  return {
    kind,
    listed: false,
    ticketHolders,
    cta: ticketHolders ? "ticket-holder-update" : "event-update",
    statusUrl: event.statusUrl || eventPath(event),
  };
}

/**
 * Resolve what an event is for the public at `now`.
 *
 * Precedence (first match wins):
 *   1. missing / draft            → unpublished
 *   2. status "past"              → past        (an explicit archive decision is final)
 *   3. EventCancelled             → cancelled
 *   4. EventPostponed             → postponed   (dates no longer expire it)
 *   5. event window has ended     → past        (now >= end)
 *   6. status "sold-out"          → sold-out
 *   7. on-sale + ticketUrl + not ended → on-sale
 *   8. everything else            → first-access
 */
export function getPublishedEventState(
  event: ScheduledEvent | null | undefined,
  now: Date = new Date()
): PublishedEventState {
  if (!event || event.status === "draft") {
    return { kind: "unpublished", listed: false, cta: null };
  }

  const past: PastState = {
    kind: "past",
    listed: false,
    cta: "view-archive",
    archiveUrl: archivePath(event),
  };

  if (event.status === "past") return past;
  if (event.eventStatus === "EventCancelled")
    return disrupted("cancelled", event);
  if (event.eventStatus === "EventPostponed")
    return disrupted("postponed", event);
  if (getEventWindowStatus(event, now) === "past") return past;

  if (event.status === "sold-out") {
    return {
      kind: "sold-out",
      listed: true,
      cta: "join-waitlist",
      badge: "Sold out",
    };
  }

  if (event.ticketUrl && isTicketOnSale(event, now)) {
    return {
      kind: "on-sale",
      listed: true,
      cta: "get-tickets",
      ticketUrl: event.ticketUrl,
    };
  }

  return {
    kind: "first-access",
    listed: event.status !== "hidden",
    cta: "get-first-access",
  };
}

/** A postponed or cancelled show whose ticket holders are owed an update. */
export function needsTicketHolderUpdate(
  state: PublishedEventState
): state is DisruptedState {
  return (
    (state.kind === "postponed" || state.kind === "cancelled") &&
    state.ticketHolders
  );
}

/**
 * Site-level state.
 *   active        — at least one listed event is on-sale or first-access.
 *   between-shows — nothing to buy or sign up for. Surfaces should switch to
 *                   the off-season experience (radio, archive, drop list)
 *                   instead of an empty or stale calendar.
 */
export type SitePublishedState = "active" | "between-shows";

export interface PublishedEntry<T extends ScheduledEvent = ScheduledEvent> {
  event: T;
  state: PublishedEventState;
}

export interface PublishedCatalogue<T extends ScheduledEvent = ScheduledEvent> {
  site: SitePublishedState;
  /** on-sale, first-access, sold-out. Soonest first; undated last. */
  upcoming: PublishedEntry<T>[];
  /** postponed / cancelled. Rendered as status notices, never as upcoming shows. */
  notices: PublishedEntry<T>[];
  /** Finished events. Most recent first. */
  past: PublishedEntry<T>[];
  /** The event the site should lead with: first on-sale, else first first-access. */
  lead: PublishedEntry<T> | undefined;
}

function startOf(event: ScheduledEvent) {
  return getEventWindow(event).start?.getTime() ?? Number.POSITIVE_INFINITY;
}

function endOf(event: ScheduledEvent) {
  const { start, end } = getEventWindow(event);
  return (end ?? start)?.getTime() ?? Number.NEGATIVE_INFINITY;
}

function soonestFirst(a: PublishedEntry, b: PublishedEntry) {
  const difference = startOf(a.event) - startOf(b.event);
  // Infinity - Infinity is NaN: two undated events fall through to the title.
  return (
    (Number.isNaN(difference) ? 0 : difference) ||
    a.event.title.localeCompare(b.event.title)
  );
}

function latestFirst(a: PublishedEntry, b: PublishedEntry) {
  const difference = endOf(b.event) - endOf(a.event);
  return (
    (Number.isNaN(difference) ? 0 : difference) ||
    a.event.title.localeCompare(b.event.title)
  );
}

/** Project a whole catalogue. Drafts and hidden records never appear in any list. */
export function getPublishedCatalogue<T extends ScheduledEvent>(
  events: readonly T[],
  now: Date = new Date()
): PublishedCatalogue<T> {
  const upcoming: PublishedEntry<T>[] = [];
  const notices: PublishedEntry<T>[] = [];
  const past: PublishedEntry<T>[] = [];

  for (const event of events) {
    if (event.status === "hidden") continue;
    const state = getPublishedEventState(event, now);
    if (state.kind === "unpublished") continue;
    const entry = { event, state };
    if (state.kind === "past") past.push(entry);
    else if (state.kind === "postponed" || state.kind === "cancelled")
      notices.push(entry);
    else upcoming.push(entry);
  }

  upcoming.sort(soonestFirst);
  notices.sort(soonestFirst);
  past.sort(latestFirst);

  const lead =
    upcoming.find(entry => entry.state.kind === "on-sale") ??
    upcoming.find(entry => entry.state.kind === "first-access");

  return {
    site: lead ? "active" : "between-shows",
    upcoming,
    notices,
    past,
    lead,
  };
}

/** Convenience for surfaces that only need the site-level answer. */
export function getSitePublishedState(
  events: readonly ScheduledEvent[],
  now: Date = new Date()
): SitePublishedState {
  return getPublishedCatalogue(events, now).site;
}
