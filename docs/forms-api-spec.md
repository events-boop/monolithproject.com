# Monolith Project V1 Form And API Spec

## Goals

- Keep the site forms small, reliable, and easy to operate
- Validate all input server-side
- Prevent spam and abuse before launch
- Deliver submissions to email immediately
- Support a future database without changing the public API

## V1 Routes

### `GET /api/healthz`

Purpose:
- lightweight uptime and environment verification

Response:

```json
{
  "ok": true
}
```

### `POST /api/contact`

Purpose:
- booking, press, partnerships, and general contact

Request body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Booking inquiry",
  "message": "We would like to book Monolith Project for an event.",
  "company": "",
  "turnstileToken": "token-from-client"
}
```

Validation rules:

- `name`: required, 2-100 chars
- `email`: required, valid email, 3-254 chars
- `subject`: required, 3-120 chars
- `message`: required, 10-4000 chars
- `company`: optional honeypot, must be empty
- `turnstileToken`: required

Success response:

```json
{
  "ok": true,
  "message": "Message received."
}
```

Failure response:

```json
{
  "ok": false,
  "error": "Invalid email address."
}
```

Operational behavior:

- verify Turnstile before processing
- rate limit by IP
- log structured metadata
- send notification to `hello@monolithproject.com`
- optionally send autoresponse from `notifications@send.monolithproject.com`

### `POST /api/join`

Purpose:
- mailing list signup

Request body:

```json
{
  "email": "jane@example.com",
  "firstName": "Jane",
  "source": "site-footer",
  "company": "",
  "turnstileToken": "token-from-client"
}
```

Validation rules:

- `email`: required, valid email
- `firstName`: optional, 0-80 chars
- `source`: optional, 0-100 chars
- `company`: optional honeypot, must be empty
- `turnstileToken`: required

Success response:

```json
{
  "ok": true,
  "message": "You are on the list."
}
```

Failure response:

```json
{
  "ok": false,
  "error": "Unable to process signup."
}
```

Operational behavior:

- verify Turnstile before processing
- rate limit by IP
- dedupe by normalized email
- notify internal inbox only on failures or suspicious activity
- optionally send confirmation email

## Environment Variables

These should live in Netlify site settings, not in source.

- `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL=hello@monolithproject.com`
- `CONTACT_FROM_EMAIL=notifications@send.monolithproject.com`
- `JOIN_FROM_EMAIL=notifications@send.monolithproject.com`
- `HEALTHZ_TOKEN` only if private probes are later needed

Optional future persistence:

- `DATABASE_URL` if Neon is added later

## Abuse Protection

- Cloudflare Turnstile on both public forms
- server-side Turnstile verification
- simple honeypot field
- IP-based rate limiting
- request size limits
- reject HTML/script-heavy payloads if not expected

## Data Model If Storage Is Added Later

### `contact_submissions`

- `id`
- `created_at`
- `name`
- `email`
- `subject`
- `message`
- `source`
- `ip_hash`
- `status`

### `mailing_list_signups`

- `id`
- `created_at`
- `email`
- `first_name`
- `source`
- `ip_hash`
- `status`

## UX Requirements

- inline validation before submit
- disabled submit state while pending
- clear success message after submit
- retry-safe error message on failure
- no full-page reload
- mobile-friendly field spacing and tap targets

## QA Cases

- valid contact submission succeeds
- invalid email is rejected
- empty message is rejected
- honeypot value causes rejection
- invalid Turnstile token causes rejection
- duplicate join request does not create duplicate state
- endpoint rate limit activates correctly
- email delivery works in staging and production

