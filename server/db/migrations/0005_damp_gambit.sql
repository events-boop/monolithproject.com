CREATE TABLE "ambassador_leads" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_id" text,
	"instagram_handle" text,
	"city" text,
	"school_or_company" text,
	"estimated_reach" text,
	"promotion_method" text,
	"referral_code" text,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_event_interest" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_id" text,
	"anonymous_session_id" text,
	"event_slug" text NOT NULL,
	"event_date" text,
	"interest_type" text NOT NULL,
	"source" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_engagement" (
	"id" text PRIMARY KEY NOT NULL,
	"content_id" text NOT NULL,
	"content_type" text NOT NULL,
	"title" text,
	"platform" text,
	"clicked_from" text,
	"contact_id" text,
	"anonymous_session_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "funnel_page_views" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_id" text,
	"anonymous_session_id" text,
	"page_path" text NOT NULL,
	"event_slug" text,
	"source" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"utm_content" text,
	"utm_term" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "link_clicks" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_id" text,
	"anonymous_session_id" text,
	"button_name" text NOT NULL,
	"destination_url" text NOT NULL,
	"page_path" text NOT NULL,
	"event_slug" text,
	"interest_type" text,
	"channel" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"utm_content" text,
	"utm_term" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partner_leads" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_id" text,
	"company_name" text,
	"role" text,
	"city" text,
	"venue_or_brand" text,
	"collaboration_type" text,
	"budget_range" text,
	"message" text,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_orders" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_id" text,
	"event_slug" text NOT NULL,
	"posh_order_id" text,
	"ticket_type" text,
	"quantity" integer DEFAULT 1 NOT NULL,
	"gross_revenue" integer DEFAULT 0 NOT NULL,
	"fees" integer DEFAULT 0 NOT NULL,
	"net_revenue" integer DEFAULT 0 NOT NULL,
	"promo_code" text,
	"utm_source" text,
	"utm_campaign" text,
	"purchased_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"raw_payload" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "state" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "source_first_seen" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "utm_source" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "utm_medium" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "utm_campaign" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "utm_content" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "utm_term" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "tags" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "laylo_signups" ADD COLUMN "laylo_user_id" text;--> statement-breakpoint
ALTER TABLE "laylo_signups" ADD COLUMN "drop_name" text;--> statement-breakpoint
ALTER TABLE "laylo_signups" ADD COLUMN "drop_slug" text;--> statement-breakpoint
ALTER TABLE "laylo_signups" ADD COLUMN "signup_channel" text;--> statement-breakpoint
ALTER TABLE "laylo_signups" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "laylo_signups" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "laylo_signups" ADD COLUMN "instagram_handle" text;--> statement-breakpoint
ALTER TABLE "laylo_signups" ADD COLUMN "utm_source" text;--> statement-breakpoint
ALTER TABLE "laylo_signups" ADD COLUMN "utm_campaign" text;--> statement-breakpoint
ALTER TABLE "vip_leads" ADD COLUMN "event_slug" text;--> statement-breakpoint
ALTER TABLE "vip_leads" ADD COLUMN "budget_range" text;--> statement-breakpoint
ALTER TABLE "vip_leads" ADD COLUMN "celebration_type" text;--> statement-breakpoint
ALTER TABLE "vip_leads" ADD COLUMN "preferred_date" text;--> statement-breakpoint
ALTER TABLE "vip_leads" ADD COLUMN "message" text;--> statement-breakpoint
ALTER TABLE "ambassador_leads" ADD CONSTRAINT "ambassador_leads_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_event_interest" ADD CONSTRAINT "contact_event_interest_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_engagement" ADD CONSTRAINT "content_engagement_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "funnel_page_views" ADD CONSTRAINT "funnel_page_views_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "link_clicks" ADD CONSTRAINT "link_clicks_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_leads" ADD CONSTRAINT "partner_leads_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_orders" ADD CONSTRAINT "ticket_orders_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ambassador_leads_contact_id_idx" ON "ambassador_leads" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "ambassador_leads_referral_code_idx" ON "ambassador_leads" USING btree ("referral_code");--> statement-breakpoint
CREATE INDEX "ambassador_leads_status_idx" ON "ambassador_leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "contact_event_interest_contact_id_idx" ON "contact_event_interest" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "contact_event_interest_anonymous_session_id_idx" ON "contact_event_interest" USING btree ("anonymous_session_id");--> statement-breakpoint
CREATE INDEX "contact_event_interest_event_slug_idx" ON "contact_event_interest" USING btree ("event_slug");--> statement-breakpoint
CREATE INDEX "contact_event_interest_interest_type_idx" ON "contact_event_interest" USING btree ("interest_type");--> statement-breakpoint
CREATE INDEX "content_engagement_content_idx" ON "content_engagement" USING btree ("content_id");--> statement-breakpoint
CREATE INDEX "content_engagement_content_type_idx" ON "content_engagement" USING btree ("content_type");--> statement-breakpoint
CREATE INDEX "content_engagement_contact_id_idx" ON "content_engagement" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "content_engagement_anonymous_session_id_idx" ON "content_engagement" USING btree ("anonymous_session_id");--> statement-breakpoint
CREATE INDEX "funnel_page_views_contact_id_idx" ON "funnel_page_views" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "funnel_page_views_anonymous_session_id_idx" ON "funnel_page_views" USING btree ("anonymous_session_id");--> statement-breakpoint
CREATE INDEX "funnel_page_views_page_path_idx" ON "funnel_page_views" USING btree ("page_path");--> statement-breakpoint
CREATE INDEX "funnel_page_views_event_slug_idx" ON "funnel_page_views" USING btree ("event_slug");--> statement-breakpoint
CREATE INDEX "funnel_page_views_utm_source_idx" ON "funnel_page_views" USING btree ("utm_source");--> statement-breakpoint
CREATE INDEX "link_clicks_contact_id_idx" ON "link_clicks" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "link_clicks_anonymous_session_id_idx" ON "link_clicks" USING btree ("anonymous_session_id");--> statement-breakpoint
CREATE INDEX "link_clicks_button_name_idx" ON "link_clicks" USING btree ("button_name");--> statement-breakpoint
CREATE INDEX "link_clicks_event_slug_idx" ON "link_clicks" USING btree ("event_slug");--> statement-breakpoint
CREATE INDEX "link_clicks_interest_type_idx" ON "link_clicks" USING btree ("interest_type");--> statement-breakpoint
CREATE INDEX "link_clicks_utm_source_idx" ON "link_clicks" USING btree ("utm_source");--> statement-breakpoint
CREATE INDEX "partner_leads_contact_id_idx" ON "partner_leads" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "partner_leads_status_idx" ON "partner_leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "partner_leads_collaboration_type_idx" ON "partner_leads" USING btree ("collaboration_type");--> statement-breakpoint
CREATE INDEX "ticket_orders_contact_id_idx" ON "ticket_orders" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "ticket_orders_event_slug_idx" ON "ticket_orders" USING btree ("event_slug");--> statement-breakpoint
CREATE INDEX "ticket_orders_posh_order_id_idx" ON "ticket_orders" USING btree ("posh_order_id");--> statement-breakpoint
CREATE INDEX "ticket_orders_utm_source_idx" ON "ticket_orders" USING btree ("utm_source");--> statement-breakpoint
CREATE INDEX "laylo_signups_laylo_user_id_idx" ON "laylo_signups" USING btree ("laylo_user_id");--> statement-breakpoint
CREATE INDEX "laylo_signups_drop_slug_idx" ON "laylo_signups" USING btree ("drop_slug");--> statement-breakpoint
CREATE INDEX "vip_leads_event_slug_idx" ON "vip_leads" USING btree ("event_slug");--> statement-breakpoint
CREATE INDEX "vip_leads_status_idx" ON "vip_leads" USING btree ("status");