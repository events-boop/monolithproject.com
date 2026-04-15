# Monolith Interactive Navigation Draft

This draft turns the current Monolith site into a cleaner chapter-based flow without inventing a second product.

The goal is not to redesign everything at once.

The goal is to reuse the current routes, content, assets, and brand worlds inside a better operating system:

- a lighter homepage
- a stronger navigation layer
- shorter destination pages
- clearer conversion paths

## 1. Core Decision

Monolith should not use abstract primary navigation.

Users do not come to the site looking for:

- proof
- architecture
- experiences
- chapters

They come looking for:

- what is next
- what series fits them
- who is playing
- how to get in
- how to plan the night

So the new flow should be:

1. intent-first
2. series-aware
3. visually premium
4. operationally obvious

## 2. What We Keep

The current site already has the raw material for this system.

### Brand Worlds Already Present

- `Monolith`
- `Chasing Sun(Sets)`
- `Untold Story`
- `Sun(Sets) Radio`

These already exist in:

- [Home.tsx](</Users/starkindustries/Downloads/monolith-project website/client/src/pages/Home.tsx:31>)
- [ChasingSunsets.tsx](</Users/starkindustries/Downloads/monolith-project website/client/src/pages/ChasingSunsets.tsx:94>)
- [UntoldStory.tsx](</Users/starkindustries/Downloads/monolith-project website/client/src/pages/UntoldStory.tsx:38>)
- [Radio.tsx](</Users/starkindustries/Downloads/monolith-project website/client/src/pages/Radio.tsx:218>)

### Navigation Behaviors Already Present

- desktop preview-card megamenus in [Navigation.tsx](</Users/starkindustries/Downloads/monolith-project website/client/src/components/Navigation.tsx:536>)
- a community utility cluster in [CommunityDropdown.tsx](</Users/starkindustries/Downloads/monolith-project website/client/src/components/CommunityDropdown.tsx:1>)
- event-aware CTAs in [Navigation.tsx](</Users/starkindustries/Downloads/monolith-project website/client/src/components/Navigation.tsx:658>)
- route-aware scene switching in [App.tsx](</Users/starkindustries/Downloads/monolith-project website/client/src/App.tsx:191>)

### Existing Pages That Stay Important

- `/tickets`
- `/schedule`
- `/chasing-sunsets`
- `/story`
- `/lineup`
- `/radio`
- `/guide`

These become the new primary system.

## 3. What Changes

The homepage stops carrying every responsibility.

The navigation becomes the site control layer.

Archive, partner, press, and support surfaces stop competing with the core journey.

## 4. Proposed Navigation Model

The system should have three layers.

### Layer 1: Homepage

The homepage becomes a selective landing layer.

Its job is only to:

- define Monolith fast
- feature the current flagship event or release
- route users into the right branch
- provide legitimacy and proof
- offer one clear conversion path

It should stop acting as:

- full archive
- full brand manifesto
- full operational guide
- full discovery index

### Layer 2: Fan System

This is the main exploration layer on desktop and the main chapter stack on mobile.

Primary blades:

1. `Next Night`
2. `Schedule`
3. `Chasing Sun(Sets)`
4. `Untold Story`
5. `Artists`
6. `Radio`
7. `Guide`

### Layer 3: Utility Layer

These remain always reachable, but they are not the emotional center of the site.

- `Tickets`
- `About`
- `Newsletter`
- `Partners`
- `Press`
- `Contact`

## 5. Blade Definitions

Each blade needs:

- title
- one-line promise
- status chip
- visual preview
- proof line
- one primary CTA
- two secondary links max

Do not preview a literal mini webpage.

Preview a designed branch state.

### 5.1 Next Night

Primary job:

- take the most ready-to-act visitor directly to the current event

Sources in the current site:

- global event CTA logic in [Navigation.tsx](</Users/starkindustries/Downloads/monolith-project website/client/src/components/Navigation.tsx:658>)
- current event surfaces in [Tickets.tsx](</Users/starkindustries/Downloads/monolith-project website/client/src/pages/Tickets.tsx:80>)
- event detail pages in [EventDetails](/Users/starkindustries/Downloads/monolith-project website/client/src/pages/EventDetails.tsx)

Preview payload:

- event title
- date
- venue
- sale state
- one hero image or loop

Primary CTA:

- `Secure Access`

Secondary links:

- `View Event`
- `Arrival Guide`

### 5.2 Schedule

Primary job:

- act as the canonical event calendar and decision page

Sources in the current site:

- [Schedule.tsx](</Users/starkindustries/Downloads/monolith-project website/client/src/pages/Schedule.tsx:89>)

Preview payload:

- next 2 to 3 dates
- city and venue labels
- ticket states

Primary CTA:

- `View Schedule`

Secondary links:

- `Tickets`
- `Event Archive`

### 5.3 Chasing Sun(Sets)

Primary job:

- represent the open-air daytime and sunset branch

Sources in the current site:

- [ChasingSunsets.tsx](</Users/starkindustries/Downloads/monolith-project website/client/src/pages/ChasingSunsets.tsx:94>)
- [ChasingSunsetsDetails.tsx](/Users/starkindustries/Downloads/monolith-project website/client/src/components/ChasingSunsetsDetails.tsx)
- [ChasingSunsetsTicketing.tsx](/Users/starkindustries/Downloads/monolith-project website/client/src/components/ChasingSunsetsTicketing.tsx)

Preview payload:

- warm image or short sunset loop
- current episode badge
- venue and lineup summary
- one short positioning line

Suggested line:

- `Open-air ritual built around golden hour, movement, and return.`

Primary CTA:

- `Enter Chasing Sun(Sets)`

Secondary links:

- `Next Episode`
- `Season Archive`

### 5.4 Untold Story

Primary job:

- represent the late-night indoor branch

Sources in the current site:

- [UntoldStory.tsx](</Users/starkindustries/Downloads/monolith-project website/client/src/pages/UntoldStory.tsx:38>)
- [UntoldHero.tsx](/Users/starkindustries/Downloads/monolith-project website/client/src/components/untold-story/UntoldHero.tsx)

Preview payload:

- dark still or short low-light loop
- next artist or next date
- room mood and event state

Suggested line:

- `Late-night rooms built for tension, clarity, and connection.`

Primary CTA:

- `Enter Untold Story`

Secondary links:

- `Next Night`
- `Season Archive`

### 5.5 Artists

Primary job:

- convert artist interest into lineup discovery and profile exploration

Sources in the current site:

- [Lineup.tsx](</Users/starkindustries/Downloads/monolith-project website/client/src/pages/Lineup.tsx:90>)
- artist profiles in `/artists/:id`

Preview payload:

- rotating artist portraits
- series filter chips
- one proof line around roster breadth or curation

Primary CTA:

- `Explore Lineup`

Secondary links:

- `Featured Artists`
- `Radio Episodes`

### 5.6 Radio

Primary job:

- keep the brand alive between events
- turn mixes and episodes into a retention surface

Sources in the current site:

- [Radio.tsx](</Users/starkindustries/Downloads/monolith-project website/client/src/pages/Radio.tsx:218>)
- episode pages at `/radio/:slug`

Preview payload:

- featured episode art
- episode title
- one tracklist or guest signal

Primary CTA:

- `Play Radio`

Secondary links:

- `Latest Episode`
- `Browse Episodes`

### 5.7 Guide

Primary job:

- centralize practical planning and reduce friction before purchase or arrival

Sources in the current site:

- [Guide.tsx](</Users/starkindustries/Downloads/monolith-project website/client/src/pages/Guide.tsx:62>)
- [FAQ.tsx](</Users/starkindustries/Downloads/monolith-project website/client/src/pages/FAQ.tsx:190>)
- [Travel.tsx](</Users/starkindustries/Downloads/monolith-project website/client/src/pages/Travel.tsx:58>)
- [VIP.tsx](</Users/starkindustries/Downloads/monolith-project website/client/src/pages/VIP.tsx:70>)

Preview payload:

- date + venue + entry status
- arrival checklist
- one practical proof line

Primary CTA:

- `Plan Your Night`

Secondary links:

- `Entry Checklist`
- `VIP Access`

## 6. Desktop Interaction Draft

Desktop should use a full-screen or near-full-screen navigation takeover.

Recommended structure:

- left column: blade list
- right column: preview panel
- top utility rail: close, tickets, newsletter
- bottom utility strip: about, partners, press, contact

Motion rules:

- open in one decisive transition
- stagger titles lightly
- change preview immediately on hover
- animate one thing at a time

Allowed:

- fade
- masked image reveal
- subtle scale
- very restrained parallax

Avoid:

- 3D novelty
- laggy cursor trails
- stacked gimmicks
- multiple competing transitions

## 7. Mobile Interaction Draft

Mobile should not attempt desktop hover behavior.

Use a vertical chapter list with expanding inline cards.

Behavior:

- tap chapter
- expand preview card below
- show image, short line, proof line, CTA
- collapse on second tap or when another card opens

Permanent mobile utility:

- `Tickets`
- `Close`

This is cleaner than a generic hamburger list and more usable than a radial experiment.

## 8. Homepage Rewrite Direction

The homepage should be reduced to five blocks.

### Block 1: Hero

- define Monolith in one line
- feature the next live event
- show one direct CTA and one explore CTA

### Block 2: Branch Selector

- lightweight preview of the seven fan-system blades

### Block 3: Proof

- artists
- archive stills
- venue or city proof
- Chicago relevance

### Block 4: Why Monolith

- one short brand clarity block

### Block 5: Retention

- newsletter
- radio
- current updates

Everything else should move deeper.

## 9. Route Migration Map

This maps the current route surface into the new system.

### Primary Blade Routes

- `/tickets` -> utility CTA plus `Next Night`
- `/schedule` -> keep as primary blade
- `/chasing-sunsets` -> keep as primary blade
- `/story` -> keep as primary blade
- `/lineup` -> keep as primary blade
- `/radio` -> keep as primary blade
- `/guide` -> keep as primary blade

### Child Routes That Stay

- `/events/:slug` -> child of `Next Night`, `Schedule`, and series pages
- `/artists/:id` -> child of `Artists`
- `/radio/:slug` -> child of `Radio`
- `/chasing-sunsets/:season` -> child archive of `Chasing Sun(Sets)`
- `/untold-story/:season` -> child archive of `Untold Story`

### Utility Routes That Stay

- `/about` -> utility
- `/newsletter` -> utility
- `/partners` -> utility
- `/press` -> utility
- `/contact` -> utility

### Routes To Consolidate

- `/archive` -> demote into proof/archive access from series, artists, and radio
- `/faq` -> merge into `Guide`
- `/travel` -> merge into `Guide`
- `/vip` -> keep live, but route through `Guide` and `Tickets`
- `/sponsors` -> merge into `Partners`
- `/booking` -> fold under `Artists` or a secondary submit flow
- `/submit` -> fold under `Artists` or `Partners` depending business intent

### Routes To Remove From Primary Navigation

- `/insights`
- `/shop`
- `/ambassadors`
- `/alerts`
- `/terms`
- `/privacy`
- `/cookies`

These can stay in the product without occupying premium nav real estate.

## 10. Suggested New Menu Order

Desktop blade order:

1. `Next Night`
2. `Schedule`
3. `Chasing Sun(Sets)`
4. `Untold Story`
5. `Artists`
6. `Radio`
7. `Guide`

Utility order:

1. `Tickets`
2. `About`
3. `Newsletter`
4. `Partners`
5. `Press`
6. `Contact`

## 11. What This Replaces In Current Navigation

The current top-level grouping in [Navigation.tsx](</Users/starkindustries/Downloads/monolith-project website/client/src/components/Navigation.tsx:536>) is:

- `ABOUT`
- `EVENTS`
- `RADIO + ARCHIVE`
- `COMMUNITY`
- `PLAN YOUR NIGHT`

That grouping is directionally good but still too mixed.

The main problems:

- `RADIO + ARCHIVE` combines retention and proof
- `PLAN YOUR NIGHT` combines ticketing, VIP, partnerships, and press
- `EVENTS` still hides the actual brand branches
- `COMMUNITY` belongs in utility, not in the emotional center

The new model fixes this by making the series and user intent explicit.

## 12. Immediate Build Sequence

Do not redesign every destination page first.

Build in this order:

1. finalize blade order and utility layer
2. rewrite homepage into a lighter routing layer
3. replace current desktop nav with the fan-system overlay
4. replace current mobile menu with expanding chapter cards
5. shorten `Chasing Sun(Sets)` and `Untold Story` into cleaner landings
6. merge `FAQ`, `Travel`, and parts of `VIP` into `Guide`
7. demote `Archive` into proof and sub-navigation

## 13. Non-Goals

- inventing new brand worlds not present in the product
- making `Proof` a standalone chapter
- making `Contact` a primary exploration branch
- replacing every route at once
- building a flashy menu that leaves page sprawl untouched

## 14. Working Summary

The right Monolith move is not a prettier hamburger.

It is a new site operating system:

- homepage as orientation
- fan system as chapter entry
- shorter landings as destinations
- proof distributed across previews and pages
- utility always reachable

That keeps what already works in the codebase, removes route competition, and gives the brand a clearer premium shape.
