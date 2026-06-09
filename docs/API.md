# Monolith Project: API Reference

This document catalogs every HTTP endpoint exposed by the Monolith backend. All routes except the top-level health probe and Catch-All SPA handler live under `/api`.

---

## Global Conventions

### Origin Validation

All `POST`, `PUT`, `PATCH`, and `DELETE` requests must pass a **same-origin browser guard**. The guard inspects the `Origin` header and the `Sec-Fetch-Site` header; requests failing both checks receive `403 Forbidden`. The following endpoints are **exempt** from this guard:

- `POST /api/webhooks/laylo`
- `POST /api/webhooks/posh`

### Secret Comparison

Every secret comparison (admin secret, webhook signing secrets, sponsor password, HMAC session cookies) uses **constant-time HMAC** (`timingSafeEqual` / `crypto.timingSafeEqual`) to prevent timing side-channel attacks.

### Rate Limiting

Rate limits are expressed as `_n_ req / _w_`. The global API bucket is **2,000 req / 15 min** by default. Individual route overrides are noted per endpoint. Webhook routes share a dedicated high-capacity bucket. Limits are backed by a database-backed store that falls back to in-memory on persistence failure.

### Correlation IDs

Every error response includes a `requestId` correlation field; internal stack traces are never leaked to the client.

### Content-Type

All API endpoints accept and return `application/json` unless otherwise noted.

---

## 1. Health & Readiness

| Method | Path            | Rate Limit       | Auth               | Description |
| ------ | --------------- | ---------------- | ------------------ | ----------- |
| `GET`  | `/health`       | Unmetered        | None               | Liveness probe. Returns `200 OK` with a simple status payload. Used by infrastructure health checks and load-balancer targets. |
| `GET`  | `/api/health`   | Skipped          | None               | Same liveness probe as `/health` but routed under `/api` to bypass the global rate limiter entirely. |
| `GET`  | `/api/ready`    | Unmetered        | `Admin-Secret` header | Readiness probe. Tests the database connection. Returns `200 OK` when the database is reachable, `503 Service Unavailable` otherwise. Requires the `Admin-Secret` header to match the configured `ADMIN_SECRET`. |

---

## 2. SEO

| Method | Path            | Rate Limit       | Auth               | Description |
| ------ | --------------- | ---------------- | ------------------ | ----------- |
| `GET`  | `/sitemap.xml`  | Unmetered        | None               | Dynamic XML sitemap. Includes static route entries (home, about, etc.) plus dynamically generated `<url>` nodes for every published event. |
| `GET`  | `/robots.txt`   | Unmetered        | None               | Returns `text/plain` robots directives. Allows all crawlers and points to the sitemap URL. |

---

## 3. Leads

| Method | Path            | Rate Limit       | Auth               | Description |
| ------ | --------------- | ---------------- | ------------------ | ----------- |
| `POST` | `/api/leads`    | 24 req / 15 min  | Same-origin        | Captures waitlist email signups. Accepts an optional **idempotency key** (deduplication), an optional **honeypot** field for bot rejection, and the lead's email + campaign metadata. On success the handler: subscribes the lead to the configured lead provider, syncs the contact to Laylo, sends a welcome email, fires a **Meta CAPI** server-side event, and mirrors the record to Airtable. |

### Idempotency

Clients may send an `Idempotency-Key` header. The server deduplicates by key for a configurable window. Repeated submissions with the same key return the original response without side effects.

### Honeypot

If the `_honey` field is present and non-empty the request is silently accepted (`200 OK`) but no lead is created and no downstream services are invoked.

---

## 4. Ticket Intent

| Method | Path                 | Rate Limit       | Auth               | Description |
| ------ | -------------------- | ---------------- | ------------------ | ----------- |
| `POST` | `/api/ticket-intent` | 90 req / 15 min  | Same-origin        | Logs ticket purchase intent. Accepts event ID, ticket tier, and quantity. This endpoint is a lightweight fire-and-forget analytics sink; it does not process payments or hold inventory. |

---

## 5. Booking Inquiry

| Method | Path                    | Rate Limit       | Auth               | Description |
| ------ | ----------------------- | ---------------- | ------------------ | ----------- |
| `POST` | `/api/booking-inquiry`  | 8 req / 15 min   | Same-origin        | Submits a booking or partnership inquiry. Honeypot-protected (same `_honey` semantics as leads). Collects name, email, artist/collective name, event type, and freeform message. |

---

## 6. Contact

| Method | Path             | Rate Limit       | Auth               | Description |
| ------ | ---------------- | ---------------- | ------------------ | ----------- |
| `POST` | `/api/contact`   | 8 req / 15 min   | Same-origin        | General contact form. Collects name, email, subject, and message. Delivers to the configured internal contact channel. |

---

## 7. Webhooks

| Method | Path                      | Rate Limit           | Auth                         | Description |
| ------ | ------------------------- | -------------------- | ---------------------------- | ----------- |
| `POST` | `/api/webhooks/laylo`     | 600 req / 15 min     | None (skips origin guard)    | Receives **Laylo** signup webhooks. Payloads are deduplicated via SHA-256 digest of the raw body. Unknown or unverifiable payloads are discarded with `200 OK` to prevent retry storms. |
| `POST` | `/api/webhooks/posh`      | 600 req / 15 min     | `Posh-Secret` header (skips origin guard) | Receives **Posh** ticket-purchase webhooks. Supports event types: `new`, `update`, `cancel`, `refund`. The `Posh-Secret` header is validated via constant-time comparison **before** the body is parsed (pre-buffer authentication). The raw body is preserved at `req.rawBody` for downstream integrity checks. |

---

## 8. Social Echo

| Method | Path               | Rate Limit       | Auth               | Description |
| ------ | ------------------ | ---------------- | ------------------ | ----------- |
| `GET`  | `/api/social/echo` | Unmetered        | Feature flag       | Returns a snapshot of live crowd activity. The response count is **coarse-counted** (rounded down to the nearest 10) to obfuscate exact audience size. Gated by the `PUBLIC_SOCIAL_ECHO_LIVE` feature flag; returns a minimal empty payload when the flag is disabled. |

---

## 9. Sponsor

| Method | Path                   | Rate Limit       | Auth                         | Description |
| ------ | ---------------------- | ---------------- | ---------------------------- | ----------- |
| `POST` | `/api/sponsor-access`  | 10 req / 15 min  | Same-origin                  | Validates a sponsor password (constant-time HMAC comparison). On success issues an **HMAC-signed session cookie** with a **30-minute TTL**. |
| `GET`  | `/api/sponsor-deck`    | 20 req / 15 min  | Sponsor session cookie       | Validates the HMAC-signed session cookie set by `/api/sponsor-access`. On success serves the sponsor PDF deck as `application/pdf` with appropriate `Content-Disposition` headers. Returns `401 Unauthorized` if the cookie is missing, expired, or tampered with. |

---

## 10. Site Data

| Method | Path              | Rate Limit                     | Auth               | Description |
| ------ | ----------------- | ------------------------------ | ------------------ | ----------- |
| `GET`  | `/api/site-data`  | 600 req / 5 min (configurable) | None               | Serves public site data (events, CTAs, marketing copy). Accepts a `?path=` query parameter to scope to a specific route. Employs **stale-while-revalidate** caching and supports **ETag-based conditional requests** (`If-None-Match` → `304 Not Modified`). |

---

## 11. Ops (Admin)

All ops endpoints require the `Admin-Secret` header.

| Method | Path                                | Rate Limit    | Auth               | Description |
| ------ | ----------------------------------- | ------------- | ------------------ | ----------- |
| `POST` | `/api/ops/cache/invalidate`         | Unmetered     | `Admin-Secret`     | Invalidates the site-data cache. Accepts an optional `path` in the body to purge a specific route; clears the entire cache when no path is provided. |
| `GET`  | `/api/ops/baseline`                 | Unmetered     | `Admin-Secret`     | Returns a performance Web Vitals baseline snapshot (LCP, CLS, INP, TTFB) collected from production telemetry. |
| `GET`  | `/api/ops/sunsets-analytics`        | Unmetered     | `Admin-Secret`     | Returns Sun(Sets) campaign funnel analytics: impressions, lead captures, ticket intents, and conversions aggregated per stage. |

---

## 12. Outbound Redirect Tracker

| Method | Path               | Rate Limit       | Auth               | Description |
| ------ | ------------------ | ---------------- | ------------------ | ----------- |
| `GET`  | `/go/:group/:key`  | Unmetered        | None               | Outbound redirect tracker. Resolves `:group` and `:key` to a destination URL, decorates the redirect with configured UTM parameters, logs the click event, and issues a `302 Found` redirect. |

### Supported Groups

| Group      | Description                     |
| ---------- | ------------------------------- |
| `tickets`  | Ticket purchase links           |
| `waitlist` | Waitlist / lead capture links   |
| `media`    | Press, photos, and video assets |
| `gallery`  | Image gallery destinations      |
| `forms`    | Form and survey links           |
| `social`   | Social media profile links      |

### Prototype-Pollution Hardening

The redirect mapping store uses a null-prototype object. Requests with `group` or `key` values matching `Object.prototype` properties (e.g. `__proto__`, `constructor`, `toString`) are rejected with `404 Not Found` rather than resolving to a prototype value.

---

## 13. Tracking

| Method | Path                     | Rate Limit       | Auth               | Description |
| ------ | ------------------------ | ---------------- | ------------------ | ----------- |
| `POST` | `/api/track/page-view`   | 240 req / 15 min | Same-origin        | Persists a funnel page view. Records route, referrer, and session metadata for conversion-path analysis. |
| `POST` | `/api/track/link-click`  | 240 req / 15 min | Same-origin        | Persists a link click event with optional event interest and content engagement tags. Supports campaign attribution. |
| `POST` | `/api/track/lead`        | 240 req / 15 min | Same-origin        | Fires a server-side **Meta CAPI Lead** event for the Lake campaign. Used as a server-side redundancy for browser-based Meta Pixel lead reporting. |

---

## 14. SPA & Fallthrough

| Method   | Path     | Rate Limit    | Auth    | Description |
| -------- | -------- | ------------- | ------- | ----------- |
| `GET`    | `*`      | N/A           | None    | Serves static assets from `dist/public`. The root route (`/`) and all known SPA routes receive the pre-rendered `index.html` with **hero preload injection** (critical CSS and hero image `<link rel="preload">` tags) embedded. Subresource requests (JS, CSS, images, fonts) are served directly from the filesystem. |
| `GET`    | `/api/*` | N/A           | None    | Catch-all for unmatched `/api/*` requests. Returns `404 Not Found` as JSON (`{ "error": "Not Found" }`) to prevent the SPA from swallowing unknown API routes. |

---

## Rate Limit Summary

| Endpoint                        | Limit                  |
| ------------------------------- | ---------------------- |
| Global `/api` bucket            | 2,000 req / 15 min     |
| `POST /api/leads`               | 24 req / 15 min        |
| `POST /api/ticket-intent`       | 90 req / 15 min        |
| `POST /api/booking-inquiry`     | 8 req / 15 min         |
| `POST /api/contact`             | 8 req / 15 min         |
| `POST /api/webhooks/laylo`      | 600 req / 15 min       |
| `POST /api/webhooks/posh`       | 600 req / 15 min       |
| `POST /api/sponsor-access`      | 10 req / 15 min        |
| `GET /api/sponsor-deck`         | 20 req / 15 min        |
| `GET /api/site-data`            | 600 req / 5 min (configurable) |
| `POST /api/track/*`             | 240 req / 15 min       |
| Health, SEO, Social Echo, Ops  | Unmetered              |
| `/go/*`, SPA static files       | Unmetered              |
