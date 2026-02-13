CREATE TABLE "social_echo_activity" (
	"id" text PRIMARY KEY NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL,
	"event_type" text NOT NULL,
	"event_key" text NOT NULL,
	"event_id" text,
	"event_title" text,
	"city" text,
	"status" text,
	"quantity" integer DEFAULT 1 NOT NULL,
	"attendee_alias" text NOT NULL,
	"raw_payload" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "social_echo_event_stats" (
	"event_key" text PRIMARY KEY NOT NULL,
	"event_id" text,
	"event_title" text,
	"city" text,
	"going_count" integer DEFAULT 0 NOT NULL,
	"pending_count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
