# Monolith Artist Show Landing Template

This is the standard launch system for artist-led Monolith shows. Ape Drums is the first implementation.

## What every artist page inherits

- Image-ready editorial hero with artist name, event coordinates, release status, and ticket CTA.
- Long-form artist profile with biography, audience metrics, career facts, and official-site link.
- Monolith booking story that explains why this artist belongs in this room now.
- Featured YouTube set plus up to two additional approval-gated official videos.
- Date, venue, capacity, age, doors, and performance timing chamber.
- Header, hero, and final ticket endpoints routed to one verified checkout URL.
- Internal ticket-intent analytics plus Meta PageView and InitiateCheckout events.
- Monolith family footer and event-specific theme palette.
- Development-only preview route, production 404 seal, and one-flag rollback.

## Shared implementation

- Page engine: `client/src/components/artist-show/ArtistShowLanding.tsx`
- Release resolver: `client/src/lib/artistShowRelease.ts`
- Shared visual system: `client/src/styles/themes/artist-show.css`
- First show configuration: `client/src/content/artist-shows/apeDrums.ts`
- First route wrapper: `client/src/pages/ApeDrumsLanding.tsx`

The shared engine contains no artist-specific copy. A new show should be created as a small configuration wrapper that supplies content, palette, tracking names, routes, and its release object.

## New show configuration

Every `ArtistShowLandingConfig` must define:

1. Event ID, public path, tracking prefix, tracking source, and pixel content name.
2. SEO title and description.
3. Six-color show palette.
4. Artist name, display lines, initials, approved hero alt text, bio, metrics, facts, and official link.
5. Hero thesis and quick facts.
6. Monolith booking story and real capacity statement.
7. Featured video copy and optional additional video slots.
8. Full date, short date, venue, city, capacity, age, timing, and conversion note.
9. Monolith family footer links.

## Media standard

- Hero image: approved press image, portrait-oriented crop preferred, minimum 2400 px on the long edge.
- Preserve source quality. Generate delivery variants, but do not replace the approved master with a heavily reduced asset.
- Keep the artist's face and defining silhouette inside the central 60% so desktop and mobile crops remain intentional.
- Use an explicit alt description.
- Featured video: newest owner-approved full set when available.
- Additional videos: official or explicitly owner-approved YouTube sources only.
- YouTube playback uses privacy-enhanced embeds.

## Release architecture

Each show receives its own environment prefix and passes values into `resolveArtistShowRelease`:

- Release flag.
- Contract countersignature flag.
- Approved HTTPS checkout URL.
- Approved doors line.
- Approved hero image path or HTTPS URL.
- Required number of approved YouTube URLs.

The route stays closed if any required input is missing. The page component must also remain behind direct compile-time release and contract environment checks so a sealed draft is excluded from the production bundle—not merely hidden behind a 404.

## Routing standard

- CRM SMS and email can route directly to checkout.
- Public social, press, and ad traffic routes to the Monolith artist page.
- Every ticket CTA on the page routes to the same verified checkout URL.
- No extra waitlist handoff is inserted into an on-sale conversion path unless the campaign explicitly requires one.

## Clone process

1. Duplicate the smallest artist page wrapper, not the shared engine.
2. Replace every configuration field and tracking identifier.
3. Add public and development-only preview routes.
4. Add compile-time build flags to the route import.
5. Create the show-specific release object using the shared resolver.
6. Add the approved hero master and owner-approved videos.
7. Add a DOM test proving the correct artist, bio, media, metrics, and locked CTAs render.
8. Run TypeScript, focused tests, production build, pixel guard, prohibited-copy scan, and sealed-bundle scan.
9. Perform desktop and mobile visual QA.
10. Release only after contract and campaign approval; rollback by closing the release flag and redeploying.

## Metric discipline

Follower, listener, capacity, and ticket-count numbers must be sourced and dated. Re-verify audience metrics on release day, and never manufacture scarcity.
