/**
 * ============================================================================
 * MONOLITH CRM — DATABASE SCHEMA
 * ============================================================================
 *
 * ARCHITECTURE: Contacts-Centric Fan-Out Model
 * The `contacts` table is the central CRM entity — a unified person record
 * deduplicated by normalized email. Every lead, submission, purchase, click,
 * and signup fans OUT from contacts via `contactId` foreign keys. This design
 * means you can trace a single contact's full journey: what forms they filled,
 * which events they RSVP'd to, what tickets they bought, which links they
 * clicked, and what platform syncs succeeded or failed — all from one ID.
 *
 * `events` vs `scheduledEvents`:
 * - `events`        — Internal/template event definitions (metadata, series,
 *                     slug); lightweight and used as FK targets by fan-out
 *                     tables (formSubmissions, poshBuyers, vipLeads, etc.).
 * - `scheduledEvents` — Public-facing, published upcoming events with full
 *                     detail (lineup, ticket tiers, FAQs, funnels, description).
 *                     This is the "show page" data. The two tables are NOT
 *                     directly joined; fan-out tables may reference either.
 *
 * `entityEmbeddings` — pgvector Semantic Pipeline:
 * Stores 1536-dimension OpenAI embeddings for any CRM entity (contacts, form
 * submissions, etc.). Enables cosine-similarity semantic search via the HNSW
 * index. The `entityType`/`entityId` pattern allows embedding any record type
 * without adding vector columns to every table.
 *
 * JSONB `metadata` / `rawPayload` Pattern:
 * Nearly every table carries a `metadata` (structured) or `rawPayload` (source
 * snapshot) JSONB column. This provides schema flexibility: new providers,
 * event types, and campaign attributes can be ingested immediately without
 * migrations, while the relational core stays stable.
 * ============================================================================
 */

import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  vector,
} from "drizzle-orm/pg-core";

/**
 * rate_limit_buckets — Token-bucket rate limiter backing store.
 * Standalone utility table (not part of the CRM model). Each row tracks
 * remaining tokens (`count`) and the next reset window (`resetAt`) for a
 * rate-limit key (IP, user ID, or endpoint combo).
 */
export const rateLimitBuckets = pgTable("rate_limit_buckets", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  resetAt: timestamp("reset_at", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

/**
 * social_echo_event_stats — Cached aggregate RSVP counts per SocialEcho event.
 * Standalone cache table updated by SocialEcho webhooks. `goingCount` and
 * `pendingCount` power attendee counters on event pages.
 */
export const socialEchoEventStats = pgTable("social_echo_event_stats", {
  eventKey: text("event_key").primaryKey(),
  eventId: text("event_id"),
  eventTitle: text("event_title"),
  city: text("city"),
  goingCount: integer("going_count").notNull().default(0),
  pendingCount: integer("pending_count").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

/**
 * social_echo_activity — Individual RSVP/check-in events from SocialEcho.
 * Append-only activity log. `rawPayload` captures the full webhook body for
 * replay/debug. Not linked to contacts (anonymized attendee aliases only).
 */
export const socialEchoActivity = pgTable("social_echo_activity", {
  id: text("id").primaryKey(),
  at: timestamp("at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
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

/**
 * leads — Raw top-of-funnel lead capture BEFORE deduplication/merge into
 * contacts. Ingested from providers (ManyChat, Laylo, forms, etc.). Once
 * a lead is resolved to an existing or new contact, downstream fan-out
 * tables use `contactId`; leads are the "inbox" before CRM unification.
 */
export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  source: text("source"),
  provider: text("provider"),
  providerStatus: text("provider_status"), // 'success' | 'failed'
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  metadata: jsonb("metadata").notNull().default({}),
});

/**
 * contacts — THE CENTRAL CRM ENTITY. Every person who interacts with the
 * Monolith ecosystem is unified here by `emailNormalized`. All fan-out
 * tables (formSubmissions, ticketOrders, linkClicks, vipLeads, etc.)
 * reference `contacts.id` — this is the hub of the entire data model.
 *
 * Key columns:
 * - `emailNormalized` — unique, lowercased/trimmed email for dedup.
 * - `primarySource`   — first known acquisition channel.
 * - `tags`            — JSONB array for flexible segmentation.
 * - `consentEmail` / `consentSms` — GDPR/TCF compliance flags.
 */
export const contacts = pgTable(
  "contacts",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    emailNormalized: text("email_normalized").notNull(),
    phone: text("phone"),
    firstName: text("first_name"),
    lastName: text("last_name"),
    instagramHandle: text("instagram_handle"),
    city: text("city"),
    state: text("state"),
    primarySource: text("primary_source"),
    sourceFirstSeen: text("source_first_seen"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmContent: text("utm_content"),
    utmTerm: text("utm_term"),
    firstSeenAt: timestamp("first_seen_at", {
      withTimezone: true,
      mode: "string",
    })
      .notNull()
      .defaultNow(),
    lastSeenAt: timestamp("last_seen_at", {
      withTimezone: true,
      mode: "string",
    })
      .notNull()
      .defaultNow(),
    consentEmail: boolean("consent_email").notNull().default(false),
    consentSms: boolean("consent_sms").notNull().default(false),
    tags: jsonb("tags").notNull().default([]),
    metadata: jsonb("metadata").notNull().default({}),
  },
  table => ({
    emailNormalizedIdx: uniqueIndex("contacts_email_normalized_idx").on(
      table.emailNormalized
    ),
    primarySourceIdx: index("contacts_primary_source_idx").on(
      table.primarySource
    ),
  })
);

/**
 * events — Internal event definitions used as FK targets by fan-out tables
 * (formSubmissions, poshBuyers, vipLeads, etc.). Stores core metadata
 * (slug, venue, series, status). For public-facing event detail with lineup,
 * ticket tiers, and FAQs see `scheduledEvents`.
 */
export const events = pgTable(
  "events",
  {
    id: text("id").primaryKey(),
    externalId: text("external_id"),
    series: text("series"),
    title: text("title").notNull(),
    slug: text("slug"),
    startsAt: timestamp("starts_at", { withTimezone: true, mode: "string" }),
    venue: text("venue"),
    city: text("city"),
    status: text("status"),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  table => ({
    slugIdx: uniqueIndex("events_slug_idx").on(table.slug),
    seriesIdx: index("events_series_idx").on(table.series),
    startsAtIdx: index("events_starts_at_idx").on(table.startsAt),
  })
);

/**
 * campaigns — Marketing campaign definitions. Maps campaign keys to sources,
 * mediums, and platforms. Referenced by `utm_sources` (for attribution) and
 * `form_submissions` (to credit which campaign drove the conversion).
 */
export const campaigns = pgTable(
  "campaigns",
  {
    id: text("id").primaryKey(),
    key: text("key").notNull(),
    name: text("name").notNull(),
    source: text("source"),
    medium: text("medium"),
    platform: text("platform"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  table => ({
    keyIdx: uniqueIndex("campaigns_key_idx").on(table.key),
    sourceIdx: index("campaigns_source_idx").on(table.source),
  })
);

/**
 * utm_sources — UTM attribution log, one row per touchpoint. Fans out from
 * `contacts` (who) and `campaigns` (which campaign). Captures full UTM params,
 * click IDs (gclid/fbclid), referrer, and landing page — the source of truth
 * for multi-touch marketing attribution.
 */
export const utmSources = pgTable(
  "utm_sources",
  {
    id: text("id").primaryKey(),
    contactId: text("contact_id").references(() => contacts.id),
    campaignId: text("campaign_id").references(() => campaigns.id),
    sessionId: text("session_id"),
    source: text("source"),
    medium: text("medium"),
    campaign: text("campaign"),
    term: text("term"),
    content: text("content"),
    gclid: text("gclid"),
    fbclid: text("fbclid"),
    ttclid: text("ttclid"),
    msclkid: text("msclkid"),
    pagePath: text("page_path"),
    pageUrl: text("page_url"),
    landingPageUrl: text("landing_page_url"),
    referrer: text("referrer"),
    referrerDomain: text("referrer_domain"),
    firstTouchAt: timestamp("first_touch_at", {
      withTimezone: true,
      mode: "string",
    }),
    lastTouchAt: timestamp("last_touch_at", {
      withTimezone: true,
      mode: "string",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    rawPayload: jsonb("raw_payload").notNull().default({}),
  },
  table => ({
    contactIdx: index("utm_sources_contact_id_idx").on(table.contactId),
    campaignIdx: index("utm_sources_campaign_id_idx").on(table.campaignId),
    sourceIdx: index("utm_sources_source_idx").on(table.source),
    sessionIdx: index("utm_sources_session_id_idx").on(table.sessionId),
  })
);

/**
 * form_submissions — Every form submission across the site (newsletter, VIP,
 * sponsor, ambassador, contact, etc.). Fans out from `contacts` (submitter),
 * `events` (which event), and `campaigns` (attribution). `formType`
 * discriminates the submission type; `rawPayload` stores the full POST body.
 */
export const formSubmissions = pgTable(
  "form_submissions",
  {
    id: text("id").primaryKey(),
    contactId: text("contact_id").references(() => contacts.id),
    eventId: text("event_id").references(() => events.id),
    campaignId: text("campaign_id").references(() => campaigns.id),
    submissionKey: text("submission_key"),
    formType: text("form_type").notNull(),
    source: text("source"),
    pagePath: text("page_path"),
    pageUrl: text("page_url"),
    eventInterest: text("event_interest"),
    eventSeries: text("event_series"),
    eventTitle: text("event_title"),
    provider: text("provider"),
    providerStatus: text("provider_status").notNull().default("pending"),
    sessionId: text("session_id"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    rawPayload: jsonb("raw_payload").notNull().default({}),
  },
  table => ({
    submissionKeyIdx: uniqueIndex("form_submissions_submission_key_idx").on(
      table.submissionKey
    ),
    contactIdx: index("form_submissions_contact_id_idx").on(table.contactId),
    eventIdx: index("form_submissions_event_id_idx").on(table.eventId),
    formTypeIdx: index("form_submissions_form_type_idx").on(table.formType),
    sourceIdx: index("form_submissions_source_idx").on(table.source),
  })
);

/**
 * contact_event_interest — Pre-registration event interest signals. Fans out
 * from `contacts`. Records which event slug a contact expressed interest in,
 * the type/level of interest, and the source. Supports anonymous sessions
 * (`anonymousSessionId`) before contact identification.
 */
export const contactEventInterest = pgTable(
  "contact_event_interest",
  {
    id: text("id").primaryKey(),
    contactId: text("contact_id").references(() => contacts.id),
    anonymousSessionId: text("anonymous_session_id"),
    eventSlug: text("event_slug").notNull(),
    eventDate: text("event_date"),
    interestType: text("interest_type").notNull(),
    source: text("source"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  table => ({
    contactIdx: index("contact_event_interest_contact_id_idx").on(
      table.contactId
    ),
    anonymousSessionIdx: index(
      "contact_event_interest_anonymous_session_id_idx"
    ).on(table.anonymousSessionId),
    eventSlugIdx: index("contact_event_interest_event_slug_idx").on(
      table.eventSlug
    ),
    interestTypeIdx: index("contact_event_interest_interest_type_idx").on(
      table.interestType
    ),
  })
);

/**
 * link_clicks — Tracks every CTA/link click across the funnel. Fans out from
 * `contacts`. Stores `buttonName`, `destinationUrl`, `eventSlug`, and full UTM
 * params. Supports anonymous sessions. Powers conversion-path analysis and
 * click-through-rate reporting per event, channel, and campaign.
 */
export const linkClicks = pgTable(
  "link_clicks",
  {
    id: text("id").primaryKey(),
    contactId: text("contact_id").references(() => contacts.id),
    anonymousSessionId: text("anonymous_session_id"),
    buttonName: text("button_name").notNull(),
    destinationUrl: text("destination_url").notNull(),
    pagePath: text("page_path").notNull(),
    eventSlug: text("event_slug"),
    interestType: text("interest_type"),
    channel: text("channel"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmContent: text("utm_content"),
    utmTerm: text("utm_term"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  table => ({
    contactIdx: index("link_clicks_contact_id_idx").on(table.contactId),
    anonymousSessionIdx: index("link_clicks_anonymous_session_id_idx").on(
      table.anonymousSessionId
    ),
    buttonNameIdx: index("link_clicks_button_name_idx").on(table.buttonName),
    eventSlugIdx: index("link_clicks_event_slug_idx").on(table.eventSlug),
    interestTypeIdx: index("link_clicks_interest_type_idx").on(
      table.interestType
    ),
    sourceIdx: index("link_clicks_utm_source_idx").on(table.utmSource),
  })
);

/**
 * laylo_signups — Laylo drop signups (SMS/email notification opt-ins). Fans
 * out from `contacts`, `formSubmissions`, and `events`. Tracks the Laylo
 * user ID, drop slug, signup channel, and sync status. Bridges the Laylo
 * platform to the CRM for unified contact profiles.
 */
export const layloSignups = pgTable(
  "laylo_signups",
  {
    id: text("id").primaryKey(),
    contactId: text("contact_id").references(() => contacts.id),
    formSubmissionId: text("form_submission_id").references(
      () => formSubmissions.id
    ),
    eventId: text("event_id").references(() => events.id),
    layloUserId: text("laylo_user_id"),
    dropName: text("drop_name"),
    dropSlug: text("drop_slug"),
    signupChannel: text("signup_channel"),
    phone: text("phone"),
    email: text("email"),
    instagramHandle: text("instagram_handle"),
    utmSource: text("utm_source"),
    utmCampaign: text("utm_campaign"),
    layloUrl: text("laylo_url"),
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  table => ({
    contactIdx: index("laylo_signups_contact_id_idx").on(table.contactId),
    submissionIdx: index("laylo_signups_form_submission_id_idx").on(
      table.formSubmissionId
    ),
    layloUserIdx: index("laylo_signups_laylo_user_id_idx").on(
      table.layloUserId
    ),
    dropSlugIdx: index("laylo_signups_drop_slug_idx").on(table.dropSlug),
  })
);

/**
 * manychat_leads — ManyChat (Instagram DM automation) lead captures. Fans out
 * from `contacts` and `formSubmissions`. Stores the ManyChat subscriber ID
 * and flow ID for tracking Instagram DM leads back to contacts and campaigns.
 */
export const manychatLeads = pgTable(
  "manychat_leads",
  {
    id: text("id").primaryKey(),
    contactId: text("contact_id").references(() => contacts.id),
    formSubmissionId: text("form_submission_id").references(
      () => formSubmissions.id
    ),
    manychatSubscriberId: text("manychat_subscriber_id"),
    flowId: text("flow_id"),
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  table => ({
    contactIdx: index("manychat_leads_contact_id_idx").on(table.contactId),
    subscriberIdx: index("manychat_leads_subscriber_id_idx").on(
      table.manychatSubscriberId
    ),
  })
);

/**
 * posh_buyers — Ticket purchases from the Posh platform. Fans out from
 * `contacts` and `events`. Tracks order ID, ticket type, quantity, and
 * amount. `rawPayload` preserves the full Posh webhook for reconciliation.
 */
export const poshBuyers = pgTable(
  "posh_buyers",
  {
    id: text("id").primaryKey(),
    contactId: text("contact_id").references(() => contacts.id),
    eventId: text("event_id").references(() => events.id),
    poshOrderId: text("posh_order_id"),
    poshTicketId: text("posh_ticket_id"),
    ticketType: text("ticket_type"),
    quantity: integer("quantity").notNull().default(1),
    amountCents: integer("amount_cents"),
    currency: text("currency").notNull().default("USD"),
    purchasedAt: timestamp("purchased_at", {
      withTimezone: true,
      mode: "string",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    rawPayload: jsonb("raw_payload").notNull().default({}),
  },
  table => ({
    contactIdx: index("posh_buyers_contact_id_idx").on(table.contactId),
    eventIdx: index("posh_buyers_event_id_idx").on(table.eventId),
    orderIdx: index("posh_buyers_order_id_idx").on(table.poshOrderId),
  })
);

/**
 * ticket_orders — Normalized ticket order records (cross-platform). Fans out
 * from `contacts`. Breaks out gross/net revenue, fees, promo codes, and UTM
 * attribution. This is the analytics-ready revenue table — `posh_buyers` is
 * the raw platform-specific counterpart.
 */
export const ticketOrders = pgTable(
  "ticket_orders",
  {
    id: text("id").primaryKey(),
    contactId: text("contact_id").references(() => contacts.id),
    eventSlug: text("event_slug").notNull(),
    poshOrderId: text("posh_order_id"),
    ticketType: text("ticket_type"),
    quantity: integer("quantity").notNull().default(1),
    grossRevenue: integer("gross_revenue").notNull().default(0),
    fees: integer("fees").notNull().default(0),
    netRevenue: integer("net_revenue").notNull().default(0),
    promoCode: text("promo_code"),
    utmSource: text("utm_source"),
    utmCampaign: text("utm_campaign"),
    purchasedAt: timestamp("purchased_at", {
      withTimezone: true,
      mode: "string",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    rawPayload: jsonb("raw_payload").notNull().default({}),
  },
  table => ({
    contactIdx: index("ticket_orders_contact_id_idx").on(table.contactId),
    eventSlugIdx: index("ticket_orders_event_slug_idx").on(table.eventSlug),
    orderIdx: index("ticket_orders_posh_order_id_idx").on(table.poshOrderId),
    sourceIdx: index("ticket_orders_utm_source_idx").on(table.utmSource),
  })
);

/**
 * funnel_page_views — Page-view tracking across the marketing/sales funnel.
 * Fans out from `contacts`. Records `pagePath`, `eventSlug`, UTM params.
 * Supports anonymous sessions. Used for funnel drop-off analysis and
 * multi-touch attribution modeling.
 */
export const funnelPageViews = pgTable(
  "funnel_page_views",
  {
    id: text("id").primaryKey(),
    contactId: text("contact_id").references(() => contacts.id),
    anonymousSessionId: text("anonymous_session_id"),
    pagePath: text("page_path").notNull(),
    eventSlug: text("event_slug"),
    source: text("source"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmContent: text("utm_content"),
    utmTerm: text("utm_term"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  table => ({
    contactIdx: index("funnel_page_views_contact_id_idx").on(table.contactId),
    anonymousSessionIdx: index("funnel_page_views_anonymous_session_id_idx").on(
      table.anonymousSessionId
    ),
    pagePathIdx: index("funnel_page_views_page_path_idx").on(table.pagePath),
    eventSlugIdx: index("funnel_page_views_event_slug_idx").on(table.eventSlug),
    sourceIdx: index("funnel_page_views_utm_source_idx").on(table.utmSource),
  })
);

/**
 * vip_leads — VIP/table-service inquiry leads. Fans out from `contacts`,
 * `formSubmissions`, and `events`. Captures group size, budget, celebration
 * type, and preferred date. Status tracks pipeline stages: new → contacted →
 * qualified → converted.
 */
export const vipLeads = pgTable(
  "vip_leads",
  {
    id: text("id").primaryKey(),
    contactId: text("contact_id").references(() => contacts.id),
    formSubmissionId: text("form_submission_id").references(
      () => formSubmissions.id
    ),
    eventId: text("event_id").references(() => events.id),
    eventSlug: text("event_slug"),
    groupSize: integer("group_size"),
    budget: text("budget"),
    budgetRange: text("budget_range"),
    celebrationType: text("celebration_type"),
    preferredDate: text("preferred_date"),
    requestedDate: text("requested_date"),
    message: text("message"),
    status: text("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  table => ({
    contactIdx: index("vip_leads_contact_id_idx").on(table.contactId),
    submissionIdx: index("vip_leads_form_submission_id_idx").on(
      table.formSubmissionId
    ),
    eventSlugIdx: index("vip_leads_event_slug_idx").on(table.eventSlug),
    statusIdx: index("vip_leads_status_idx").on(table.status),
  })
);

/**
 * sponsor_leads — Sponsorship inquiry leads. Fans out from `contacts` and
 * `formSubmissions`. Captures company name, sponsorship type, and budget.
 * Status tracks the sponsorship sales pipeline.
 */
export const sponsorLeads = pgTable(
  "sponsor_leads",
  {
    id: text("id").primaryKey(),
    contactId: text("contact_id").references(() => contacts.id),
    formSubmissionId: text("form_submission_id").references(
      () => formSubmissions.id
    ),
    company: text("company"),
    sponsorshipType: text("sponsorship_type"),
    budget: text("budget"),
    status: text("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  table => ({
    contactIdx: index("sponsor_leads_contact_id_idx").on(table.contactId),
    submissionIdx: index("sponsor_leads_form_submission_id_idx").on(
      table.formSubmissionId
    ),
  })
);

/**
 * ambassador_leads — Ambassador/referral program signups. Fans out from
 * `contacts`. Captures Instagram handle, estimated reach, promotion method,
 * and referral code. Status tracks ambassador onboarding pipeline.
 */
export const ambassadorLeads = pgTable(
  "ambassador_leads",
  {
    id: text("id").primaryKey(),
    contactId: text("contact_id").references(() => contacts.id),
    instagramHandle: text("instagram_handle"),
    city: text("city"),
    schoolOrCompany: text("school_or_company"),
    estimatedReach: text("estimated_reach"),
    promotionMethod: text("promotion_method"),
    referralCode: text("referral_code"),
    status: text("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  table => ({
    contactIdx: index("ambassador_leads_contact_id_idx").on(table.contactId),
    referralCodeIdx: index("ambassador_leads_referral_code_idx").on(
      table.referralCode
    ),
    statusIdx: index("ambassador_leads_status_idx").on(table.status),
  })
);

/**
 * partner_leads — Partnership/collaboration inquiry leads. Fans out from
 * `contacts`. Captures company name, venue/brand, collaboration type, and
 * budget range. Status tracks the partnership pipeline stages.
 */
export const partnerLeads = pgTable(
  "partner_leads",
  {
    id: text("id").primaryKey(),
    contactId: text("contact_id").references(() => contacts.id),
    companyName: text("company_name"),
    role: text("role"),
    city: text("city"),
    venueOrBrand: text("venue_or_brand"),
    collaborationType: text("collaboration_type"),
    budgetRange: text("budget_range"),
    message: text("message"),
    status: text("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  table => ({
    contactIdx: index("partner_leads_contact_id_idx").on(table.contactId),
    statusIdx: index("partner_leads_status_idx").on(table.status),
    collaborationTypeIdx: index("partner_leads_collaboration_type_idx").on(
      table.collaborationType
    ),
  })
);

/**
 * content_engagement — Tracks interactions with content (articles, videos,
 * social posts, playlists). Fans out from `contacts`. `contentType`
 * discriminates the content format; `clickedFrom` records the UI placement.
 * Supports anonymous sessions. Powers content-performance reporting.
 */
export const contentEngagement = pgTable(
  "content_engagement",
  {
    id: text("id").primaryKey(),
    contentId: text("content_id").notNull(),
    contentType: text("content_type").notNull(),
    title: text("title"),
    platform: text("platform"),
    clickedFrom: text("clicked_from"),
    contactId: text("contact_id").references(() => contacts.id),
    anonymousSessionId: text("anonymous_session_id"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  table => ({
    contentIdx: index("content_engagement_content_idx").on(table.contentId),
    contentTypeIdx: index("content_engagement_content_type_idx").on(
      table.contentType
    ),
    contactIdx: index("content_engagement_contact_id_idx").on(table.contactId),
    anonymousSessionIdx: index(
      "content_engagement_anonymous_session_id_idx"
    ).on(table.anonymousSessionId),
  })
);

/**
 * artist_agent_contacts — Artist booking / agent contact leads. Fans out from
 * `contacts` and `formSubmissions`. Captures artist name, agency, and role.
 * Status tracks the booking pipeline.
 */
export const artistAgentContacts = pgTable(
  "artist_agent_contacts",
  {
    id: text("id").primaryKey(),
    contactId: text("contact_id").references(() => contacts.id),
    formSubmissionId: text("form_submission_id").references(
      () => formSubmissions.id
    ),
    artistName: text("artist_name"),
    agency: text("agency"),
    role: text("role"),
    status: text("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  table => ({
    contactIdx: index("artist_agent_contacts_contact_id_idx").on(
      table.contactId
    ),
    submissionIdx: index("artist_agent_contacts_form_submission_id_idx").on(
      table.formSubmissionId
    ),
  })
);

/**
 * email_platform_sync_status — Tracks sync status of contacts to external
 * email/SMS platforms (Mailchimp, SendGrid, etc.). Fans out from `contacts`
 * and `formSubmissions`. Records the platform, provider contact ID, last sync
 * timestamp, and error message for debugging failed syncs.
 */
export const emailPlatformSyncStatus = pgTable(
  "email_platform_sync_status",
  {
    id: text("id").primaryKey(),
    contactId: text("contact_id").references(() => contacts.id),
    formSubmissionId: text("form_submission_id").references(
      () => formSubmissions.id
    ),
    platform: text("platform").notNull(),
    status: text("status").notNull().default("pending"),
    providerContactId: text("provider_contact_id"),
    lastSyncedAt: timestamp("last_synced_at", {
      withTimezone: true,
      mode: "string",
    }),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  table => ({
    contactIdx: index("email_platform_sync_status_contact_id_idx").on(
      table.contactId
    ),
    submissionIdx: index(
      "email_platform_sync_status_form_submission_id_idx"
    ).on(table.formSubmissionId),
    platformIdx: index("email_platform_sync_status_platform_idx").on(
      table.platform
    ),
  })
);

/**
 * entity_embeddings — pgvector semantic search pipeline. Stores 1536-dim
 * OpenAI embeddings for any CRM entity (contacts, form submissions, events,
 * etc.) keyed by `entityType` + `entityId`. Uses an HNSW index with cosine
 * distance for fast approximate nearest-neighbor search. Enables semantic
 * queries (e.g., "all VIP leads interested in table service in Miami")
 * without adding vector columns to every table.
 */
export const entityEmbeddings = pgTable(
  "entity_embeddings",
  {
    id: text("id").primaryKey(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    contactId: text("contact_id").references(() => contacts.id),
    formSubmissionId: text("form_submission_id").references(
      () => formSubmissions.id
    ),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
    embeddingModel: text("embedding_model")
      .notNull()
      .default("text-embedding-3-small"),
    dimensions: integer("dimensions").notNull().default(1536),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  table => ({
    entityIdx: index("entity_embeddings_entity_idx").on(
      table.entityType,
      table.entityId
    ),
    contactIdx: index("entity_embeddings_contact_id_idx").on(table.contactId),
    submissionIdx: index("entity_embeddings_form_submission_id_idx").on(
      table.formSubmissionId
    ),
    embeddingIdx: index("entity_embeddings_embedding_hnsw_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  })
);

/**
 * ticket_intents — Pre-purchase ticket intent signals (e.g., "Get Tickets"
 * button clicks before a conversion is recorded). Lightweight intent log;
 * once a purchase completes, the `ticket_orders` table records the
 * realized revenue. Standalone table (not FK'd to contacts) by design —
 * intents are often anonymous.
 */
export const ticketIntents = pgTable("ticket_intents", {
  id: text("id").primaryKey(),
  source: text("source").notNull(),
  eventId: text("event_id"),
  sessionId: text("session_id"),
  destinationUrl: text("destination_url"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  metadata: jsonb("metadata").notNull().default({}),
});

/**
 * contact_submissions — General "Contact Us" form submissions. Standalone
 * table (no FK to contacts) — these are one-off support/contact requests
 * routed to external systems via webhook. `webhookStatus` tracks delivery.
 */
export const contactSubmissions = pgTable("contact_submissions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  webhookStatus: text("webhook_status").notNull().default("pending"), // 'pending' | 'success' | 'failed'
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  metadata: jsonb("metadata").notNull().default({}),
});

/**
 * booking_inquiries — Artist booking, sponsorship, and partnership inquiry
 * form submissions. Standalone table (no FK to contacts). Routed via webhook
 * to the booking team. `type` discriminates: partner-on-location,
 * artist-booking, sponsorship, or general.
 */
export const bookingInquiries = pgTable("booking_inquiries", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  entity: text("entity").notNull(),
  type: text("type").notNull(), // 'partner-on-location' | 'artist-booking' | 'sponsorship' | 'general'
  location: text("location"),
  message: text("message").notNull(),
  webhookStatus: text("webhook_status").notNull().default("pending"), // 'pending' | 'success' | 'failed'
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  metadata: jsonb("metadata").notNull().default({}),
});

/**
 * scheduled_events — Public-facing published event instances with full detail.
 * This is the "show page" table: lineup, ticket tiers, FAQs, venue info,
 * active funnels, dress code, and more. Distinct from the lightweight
 * `events` table (which serves as an internal FK target). Indexed by series,
 * status, slug, and start date for fast public-facing queries.
 */
export const scheduledEvents = pgTable(
  "scheduled_events",
  {
    id: text("id").primaryKey(),
    series: text("series").notNull(), // 'chasing-sunsets' | 'untold-story' | 'monolith-project'
    episode: text("episode").notNull(),
    title: text("title").notNull(),
    slug: text("slug"),
    subtitle: text("subtitle"),
    date: text("date").notNull(),
    time: text("time").notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true, mode: "string" }),
    endsAt: timestamp("ends_at", { withTimezone: true, mode: "string" }),
    doors: text("doors"),
    venue: text("venue").notNull(),
    location: text("location").notNull(),
    lineup: text("lineup"),
    image: text("image"),
    status: text("status").notNull(), // 'on-sale' | 'coming-soon' | 'sold-out'
    inventoryState: text("inventory_state"),
    capacity: text("capacity"),
    format: text("format"),
    dress: text("dress"),
    sound: text("sound"),
    description: text("description"),
    age: text("age"),
    ticketUrl: text("ticket_url"),
    startingPrice: integer("starting_price"),
    ticketTiers: jsonb("ticket_tiers").default([]),
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
    recentlyDropped: boolean("recently_dropped").notNull().default(false),
  },
  table => ({
    seriesIdx: index("scheduled_events_series_idx").on(table.series),
    statusIdx: index("scheduled_events_status_idx").on(table.status),
    startsAtIdx: index("scheduled_events_starts_at_idx").on(table.startsAt),
    slugIdx: uniqueIndex("scheduled_events_slug_idx").on(table.slug),
  })
);
