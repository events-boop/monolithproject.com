# Monolith Project Launch Checklist

## Canonical Setup

- Primary site: `https://www.monolithproject.com`
- Redirect: `https://monolithproject.com` -> `https://www.monolithproject.com`
- Staging site: `https://staging.monolithproject.com`
- Human inbox domain: `monolithproject.com`
- Transactional sending subdomain: `send.monolithproject.com`

## Platform Layout

- DNS, SSL, redirects, WAF, and Turnstile: Cloudflare
- Frontend hosting and serverless endpoints: Netlify
- Human inboxes: Google Workspace
- Transactional email: Resend
- Automated browser tests before cutover: Playwright

## Required DNS Records

Configure these in Cloudflare after the Netlify production and staging sites exist.

### Website Records

- `www` `CNAME` -> `<production-site>.netlify.app` proxied
- `@` `CNAME` -> `apex-loadbalancer.netlify.com` proxied
- `staging` `CNAME` -> `<staging-site>.netlify.app` proxied

### Redirect Rule

- Redirect `https://monolithproject.com/*` to `https://www.monolithproject.com/$1` with status `301`

### Google Workspace

- `@` `MX` priority `1` -> `smtp.google.com`
- `@` `TXT` SPF -> `v=spf1 include:_spf.google.com ~all`
- `google._domainkey` `TXT` -> Google Workspace DKIM value from admin console

### DMARC

- `_dmarc` `TXT` -> `v=DMARC1; p=none; rua=mailto:dmarc@monolithproject.com; pct=100; adkim=s; aspf=s`

Start with `p=none`. Move to `quarantine` after validation, then to `reject`.

### Resend

Use `send.monolithproject.com` for transactional mail.

- Add the exact Resend verification records for the `send` subdomain
- Keep transactional mail off the apex domain

## Required Inboxes

- `hello@monolithproject.com`
- `bookings@monolithproject.com`
- `press@monolithproject.com`
- `dmarc@monolithproject.com`

## Pre-Launch Application Checklist

- Real frontend app exists and can build in CI
- Production Netlify site exists
- Staging Netlify site exists
- `staging.monolithproject.com` resolves correctly
- Contact form route is implemented
- Join-list form route is implemented
- Turnstile is enabled and verified
- Resend is configured for transactional mail
- Inbox routing is tested for all human addresses
- Privacy policy page exists
- Terms page exists
- 404 page exists
- Analytics scripts are reviewed and intentionally enabled

## Pre-Launch Verification

- `GET /` returns `200`
- `GET /events` returns `200`
- `GET /radio` returns `200`
- `GET /gallery` returns `200`
- `GET /about` returns `200`
- `GET /contact` returns `200`
- `GET /privacy` returns `200`
- `GET /terms` returns `200`
- `GET /api/healthz` returns `200`
- `POST /api/contact` succeeds with valid input
- `POST /api/contact` rejects invalid input
- `POST /api/join` succeeds with valid input
- `POST /api/join` rejects invalid input
- Notification emails are delivered
- Confirmation emails are delivered if enabled
- SPF passes
- DKIM passes
- DMARC reports arrive at `dmarc@monolithproject.com`

## Cutover Checklist

- Production DNS records created in Cloudflare
- Cloudflare SSL mode is `Full (strict)`
- Netlify production domain is attached and verified
- Redirect from apex to `www` is active
- Form environment variables are set in Netlify
- Resend API key is set in Netlify
- Turnstile keys are set in Netlify
- Smoke tests pass on staging
- Manual form tests pass on staging
- Rollback owner is assigned
- Launch window is scheduled

## Post-Launch Checks

- Live homepage loads without mixed-content or TLS errors
- Live forms submit successfully
- Notification email arrives within expected time
- No unexpected 404s appear in logs
- No bot/spam surge appears on forms
- DMARC report volume looks normal
- Redirects behave correctly for both apex and `www`

