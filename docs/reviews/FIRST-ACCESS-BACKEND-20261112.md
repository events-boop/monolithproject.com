# Monolith First Access — backend reliability checkpoint

Date: 2026-11-12. Repository: canonical Monolith website checkout.
Design baseline: `d2cef4d`. Latest shared honeypot patches preserved at `7cc1e50`.
This is a local implementation checkpoint, not a production activation record.

## Changes

- `shared/first-access.ts` owns the exact rendered marketing disclosure, adult
  confirmation and consent version. The client sends that version; the server
  rejects absent/stale versions before storing or subscribing anything.
- `server/services/first-access-store.ts` uses the existing `leads` table. Each
  operation gets its own consent/preferences snapshot under a hashed operation
  ID; the raw key is not stored. A returning visitor's new preferences create a
  new receipt without overwriting earlier consent or another newsletter record.
- A conditional database UPDATE claims a 60-second delivery lease. Only the
  current lease owner can finish it. Worker crashes can recover after expiry.
  Success and suppression results replay durably; transient failures release
  the claim for the same operation to retry. Changed payloads cannot reuse a key.
- First Access verifies existing Brevo membership before issuing another contact
  update on retries. It still refuses blacklisted addresses. Other integrations
  retain their existing update behavior through an opt-in provider option.
- POST limits use the shared database-backed limiter with storage required:
  60 attempts per connection and eight per normalized email per 15 minutes.
  These are implementation defaults, not production load measurements. They
  reduce the previous eight-person shared-NAT lockout and require launch tuning.
  Limiter storage failures return 503 rather than silently using instance memory.
- The UI uses `Retry-After` for 429 copy and preserves its existing failure and
  recovery design. A honeypot acknowledgement has state `accepted`, never a
  subscribed state that could count as a conversion.

No new table, migration, environment value, public route, or activation flag was
added. The general newsletter capture and sibling SUNSETS.FM repository are
unchanged. City and interest preferences are durable locally; no unverified
Brevo attribute mapping has been invented or enabled.

## Endpoint contract

`GET /api/first-access` retains `{ ok: true, available: boolean }` and no-store.
This is a readiness probe, not a guarantee of later provider availability.

`POST /api/first-access` requires JSON and `Idempotency-Key` containing 16–128
ASCII letters, digits, underscores or hyphens. The current browser generates a
UUID. Validated fields: first name, normalized email, optional city, one to three
Monolith interests, explicit email consent, adult confirmation, matching
`consentVersion`, and the existing generated honeypot field.

| Outcome | HTTP | Meaning |
| --- | --- | --- |
| Confirmed provider subscription | 200 | `ok: true`, `state: subscribed` |
| Completed operation replay | Original result | `X-Idempotent-Replay: true`; no new provider call |
| Operation already processing | 409 | Saved, not confirmed; `Retry-After: 2` |
| Key reused for changed details | 409 | Refresh and use a new operation reference |
| Suppressed address | 409 | No reactivation; terminal result may replay |
| Invalid/missing consent, version, or operation reference | 400 | No capture or provider call |
| Rate limited | 429 | `Retry-After` from the actual bucket |
| Provider delivery failed after capture | 502 | `requestSaved: true`; same key can retry |
| Storage/readiness/list mapping unavailable | 503 | No claimed subscription; hosted recovery remains available |
| Filled decoy | 202 | Neutral `accepted` acknowledgement, no provider call or conversion |

Existing receipts replay before the provider readiness check. New capture still
fails closed when provider readiness cannot be verified. This pass does not
introduce an offline collection/automatic resend policy. Saved operations are
pinned to their original Brevo list instead of silently moving audiences after
a configuration change. Idempotency coordinates this website's operation; it
does not promise exactly-once behavior inside a third-party provider.

## Verification

- Node v22.13.0; `tsc --noEmit`: exit 0.
- Full `vitest run`: 65 files passed, one skipped; 605 tests passed, 11 skipped.
- Tests cover concurrency orchestration, changed-key payload rejection,
  retryable versus terminal results, preference/consent preservation, HTTP
  replay/retry headers, required limiter storage, shared connections, suppression,
  existing Brevo membership, and no conversion on honeypot acknowledgement.
- Store tests inspect generated PostgreSQL claim/lease-owner conditions using
  Drizzle's SQL dialect. They do not execute those statements against PostgreSQL.
  HTTP tests run a loopback Express server with mocked storage/service boundaries.
  Provider tests mock Brevo; a passing suite does not prove real delivery.
- `git diff --check`: passed. No build, migration, production/customer writes,
  live subscription, push or deployment was performed.

## Remaining staging checks

The loaded local environment has no `DATABASE_URL`, `BREVO_API_KEY`,
`BREVO_LIST_ID`, or selected Brevo lead provider. Only configuration presence
was reported; no credential values were printed. Production settings were not
inspected and cannot be inferred from the local absence.

1. Identify the approved Monolith staging environment and test recipient.
2. Confirm `leads` and `rate_limit_buckets` schema and least-privilege access.
   Exercise two real workers claiming the same receipt, stale-lease recovery,
   and status-write failure reconciliation against that environment.
3. Verify the Monolith newsletter list, suppression behavior, exact consent
   disclosures, approved city/interest field mappings, and any automations.
4. Run one authorized test signup, verify stored evidence and provider membership,
   replay it, and check actual welcome automation/delivery separately. Provider
   membership alone is not evidence that an email was sent or delivered.
5. Decide activation explicitly, then build/validate the candidate and verify
   direct Netlify API handling, historical routes, pixel guard, responsive states,
   and consent-aware production tracking before publishing.

The intake remains in its existing development preview. Local commits are not
proof of an off-machine backup; source distribution still follows `AGENTS.md`.
