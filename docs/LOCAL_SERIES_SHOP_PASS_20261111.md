# Series and collection visual follow-up — November 11, 2026

The approved home/calendar/First Access/history checkpoint is committed locally
as `b4a04bc`. This subsequent series/shop pass is verified and included in
the next local checkpoint. Nothing was pushed or deployed.

- Shared `SeasonInvitation` presents the approved 2027 preview on the existing
  Chasing Sunsets and Untold Story URLs, preserving their marks and palettes.
  Untold shows it when no current event is available; its event-specific states
  remain intact. Chasing keeps the existing ticket-holder guide above its preview.
- Mobile poster marks and the large year occupy separate grid cells.
- `/shop` now has a Collection 01 editorial poster and permanent series links.
  It remains in development, with First Access instead of checkout.
- Shared signup strips on radio, events, and other pages now use the same bold
  First Access action mapped to `/newsletter`.
- Static series HTML includes the season preview; Untold metadata matches the
  client. Shop now has static HTML, its permanent canonical, and sitemap coverage.
- Existing archives, gallery links, event status, and gated integrations remain
  intact. No artists, dates, inventory, or receipts were invented.

## Verification

- Chrome: 16 route/viewport combinations across 320, 390, 768, and 1440 pixels,
  including shared signup sections on radio and a past event page. No page
  overflow, broken rendered HTML images, or page errors. Axe reported no WCAG
  A/AA violations in the changed sections.
- Every inspected First Access action has weight 700 and destination
  `/newsletter`; clicking the shop action opened the full signup page.
- TypeScript, fresh Vite build, static prerender, and 19 existing targeted
  history/schema/CTA tests passed.
- Event validation passed for 9 records with the same six missing-receipt
  warnings. Historical guard passed for 84 routes. Pixel guard passed.
- Static home/series/shop content and historical route coverage retained.

Screenshots and browser report:
`/private/tmp/monolith-series-visual-20261111/`.

Local preview:

- <http://localhost:3002/untold-story#untold-event>
- <http://localhost:3002/chasing-sunsets#chasing-next-chapter>
- <http://localhost:3002/shop>

Unrelated `LakeLanding.tsx`, generated media, and the separate SOL handoff remain
outside this design pass; they are preserved in a separate checkpoint.
