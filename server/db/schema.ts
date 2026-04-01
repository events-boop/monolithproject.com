import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const rateLimitBuckets = pgTable("rate_limit_buckets", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  resetAt: timestamp("reset_at", { withTimezone: true, mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
});

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

export const contactSubmissions = pgTable("contact_submissions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  webhookStatus: text("webhook_status").notNull().default("pending"), // 'pending' | 'success' | 'failed'
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  metadata: jsonb("metadata").notNull().default({}),
});

export const bookingInquiries = pgTable("booking_inquiries", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  entity: text("entity").notNull(),
  type: text("type").notNull(), // 'partner-on-location' | 'artist-booking' | 'sponsorship' | 'general'
  location: text("location"),
  message: text("message").notNull(),
  webhookStatus: text("webhook_status").notNull().default("pending"), // 'pending' | 'success' | 'failed'
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  metadata: jsonb("metadata").notNull().default({}),
});

export const scheduledEvents = pgTable("scheduled_events", {
  id: text("id").primaryKey(),
  series: text("series").notNull(), // 'chasing-sunsets' | 'untold-story' | 'monolith-project'
  episode: text("episode").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  date: text("date").notNull(),
  time: text("time").notNull(),
  doors: text("doors"),
  venue: text("venue").notNull(),
  location: text("location").notNull(),
  lineup: text("lineup"),
  image: text("image"),
  status: text("status").notNull(), // 'on-sale' | 'coming-soon' | 'sold-out'
  capacity: text("capacity"),
  format: text("format"),
  dress: text("dress"),
  sound: text("sound"),
  description: text("description"),
  age: text("age"),
  ticketUrl: text("ticket_url"),
  headline: text("headline"),
  mainExperience: text("main_experience"),
  experienceIntro: text("experience_intro"),
  whatToExpect: jsonb("what_to_expect").default([]),
  tablePackages: jsonb("table_packages").default([]),
  tableReservationEmail: text("table_reservation_email"),
  faqs: jsonb("faqs").default([]),
  photoNotice: text("photo_notice"),
  eventNotice: text("event_notice"),
  activeFunnels: jsonb("active_funnels").default([]),
});
