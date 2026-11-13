# Monolith First Access — final design and flow pass

Date: 2026-11-12. Local source only; no deployment or public intake activation.
Preservation baseline: `1eb3dca` on `fix/pr0-chunk-recovery-hotfix`.

## Reviewed and preserved

Reviewed DeepSeek's four patched implementation files and appended design report
against the checkpoint. Retained the mobile headline and subcopy, fixed story
alignment, styled consent controls, shorter city placeholder, step-rail scroll
behavior, and the First Access badge palette. Preserved the Monolith header,
existing routes, provider gates, consent wording, and unchecked consent controls.

## Follow-up changes

- `client/src/components/FirstAccessIntake.tsx`: availability checking expires
  after four seconds; hosted signup is available immediately while checking.
  Submissions expire after 30 seconds with an honest unconfirmed outcome, retain
  input, and keep the same key for retrying the same payload. UUID errors are
  caught. A synchronous submit guard prevents overlapping operations.
- The same component focuses missing consent on final validation and focuses
  headings when navigating forward or back, including returning to step one.
  Editing and consent changes are disabled during submission. Success uses a
  snapshot of the submitted identity and interests and includes a privacy link.
- Confirmed `state: "subscribed"` results call the existing Meta Lead helper
  only with accepted analytics consent, with Monolith 2027 attribution and no
  email/name payload. Continue, failed, saved-only, and consent-declined states
  do not emit the event. Tracking errors cannot invalidate a confirmed signup.
- `client/src/components/CookieConsent.tsx`: intake supplies an in-flow portal
  slot, eliminating overlap rather than moving the overlay over another part of
  the form. Other pages retain the existing fixed placement. A mutation observer
  handles lazy route mounts and removal of the slot.
- `client/src/styles/first-access-intake.css`: extend the 11px text floor to
  remaining small labels, retain a fixed story offset with footer breathing room,
  and restore native consent checkboxes in forced-colors mode.

## Browser verification

Safari responsive preview at 390×844 and 1440×900, using the existing dev server:
`http://localhost:3001/newsletter?intake_preview=1`.

- Inspected all three steps, selected world cards, details, summary, and final
  validation. Confirmed focus lands on missing consent after final validation.
- At mobile width, reproduced the prior top-fixed notice covering the step rail.
  After the change, observed the notice inside the card with the rail visible
  above it and form content below it. Declining removes it normally.
- Checked the mobile headline/subcopy, readable tags, city placeholder, navigation
  rail, back navigation focus, and desktop composition after typography changes.
- No live signup was submitted. Successful, slow, failed, and saved-only outcomes
  were checked with mocked component tests, not real Brevo delivery or browser
  screenshots of a real successful subscription.

## Validation

- Node v22.13.0; `tsc --noEmit`: exit 0.
- Targeted Vitest: five files, 31 tests passed, including existing First Access
  service tests and new component/notice regression tests.
- `git diff --check`: passed.
- No build, production database writes, provider activation, push, or deployment.

## Still open

Server-side idempotency, consent version/record history, repeat-signup preference
updates, durable rate limits, and readiness/activation policy remain separate
backend work. The submitted idempotency header is still ignored by the new route.
This pass does not change the current save-before-provider / readiness behavior.
Real Brevo mappings, deliverability, production configuration and pixel delivery
remain unverified. The intake remains behind its existing development preview.
Full release checks and production evidence remain required before launch.
