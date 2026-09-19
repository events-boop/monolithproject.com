# Homepage and Chasing Sunsets full-page design review

Draft preview: https://6aae7bd96a0a4ef24eb537f1--monolithproject.netlify.app

## Changes

- Preserved the cinematic homepage hero and navigation. Tightened homepage section spacing and calendar, replaced abstract brand cards with photo-led series cards, introduced a visible recap thumbnail and actual artist portraits, and simplified the contact section.
- Rebuilt `/chasing-sunsets` using the approved transparent gold logo, lakefront hero, shared current-event feature, real Castaways photography, the existing JOEZI/MASSUMA video links, previous-show records, summer galleries and accessible individual FAQ disclosures.
- Replaced the old July/August sales copy, obsolete lineup and unverified table prices on the series page. Current status, headliners, support, date, venue, hours and ticket destination come from the same publication as the homepage/Sunsets guide.
- Kept the running order unconfirmed. Links lead to the current event guide for status, schedule, weather policy and update subscriptions; no new subscription delivery claims or refund promises were introduced.
- Made the Chasing Sunsets footer links larger and removed its oversized decorative wordmark. Existing radio shelf, contact and artist submission paths remain available.
- Matched the series prerendered title, description and image to its rendered metadata and added archive links to the prerendered body.

## Verification

- TypeScript check passed.
- Production build and Meta pixel guard passed; pixels and analytics were preserved.
- 15 initial Playwright checks passed across homepage, cinematic media and series redesign.
- All 6 series/media/navigation checks passed again after the final venue alignment correction.
- Tested widths: 360, 390, 430, 768 and 1363 CSS px.
- All images in the series main content load; new homepage media load; all five selected archive destinations resolve.
- No horizontal overflow at tested widths; FAQ keyboard activation passes.
- AllEvents ticket URL and allowed campaign parameters verified. No actual checkout purchase or signup delivery tested in this design pass.
- Desktop/mobile screenshots: `/tmp/chasing-series-1363.png`, `/tmp/chasing-series-390.png`, `/tmp/monolith-home-1363.png`, `/tmp/monolith-home-390.png`.

## Delivery scope

Draft only; production was not replaced. This checkout contains pre-existing uncommitted website work, which was preserved. No blanket commit/stage operation was performed. Some previous-show records explicitly remain partial archives while their full edits are pending.
