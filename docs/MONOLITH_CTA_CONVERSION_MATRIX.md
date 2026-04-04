# Monolith CTA Conversion Matrix

## Purpose

This document locks the CTA system for the current Monolith site so conversion work stays consistent across pages, devices, and event states.

The goal is simple:

- one primary CTA per page
- one secondary CTA per page
- one low-friction fallback CTA per page
- clear tool ownership for every conversion surface
- no competing asks fighting each other on the same screen

This is meant to guide implementation on the current site, not a redesign.

## Tool Ownership

| Tool | Role | Use It For | Do Not Use It For |
| --- | --- | --- | --- |
| `Laylo` | intent capture | waitlist, presale, lineup drop, SMS updates, post-event comeback | VIP qualification, long intake forms, final checkout |
| `Fillout` | qualification | VIP tables, concierge, ambassadors, sponsor/partner intake, high-intent applications | low-friction mass signup, final checkout |
| `Posh` | transaction | ticket purchase, tiered access, hidden ticket tiers, final conversion | early funnel capture, long-form qualification |

## Global Rules

- Use one dominant CTA per viewport section.
- Every major page should ladder toward the same primary outcome.
- If the user is not ready to buy, offer `Laylo` capture before sending them into a dead end.
- `VIP` and premium intent should never route through generic newsletter capture.
- `Tickets` should never route through a long form unless the offer is explicitly VIP or concierge-led.
- Mobile sticky CTAs should mirror the page primary CTA, not invent a new one.
- Avoid generic copy like `Learn More` when the real next step is known.

## CTA Hierarchy

Primary CTA:
- the main business action for the page

Secondary CTA:
- the strongest adjacent action for users not ready for the primary

Fallback CTA:
- the lowest-friction capture or continuation action

## Event State Rules

| Event State | Primary CTA | Tool | Secondary CTA | Tool | Fallback CTA | Tool |
| --- | --- | --- | --- | --- | --- | --- |
| `upcoming` | `Unlock Presale Access` | `Laylo` | `View Schedule` | site | `Request VIP Access` | `Fillout` |
| `on-sale` | `Get Tickets` | `Posh` | `Request VIP Access` | `Fillout` | `Join SMS Updates` | `Laylo` |
| `low-inventory` | `Claim Last Tickets` | `Posh` | `Request VIP Access` | `Fillout` | `Get Restock Alerts` | `Laylo` |
| `sold-out` | `Join Waitlist` | `Laylo` | `Request VIP Access` | `Fillout` | `Get First Access To The Next Signal` | `Laylo` |
| `post-event` | `Get First Access To The Next Signal` | `Laylo` | `Watch Recap` | site | `Explore Archive` | site |

## Page Matrix

### Tier 1 Pages

| Page | Route | Primary CTA | Tool | Secondary CTA | Tool | Fallback CTA | Tool |
| --- | --- | --- | --- | --- | --- | --- | --- | 
| Home | `/` | `Get Tickets` if a live event exists, otherwise `Unlock Presale Access` | `Posh` or `Laylo` by state | `View Schedule` | site | `Join SMS Updates` | `Laylo` |
| Tickets | `/tickets` | state-based event CTA | `Posh` or `Laylo` by state | `Request VIP Access` | `Fillout` | `Join SMS Updates` | `Laylo` |
| Schedule | `/schedule` | `Get Tickets` if any live event exists, otherwise `Unlock Presale Access` | `Posh` or `Laylo` | `Join SMS Updates` | `Laylo` | `Request VIP Access` | `Fillout` |
| Untold Story | `/story` | `Get Tickets` if on sale, otherwise `Unlock Presale Access` | `Posh` or `Laylo` | `Request VIP Access` | `Fillout` | `View Schedule` | site |
| Chasing Sunsets | `/chasing-sunsets` | `Get Tickets` if on sale, otherwise `Join Waitlist` | `Posh` or `Laylo` | `View Schedule` | site | `Join SMS Updates` | `Laylo` |
| VIP | `/vip` | `Request VIP Access` | `Fillout` | `Get Tickets` | `Posh` | `Join SMS Updates` | `Laylo` |
| Newsletter / Inner Circle | `/newsletter` `/inner-circle` | `Join SMS Updates` | `Laylo` | `View Schedule` | site | `Request VIP Access` | `Fillout` |

### Tier 2 Pages

| Page | Route | Primary CTA | Tool | Secondary CTA | Tool | Fallback CTA | Tool |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Contact | `/contact` | `Start Contact` | site or `Fillout` if upgraded | `Join SMS Updates` | `Laylo` | `View Schedule` | site |
| Booking | `/booking` | `Submit Booking Inquiry` | site or `Fillout` if upgraded | `View Press Context` | site | `Join SMS Updates` | `Laylo` |
| Ambassadors | `/ambassadors` | `Apply Now` | `Fillout` | `Get Tickets` | `Posh` | `Join SMS Updates` | `Laylo` |
| Sponsors | `/sponsors` | `Request Access` | `Fillout` | `View Partners` | site | `Start Contact` | site |
| Guide | `/guide` | `Get Tickets` | `Posh` | `View Schedule` | site | `Join SMS Updates` | `Laylo` |
| Radio | `/radio` | `Get Tickets` | `Posh` | `Join SMS Updates` | `Laylo` | `Browse Archive` | site |
| Radio Episode | `/radio/:slug` | `Get Tickets` | `Posh` | `Join SMS Updates` | `Laylo` | `Open Radio Show` | site |
| Archive | `/archive` | `Get First Access To The Next Signal` | `Laylo` | `View Schedule` | site | `Browse Events` | site |
| About | `/about` `/togetherness` | `View Schedule` | site | `Join SMS Updates` | `Laylo` | `Request VIP Access` | `Fillout` |
| Insights | `/insights` | `View Schedule` | site | `Join SMS Updates` | `Laylo` | `Get Tickets` | `Posh` |
| Artist Profile | `/artists/:id` | `Get Tickets` | `Posh` | `View Lineup` | site | `Join SMS Updates` | `Laylo` |

## Homepage Section Map

This is the most important page for conversion consistency.

| Section | Primary CTA | Tool | Notes |
| --- | --- | --- | --- |
| Hero | `Get Tickets` if live, otherwise `Unlock Presale Access` | `Posh` or `Laylo` | strongest CTA on page |
| Featured Campaigns | state-based event CTA | `Posh` or `Laylo` | keep one event-led ask |
| Series / Philosophy sections | none dominant beyond page CTA | n/a | support the page primary, do not add new competing asks |
| Countdown / Conversion strip | mirror page primary CTA | same as hero | urgency surface |
| Event funnel stack | `Join Waitlist`, `Giveaway`, or `Coordinates` depending on event | mostly `Laylo`-style capture logic | this is the low-friction capture layer |
| Newsletter / Inner Circle | `Join SMS Updates` | `Laylo` | should remain the fallback conversion block |

## Button Copy Library

Use these labels consistently.

### Laylo

- `Unlock Presale Access`
- `Join Waitlist`
- `Join SMS Updates`
- `Get First Access`
- `Get First Access To The Next Signal`
- `Notify Me First`

### Fillout

- `Request VIP Access`
- `Check Availability`
- `Apply Now`
- `Start Sponsor Inquiry`
- `Talk To Concierge`

### Posh

- `Get Tickets`
- `Claim Last Tickets`
- `Secure Your Spot`
- `Open Ticket Access`

### Site-Native

- `View Schedule`
- `Browse Archive`
- `Watch Recap`
- `Explore The Series`
- `Open Radio Show`

## Placement Rules

- Hero gets the strongest CTA on the page.
- A second appearance of the primary CTA should happen by the time the user reaches the first major conversion or countdown section.
- Long pages should repeat the primary CTA every 2 to 3 major sections.
- Secondary CTAs should sit near the primary but with clearly lower visual weight.
- Fallback CTAs belong near the end of the page or inside recovery strips, not at equal weight with the primary.

## Mobile Rules

- Use a sticky bottom CTA on Tier 1 pages.
- Sticky CTA must mirror the page primary CTA exactly.
- Sticky CTA label should stay short.
- Keep minimum touch height at `56px`.
- Do not stack more than two actions in the sticky region.
- If a page has both a primary ticket action and VIP secondary action, keep the sticky bar focused on the primary only.

## Recovery Rules

- Use end-of-page recovery before adding exit-intent mechanics.
- Recovery CTA should usually be `Join SMS Updates` or `Join Waitlist`.
- Do not interrupt ticket-ready traffic with popups on first paint.
- If exit-intent is tested later, it should only offer the lower-friction fallback CTA.

## Current Site Alignment Notes

- [client/src/pages/Tickets.tsx](/Users/starkindustries/Downloads/monolith-project%20website/client/src/pages/Tickets.tsx) already behaves close to the target model, but the state logic should become stricter and the 400ms purchase delay should be removed.
- [client/src/pages/VIP.tsx](/Users/starkindustries/Downloads/monolith-project%20website/client/src/pages/VIP.tsx) is correctly a qualification page and should stay owned by `Fillout` or an equivalent structured intake flow.
- [client/src/pages/Home.tsx](/Users/starkindustries/Downloads/monolith-project%20website/client/src/pages/Home.tsx) should keep one dominant conversion thread instead of letting each section become its own funnel.
- [client/src/lib/cta.ts](/Users/starkindustries/Downloads/monolith-project%20website/client/src/lib/cta.ts) should eventually be expanded into a state-aware CTA config instead of a flat label list.

## Immediate Implementation Order

1. Lock event-state CTA behavior in code.
2. Normalize homepage, tickets, story, and Chasing Sunsets around the same CTA rules.
3. Replace any generic `Request Access` usage that is actually meant to be `Join SMS Updates` or `Request VIP Access`.
4. Make the global sticky ticket button state-aware so it reflects `Get Tickets`, `Unlock Presale Access`, or `Join Waitlist correctly.
5. Keep `Posh` as the primary checkout path and avoid splitting priority traffic across multiple ticketing surfaces.

## Success Metrics

- homepage hero CTA CTR
- ticket page CTA CTR
- Laylo capture rate
- VIP form completion rate
- ticket intent to purchase rate
- sold-out waitlist conversion into next event purchases
