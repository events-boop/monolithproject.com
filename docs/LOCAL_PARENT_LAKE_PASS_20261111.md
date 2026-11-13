# Monolith parent page and Lake List — local checkpoint

## Changes

- `/monolith` retains its photographic hero, concept, manifesto, and existing
  section anchors. The project section now connects Chasing Sun(Sets), Untold
  Story, House of Friends, and SUNSETS.FM with the shared programme cards.
- Replaced the parent page's expired August ticket promotion with the shared,
  bold First Access invitation to `/newsletter`.
- `/lake` now uses the shared Sunsets bio treatment for Chasing Sunsets IV in
  2027. It preserves `#lake-list`, links to September 19 ticket-holder support,
  retains access to previous chapters, and removes expired checkout/season-pass
  promotions. No future dates or artist bookings are asserted.
- Added meaningful `/lake` static HTML and sitemap coverage. Client and static
  metadata match on both updated pages.
- Prerender now rejects a previously prerendered home template before writing
  any routes. Previously, running prerender twice without a fresh Vite build
  silently reused the home body across historical dossiers. Use `npm run build`
  for a complete fresh pipeline.

## Verification

- Full Vitest suite: 556 passed, 11 skipped. Local server tests required socket
  access outside the restricted sandbox.
- TypeScript passed; fresh Vite build and prerender passed.
- `validate:events`: 9 events validated, with six existing warnings for past
  events lacking verified recap/archive receipts. No receipts were invented.
- `validate:history`: all 84 historical routes passed static content,
  canonicals, sitemap coverage, and truthful lifecycle checks.
- `pixel:guard` and `git diff --check` passed.
- Browser checks on `/monolith` and `/lake` at 320, 390, 768, and 1440 pixels:
  no horizontal overflow, broken rendered images, page errors, stale checkout
  links, or main-content WCAG A/AA violations. Lake First Access navigates to
  `/newsletter`. No third-party iframe loads before interaction.
- A repeated prerender was deliberately rejected; hashes confirmed the home
  page and postponed-event dossier were unchanged.
- Screenshots and browser report are local in
  `/private/tmp/monolith-parent-visual-20261111/`. Fresh homepage snapshots are
  `/private/tmp/monolith-home-current-20261111.png` and
  `/private/tmp/monolith-home-2027-current-20261111.png`.

Local work only. No push, production deployment, gated-system activation, or
live signup submission was performed.
