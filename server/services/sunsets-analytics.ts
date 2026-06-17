import { sql } from "drizzle-orm";
import { getDatabase } from "../db/client";

const SUNSETS_EVENT_SLUGS = [
  "chasing-sunsets-july-4-2026",
  "chasing-sunsets-august-22-2026",
  "chasing-sunsets-september-19-2026",
] as const;

type QueryResult<T> = { rows: T[] } | T[];

type SummaryRow = {
  visits: string | number | null;
  unique_visitors: string | number | null;
  first_access_clicks: string | number | null;
  first_access_signups: string | number | null;
  ticket_clicks: string | number | null;
  purchases: string | number | null;
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
  visits: string | number | null;
  signups: string | number | null;
  ticket_clicks: string | number | null;
  purchases: string | number | null;
  revenue_cents: string | number | null;
};

type EventRow = {
  event_slug: string | null;
  visits: string | number | null;
  ticket_clicks: string | number | null;
  purchases: string | number | null;
  revenue_cents: string | number | null;
  vip_leads: string | number | null;
};

type ButtonRow = {
  button_name: string | null;
  clicks: string | number | null;
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

function normalizeSource(value: string | null | undefined) {
  const source = value?.trim().toLowerCase();
  return source || "direct";
}

export async function readSunsetsAnalytics() {
  const db = getDatabase();
  if (!db) {
    return {
      configured: false,
      generatedAt: new Date().toISOString(),
      eventSlugs: SUNSETS_EVENT_SLUGS,
      summary: null,
      sources: [],
      events: [],
      buttons: [],
    };
  }

  const eventSlugList = sql.join(
    SUNSETS_EVENT_SLUGS.map(slug => sql`${slug}`),
    sql`, `
  );

  const [summaryResult, sourceResult, eventResult, buttonResult] =
    await Promise.all([
      db.execute<SummaryRow>(sql`
      with
        page_views as (
          select *
          from funnel_page_views
          where page_path in ('/sunsets', '/sunsets/')
             or event_slug in (${eventSlugList})
        ),
        clicks as (
          select *
          from link_clicks
          where page_path in ('/sunsets', '/sunsets/')
             or event_slug in (${eventSlugList})
        ),
        signups as (
          select *
          from form_submissions
          where page_path in ('/sunsets', '/sunsets/')
             or event_interest in (${eventSlugList})
             or event_series = 'chasing-sunsets'
             or form_type = 'first_access_signup'
        ),
        orders as (
          select *
          from ticket_orders
          where event_slug in (${eventSlugList})
        ),
        vip as (
          select *
          from vip_leads
          where event_slug in (${eventSlugList})
        )
      select
        (select count(*) from page_views) as visits,
        (select count(distinct anonymous_session_id) from page_views where anonymous_session_id is not null) as unique_visitors,
        (select count(*) from clicks where interest_type in ('first_access_click', 'inline_email_capture', 'inline_sms_capture')) as first_access_clicks,
        (select count(*) from signups) as first_access_signups,
        (select count(*) from clicks where interest_type = 'ticket_click') as ticket_clicks,
        (select count(*) from orders) as purchases,
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
          select coalesce(utm_source, source, metadata->>'source', 'direct') as source, count(*) as visits
          from funnel_page_views
          where page_path in ('/sunsets', '/sunsets/')
             or event_slug in (${eventSlugList})
          group by 1
        ),
        signups as (
          select coalesce(source, raw_payload->>'utmSource', raw_payload->>'lastUtmSource', 'direct') as source, count(*) as signups
          from form_submissions
          where page_path in ('/sunsets', '/sunsets/')
             or event_interest in (${eventSlugList})
             or event_series = 'chasing-sunsets'
             or form_type = 'first_access_signup'
          group by 1
        ),
        clicks as (
          select coalesce(utm_source, metadata->>'source', channel, 'direct') as source, count(*) as ticket_clicks
          from link_clicks
          where (page_path in ('/sunsets', '/sunsets/') or event_slug in (${eventSlugList}))
            and interest_type = 'ticket_click'
          group by 1
        ),
        orders as (
          select
            coalesce(
              ticket_orders.utm_source,
              ticket_orders.raw_payload #>> '{normalized,utmSource}',
              contacts.utm_source,
              'direct'
            ) as source,
            count(*) as purchases,
            coalesce(sum(ticket_orders.net_revenue), 0) as revenue_cents
          from ticket_orders
          left join contacts on contacts.id = ticket_orders.contact_id
          where ticket_orders.event_slug in (${eventSlugList})
          group by 1
        ),
        source_keys as (
          select source from visits
          union select source from signups
          union select source from clicks
          union select source from orders
        )
      select
        source_keys.source,
        coalesce(visits.visits, 0) as visits,
        coalesce(signups.signups, 0) as signups,
        coalesce(clicks.ticket_clicks, 0) as ticket_clicks,
        coalesce(orders.purchases, 0) as purchases,
        coalesce(orders.revenue_cents, 0) as revenue_cents
      from source_keys
      left join visits on visits.source = source_keys.source
      left join signups on signups.source = source_keys.source
      left join clicks on clicks.source = source_keys.source
      left join orders on orders.source = source_keys.source
      order by revenue_cents desc, purchases desc, ticket_clicks desc, visits desc
      limit 20
    `),
      db.execute<EventRow>(sql`
      with
        event_keys as (
          select unnest(array[${eventSlugList}]) as event_slug
        ),
        visits as (
          select event_slug, count(*) as visits
          from funnel_page_views
          where event_slug in (${eventSlugList})
          group by 1
        ),
        clicks as (
          select event_slug, count(*) filter (where interest_type = 'ticket_click') as ticket_clicks
          from link_clicks
          where event_slug in (${eventSlugList})
          group by 1
        ),
        orders as (
          select event_slug, count(*) as purchases, coalesce(sum(net_revenue), 0) as revenue_cents
          from ticket_orders
          where event_slug in (${eventSlugList})
          group by 1
        ),
        vip as (
          select event_slug, count(*) as vip_leads
          from vip_leads
          where event_slug in (${eventSlugList})
          group by 1
        )
      select
        event_keys.event_slug,
        coalesce(visits.visits, 0) as visits,
        coalesce(clicks.ticket_clicks, 0) as ticket_clicks,
        coalesce(orders.purchases, 0) as purchases,
        coalesce(orders.revenue_cents, 0) as revenue_cents,
        coalesce(vip.vip_leads, 0) as vip_leads
      from event_keys
      left join visits on visits.event_slug = event_keys.event_slug
      left join clicks on clicks.event_slug = event_keys.event_slug
      left join orders on orders.event_slug = event_keys.event_slug
      left join vip on vip.event_slug = event_keys.event_slug
      order by event_keys.event_slug
    `),
      db.execute<ButtonRow>(sql`
      select button_name, count(*) as clicks
      from link_clicks
      where page_path in ('/sunsets', '/sunsets/')
         or event_slug in (${eventSlugList})
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
    purchases: numberValue(summaryRow?.purchases),
    revenueCents: numberValue(summaryRow?.revenue_cents),
    vipClicks: numberValue(summaryRow?.vip_clicks),
    vipLeads: numberValue(summaryRow?.vip_leads),
    recapClicks: numberValue(summaryRow?.recap_clicks),
    galleryClicks: numberValue(summaryRow?.gallery_clicks),
    soundcloudClicks: numberValue(summaryRow?.soundcloud_clicks),
    shareClicks: numberValue(summaryRow?.share_clicks),
  };

  return {
    configured: true,
    generatedAt: new Date().toISOString(),
    eventSlugs: SUNSETS_EVENT_SLUGS,
    summary: {
      ...summary,
      firstAccessClickRate: rate(summary.firstAccessClicks, summary.visits),
      signupRate: rate(summary.firstAccessSignups, summary.visits),
      ticketClickRate: rate(summary.ticketClicks, summary.visits),
      purchaseRate: rate(summary.purchases, summary.visits),
      revenueDollars: Number((summary.revenueCents / 100).toFixed(2)),
    },
    sources: rows(sourceResult).map(row => {
      const visits = numberValue(row.visits);
      const signups = numberValue(row.signups);
      const ticketClicks = numberValue(row.ticket_clicks);
      const purchases = numberValue(row.purchases);
      const revenueCents = numberValue(row.revenue_cents);

      return {
        source: normalizeSource(row.source),
        visits,
        signups,
        ticketClicks,
        purchases,
        revenueCents,
        revenueDollars: Number((revenueCents / 100).toFixed(2)),
        signupRate: rate(signups, visits),
        ticketClickRate: rate(ticketClicks, visits),
        purchaseRate: rate(purchases, visits),
        costPerSignup: null,
        costPerPurchase: null,
      };
    }),
    events: rows(eventResult).map(row => {
      const revenueCents = numberValue(row.revenue_cents);
      return {
        eventSlug: row.event_slug,
        visits: numberValue(row.visits),
        ticketClicks: numberValue(row.ticket_clicks),
        purchases: numberValue(row.purchases),
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
