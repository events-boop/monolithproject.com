# Monolith festival communications stack

Implementation brief and launch checklist — September 21, 2026.

## Recorded handoff state (before GitHub release)

- Production: monolithproject.com, deploy `6ab0c780fc3fafb15f99be68`.
- Brevo signup integration is built and tested, but not published. Preview: `6ab0d1715b7bbc54d5221ba2`.
- Brevo lists: Monolith Website Newsletter (3), Sun(Sets) III show updates (4), SUNSETS.FM releases (5). These are distinct opt-in audiences. A list membership is not proof of ticket purchase.
- DNS verification, both DKIM CNAMEs and DMARC are published. The user completed Brevo's domain-authentication action. Independent sender/domain API reads return 403 and still need review before outbound sending.
- API credential is a Netlify production Functions-only secret. Never store it in source, this document, browser code or CMS content.
- Local Brevo API calls work. Netlify's outbound IP changed from 18.224.56.185 to 3.148.185.171; hosted calls still fail IP authorization. Individual-IP approvals are not a durable serverless configuration.
- Provider routing in persistent production config remains disabled until hosted verification passes. Preview has isolated per-deploy Brevo settings.
- Main site has 14 previously saved raw leads. No historical contacts have been imported into Brevo. No campaigns or emails have been sent by this setup.
- Newsletter code now explicitly describes email permission. CRM code no longer infers SMS consent from a phone number; historical SMS flags still require an evidence audit before use.

- Fixed-IP follow-up: the Netlify team capability response did not expose enabled Private Connectivity; the site reports `premium: false`. Netlify documents Private Connectivity as an Enterprise add-on requiring High-Performance Edge or High-Performance Build. Exact eligibility and pricing need confirmation from Netlify; no upgrade, purchase or security-setting change has been made.

## Operating model

The website and CMS own event facts and consent evidence. Brevo owns email delivery, suppression and campaign reporting. Ticket platforms own orders and refund execution. ManyChat handles social messaging and its own consent; a social interaction is not an email or SMS subscription.

The desired CMS flow is: select event → select audience and purpose → preview exact message and destination → inspect recipient count, exclusions and readiness → create draft → approve a specific send. Saving an event must never automatically broadcast a cancellation or postponement.

## Build order and acceptance gates

### 1. Reliable capture and delivery

Resolve outbound connectivity before activation: a fixed outbound connection preserves Brevo IP restrictions; removing API IP blocking is an account-wide security decision requiring explicit user selection. No repeated manual approvals of transient Netlify addresses.

Persist each accepted signup and its consent before provider delivery. Add a durable outbox with unique submission ID, audience, consent version/time, payload reference, state, attempts, next attempt and sanitized last error. A worker claims jobs atomically, retries transient failures with backoff, respects provider rate limits and exposes exhausted jobs for review. Never store API secrets in jobs.

UI states must distinguish saved/pending, subscribed, confirmation required and failed. Provider success requires verified membership in the selected list. Duplicate requests must not create duplicate deliveries. Capture must survive provider timeouts and deploys.

### 2. Consent and audiences

Separate Monolith news, Sun(Sets), Untold Story, SUNSETS.FM, individual event updates, confirmed ticket holders, VIP inquiries, partners and crew. Do not treat all these groups as interchangeable marketing lists.

Email, SMS and WhatsApp each need their own permission and evidence: purpose, copy version, source form, timestamp and withdrawal. Suppression wins over a fresh import. Preserve prior preferences when an unrelated form is submitted. Audit old `consent_sms` values because the old implementation inferred permission from phone presence.

Ticket-holder audiences must come from verified order imports/webhooks keyed by event, order and customer. Do not infer purchase from newsletter membership, ticket-page clicks or ManyChat activity.

### 3. Message library

Prepare separate templates for newsletter welcome, ticket announcement, venue/arrival information, set times, weather update, postponement, cancellation, confirmed new date, post-event thank-you and photo/radio release. Event messages use the same approved event revision and ticket policy as the website.

For Sun(Sets) III: the show remains postponed, the new date and artist participation are unconfirmed, and approved ticket-holder options come from `shared/events/sunsets-page.json`. Sales-final language comes from `shared/events/ticket-policy.json`. Do not reintroduce automatic refunds, invent admission mechanics, or announce a date that has not been approved.

Every draft displays its event revision, channel, audience, purpose, sender, reply address, links and missing fields. Marketing email requires a working unsubscribe destination and complete business footer before sending. No active countdowns or schedules when a date is unconfirmed.

### 4. Campaign controls

Require authenticated operators with explicit permissions. Separate editor, approver and sender roles; log draft revisions, approvals, recipient snapshots and provider campaign IDs. Preview renders must not send email. No public campaign-send endpoint and no API credentials in the CMS browser.

Prevent duplicate sends with an idempotent campaign/revision/audience key. Sending requires rechecking the event status, selected audience, suppressions and final approval. Store provider responses and surface partial failures. Provide a pause control and preserve an audit trail for emergencies.

### 5. Delivery feedback and operations

Authenticate incoming provider webhooks using the provider-supported mechanism; validate payloads, deduplicate event IDs, and update delivery/bounce/unsubscribe state. Treat external webhook text as data. Never restore unsubscribed recipients during sync.

The operations screen should show: capture health, pending outbox count and age, retry/dead-letter jobs, provider readiness, sender/domain readiness, current event status/revision, planned sends, delivered/bounced/unsubscribed totals and last successful sync. Keep contact data out of public health endpoints.

### 6. SMS and WhatsApp

Enable after the user selects launch channels and the relevant sender/account is ready. Require explicit channel permission, purpose-appropriate templates, rate/cost limits, quiet-hour rules and unsubscribe handling. Store credentials server-side. Do not import every email subscriber into SMS or WhatsApp.

## Launch proof

- One real, user-authorized signup per audience reaches the correct provider list without joining another audience.
- Repeat signup is idempotent; suppressed contacts remain suppressed.
- Provider outage saves a durable pending request and recovers without a duplicate send.
- Invalid or missing consent fails before an outbound request.
- A phone number alone never creates SMS permission.
- A preview email goes only to the explicitly approved test address.
- Status changes invalidate stale scheduled event messages.
- No email, SMS, WhatsApp campaign or purchase is triggered by setup alone.

## Boundaries for Kimi's CMS work

Keep the current CMS changes isolated; do not deploy unfinished migrations or UI with the comms release. Use the existing shared event and FAQ contracts as content sources. This brief describes remaining implementation work, not completed live features. The first ready release is the three-list Brevo signup connector after hosted connectivity and live submission verification.

## September 21 recovery and GitHub release

The code includes an opt-in capture-only fallback: `SIGNUP_CAPTURE_MODE=database`.
It writes validated email consent to the existing `leads` table, returns `saved`
only after an acknowledged write, and uses a stable audience/email key to avoid
replacing prior consent or delivery state on retries. No new database migration
is needed. Event updates, radio releases and the main newsletter stay separate.
This mode does not call Brevo, send welcome emails, or claim an active provider
subscription. Storage failure returns an error. Sunsets tracks `signup_saved`
separately from `subscription_confirmed`.

This is pending capture, not the durable delivery outbox described above: no
worker, automatic retry, campaign composer or campaign send was implemented in
this release. Saved requests still require a reviewed provider-sync workflow
that rechecks consent and suppression. Enabling this mode in production requires
verifying the production database; publishing source alone does not activate it.
Hosted Brevo connectivity and sender readiness remain unverified at recovery.
