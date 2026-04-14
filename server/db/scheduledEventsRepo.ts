import { getDatabase } from "./client";
import { scheduledEvents } from "./schema";
import { upcomingEvents } from "../data/public-site-data";
import type {
  ActiveFunnel,
  EventSeries,
  ScheduledEvent,
  TicketTier,
} from "../../shared/events/types";

type ScheduledEventRow = typeof scheduledEvents.$inferSelect;

const EVENT_SERIES = new Set<EventSeries>([
  "chasing-sunsets",
  "untold-story",
  "monolith-project",
]);

const EVENT_STATUS = new Set<ScheduledEvent["status"]>([
  "on-sale",
  "coming-soon",
  "sold-out",
  "past",
]);

const ACTIVE_FUNNELS = new Set<ActiveFunnel>([
  "waitlist",
  "waitlist-chasing",
  "waitlist-untold",
  "giveaway",
  "coordinates",
]);

function isEventSeries(value: string): value is EventSeries {
  return EVENT_SERIES.has(value as EventSeries);
}

function isEventStatus(value: string): value is ScheduledEvent["status"] {
  return EVENT_STATUS.has(value as ScheduledEvent["status"]);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isTicketTierArray(value: unknown): value is TicketTier[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        typeof item.description === "string" &&
        Array.isArray(item.features) &&
        item.features.every((feature: unknown) => typeof feature === "string") &&
        ["ticket", "star", "crown"].includes(String(item.icon)) &&
        typeof item.available === "boolean",
    )
  );
}

function isFaqArray(value: unknown): value is NonNullable<ScheduledEvent["faqs"]> {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof item.q === "string" &&
        typeof item.a === "string",
    )
  );
}

function toActiveFunnels(value: unknown): ActiveFunnel[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const funnels = value.filter(
    (item): item is ActiveFunnel =>
      typeof item === "string" && ACTIVE_FUNNELS.has(item as ActiveFunnel),
  );

  return funnels.length > 0 ? funnels : undefined;
}

function pickDefined<T extends object>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).filter(
      ([, entry]) => entry !== undefined && entry !== null,
    ),
  ) as Partial<T>;
}

function mapRowToScheduledEvent(row: ScheduledEventRow): ScheduledEvent | null {
  if (!isEventSeries(row.series) || !isEventStatus(row.status)) {
    return null;
  }

  const event = pickDefined<ScheduledEvent>({
    id: row.id,
    series: row.series,
    episode: row.episode,
    title: row.title,
    slug: row.slug ?? undefined,
    subtitle: row.subtitle ?? undefined,
    date: row.date,
    time: row.time,
    startsAt: row.startsAt ?? undefined,
    endsAt: row.endsAt ?? undefined,
    doors: row.doors ?? undefined,
    venue: row.venue,
    location: row.location,
    lineup: row.lineup ?? undefined,
    image: row.image ?? undefined,
    status: row.status,
    inventoryState:
      row.inventoryState === "low" || row.inventoryState === "normal"
        ? row.inventoryState
        : undefined,
    capacity: row.capacity ?? undefined,
    format: row.format ?? undefined,
    dress: row.dress ?? undefined,
    sound: row.sound ?? undefined,
    description: row.description ?? undefined,
    age: row.age ?? undefined,
    ticketUrl: row.ticketUrl ?? undefined,
    startingPrice: row.startingPrice ?? undefined,
    ticketTiers: isTicketTierArray(row.ticketTiers) ? row.ticketTiers : undefined,
    headline: row.headline ?? undefined,
    mainExperience: row.mainExperience ?? undefined,
    experienceIntro: row.experienceIntro ?? undefined,
    whatToExpect: isStringArray(row.whatToExpect) ? row.whatToExpect : undefined,
    tablePackages: isStringArray(row.tablePackages) ? row.tablePackages : undefined,
    tableReservationEmail: row.tableReservationEmail ?? undefined,
    faqs: isFaqArray(row.faqs) ? row.faqs : undefined,
    photoNotice: row.photoNotice ?? undefined,
    eventNotice: row.eventNotice ?? undefined,
    activeFunnels: toActiveFunnels(row.activeFunnels),
    recentlyDropped: row.recentlyDropped,
  });

  return event as ScheduledEvent;
}

export function mergeScheduledEvents(
  baseEvents: ScheduledEvent[],
  overrideEvents: ScheduledEvent[],
) {
  const overridesById = new Map(overrideEvents.map((event) => [event.id, event]));
  const merged = baseEvents.map((event) => ({
    ...event,
    ...(overridesById.get(event.id) ?? {}),
  }));

  const baseIds = new Set(baseEvents.map((event) => event.id));
  const appended = overrideEvents.filter((event) => !baseIds.has(event.id));

  return [...merged, ...appended];
}

export async function readPublicScheduledEvents() {
  const db = getDatabase();
  if (!db) return upcomingEvents;

  try {
    const rows = await db.select().from(scheduledEvents);
    const dbEvents = rows
      .map(mapRowToScheduledEvent)
      .filter((event): event is ScheduledEvent => Boolean(event));

    if (dbEvents.length === 0) {
      return upcomingEvents;
    }

    return mergeScheduledEvents(upcomingEvents, dbEvents);
  } catch (error) {
    console.warn(
      "[site-data] Falling back to static events because scheduled_events could not be read.",
      error instanceof Error ? error.message : error,
    );
    return upcomingEvents;
  }
}
