import { sql, type SQL } from "drizzle-orm";
import { getDatabase } from "../db/client";

export const SUNSETS_EVENT_SLUGS = [
  "chasing-sunsets-july-4-2026",
  "chasing-sunsets-august-22-2026",
  "chasing-sunsets-september-19-2026",
] as const;

export type SunsetsEventSlug = (typeof SUNSETS_EVENT_SLUGS)[number];

export interface SunsetsAnalyticsFilters {
  eventSlug?: SunsetsEventSlug;
  dateFrom?: string;
  dateTo?: string;
}

export type AttributionChannel =
  | "paid"
  | "owned"
  | "earned"
  | "direct"
  | "unknown";

type QueryResult<T> = { rows: T[] } | T[];

type SummaryRow = {
  visits: string | number | null;
  unique_visitors: string | number | null;
  first_access_clicks: string | number | null;
  first_access_signups: string | number | null;
  ticket_clicks: string | number | null;
  orders: string | number | null;
  ticket_quantity: string | number | null;
  gross_ticket_quantity: string | number | null;
  refunded_orders: string | number | null;
  refund_cents: string | number | null;
  revenue_cents: string | number | null;
  vip_clicks: string | number | null;
  vip_leads: string | number | null;
  recap_clicks: string | number | null;
  gallery_clicks: string | number | null;
  soundcloud_clicks: string | number | null;
  share_clicks: string | number | null;
};

type SourceRow = {
  source: string | null;
  medium: string | null;
  visits: string | number | null;
  signups: string | number | null;
  ticket_clicks: string | number | null;
  orders: string | number | null;
  ticket_quantity: string | number | null;
  gross_ticket_quantity: string | number | null;
  refunded_orders: string | number | null;
  refund_cents: string | number | null;
  revenue_cents: string | number | null;
};

type EventRow = {
  event_slug: string | null;
  visits: string | number | null;
  ticket_clicks: string | number | null;
  orders: string | number | null;
  ticket_quantity: string | number | null;
  gross_ticket_quantity: string | number | null;
  refunded_orders: string | number | null;
  refund_cents: string | number | null;
  revenue_cents: string | number | null;
  vip_leads: string | number | null;
};

type ButtonRow = {
  button_name: string | null;
  clicks: string | number | null;
};

type ChannelMetrics = {
  channel: AttributionChannel;
  visits: number;
  signups: number;
  ticketClicks: number;
  orders: number;
  ticketQuantity: number;
  grossTicketQuantity: number;
  refundedOrders: number;
  refundCents: number;
  revenueCents: number;
};

function rows<T>(result: QueryResult<T>) {
  return Array.isArray(result) ? result : result.rows;
}

function numberValue(value: string | number | null | undefined) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function rate(numerator: number, denominator: number) {
  return denominator > 0 ? Number((numerator / denominator).toFixed(4)) : 0;
}

function normalizeDimension(
  value: string | null | undefined,
  fallback: string
) {
  const normalized = value?.trim().toLowerCase();
  return normalized || fallback;
}

function isValidIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

function readQueryString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function parseSunsetsAnalyticsFilters(
  query: Record<string, unknown>
): SunsetsAnalyticsFilters {
  const eventSlug = readQueryString(query.event_slug);
  const dateFrom = readQueryString(query.date_from);
  const dateTo = readQueryString(query.date_to);

  if (
    eventSlug &&
    !SUNSETS_EVENT_SLUGS.includes(eventSlug as SunsetsEventSlug)
  ) {
    throw new Error(`Unsupported event_slug: ${eventSlug}`);
  }
  if (dateFrom && !isValidIsoDate(dateFrom)) {
    throw new Error("date_from must be a valid YYYY-MM-DD date");
  }
  if (dateTo && !isValidIsoDate(dateTo)) {
    throw new Error("date_to must be a valid YYYY-MM-DD date");
  }
  if (dateFrom && dateTo && dateFrom > dateTo) {
    throw new Error("date_from must be on or before date_to");
  }

  return {
    eventSlug: eventSlug as SunsetsEventSlug | undefined,
    dateFrom,
    dateTo,
  };
}

export function classifyAttributionChannel(
  rawSource?: string | null,
  rawMedium?: string | null
): AttributionChannel {
  const source = normalizeDimension(rawSource, "direct");
  const medium = normalizeDimension(rawMedium, "none");

  if (
    /(^|_)(paid|cpc|ppc|display|retargeting|paid-social|paid_social)($|_)/.test(
      medium
    )
  ) {
    return "paid";
  }

  if (source === "direct" && ["none", "direct", "(none)"].includes(medium)) {
    return "direct";
  }

  const ownedSources = new Set([
    "email",
    "laylo",
    "manychat",
    "monolith",
    "monolith_site",
    "newsletter",
    "sms",
    "sunsetsvip",
  ]);
  const ownedMediums = new Set([
    "email",
    "landing_cta",
    "linkinbio",
    "newsletter",
    "organic_dm",
    "sms",
    "text",
  ]);
  if (ownedSources.has(source) || ownedMediums.has(medium)) return "owned";

  if (
    [
      "event_listing",
      "organic",
      "organic_social",
      "referral",
      "social",
    ].includes(medium) ||
    ["do312", "partner", "resident_advisor"].includes(source)
  ) {
    return "earned";
  }

  return "unknown";
}

function nextDate(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

function dateRangeSql(column: SQL, filters: SunsetsAnalyticsFilters) {
  const from = filters.dateFrom
    ? `${filters.dateFrom}T00:00:00.000Z`
    : undefined;
  const to = filters.dateTo
    ? `${nextDate(filters.dateTo)}T00:00:00.000Z`
    : undefined;

  return sql`
    ${from ? sql`and ${column} >= ${from}` : sql``}
    ${to ? sql`and ${column} < ${to}` : sql``}
  `;
}

function withRates(metrics: ChannelMetrics) {
  return {
    ...metrics,
    revenueDollars: Number((metrics.revenueCents / 100).toFixed(2)),
    refundDollars: Number((metrics.refundCents / 100).toFixed(2)),
    signupRate: rate(metrics.signups, metrics.visits),
    ticketClickRate: rate(metrics.ticketClicks, metrics.visits),
    orderRate: rate(metrics.orders, metrics.visits),
  };
}

function aggregateChannels(
  sourceMetrics: Array<ChannelMetrics & { source: string; medium: string }>
) {
  const channelMap = new Map<AttributionChannel, ChannelMetrics>();

  for (const row of sourceMetrics) {
    const current = channelMap.get(row.channel) || {
      channel: row.channel,
      visits: 0,
      signups: 0,
      ticketClicks: 0,
      orders: 0,
      ticketQuantity: 0,
      grossTicketQuantity: 0,
      refundedOrders: 0,
      refundCents: 0,
      revenueCents: 0,
    };

    current.visits += row.visits;
    current.signups += row.signups;
    current.ticketClicks += row.ticketClicks;
    current.orders += row.orders;
    current.ticketQuantity += row.ticketQuantity;
    current.grossTicketQuantity += row.grossTicketQuantity;
    current.refundedOrders += row.refundedOrders;
    current.refundCents += row.refundCents;
    current.revenueCents += row.revenueCents;
    channelMap.set(row.channel, current);
  }

  const order: AttributionChannel[] = [
    "paid",
    "owned",
    "earned",
    "direct",
    "unknown",
  ];
  return order
    .map(channel => channelMap.get(channel))
    .filter((row): row is ChannelMetrics => Boolean(row))
    .map(withRates);
}

export async function readSunsetsAnalytics(
  filters: SunsetsAnalyticsFilters = {}
) {
  const selectedEventSlugs = filters.eventSlug
    ? [filters.eventSlug]
    : [...SUNSETS_EVENT_SLUGS];
  const responseFilters = {
    eventSlug: filters.eventSlug || null,
    dateFrom: filters.dateFrom || null,
    dateTo: filters.dateTo || null,
  };
  const db = getDatabase();
  if (!db) {
    return {
      configured: false,
      generatedAt: new Date().toISOString(),
      filters: responseFilters,
      eventSlugs: selectedEventSlugs,
      summary: null,
      sources: [],
      channels: [],
      events: [],
      buttons: [],
    };
  }

  const eventSlugList = sql.join(
    selectedEventSlugs.map(slug => sql`${slug}`),
    sql`, `
  );
  const pageScope = filters.eventSlug
    ? sql`event_slug = ${filters.eventSlug}`
    : sql`(page_path in ('/sunsets', '/sunsets/') or event_slug in (${eventSlugList}))`;
  const signupScope = filters.eventSlug
    ? sql`(event_interest = ${filters.eventSlug} or raw_payload->>'eventSlug' = ${filters.eventSlug})`
    : sql`(page_path in ('/sunsets', '/sunsets/') or event_interest in (${eventSlugList}) or event_series = 'chasing-sunsets' or form_type = 'first_access_signup')`;
  const eventScope = filters.eventSlug
    ? sql`event_slug = ${filters.eventSlug}`
    : sql`event_slug in (${eventSlugList})`;
  const refundCentsExpression = sql`
    coalesce(
      case
        when (raw_payload #>> '{normalized,refundCents}') ~ '^[0-9]+$'
          then (raw_payload #>> '{normalized,refundCents}')::numeric
      end,
      case
        when (raw_payload ->> 'partialRefund') ~ '^[0-9]+([.][0-9]+)?$'
          then round((raw_payload ->> 'partialRefund')::numeric * 100)
      end,
      case
        when lower(coalesce(raw_payload #>> '{normalized,status}', '')) in ('cancelled', 'disputed')
          or lower(coalesce(raw_payload ->> 'refunded', '')) in ('true', '1')
          then greatest(0, gross_revenue - fees)
        else greatest(0, (gross_revenue - fees) - net_revenue)
      end,
      0
    )
  `;
  const fullyRefundedExpression = sql`
    lower(coalesce(raw_payload #>> '{normalized,refundKind}', '')) = 'full'
    or lower(coalesce(raw_payload #>> '{normalized,status}', '')) in ('cancelled', 'disputed')
    or lower(coalesce(raw_payload ->> 'refunded', '')) in ('true', '1')
  `;

  const [summaryResult, sourceResult, eventResult, buttonResult] =
    await Promise.all([
      db.execute<SummaryRow>(sql`
        with
          page_views as (
            select * from funnel_page_views
            where ${pageScope}
            ${dateRangeSql(sql`created_at`, filters)}
          ),
          clicks as (
            select * from link_clicks
            where ${pageScope}
            ${dateRangeSql(sql`created_at`, filters)}
          ),
          signups as (
            select * from form_submissions
            where ${signupScope}
            ${dateRangeSql(sql`created_at`, filters)}
          ),
          orders as (
            select
              ticket_orders.*,
              ${refundCentsExpression} as refund_cents,
              (${fullyRefundedExpression}) as fully_refunded
            from ticket_orders
            where ${eventScope}
            ${dateRangeSql(sql`coalesce(purchased_at, created_at)`, filters)}
          ),
          vip as (
            select * from vip_leads
            where ${eventScope}
            ${dateRangeSql(sql`created_at`, filters)}
          )
        select
          (select count(*) from page_views) as visits,
          (select count(distinct anonymous_session_id) from page_views where anonymous_session_id is not null) as unique_visitors,
          (select count(*) from clicks where interest_type in ('first_access_click', 'inline_email_capture', 'inline_sms_capture')) as first_access_clicks,
          (select count(*) from signups) as first_access_signups,
          (select count(*) from clicks where interest_type = 'ticket_click') as ticket_clicks,
          (select count(*) from orders) as orders,
          (select coalesce(sum(case when fully_refunded then 0 else quantity end), 0) from orders) as ticket_quantity,
          (select coalesce(sum(quantity), 0) from orders) as gross_ticket_quantity,
          (select count(*) from orders where refund_cents > 0) as refunded_orders,
          (select coalesce(sum(refund_cents), 0) from orders) as refund_cents,
          (select coalesce(sum(net_revenue), 0) from orders) as revenue_cents,
          (select count(*) from clicks where interest_type = 'vip_click') as vip_clicks,
          (select count(*) from vip) as vip_leads,
          (select count(*) from clicks where interest_type = 'recap_click') as recap_clicks,
          (select count(*) from clicks where interest_type = 'gallery_click') as gallery_clicks,
          (select count(*) from clicks where interest_type = 'soundcloud_click') as soundcloud_clicks,
          (select count(*) from clicks where interest_type = 'share_click') as share_clicks
      `),
      db.execute<SourceRow>(sql`
        with
          visits as (
            select
              coalesce(utm_source, source, metadata->>'source', 'direct') as source,
              coalesce(utm_medium, metadata->>'medium', 'none') as medium,
              count(*) as visits
            from funnel_page_views
            where ${pageScope}
            ${dateRangeSql(sql`created_at`, filters)}
            group by 1, 2
          ),
          signups as (
            select
              coalesce(source, raw_payload->>'utmSource', raw_payload->>'lastUtmSource', 'direct') as source,
              coalesce(raw_payload->>'utmMedium', raw_payload->>'lastUtmMedium', 'none') as medium,
              count(*) as signups
            from form_submissions
            where ${signupScope}
            ${dateRangeSql(sql`created_at`, filters)}
            group by 1, 2
          ),
          clicks as (
            select
              coalesce(utm_source, metadata->>'source', channel, 'direct') as source,
              coalesce(utm_medium, metadata->>'medium', 'none') as medium,
              count(*) as ticket_clicks
            from link_clicks
            where ${pageScope}
              and interest_type = 'ticket_click'
            ${dateRangeSql(sql`created_at`, filters)}
            group by 1, 2
          ),
          order_rows as (
            select
              coalesce(ticket_orders.utm_source, ticket_orders.raw_payload #>> '{normalized,utmSource}', contacts.utm_source, 'direct') as source,
              coalesce(ticket_orders.raw_payload #>> '{normalized,utmMedium}', contacts.utm_medium, 'none') as medium,
              ticket_orders.quantity,
              ticket_orders.net_revenue,
              ${refundCentsExpression} as refund_cents,
              (${fullyRefundedExpression}) as fully_refunded
            from ticket_orders
            left join contacts on contacts.id = ticket_orders.contact_id
            where ${eventScope}
            ${dateRangeSql(sql`coalesce(ticket_orders.purchased_at, ticket_orders.created_at)`, filters)}
          ),
          orders as (
            select
              source,
              medium,
              count(*) as orders,
              coalesce(sum(case when fully_refunded then 0 else quantity end), 0) as ticket_quantity,
              coalesce(sum(quantity), 0) as gross_ticket_quantity,
              count(*) filter (where refund_cents > 0) as refunded_orders,
              coalesce(sum(refund_cents), 0) as refund_cents,
              coalesce(sum(net_revenue), 0) as revenue_cents
            from order_rows
            group by 1, 2
          ),
          source_keys as (
            select source, medium from visits
            union select source, medium from signups
            union select source, medium from clicks
            union select source, medium from orders
          )
        select
          source_keys.source,
          source_keys.medium,
          coalesce(visits.visits, 0) as visits,
          coalesce(signups.signups, 0) as signups,
          coalesce(clicks.ticket_clicks, 0) as ticket_clicks,
          coalesce(orders.orders, 0) as orders,
          coalesce(orders.ticket_quantity, 0) as ticket_quantity,
          coalesce(orders.gross_ticket_quantity, 0) as gross_ticket_quantity,
          coalesce(orders.refunded_orders, 0) as refunded_orders,
          coalesce(orders.refund_cents, 0) as refund_cents,
          coalesce(orders.revenue_cents, 0) as revenue_cents
        from source_keys
        left join visits using (source, medium)
        left join signups using (source, medium)
        left join clicks using (source, medium)
        left join orders using (source, medium)
        order by revenue_cents desc, orders desc, ticket_clicks desc, visits desc
        limit 50
      `),
      db.execute<EventRow>(sql`
        with
          event_keys as (
            select unnest(array[${eventSlugList}]) as event_slug
          ),
          visits as (
            select event_slug, count(*) as visits
            from funnel_page_views
            where ${eventScope}
            ${dateRangeSql(sql`created_at`, filters)}
            group by 1
          ),
          clicks as (
            select event_slug, count(*) filter (where interest_type = 'ticket_click') as ticket_clicks
            from link_clicks
            where ${eventScope}
            ${dateRangeSql(sql`created_at`, filters)}
            group by 1
          ),
          order_rows as (
            select
              event_slug,
              quantity,
              net_revenue,
              ${refundCentsExpression} as refund_cents,
              (${fullyRefundedExpression}) as fully_refunded
            from ticket_orders
            where ${eventScope}
            ${dateRangeSql(sql`coalesce(purchased_at, created_at)`, filters)}
          ),
          orders as (
            select
              event_slug,
              count(*) as orders,
              coalesce(sum(case when fully_refunded then 0 else quantity end), 0) as ticket_quantity,
              coalesce(sum(quantity), 0) as gross_ticket_quantity,
              count(*) filter (where refund_cents > 0) as refunded_orders,
              coalesce(sum(refund_cents), 0) as refund_cents,
              coalesce(sum(net_revenue), 0) as revenue_cents
            from order_rows
            group by 1
          ),
          vip as (
            select event_slug, count(*) as vip_leads
            from vip_leads
            where ${eventScope}
            ${dateRangeSql(sql`created_at`, filters)}
            group by 1
          )
        select
          event_keys.event_slug,
          coalesce(visits.visits, 0) as visits,
          coalesce(clicks.ticket_clicks, 0) as ticket_clicks,
          coalesce(orders.orders, 0) as orders,
          coalesce(orders.ticket_quantity, 0) as ticket_quantity,
          coalesce(orders.gross_ticket_quantity, 0) as gross_ticket_quantity,
          coalesce(orders.refunded_orders, 0) as refunded_orders,
          coalesce(orders.refund_cents, 0) as refund_cents,
          coalesce(orders.revenue_cents, 0) as revenue_cents,
          coalesce(vip.vip_leads, 0) as vip_leads
        from event_keys
        left join visits using (event_slug)
        left join clicks using (event_slug)
        left join orders using (event_slug)
        left join vip using (event_slug)
        order by event_keys.event_slug
      `),
      db.execute<ButtonRow>(sql`
        select button_name, count(*) as clicks
        from link_clicks
        where ${pageScope}
        ${dateRangeSql(sql`created_at`, filters)}
        group by button_name
        order by clicks desc, button_name asc
        limit 20
      `),
    ]);

  const summaryRow = rows(summaryResult)[0];
  const summary = {
    visits: numberValue(summaryRow?.visits),
    uniqueVisitors: numberValue(summaryRow?.unique_visitors),
    firstAccessClicks: numberValue(summaryRow?.first_access_clicks),
    firstAccessSignups: numberValue(summaryRow?.first_access_signups),
    ticketClicks: numberValue(summaryRow?.ticket_clicks),
    orders: numberValue(summaryRow?.orders),
    ticketQuantity: numberValue(summaryRow?.ticket_quantity),
    grossTicketQuantity: numberValue(summaryRow?.gross_ticket_quantity),
    refundedOrders: numberValue(summaryRow?.refunded_orders),
    refundCents: numberValue(summaryRow?.refund_cents),
    revenueCents: numberValue(summaryRow?.revenue_cents),
    vipClicks: numberValue(summaryRow?.vip_clicks),
    vipLeads: numberValue(summaryRow?.vip_leads),
    recapClicks: numberValue(summaryRow?.recap_clicks),
    galleryClicks: numberValue(summaryRow?.gallery_clicks),
    soundcloudClicks: numberValue(summaryRow?.soundcloud_clicks),
    shareClicks: numberValue(summaryRow?.share_clicks),
  };

  const sources = rows(sourceResult).map(row => {
    const source = normalizeDimension(row.source, "direct");
    const medium = normalizeDimension(row.medium, "none");
    const visits = numberValue(row.visits);
    const signups = numberValue(row.signups);
    const ticketClicks = numberValue(row.ticket_clicks);
    const orders = numberValue(row.orders);
    const ticketQuantity = numberValue(row.ticket_quantity);
    const grossTicketQuantity = numberValue(row.gross_ticket_quantity);
    const refundedOrders = numberValue(row.refunded_orders);
    const refundCents = numberValue(row.refund_cents);
    const revenueCents = numberValue(row.revenue_cents);

    return {
      source,
      medium,
      channel: classifyAttributionChannel(source, medium),
      visits,
      signups,
      ticketClicks,
      orders,
      purchases: orders,
      ticketQuantity,
      grossTicketQuantity,
      refundedOrders,
      refundCents,
      refundDollars: Number((refundCents / 100).toFixed(2)),
      revenueCents,
      revenueDollars: Number((revenueCents / 100).toFixed(2)),
      signupRate: rate(signups, visits),
      ticketClickRate: rate(ticketClicks, visits),
      orderRate: rate(orders, visits),
      purchaseRate: rate(orders, visits),
      costPerSignup: null,
      costPerPurchase: null,
    };
  });

  return {
    configured: true,
    generatedAt: new Date().toISOString(),
    filters: responseFilters,
    eventSlugs: selectedEventSlugs,
    summary: {
      ...summary,
      purchases: summary.orders,
      firstAccessClickRate: rate(summary.firstAccessClicks, summary.visits),
      signupRate: rate(summary.firstAccessSignups, summary.visits),
      ticketClickRate: rate(summary.ticketClicks, summary.visits),
      orderRate: rate(summary.orders, summary.visits),
      purchaseRate: rate(summary.orders, summary.visits),
      revenueDollars: Number((summary.revenueCents / 100).toFixed(2)),
      refundDollars: Number((summary.refundCents / 100).toFixed(2)),
    },
    sources,
    channels: aggregateChannels(sources),
    events: rows(eventResult).map(row => {
      const orders = numberValue(row.orders);
      const refundCents = numberValue(row.refund_cents);
      const revenueCents = numberValue(row.revenue_cents);
      return {
        eventSlug: row.event_slug,
        visits: numberValue(row.visits),
        ticketClicks: numberValue(row.ticket_clicks),
        orders,
        purchases: orders,
        ticketQuantity: numberValue(row.ticket_quantity),
        grossTicketQuantity: numberValue(row.gross_ticket_quantity),
        refundedOrders: numberValue(row.refunded_orders),
        refundCents,
        refundDollars: Number((refundCents / 100).toFixed(2)),
        revenueCents,
        revenueDollars: Number((revenueCents / 100).toFixed(2)),
        vipLeads: numberValue(row.vip_leads),
      };
    }),
    buttons: rows(buttonResult).map(row => ({
      buttonName: row.button_name || "Unknown",
      clicks: numberValue(row.clicks),
    })),
  };
}
