# Monolith Project Staging To Production Rollout Plan

## Phase 1: Build Readiness

- build the actual frontend app
- implement `GET /api/healthz`
- implement `POST /api/contact`
- implement `POST /api/join`
- configure Turnstile on staging
- configure Resend on staging
- confirm CI passes on every change

Exit criteria:
- app builds cleanly in CI
- route smoke tests pass
- uploader tests pass

## Phase 2: Staging Setup

- create a dedicated Netlify staging site
- attach `staging.monolithproject.com`
- configure staging environment variables
- connect staging forms to test or internal-only email recipients
- disable production-only analytics if needed

Exit criteria:
- `staging.monolithproject.com` is stable
- all public routes return `200`
- forms submit successfully end-to-end

## Phase 3: QA And Launch Rehearsal

- run Playwright smoke tests on staging
- test desktop and mobile manually
- test contact form with valid and invalid payloads
- test mailing list form with valid and duplicate payloads
- confirm notification email delivery
- confirm confirmation email delivery if enabled
- verify redirect behavior and canonical tags
- verify privacy and terms pages exist

Exit criteria:
- no blocking UI bugs
- no blocking form bugs
- no DNS or TLS warnings

## Phase 4: Production Cutover

- create Netlify production site if not already present
- attach `www.monolithproject.com`
- add apex redirect at Cloudflare
- copy production environment variables into Netlify
- verify SSL is active
- deploy current release candidate
- run smoke tests immediately after deploy

Exit criteria:
- production routes pass smoke tests
- production forms submit successfully
- production emails deliver correctly

## Phase 5: Launch Monitoring

- monitor Netlify function logs
- monitor Cloudflare analytics and bot activity
- monitor form success/error rates
- monitor Google Workspace inbox delivery
- monitor Resend delivery events
- review DMARC aggregate reports

First 48 hours:
- keep rollback owner available
- keep staging untouched for comparison
- log any user-reported issues immediately

## Rollback Plan

Use rollback if:
- forms fail in production
- email delivery fails
- critical routes return non-200 responses
- major rendering regression appears

Rollback actions:
- restore previous Netlify deploy
- leave Cloudflare DNS unchanged if domain is still pointing correctly
- disable broken form entry points if needed
- switch contact CTA to direct email temporarily if form handling is the issue

## Owners

Assign one owner per area before launch:

- DNS and SSL
- Netlify deploys
- form backend
- transactional email
- inbox management
- QA signoff
- rollback execution
