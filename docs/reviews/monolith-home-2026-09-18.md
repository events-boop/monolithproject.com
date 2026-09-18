# Monolith homepage design review — September 18, 2026

Preview: https://6aadc4310ac521d493aff2c0--monolithproject.netlify.app/

The homepage keeps Monolith’s dark palette, photography, bold typography and architectural borders. The large rotating event dossier is replaced by a compact, stable event strip. Main homepage purchase buttons use Monolith orange; secondary actions are outlined. Duplicate brand and old August 22 promotional sections were removed. July 4 artists are clearly archival.

The September 19 feature, hero, navigation and public event feed now derive approved event details from `shared/events/sunsets-page.json`. This covers JOEZI × MASSUMA, the approved support names, 12 PM–10 PM Chicago time, Castaways, 21+, the dated status notice and AllEvents checkout. The feed overlays this publication onto stale database content while retaining draft/hidden restrictions. Unverified VIP inventory and prices are not carried forward. Event structured data is retained, and weather/status links lead to the full Sunsets guide.

## Verification

- Production build, TypeScript and whitespace checks passed.
- 31 focused unit checks passed: event selection, payloads, stale database reconciliation, checkout actions, attribution and Sunsets publishing safeguards.
- 13 browser checks passed: 360/390/430/768/1363 px homepage layouts, 320 px hero separation, minimum mobile text/touch sizes, route aliases, VIP rendering and consistent featured-event selection.
- Checked the rendered preview in Chrome, including the confirmed lineup, event essentials and ticket links.
- Existing GA4 `G-DE8Z8VS263` and Meta pixel `1049241148606250` remain present. The build’s pixel guard passed. Homepage ticket actions record clicks, not completed purchases; permitted campaign taxonomy is forwarded to AllEvents and personal fields/session IDs are excluded.
- Screenshots: `/tmp/monolith-home-390-opening.png`, `/tmp/monolith-home-1363-opening.png`, `/tmp/monolith-home-390.png`, `/tmp/monolith-home-1363.png`.

## Limits and pending decisions

This homepage pass is a draft preview. No production push was made. The preview build includes the existing working tree; unrelated artist/gallery edits remain uncommitted.

Final performance times remain pending approval. The signup provider connection remains pending on the Sunsets guide. No new postponement/cancellation decision was published. Checkout destination and link behavior were checked; payment completion and external-platform purchase attribution were not tested. No new performance score is claimed.
