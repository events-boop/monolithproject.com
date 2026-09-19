# Approved website release and weather notice — September 19, 2026

This release brings the previously reviewed Netlify-only homepage, series, artist, routing, event lifecycle and accessibility changes into the canonical GitHub source. Earlier review notes describing draft-only publication or pending source synchronization are historical.

## Current announcement

Erik supplied the weather-postponement statement and approved ticket-holder admission to the rescheduled show and/or an Untold Story event. The exact date, instructions and artist participation remain unconfirmed. The internal October 10 target is deliberately excluded from the Sun(Sets) III announcement and event metadata.

Both front doors present a compact accessible dialog on the first visit in a browser session. Dismissal persists for the update revision; a new published revision can appear again. The floating notice reopens the dialog. The full statement and ticket-holder options are selectable text on the event guide. The popup, FAQ, ticket page and status messages share the approved publication. No messages were sent to subscribers.

## Verification

- All 298 unit tests passed.
- TypeScript and production build passed, including the existing campaign pixel guard.
- Popup tests cover both front doors at 360, 390, 430, 768 and 1363 px, focus containment, Escape, close/reopen, reload persistence, full-update navigation and absence of the unconfirmed target date.
- All 54 focused browser checks passed: routes, responsive layouts, inquiry, metadata, artists, hero, popup and subscription feedback. No real signup or payment was submitted.
- Fixed server featured-event selection so the postponed finale remains the priority, and corrected ticket-page/prerender messaging.
- Fixed inquiry dialog focus wrap and removed an unnecessary text fade that reduced measured contrast.
- Screenshots: `/tmp/weather-popup-monolith-390.png`, `/tmp/weather-popup-monolith-1363.png`, `/tmp/weather-popup-sunsets-390.png`, `/tmp/weather-popup-sunsets-1363.png`.

## Still requires owner/account input

- Signup destination and secure provider connection. Existing Flodesk adapter remains inactive until configured; event updates and radio have separate opt-ins. Verify actual delivery with an authorized test address afterward.
- Confirmed replacement date, artist participation and support running order.
- Specific ticket-holder redemption instructions and any updated VIP/table arrangements.
- External checkout completion/campaign conversion reporting was not tested during this release.

The larger Radio/Journal/access-program ideas remain future editorial work, not part of this synchronization pass.
