CREATE TABLE IF NOT EXISTS "leads" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"source" text,
	"provider" text,
	"provider_status" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"webhook_status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "booking_inquiries" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"entity" text NOT NULL,
	"type" text NOT NULL,
	"location" text,
	"message" text NOT NULL,
	"webhook_status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "scheduled_events" (
	"id" text PRIMARY KEY NOT NULL,
	"series" text NOT NULL,
	"episode" text NOT NULL,
	"title" text NOT NULL,
	"slug" text,
	"subtitle" text,
	"date" text NOT NULL,
	"time" text NOT NULL,
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"doors" text,
	"venue" text NOT NULL,
	"location" text NOT NULL,
	"lineup" text,
	"image" text,
	"status" text NOT NULL,
	"inventory_state" text,
	"capacity" text,
	"format" text,
	"dress" text,
	"sound" text,
	"description" text,
	"age" text,
	"ticket_url" text,
	"starting_price" integer,
	"ticket_tiers" jsonb DEFAULT '[]'::jsonb,
	"headline" text,
	"main_experience" text,
	"experience_intro" text,
	"what_to_expect" jsonb DEFAULT '[]'::jsonb,
	"table_packages" jsonb DEFAULT '[]'::jsonb,
	"table_reservation_email" text,
	"faqs" jsonb DEFAULT '[]'::jsonb,
	"photo_notice" text,
	"event_notice" text,
	"active_funnels" jsonb DEFAULT '[]'::jsonb,
	"recently_dropped" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "scheduled_events" ADD COLUMN IF NOT EXISTS "slug" text;
--> statement-breakpoint
ALTER TABLE "scheduled_events" ADD COLUMN IF NOT EXISTS "starts_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "scheduled_events" ADD COLUMN IF NOT EXISTS "ends_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "scheduled_events" ADD COLUMN IF NOT EXISTS "inventory_state" text;
--> statement-breakpoint
ALTER TABLE "scheduled_events" ADD COLUMN IF NOT EXISTS "starting_price" integer;
--> statement-breakpoint
ALTER TABLE "scheduled_events" ADD COLUMN IF NOT EXISTS "ticket_tiers" jsonb DEFAULT '[]'::jsonb;
--> statement-breakpoint
ALTER TABLE "scheduled_events" ADD COLUMN IF NOT EXISTS "recently_dropped" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "scheduled_events_series_idx" ON "scheduled_events" USING btree ("series");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "scheduled_events_status_idx" ON "scheduled_events" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "scheduled_events_starts_at_idx" ON "scheduled_events" USING btree ("starts_at");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "scheduled_events_slug_idx" ON "scheduled_events" USING btree ("slug");
