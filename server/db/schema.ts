import { boolean, index, integer, jsonb, pgTable, text, timestamp, uniqueIndex, vector } from "drizzle-orm/pg-core";

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
    firstSeenAt: timestamp("first_seen_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    consentEmail: boolean("consent_email").notNull().default(false),
    consentSms: boolean("consent_sms").notNull().default(false),
    tags: jsonb("tags").notNull().default([]),
    metadata: jsonb("metadata").notNull().default({}),
  },
  (table) => ({
    emailNormalizedIdx: uniqueIndex("contacts_email_normalized_idx").on(table.emailNormalized),
    primarySourceIdx: index("contacts_primary_source_idx").on(table.primarySource),
  }),
);

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
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("events_slug_idx").on(table.slug),
    seriesIdx: index("events_series_idx").on(table.series),
    startsAtIdx: index("events_starts_at_idx").on(table.startsAt),
  }),
);

export const campaigns = pgTable(
  "campaigns",
  {
    id: text("id").primaryKey(),
    key: text("key").notNull(),
    name: text("name").notNull(),
    source: text("source"),
    medium: text("medium"),
    platform: text("platform"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  (table) => ({
    keyIdx: uniqueIndex("campaigns_key_idx").on(table.key),
    sourceIdx: index("campaigns_source_idx").on(table.source),
  }),
);

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
    firstTouchAt: timestamp("first_touch_at", { withTimezone: true, mode: "string" }),
    lastTouchAt: timestamp("last_touch_at", { withTimezone: true, mode: "string" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    rawPayload: jsonb("raw_payload").notNull().default({}),
  },
  (table) => ({
    contactIdx: index("utm_sources_contact_id_idx").on(table.contactId),
    campaignIdx: index("utm_sources_campaign_id_idx").on(table.campaignId),
    sourceIdx: index("utm_sources_source_idx").on(table.source),
    sessionIdx: index("utm_sources_session_id_idx").on(table.sessionId),
  }),
);

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
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    rawPayload: jsonb("raw_payload").notNull().default({}),
  },
  (table) => ({
    submissionKeyIdx: uniqueIndex("form_submissions_submission_key_idx").on(table.submissionKey),
    contactIdx: index("form_submissions_contact_id_idx").on(table.contactId),
    eventIdx: index("form_submissions_event_id_idx").on(table.eventId),
    formTypeIdx: index("form_submissions_form_type_idx").on(table.formType),
    sourceIdx: index("form_submissions_source_idx").on(table.source),
  }),
);

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
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  (table) => ({
    contactIdx: index("contact_event_interest_contact_id_idx").on(table.contactId),
    anonymousSessionIdx: index("contact_event_interest_anonymous_session_id_idx").on(table.anonymousSessionId),
    eventSlugIdx: index("contact_event_interest_event_slug_idx").on(table.eventSlug),
    interestTypeIdx: index("contact_event_interest_interest_type_idx").on(table.interestType),
  }),
);

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
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  (table) => ({
    contactIdx: index("link_clicks_contact_id_idx").on(table.contactId),
    anonymousSessionIdx: index("link_clicks_anonymous_session_id_idx").on(table.anonymousSessionId),
    buttonNameIdx: index("link_clicks_button_name_idx").on(table.buttonName),
    eventSlugIdx: index("link_clicks_event_slug_idx").on(table.eventSlug),
    interestTypeIdx: index("link_clicks_interest_type_idx").on(table.interestType),
    sourceIdx: index("link_clicks_utm_source_idx").on(table.utmSource),
  }),
);

export const layloSignups = pgTable(
  "laylo_signups",
  {
    id: text("id").primaryKey(),
    contactId: text("contact_id").references(() => contacts.id),
    formSubmissionId: text("form_submission_id").references(() => formSubmissions.id),
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
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  (table) => ({
    contactIdx: index("laylo_signups_contact_id_idx").on(table.contactId),
    submissionIdx: index("laylo_signups_form_submission_id_idx").on(table.formSubmissionId),
    layloUserIdx: index("laylo_signups_laylo_user_id_idx").on(table.layloUserId),
    dropSlugIdx: index("laylo_signups_drop_slug_idx").on(table.dropSlug),
  }),
);

export const manychatLeads = pgTable(
  "manychat_leads",
  {
    id: text("id").primaryKey(),
    contactId: text("contact_id").references(() => contacts.id),
    formSubmissionId: text("form_submission_id").references(() => formSubmissions.id),
    manychatSubscriberId: text("manychat_subscriber_id"),
    flowId: text("flow_id"),
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  (table) => ({
    contactIdx: index("manychat_leads_contact_id_idx").on(table.contactId),
    subscriberIdx: index("manychat_leads_subscriber_id_idx").on(table.manychatSubscriberId),
  }),
);

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
    purchasedAt: timestamp("purchased_at", { withTimezone: true, mode: "string" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    rawPayload: jsonb("raw_payload").notNull().default({}),
  },
  (table) => ({
    contactIdx: index("posh_buyers_contact_id_idx").on(table.contactId),
    eventIdx: index("posh_buyers_event_id_idx").on(table.eventId),
    orderIdx: index("posh_buyers_order_id_idx").on(table.poshOrderId),
  }),
);

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
    purchasedAt: timestamp("purchased_at", { withTimezone: true, mode: "string" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    rawPayload: jsonb("raw_payload").notNull().default({}),
  },
  (table) => ({
    contactIdx: index("ticket_orders_contact_id_idx").on(table.contactId),
    eventSlugIdx: index("ticket_orders_event_slug_idx").on(table.eventSlug),
    orderIdx: index("ticket_orders_posh_order_id_idx").on(table.poshOrderId),
    sourceIdx: index("ticket_orders_utm_source_idx").on(table.utmSource),
  }),
);

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
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  (table) => ({
    contactIdx: index("funnel_page_views_contact_id_idx").on(table.contactId),
    anonymousSessionIdx: index("funnel_page_views_anonymous_session_id_idx").on(table.anonymousSessionId),
    pagePathIdx: index("funnel_page_views_page_path_idx").on(table.pagePath),
    eventSlugIdx: index("funnel_page_views_event_slug_idx").on(table.eventSlug),
    sourceIdx: index("funnel_page_views_utm_source_idx").on(table.utmSource),
  }),
);

export const vipLeads = pgTable(
  "vip_leads",
  {
    id: text("id").primaryKey(),
    contactId: text("contact_id").references(() => contacts.id),
    formSubmissionId: text("form_submission_id").references(() => formSubmissions.id),
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
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  (table) => ({
    contactIdx: index("vip_leads_contact_id_idx").on(table.contactId),
    submissionIdx: index("vip_leads_form_submission_id_idx").on(table.formSubmissionId),
    eventSlugIdx: index("vip_leads_event_slug_idx").on(table.eventSlug),
    statusIdx: index("vip_leads_status_idx").on(table.status),
  }),
);

export const sponsorLeads = pgTable(
  "sponsor_leads",
  {
    id: text("id").primaryKey(),
    contactId: text("contact_id").references(() => contacts.id),
    formSubmissionId: text("form_submission_id").references(() => formSubmissions.id),
    company: text("company"),
    sponsorshipType: text("sponsorship_type"),
    budget: text("budget"),
    status: text("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  (table) => ({
    contactIdx: index("sponsor_leads_contact_id_idx").on(table.contactId),
    submissionIdx: index("sponsor_leads_form_submission_id_idx").on(table.formSubmissionId),
  }),
);

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
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  (table) => ({
    contactIdx: index("ambassador_leads_contact_id_idx").on(table.contactId),
    referralCodeIdx: index("ambassador_leads_referral_code_idx").on(table.referralCode),
    statusIdx: index("ambassador_leads_status_idx").on(table.status),
  }),
);

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
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  (table) => ({
    contactIdx: index("partner_leads_contact_id_idx").on(table.contactId),
    statusIdx: index("partner_leads_status_idx").on(table.status),
    collaborationTypeIdx: index("partner_leads_collaboration_type_idx").on(table.collaborationType),
  }),
);

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
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  (table) => ({
    contentIdx: index("content_engagement_content_idx").on(table.contentId),
    contentTypeIdx: index("content_engagement_content_type_idx").on(table.contentType),
    contactIdx: index("content_engagement_contact_id_idx").on(table.contactId),
    anonymousSessionIdx: index("content_engagement_anonymous_session_id_idx").on(table.anonymousSessionId),
  }),
);

export const artistAgentContacts = pgTable(
  "artist_agent_contacts",
  {
    id: text("id").primaryKey(),
    contactId: text("contact_id").references(() => contacts.id),
    formSubmissionId: text("form_submission_id").references(() => formSubmissions.id),
    artistName: text("artist_name"),
    agency: text("agency"),
    role: text("role"),
    status: text("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  (table) => ({
    contactIdx: index("artist_agent_contacts_contact_id_idx").on(table.contactId),
    submissionIdx: index("artist_agent_contacts_form_submission_id_idx").on(table.formSubmissionId),
  }),
);

export const emailPlatformSyncStatus = pgTable(
  "email_platform_sync_status",
  {
    id: text("id").primaryKey(),
    contactId: text("contact_id").references(() => contacts.id),
    formSubmissionId: text("form_submission_id").references(() => formSubmissions.id),
    platform: text("platform").notNull(),
    status: text("status").notNull().default("pending"),
    providerContactId: text("provider_contact_id"),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true, mode: "string" }),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  (table) => ({
    contactIdx: index("email_platform_sync_status_contact_id_idx").on(table.contactId),
    submissionIdx: index("email_platform_sync_status_form_submission_id_idx").on(table.formSubmissionId),
    platformIdx: index("email_platform_sync_status_platform_idx").on(table.platform),
  }),
);

export const entityEmbeddings = pgTable(
  "entity_embeddings",
  {
    id: text("id").primaryKey(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    contactId: text("contact_id").references(() => contacts.id),
    formSubmissionId: text("form_submission_id").references(() => formSubmissions.id),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
    embeddingModel: text("embedding_model").notNull().default("text-embedding-3-small"),
    dimensions: integer("dimensions").notNull().default(1536),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),
  },
  (table) => ({
    entityIdx: index("entity_embeddings_entity_idx").on(table.entityType, table.entityId),
    contactIdx: index("entity_embeddings_contact_id_idx").on(table.contactId),
    submissionIdx: index("entity_embeddings_form_submission_id_idx").on(table.formSubmissionId),
    embeddingIdx: index("entity_embeddings_embedding_hnsw_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);

export const ticketIntents = pgTable("ticket_intents", {
  id: text("id").primaryKey(),
  source: text("source").notNull(),
  eventId: text("event_id"),
  sessionId: text("session_id"),
  destinationUrl: text("destination_url"),
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
  (table) => ({
    seriesIdx: index("scheduled_events_series_idx").on(table.series),
    statusIdx: index("scheduled_events_status_idx").on(table.status),
    startsAtIdx: index("scheduled_events_starts_at_idx").on(table.startsAt),
    slugIdx: uniqueIndex("scheduled_events_slug_idx").on(table.slug),
  }),
);
