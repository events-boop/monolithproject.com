# CMS foundation review — September 21, 2026

Initial source review for Kimi, followed by the local repairs recorded below.
Repository: `/Users/starkindustries/Downloads/monolith-project website` (no trailing space).
The source is being developed locally; recheck these findings against later edits.
Reviewed cmsRepo.ts SHA-256: 7db3728ab9d6f1a24c3c219f359a00b6905b3a800606398703911b3ee88ac9dc.

## P1 — Save/restore can permanently strand the current draft

Locations: `server/db/cmsRepo.ts:175`, `:374`, `:481`.
Both paths mark the old draft superseded before inserting the replacement and moving
the document pointer. If insertion or pointer update fails, the pointer can still
name a superseded row. A retry then attempts to supersede that same row with
`state = draft`, affects zero rows, and fails again. The current per-statement
compare-and-swap checks do not provide rollback.

Make each mutation an atomic database operation. Guard the expected document
revision, allocate the new revision, change the old state, and move the pointer in
one transaction with database-side failure checks. Do not merely batch the current
queries and check zero-row results after commit. Add failure-injection and concurrent
save tests with a real disposable database before exposing these writes.

## P1 — Publish can leave public reads empty after a failed operation

Locations: `server/db/cmsRepo.ts:411-438`, `:503-509`.
Publish changes the document's published pointer and clears the draft pointer before
marking the target revision published. If the second write fails, getPublishedPayload
returns null for the newly selected row. Retrying publish rejects it because it is
no longer the current draft. Superseding the prior publication can also fail after
new content has become visible. Publish must atomically update the pointers and both
revision states, preserving the old publication on every failure.

## P2 — Restore lacks stale-editor protection and bypasses current validation

Locations: `server/db/cmsRepo.ts:465-488`; `server/lib/schemas.ts` cmsRestoreBodySchema.
Restore accepts only the historical revision ID. It fetches the latest document and
supersedes its draft, even if the operator was acting from an older view. Accept and
check the operator's expected base revision. Validate historical payloads against
current schemas before restoring; also revalidate immediately before publishing.
Currently saveDraft validates, but restoreRevision and publishRevision do not.
A revision admitted under an older contract can therefore bypass a newer rule.

## P2 — Initial seeding replaces an existing unpublished editor draft

Location: `scripts/cms_seed.mts:131-138`.
When a document has a draft but no publication, the seed script saves the static
payload over that draft and publishes it. The content remains in revision history,
but the editor's active draft is displaced. Default to skipping/reporting existing
documents or drafts; require an explicit, separate recovery/replace operation.

## Validation and scope

Ran: `npx vitest run server/db/__tests__/cmsRepo.test.ts server/db/__tests__/cmsPayloadSchemas.test.ts`.
Result: 41 tests passed. These cover schemas, pure revision helpers and missing-DB
behavior; they do not establish connected-database rollback/concurrency safety.
No migration, seed command, production write or campaign send was performed.
At review time the repository was used by the seed script, with admin request-body
schemas present; no CMS admin route/public CMS reader integration was located.

## Supported implementation direction

The existing Neon HTTP stack can run non-interactive transactions. Drizzle's local
Neon HTTP batch implementation calls the driver's transaction API. For dependent
mutations, use an atomic SQL operation/database function with document locking and
DB-side conflict checks, or explicitly use a driver supporting interactive
transactions. A callback transaction cannot simply be pasted onto neon-http.

References:
- https://github.com/neondatabase/serverless/blob/main/README.md
- https://orm.drizzle.team/docs/batch-api
- https://orm.drizzle.team/docs/connect-neon

## Brevo handoff status

Live GET https://monolithproject.com/api/sunsets/subscriptions returned
`{"ok":true,"audiences":{"event":false,"radio":false}}` during this review.
This verifies the public readiness result only, not the precise upstream error.
The earlier handoff recorded hosted IP-authorization failures. Current official
Netlify documentation confirms changing default outbound IPs and an Enterprise
Private Connectivity add-on; Brevo documents rejection of unauthorized IPs even
with a valid API key. Resolving delivery requires a fixed-IP path or an explicitly
approved change to Brevo IP restrictions. No settings were changed.

- https://docs.netlify.com/manage/security/private-connectivity/
- https://developers.brevo.com/docs/ip-security


## Local repairs and verification

The four findings above describe the original implementation. The local repository
now uses a single atomic SQL statement for each save, publish and restore, with
locked document pointers and revision-state guards. Public reads join the selected
publication in one query. Restore requires the editor's expected `baseRevision`;
restore and publish both validate against the current payload schema. Initial
seeding skips every existing document, including unpublished drafts.

Verified against an isolated, disposable local PostgreSQL database: 11 integration
tests pass, covering rollback after injected revision/pointer failures, retry,
stale restore/seed protection, current-schema validation, concurrent saves,
concurrent publication and competing save/publication. The existing 41 CMS schema
and repository tests also pass. No production database migration or seed ran.
The PostgreSQL CI workflow is prepared locally; no remote CI run is claimed.

The admin restore route forwards the required base revision. A CMS editor must
send that value (or explicit null for an initially empty document); requests that
omit it are rejected rather than silently replacing a newer draft.
