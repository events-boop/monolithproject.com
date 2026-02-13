import { desc, eq } from "drizzle-orm";
import { getDatabase } from "./client";
import { socialEchoActivity, socialEchoEventStats } from "./schema";

export interface SocialEchoEventStatsRow {
  eventKey: string;
  eventId: string | null;
  eventTitle: string | null;
  city: string | null;
  goingCount: number;
  pendingCount: number;
  updatedAt: string;
}

export interface SocialEchoActivityRow {
  id: string;
  at: string;
  eventType: string;
  eventKey: string;
  eventId: string | null;
  eventTitle: string | null;
  city: string | null;
  status: string | null;
  quantity: number;
  attendeeAlias: string;
  rawPayload: Record<string, unknown>;
}

export interface SocialEchoSnapshot {
  now: string;
  summary: {
    totalGoing: number;
    totalPending: number;
    liveEvents: number;
  };
  events: SocialEchoEventStatsRow[];
  activity: SocialEchoActivityRow[];
}

export async function readSocialEchoEventByKey(eventKey: string) {
  const db = getDatabase();
  if (!db) return null;

  const rows = await db.select().from(socialEchoEventStats).where(eq(socialEchoEventStats.eventKey, eventKey)).limit(1);
  return rows[0] || null;
}

export async function upsertSocialEchoEventStats(row: SocialEchoEventStatsRow) {
  const db = getDatabase();
  if (!db) return false;

  await db
    .insert(socialEchoEventStats)
    .values({
      eventKey: row.eventKey,
      eventId: row.eventId,
      eventTitle: row.eventTitle,
      city: row.city,
      goingCount: row.goingCount,
      pendingCount: row.pendingCount,
      updatedAt: row.updatedAt,
    })
    .onConflictDoUpdate({
      target: socialEchoEventStats.eventKey,
      set: {
        eventId: row.eventId,
        eventTitle: row.eventTitle,
        city: row.city,
        goingCount: row.goingCount,
        pendingCount: row.pendingCount,
        updatedAt: row.updatedAt,
      },
    });

  return true;
}

export async function insertSocialEchoActivity(row: SocialEchoActivityRow) {
  const db = getDatabase();
  if (!db) return false;

  const inserted = await db
    .insert(socialEchoActivity)
    .values({
      id: row.id,
      at: row.at,
      eventType: row.eventType,
      eventKey: row.eventKey,
      eventId: row.eventId,
      eventTitle: row.eventTitle,
      city: row.city,
      status: row.status,
      quantity: row.quantity,
      attendeeAlias: row.attendeeAlias,
      rawPayload: row.rawPayload,
    })
    .onConflictDoNothing()
    .returning({ id: socialEchoActivity.id });

  return inserted.length > 0;
}

export async function readSocialEchoSnapshot() {
  const db = getDatabase();
  if (!db) return null;

  const events = await db.select().from(socialEchoEventStats).orderBy(desc(socialEchoEventStats.goingCount));
  const activity = await db
    .select()
    .from(socialEchoActivity)
    .orderBy(desc(socialEchoActivity.at))
    .limit(30);

  const totalGoing = events.reduce((sum, event) => sum + event.goingCount, 0);
  const totalPending = events.reduce((sum, event) => sum + event.pendingCount, 0);

  const snapshot: SocialEchoSnapshot = {
    now: new Date().toISOString(),
    summary: {
      totalGoing,
      totalPending,
      liveEvents: events.length,
    },
    events,
    activity: activity.map((item) => ({
      ...item,
      rawPayload: (item.rawPayload || {}) as Record<string, unknown>,
    })),
  };

  return snapshot;
}

