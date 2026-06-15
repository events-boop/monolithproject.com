# SUN(SETS) Marketer Drop Swap Workflow

## Purpose

Keep public links stable while swapping the live drop destination behind the scenes.

All ads, Instagram bio links, organic posts, and ManyChat buttons should stay pointed at the canonical SUN(SETS) rail:

```text
https://sunsets.vip/sunsets
```

The root `https://sunsets.vip` mirrors this same page, and legacy `/lake` URLs fold into `/sunsets` with UTMs intact. The app routes CTA traffic through the Monolith server first, then forwards users to the active Laylo, ManyChat, VIP, or ticket destination. That means UTMs and click identifiers stay intact while the destination can change from Netlify environment variables.

## The 3-Step Drop Swap

1. Get the new destination link.

   Use the live ManyChat flow URL, Laylo drop URL, Posh/Bucket Listers ticket URL, or VIP form URL.

2. Update the Netlify environment variable.

   In Netlify, open the `monolithproject` site, then go to Site configuration -> Environment variables.

3. Save and trigger a production deploy.

   Once the deploy is live, every active public link using `sunsets.vip` routes to the new destination without changing the ad, bio, story, or organic post URL.

## Live Variable Map

Use the variable that matches the rail you are changing:

| Rail                            | Public path                     | Netlify variable                                                                               |
| ------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------- |
| General Laylo/waitlist fallback | `/go/waitlist/general`          | `OUTBOUND_LAYLO_URL`, `LAYLO_URL`, or `OUTBOUND_WAITLIST_GENERAL_URL`                          |
| Chasing Sun(Sets) waitlist      | `/go/waitlist/chasing-sunsets`  | `OUTBOUND_WAITLIST_CHASING_SUNSETS_URL`, `OUTBOUND_LAYLO_SUNSETS_URL`, or `OUTBOUND_LAYLO_URL` |
| SUN keyword / ManyChat rail     | `/go/waitlist/sunsets-manychat` | `OUTBOUND_WAITLIST_SUNSETS_MANYCHAT_URL`                                                       |
| Benchek featured set drop       | `/go/waitlist/benchek`          | `OUTBOUND_WAITLIST_BENCHEK_URL`                                                               |
| July 4 tickets                  | `/go/tickets/css-jul04`         | `OUTBOUND_TICKETS_CSS_JUL04_URL` or `NEXT_PUBLIC_POSH_SUNSETS_JULY4_URL`                       |
| August 22 tickets               | `/go/tickets/css-aug22`         | `OUTBOUND_TICKETS_CSS_AUG22_URL`                                                               |
| September 19 tickets            | `/go/tickets/css-sep19`         | `OUTBOUND_TICKETS_CSS_SEP19_URL`                                                               |
| SUN(SETS) VIP / tables          | `/go/forms/sunsets-vip`         | `OUTBOUND_FORMS_SUNSETS_VIP_URL` or `FILLOUT_SUNSETS_VIP_URL`                                  |

Use `OUTBOUND_LAYLO_URL` for the fastest global drop swap when the same Laylo destination should drive the general and Chasing Sun(Sets) waitlist rails.

## Provider Webhooks & Sync

Keep these active for the SUN(SETS) rail:

| Provider | Purpose | Endpoint / setting | Required Netlify variable |
| --- | --- | --- | --- |
| Laylo | Lake List signup intake from Laylo back into Monolith CRM/Airtable | `https://sunsets.vip/api/webhooks/laylo` | `LAYLO_WEBHOOK_SECRET` |
| Laylo | Website form sync into Laylo | `LEAD_PROVIDER=laylo` plus Laylo API token | `LAYLO_API_TOKEN` or `LAYLO_API_KEY` |
| Posh | Buyer/order intake into Monolith CRM | `https://sunsets.vip/api/webhooks/posh` | `POSH_WEBHOOK_SECRET` |
| Airtable | Server-side lead mirror | Enabled through env only, never client-side | `AIRTABLE_SYNC_ENABLED=true`, `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, and table ID/name |

Use the same shared secret value in the provider dashboard and Netlify. The Laylo webhook accepts `Laylo-Secret`, `X-Laylo-Secret`, or `X-Webhook-Secret`. The Posh webhook accepts `Posh-Secret`.

Check `/health` after deploy. It reports whether Laylo webhook, Posh webhook, Airtable sync, and Meta CAPI are configured without exposing credentials.

## Attribution Guarantee

The outbound router preserves campaign parameters when it forwards a user to the active destination.

Preserved parameters include:

```text
utm_source
utm_medium
utm_campaign
utm_content
utm_term
ref
fbclid
gclid
ttclid
msclkid
session_id
event_slug
```

This lets Meta, Laylo, ManyChat, Posh, and CRM intake keep the same campaign story even when the destination is swapped.

## Post-Swap Smoke Tests

Run these after saving the env var and completing the Netlify deploy.

```bash
curl -I "https://sunsets.vip/go/waitlist/sunsets-manychat?utm_source=meta&utm_medium=cpc&utm_campaign=sunsets_launch&utm_content=sun_keyword&ref=ig_dm_sun&fbclid=test"
```

```bash
curl -I "https://sunsets.vip/go/waitlist/chasing-sunsets?utm_source=meta&utm_medium=cpc&utm_campaign=sunsets_launch&utm_content=lake_list&ref=ig_bio"
```

```bash
curl -I "https://sunsets.vip/go/tickets/css-jul04?utm_source=sunsetsvip&utm_medium=linkinbio&utm_campaign=sunsets_2026_07_04&utm_content=buy_tickets_primary&ref=site_cta"
```

```bash
curl -I "https://sunsets.vip/go/tickets/css-aug22?utm_source=sunsetsvip&utm_medium=linkinbio&utm_campaign=sunsets_2026_08_22&utm_content=buy_tickets_chapter&ref=site_cta"
```

```bash
curl -I "https://sunsets.vip/go/tickets/css-sep19?utm_source=sunsetsvip&utm_medium=linkinbio&utm_campaign=sunsets_2026_09_19&utm_content=buy_tickets_chapter&ref=site_cta"
```

Expected result:

- If the destination env var is set, the route returns a redirect to the active external destination.
- The final destination URL still contains the UTM/ref/click parameters.
- If a SUN(SETS) ticket URL is not set, the route shows the clean Tickets Coming Soon fallback instead of a broken checkout.

## Operating Rule

Ads and public CTAs should stay stable. The destination changes inside Netlify.

For a new drop, do not edit active ads unless the public CTA strategy changes. Swap the correct environment variable, deploy, and smoke test the route.
