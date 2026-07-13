CREATE TABLE "house_of_friends_applications" (
	"id" text PRIMARY KEY NOT NULL,
	"reference_code" text NOT NULL,
	"status" text DEFAULT 'submitted' NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"stage_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"instagram" text NOT NULL,
	"artist_url" text,
	"years_active" text NOT NULL,
	"genres" text NOT NULL,
	"bio" text NOT NULL,
	"why_house_of_friends" text NOT NULL,
	"collaboration_style" text NOT NULL,
	"set_title" text NOT NULL,
	"set_tracklist" text,
	"set_url" text,
	"folder_prefix" text NOT NULL,
	"profile_object_key" text NOT NULL,
	"photo_object_key" text NOT NULL,
	"dj_set_object_key" text NOT NULL,
	"photo_metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"dj_set_metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"age_confirmed" boolean NOT NULL,
	"availability_confirmed" boolean NOT NULL,
	"rights_confirmed" boolean NOT NULL,
	"terms_accepted" boolean NOT NULL,
	"marketing_consent" boolean DEFAULT false NOT NULL,
	"submitted_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "house_of_friends_applications_reference_code_idx" ON "house_of_friends_applications" USING btree ("reference_code");--> statement-breakpoint
CREATE INDEX "house_of_friends_applications_email_idx" ON "house_of_friends_applications" USING btree ("email");--> statement-breakpoint
CREATE INDEX "house_of_friends_applications_status_idx" ON "house_of_friends_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "house_of_friends_applications_submitted_at_idx" ON "house_of_friends_applications" USING btree ("submitted_at");