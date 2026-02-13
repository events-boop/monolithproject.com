import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const socialEchoEventStats = pgTable("social_echo_event_stats", {
  eventKey: text("event_key").primaryKey(),
  eventId: text("event_id"),
  eventTitle: text("event_title"),
  city: text("city"),
  goingCount: integer("going_count").notNull().default(0),
  pendingCount: integer("pending_count").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
});

export const socialEchoActivity = pgTable("social_echo_activity", {
  id: text("id").primaryKey(),
  at: timestamp("at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  eventType: text("event_type").notNull(),
  eventKey: text("event_key").notNull(),
  eventId: text("event_id"),
  eventTitle: text("event_title"),
  city: text("city"),
  status: text("status"),
  quantity: integer("quantity").notNull().default(1),
  attendeeAlias: text("attendee_alias").notNull(),
  rawPayload: jsonb("raw_payload").notNull().default({}),
});

export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  source: text("source"),
  provider: text("provider"),
  providerStatus: text("provider_status"), // 'success' | 'failed'
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  metadata: jsonb("metadata").notNull().default({}),
});

