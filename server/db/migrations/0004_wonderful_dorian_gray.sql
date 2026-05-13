CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint
CREATE TABLE "artist_agent_contacts" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_id" text,
	"form_submission_id" text,
	"artist_name" text,
	"agency" text,
	"role" text,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"source" text,
	"medium" text,
	"platform" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"email_normalized" text NOT NULL,
	"phone" text,
	"first_name" text,
	"last_name" text,
	"instagram_handle" text,
	"primary_source" text,
	"first_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"consent_email" boolean DEFAULT false NOT NULL,
	"consent_sms" boolean DEFAULT false NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_platform_sync_status" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_id" text,
	"form_submission_id" text,
	"platform" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"provider_contact_id" text,
	"last_synced_at" timestamp with time zone,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "entity_embeddings" (
	"id" text PRIMARY KEY NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"contact_id" text,
	"form_submission_id" text,
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"embedding_model" text DEFAULT 'text-embedding-3-small' NOT NULL,
	"dimensions" integer DEFAULT 1536 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" text PRIMARY KEY NOT NULL,
	"external_id" text,
	"series" text,
	"title" text NOT NULL,
	"slug" text,
	"starts_at" timestamp with time zone,
	"venue" text,
	"city" text,
	"status" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_id" text,
	"event_id" text,
	"campaign_id" text,
	"submission_key" text,
	"form_type" text NOT NULL,
	"source" text,
	"page_path" text,
	"page_url" text,
	"event_interest" text,
	"event_series" text,
	"event_title" text,
	"provider" text,
	"provider_status" text DEFAULT 'pending' NOT NULL,
	"session_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"raw_payload" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "laylo_signups" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_id" text,
	"form_submission_id" text,
	"event_id" text,
	"laylo_url" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "manychat_leads" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_id" text,
	"form_submission_id" text,
	"manychat_subscriber_id" text,
	"flow_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posh_buyers" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_id" text,
	"event_id" text,
	"posh_order_id" text,
	"posh_ticket_id" text,
	"ticket_type" text,
	"quantity" integer DEFAULT 1 NOT NULL,
	"amount_cents" integer,
	"currency" text DEFAULT 'USD' NOT NULL,
	"purchased_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"raw_payload" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sponsor_leads" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_id" text,
	"form_submission_id" text,
	"company" text,
	"sponsorship_type" text,
	"budget" text,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "utm_sources" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_id" text,
	"campaign_id" text,
	"session_id" text,
	"source" text,
	"medium" text,
	"campaign" text,
	"term" text,
	"content" text,
	"gclid" text,
	"fbclid" text,
	"ttclid" text,
	"msclkid" text,
	"page_path" text,
	"page_url" text,
	"landing_page_url" text,
	"referrer" text,
	"referrer_domain" text,
	"first_touch_at" timestamp with time zone,
	"last_touch_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"raw_payload" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vip_leads" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_id" text,
	"form_submission_id" text,
	"event_id" text,
	"group_size" integer,
	"budget" text,
	"requested_date" text,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "artist_agent_contacts" ADD CONSTRAINT "artist_agent_contacts_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artist_agent_contacts" ADD CONSTRAINT "artist_agent_contacts_form_submission_id_form_submissions_id_fk" FOREIGN KEY ("form_submission_id") REFERENCES "public"."form_submissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_platform_sync_status" ADD CONSTRAINT "email_platform_sync_status_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_platform_sync_status" ADD CONSTRAINT "email_platform_sync_status_form_submission_id_form_submissions_id_fk" FOREIGN KEY ("form_submission_id") REFERENCES "public"."form_submissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entity_embeddings" ADD CONSTRAINT "entity_embeddings_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entity_embeddings" ADD CONSTRAINT "entity_embeddings_form_submission_id_form_submissions_id_fk" FOREIGN KEY ("form_submission_id") REFERENCES "public"."form_submissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "laylo_signups" ADD CONSTRAINT "laylo_signups_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "laylo_signups" ADD CONSTRAINT "laylo_signups_form_submission_id_form_submissions_id_fk" FOREIGN KEY ("form_submission_id") REFERENCES "public"."form_submissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "laylo_signups" ADD CONSTRAINT "laylo_signups_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manychat_leads" ADD CONSTRAINT "manychat_leads_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manychat_leads" ADD CONSTRAINT "manychat_leads_form_submission_id_form_submissions_id_fk" FOREIGN KEY ("form_submission_id") REFERENCES "public"."form_submissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posh_buyers" ADD CONSTRAINT "posh_buyers_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posh_buyers" ADD CONSTRAINT "posh_buyers_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsor_leads" ADD CONSTRAINT "sponsor_leads_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsor_leads" ADD CONSTRAINT "sponsor_leads_form_submission_id_form_submissions_id_fk" FOREIGN KEY ("form_submission_id") REFERENCES "public"."form_submissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "utm_sources" ADD CONSTRAINT "utm_sources_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "utm_sources" ADD CONSTRAINT "utm_sources_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vip_leads" ADD CONSTRAINT "vip_leads_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vip_leads" ADD CONSTRAINT "vip_leads_form_submission_id_form_submissions_id_fk" FOREIGN KEY ("form_submission_id") REFERENCES "public"."form_submissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vip_leads" ADD CONSTRAINT "vip_leads_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "artist_agent_contacts_contact_id_idx" ON "artist_agent_contacts" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "artist_agent_contacts_form_submission_id_idx" ON "artist_agent_contacts" USING btree ("form_submission_id");--> statement-breakpoint
CREATE UNIQUE INDEX "campaigns_key_idx" ON "campaigns" USING btree ("key");--> statement-breakpoint
CREATE INDEX "campaigns_source_idx" ON "campaigns" USING btree ("source");--> statement-breakpoint
CREATE UNIQUE INDEX "contacts_email_normalized_idx" ON "contacts" USING btree ("email_normalized");--> statement-breakpoint
CREATE INDEX "contacts_primary_source_idx" ON "contacts" USING btree ("primary_source");--> statement-breakpoint
CREATE INDEX "email_platform_sync_status_contact_id_idx" ON "email_platform_sync_status" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "email_platform_sync_status_form_submission_id_idx" ON "email_platform_sync_status" USING btree ("form_submission_id");--> statement-breakpoint
CREATE INDEX "email_platform_sync_status_platform_idx" ON "email_platform_sync_status" USING btree ("platform");--> statement-breakpoint
CREATE INDEX "entity_embeddings_entity_idx" ON "entity_embeddings" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "entity_embeddings_contact_id_idx" ON "entity_embeddings" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "entity_embeddings_form_submission_id_idx" ON "entity_embeddings" USING btree ("form_submission_id");--> statement-breakpoint
CREATE INDEX "entity_embeddings_embedding_hnsw_idx" ON "entity_embeddings" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "events_series_idx" ON "events" USING btree ("series");--> statement-breakpoint
CREATE INDEX "events_starts_at_idx" ON "events" USING btree ("starts_at");--> statement-breakpoint
CREATE UNIQUE INDEX "form_submissions_submission_key_idx" ON "form_submissions" USING btree ("submission_key");--> statement-breakpoint
CREATE INDEX "form_submissions_contact_id_idx" ON "form_submissions" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "form_submissions_event_id_idx" ON "form_submissions" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "form_submissions_form_type_idx" ON "form_submissions" USING btree ("form_type");--> statement-breakpoint
CREATE INDEX "form_submissions_source_idx" ON "form_submissions" USING btree ("source");--> statement-breakpoint
CREATE INDEX "laylo_signups_contact_id_idx" ON "laylo_signups" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "laylo_signups_form_submission_id_idx" ON "laylo_signups" USING btree ("form_submission_id");--> statement-breakpoint
CREATE INDEX "manychat_leads_contact_id_idx" ON "manychat_leads" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "manychat_leads_subscriber_id_idx" ON "manychat_leads" USING btree ("manychat_subscriber_id");--> statement-breakpoint
CREATE INDEX "posh_buyers_contact_id_idx" ON "posh_buyers" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "posh_buyers_event_id_idx" ON "posh_buyers" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "posh_buyers_order_id_idx" ON "posh_buyers" USING btree ("posh_order_id");--> statement-breakpoint
CREATE INDEX "sponsor_leads_contact_id_idx" ON "sponsor_leads" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "sponsor_leads_form_submission_id_idx" ON "sponsor_leads" USING btree ("form_submission_id");--> statement-breakpoint
CREATE INDEX "utm_sources_contact_id_idx" ON "utm_sources" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "utm_sources_campaign_id_idx" ON "utm_sources" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "utm_sources_source_idx" ON "utm_sources" USING btree ("source");--> statement-breakpoint
CREATE INDEX "utm_sources_session_id_idx" ON "utm_sources" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "vip_leads_contact_id_idx" ON "vip_leads" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "vip_leads_form_submission_id_idx" ON "vip_leads" USING btree ("form_submission_id");
