CREATE TABLE IF NOT EXISTS "ticket_intents" (
	"id" text PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"event_id" text,
	"session_id" text,
	"destination_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
