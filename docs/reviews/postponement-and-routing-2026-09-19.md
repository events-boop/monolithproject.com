# Confirmed postponement and routing audit — September 19, 2026

Owner instruction: add a postponed alert on Sunsets.vip and Monolith, with a highlight around the affected show. This is recorded as the status approval in the shared publication.

Production deploy: https://6aaec1a8d3d66161284652c2--monolithproject.netlify.app
Live: https://monolithproject.com/ and https://sunsets.vip/

## Publication

- Shared status is EventPostponed and salesEnabled is false. The original September 19 date remains in event schema as the postponed date, without inventing a replacement date.
- Floating amber notices on both front doors, the series page and shared site pages. Homepage event feature and calendar card are highlighted. Original poster labelled postponed/original billing.
- The postponed show and update remain visible after the original end time. Navigation points to the update; the old September ticket redirect also resolves to the notice, overriding the former Posh route.
- No new artist participation, refund or transfer arrangements are promised. Keep booking confirmation and contact events@monolithproject.com for individual questions.
- Cookie controls and pixels preserved. Alerts do not cover active signup fields or the event-page cookie dialog. Fixed the desktop form fallback overlapping retry controls.

## Audit

- Recursive crawl: 84 linked pages, zero remaining broken routes or missing anchors.
- Fixed Untold Story's nonexistent four-chapters gallery link and shared skip-to-content targets on older pages.
- 34 external destinations returned HTTP 200 after redirects. This verifies reachability, not third-party account access, playback rights or checkout completion.
- Both apex and www Sunsets.vip redirect to the correct event guide.
- 17 page/routing browser checks, 17 targeted unit checks, and 8 final Sunsets responsive/accessibility/interaction checks passed. Widths: 360, 390, 430, 768 and 1363 CSS px.
- Build, TypeScript and campaign pixel guard passed. Form success/error paths were tested using mocked responses; no real signup was submitted and actual delivery was not claimed.

## Source state

Published the reviewed working-tree build directly through the existing Netlify site for this announcement. The canonical checkout contains earlier uncommitted work; no blanket commit or GitHub push was made. GitHub source synchronization remains outstanding and must preserve these changes before the next Git-triggered deployment.
