# DEEP REVIEW — Monolith project: the 14 dirty files and the 39-commit range

**Record:** `~/Downloads/monolith-project website`
**Branch:** `fix/pr0-chunk-recovery-hotfix` · 39 commits ahead of `origin/main`, none pushed
**Reviewer:** Hermes (DeepSeek) · **Date:** 2026-11-12
**Commissioned by:** the owner, immediately after the production release of the same day

---

## 0. CERTIFICATION & COVERAGE

```
MODEL: deepseek-flash (DeepSeek)   PRIOR KNOWLEDGE OF THIS REPO: NONE
CERTIFICATION: "Evaluated only against files inside ~/Downloads/monolith-project website.
Deviations: none. Self-authored 2 docs under docs/reviews/ (this file and the prompt)."
```

Read in full: `server/services/first-access.ts`, `server/routes/first-access.ts`, `server/services/signup-capture.ts` (return path), `server/__tests__/first-access.test.ts`, `client/src/components/EventStatusBadge.tsx`, `client/src/components/FirstAccessIntake.tsx` (666 lines), the complete `git diff` of the 7 modified files, `git show 1130a09`.
Sampled: `shared/events/publishedState.ts` (header + `getPublishedEventState`), `client/src/pages/Schedule.tsx` (status helper + editorial card), `server/routes/leads.ts` (idempotency block), the six CSS files that styled the replaced attributes, `docs/PRODUCTION_RELEASE_20261112.md`.
Not opened: `client/src/styles/first-access-intake.css` (651 lines, read only as a diff-adjacent artifact — no selector audit), 1,180 of the 1,246 files in the commit range, `e2e/`, `netlify/`. A file I did not open is never cited as evidence.

**Verification receipts (run today, on the dirty tree):**
```
./node_modules/.bin/tsc --noEmit        exit 0, no diagnostics
./node_modules/.bin/vitest run          61 files passed, 1 skipped · 569 tests passed, 11 skipped
vitest run server/__tests__/first-access.test.ts   13 passed
```

---

## 1. VERDICT

**The 14 files:** do not commit as-is. They are clean, typed, tested — and inert. 1,704 lines of intake are reachable only behind a `import.meta.env.DEV` flag, so no production visitor can use any of it. Two things must be fixed before commit: wire it to a route, and stop advertising an idempotency contract the server does not honour.

**The 39 commits:** absolutely must be pushed, and that is the most urgent item in this document — production is deployed from this branch and the branch exists on exactly one disk on earth.

**Single first change:** `git push -u origin fix/pr0-chunk-recovery-hotfix`. Nothing below matters if that disk dies.

---

## 2. FINDINGS, RANKED

`VALUE = round(100 × (0.35·Impact + 0.25·Reach + 0.20·Confidence + 0.20·Ease) / 10)`

| Rank | ID | Finding | Category | I | R | C | E | VALUE | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| 1 | F-01 | Production source exists on one disk only; Netlify published from an unpushed branch | PROCESS | 10 | 10 | 10 | 6 | **92** | `docs/PRODUCTION_RELEASE_20261112.md:9-11` |
| 2 | F-02 | The entire First Access intake is unreachable in production — dev-only query flag | REACHABILITY | 9 | 10 | 10 | 9 | **95** | `client/src/pages/Newsletter.tsx:12-18` |
| 3 | F-03 | Client sends `Idempotency-Key`; `/api/first-access` never reads it | CONTRACT | 6 | 4 | 10 | 8 | **67** | `FirstAccessIntake.tsx:152` vs `routes/first-access.ts:24-38` |
| 4 | F-04 | Consent record cannot be tied to the consent copy shown | COMPLIANCE | 7 | 5 | 9 | 5 | **65** | `signup-capture.ts:63` vs `FirstAccessIntake.tsx:536-540` |
| 5 | F-06 | Badge swap orphaned six CSS selectors; nothing tests them | REGRESSION | 4 | 5 | 10 | 9 | **65** | `schedule.css:110`, `home.css:923`, `event-alert.css:72`, `art-direction.css:216,299` |
| 6 | F-05 | Provider outage loses signups even though a durable `pending` path exists | CORRECTNESS | 6 | 6 | 8 | 5 | **62** | `services/first-access.ts:68-76` |
| 7 | F-07 | Up to three `getPublishedEventState()` calls per row, each with its own `new Date()` | CORRECTNESS | 3 | 4 | 9 | 9 | **57** | `Schedule.tsx:279-283`, `:34`, `:52`; `HomeUpcomingShows.tsx:24,46` |
| 8 | F-08 | `crypto.randomUUID()` throws outside a secure context, after three steps of typing | A11Y/ROBUSTNESS | 3 | 3 | 8 | 8 | **50** | `FirstAccessIntake.tsx:144` |
| 9 | F-09 | Honeypot answers 400 with a generic validation message — detected, and indistinguishable in support | SECURITY | 2 | 3 | 9 | 9 | **51** | `services/first-access.ts:60-67` |
| 10 | F-10 | `preferMemory: true` rate limits are per-instance on serverless | SECURITY | 4 | 3 | 7 | 5 | **46** | `routes/first-access.ts:16,30` |
| 11 | F-11 | No `[data-status="first-access"]` palette rule; the flagship state renders in the default blue | POLISH | 1 | 4 | 10 | 10 | **54** | `event-status-badge.css:1-50` |

### F-01 · Production runs code that is not in any remote · **92**
`docs/PRODUCTION_RELEASE_20261112.md` states it plainly: published from `3a3edfc7f58d69d67645ccb0b6effb181aa5f319` on `fix/pr0-chunk-recovery-hotfix`, *"The source branch was not pushed."* Thirty-nine commits, 1,246 files, +71,146/−9,197. Nothing here is on GitHub; `origin/main` does not contain the code that is serving `monolithproject.com` right now.
Harm: no rollback target that anyone else can reach, no second pair of eyes, no CI on the shipped artifact, and a laptop failure becomes a production incident with no source of truth. This is the only finding in this document with a non-recoverable failure mode.
Fix: `git push -u origin fix/pr0-chunk-recovery-hotfix` today, then open a PR so the range has a review surface even if it merges later.

### F-02 · 1,704 lines no visitor can reach · **95**
`client/src/pages/Newsletter.tsx:12-18`:
```tsx
if (import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get("intake_preview") === "1") {
  return <FirstAccessIntake designPreview />;
}
```
A grep for `FirstAccessIntake` across the repo returns exactly two hits: the import and this branch. Both are compiled out of production (`import.meta.env.DEV` is `false`), so `/newsletter` still renders the old page and nothing on the live site can call `POST /api/first-access`. The route, the service, the 13 tests and 651 lines of CSS are shipped as dead weight — the component and its stylesheet stay in the bundle because the import is static.
Harm: the owner believes the 2027 intake exists; a visitor in production sees the previous form. Every day this sits, it also costs bundle bytes on every page load that imports `Newsletter`.
Fix: decide explicitly — (a) ship it behind the availability flag (the component already fails safe to the hosted form when `GET /api/first-access` says unavailable), or (b) move it to a dev-only entry so it leaves the production bundle. Do not leave it in the third state.

### F-03 · The idempotency header is theatre · **67**
Client, `FirstAccessIntake.tsx:142-155`: builds a payload signature, mints `crypto.randomUUID()`, sends `Idempotency-Key`. Server, `routes/first-access.ts:33-37`: `submitFirstAccess(req.body)` — the header is never read. `server/routes/leads.ts:122-147` has the full pattern (cache lookup, `X-Idempotent-Replay`, in-flight promise sharing); this route does not use it.
Harm: the 502 copy tells the visitor *"Please retry"* (`services/first-access.ts:129`). Every retry re-runs the save and the provider subscribe. `saveSignupRequest` is conflict-safe (`onConflictDoNothing`, `signup-capture.ts:68`), so no duplicate rows — but the provider gets a duplicate write and the client gets a fresh round trip, and the header implies a guarantee the system does not make.
Fix: either honour the header with the `leads.ts` cache/in-flight helpers, or delete it from the client. A header nobody reads is worse than no header: it will be trusted during an incident.

### F-04 · The consent record does not name the consent · **65**
The visitor reads: *"I'd like email updates from THE MONOLITH PROJECT. I can unsubscribe at any time"* plus *"I'm 18 or older"*, having selected up to three named worlds (`FirstAccessIntake.tsx:525-562`). What gets stored: `consentVersion: "email-signup-2026-09-21"` — a hardcoded string in `signup-capture.ts:63`, the generic newsletter consent. The First Access identity is recorded only in `metadata.formVersion = "first-access-2027-v1"` (`services/first-access.ts:91`), which is not the consent field.
Harm: in a GDPR/CCPA request or a regulator's letter, the record cannot be tied to the sentence the person actually agreed to. The `channelConsent` block is also hardcoded (`signup-capture.ts:62`) regardless of what the form said.
Fix: thread `consentVersion` through `saveSignupRequest` (or accept it in `details` and copy it into the consent field) and set `first-access-2027-v1` here; keep the copy and the constant in one file so they cannot drift.

### F-06 · Six selectors stopped matching, silently · **65**
The badge replaces three ad-hoc spans and, in doing so, drops attributes that CSS and alert styling depended on:

| Selector | Was matched by | Now |
|---|---|---|
| `schedule.css:110` `.schedule-editorial-tags [data-event-state="EventPostponed"]` | `data-event-state={event.eventStatus}` in `Schedule.tsx` | dead — badge emits `data-status` |
| `home.css:923` `.home-show-status` | `className="home-show-status"` | dead |
| `home.css:931` `.home-show-status[data-on-sale="true"]` | `data-on-sale={onSale}` | dead |
| `art-direction.css:216`, `:299` `#app-shell .monolith-home .home-show-status` | same class | dead |
| `event-alert.css:72` `.home-show-card[data-event-status="EventPostponed"] .home-show-status` | descendant class | dead |

Harm: postponed styling on the homepage no longer comes from the alert layer; it now depends entirely on the new badge having its own palette (it does — `event-status-badge.css:27-32`), so the visible result is probably fine and provably *unverified*. No test references any of the removed attributes (grep over `e2e/`, `client/`, `scripts/` returns nothing), so nothing will catch it next time either.
Fix: delete the five dead rules and the `data-on-sale` computation in the same commit as the badge, and add one snapshot or DOM assertion per surface that checks the badge's `data-status`, so the next swap has a tripwire.

### F-05 · Fail-closed is right; failing closed *before* the receipt is not · **62**
`services/first-access.ts:68-76` returns 503 and saves nothing when `firstAccessAvailable()` is false — and availability includes a live Brevo call (`:36-42`). Yet the service has a durable queue: it saves the receipt and marks `providerStatus: "pending"` when the *subscribe* fails (`:121`).
Harm: a Brevo outage, a rate-limited key, or a bad `BREVO_LIST_ID` silently costs every signup in the window, at exactly the moment (a launch) when they matter. The architecture already knows how to keep them; the guard sits in front of the thing it was built to protect.
Fix: always attempt `saveSignupRequest` when the payload is valid, mark `pending`, and let the reconciliation path (`markDelivery`'s comment, `:51-55`) do its job. Keep fail-closed for *telling the user they are subscribed* — never for capturing.

### F-07 · Three clocks per row · **57**
`Schedule.tsx:279-283` calls `getPublishedEventState(event)` three times for one card; the helper defaults `now` to `new Date()` (`publishedState.ts:144-147`). `statusLabel(event)` (`:34`) calls it again. `HomeUpcomingShows.tsx:24,46` calls it twice.
Harm: small, real. The badge and the CTA of one row can disagree if a boundary (on-sale → past) is crossed between calls; every render re-derives state instead of reading one value.
Fix: one `const state = getPublishedEventState(event)` per row, passed to the badge and the label.

### F-08 · `crypto.randomUUID()` outside a secure context · **50**
`FirstAccessIntake.tsx:144`. `crypto.randomUUID` is only defined in secure contexts. On `http://localhost` it exists; on `http://192.168.x.x:5001` — the normal way to check a phone layout — it is `undefined` and throws inside the submit handler's try block, surfacing the generic *"You appear to be offline"* copy after three steps of typing.
Fix: `globalThis.crypto?.randomUUID?.() ?? fallbackId()`.

### F-09 · The honeypot answers out loud · **51**
`services/first-access.ts:60-67` returns 400 with the same message a human sees for a typo. Harm: a bot that reads the response learns the field; a human support ticket saying "it says check my details" cannot be distinguished from spam capture.
Fix: accept, save nothing, return 200.

### F-10 · Per-instance rate limits · **46**
`routes/first-access.ts:16,30` — `preferMemory: true`. On Netlify the POST limit of 8 per 15 minutes is 8 *per lambda instance*, so the effective ceiling is memory × instances, and the guarantee disappears under scale.
Fix: point the limiter at the same durable store the leads route uses, or state in the code that this is best-effort.

### F-11 · The flagship state has no palette · **54**
`event-status-badge.css` defines `on-sale`, `postponed`, `sold-out`, `cancelled`, `past`, `unpublished`. `first-access` — the state the 2027 campaign is built on — falls through to the default blue (`--status-ink: #b3dff5`). Intentional or not, it is undocumented, and the fallback is the same colour as the unconfigured default.
Fix: add an explicit rule, even if it is the same blue.

---

## 3. THE 14 FILES

| File | Role | Change | Verdict |
|---|---|---|---|
| `EventStatusBadge.tsx` (new, 28) | one status vocabulary for all surfaces | none — correct and small; `label \\|\\| labels[status]` swallows an empty string | **KEEP** |
| `event-status-badge.css` (new, 50) | badge palette | missing `first-access` | **FIX** (F-11) |
| `FirstAccessIntake.tsx` (new, 666) | 3-step intake | complete flow: interests → details → consent, focus management, honeypot, hosted-form fallback | **FIX** (F-02, F-03, F-08) |
| `first-access-intake.css` (new, 651) | intake styling | not audited (declared) | **UNKNOWN** |
| `services/first-access.ts` (new, 133) | validate → save → subscribe → mark | ordering is right (durable before provider); availability gate is wrong (F-05); consent version arrives pre-baked (F-04) | **FIX** |
| `routes/first-access.ts` (new, 39) | GET availability, POST submit | no idempotency read (F-03), memory rate limit (F-10) | **FIX** |
| `__tests__/first-access.test.ts` (new, 137) | 13 tests | genuinely good: asserts *what must not happen* (no save, no subscribe) across every failure path. Mocks erase the real DB conflict and the real Brevo timing — it proves the ordering, not the integration | **KEEP** |
| `Newsletter.tsx` | preview hook | dev-only gate makes the feature unreachable (F-02) | **FIX** |
| `Schedule.tsx` | badge + empty-description suppression | also fixes a real bug: cards no longer print a filler sentence when there is no description. Triple call per row (F-07); drops `data-event-state` (F-06) | **FIX** |
| `HomeUpcomingShows.tsx` | badge, removes `home-show-status`/`data-on-sale` | F-06 | **FIX** |
| `HomeNextChapter.tsx` | badge replaces one line of copy | **KEEP** |
| `SeasonInvitation.tsx` | badge replaces the note, `<p>` → `<div>` | class survives (`season-invitation.css:100`), tag change untested | **KEEP** |
| `home-next-chapter.css` | swaps the `div > span` rule for a badge margin | **KEEP** |
| `server/app.ts` | registers the router | **KEEP** |

Unreachable or orphaned after this changeset: the whole intake in production (F-02); five CSS rules (F-06); the `Idempotency-Key` header (F-03). Nothing is duplicated — the badge is a genuine consolidation, not a parallel implementation.

---

## 4. THE 39 COMMITS — RELEASE-RISK AUDIT

| Stage | Commits | Files | Churn | Reviewable? | Risk |
|---|---|---|---|---|---|
| A. Production stability | `1130a09` `4192ff7` `9d26e9d` | 8 | 260/15 | yes — read in full | **low**, and correct: see below |
| B. 2027 design + rebuild | `b4a04bc` `991a2ba` `7db1bb3` `3a3edfc` `1e2031b` `d5392ee` `20c07b3` `8113870` `ce5ac29` | ~430 | ~30,000/9,000 | **no** | **high** — this is the release, and it is larger than any review can hold |
| C. Radio + SUNSETS network | `b353ff7` `11a55a4` `db29e44` `ad5e932` `d5392ee` `6c8b779` `8b2ad48` `55938f2` | ~130 | ~3,500/450 | partially | medium — `6c8b779` touches SEO/redirects |
| D. Media and binary dumps | `4d11204` `573da84` `ca6b6df` | 722 | 23,458/15 | **no** | low technical, high **repo-weight** risk |
| E. Audience OS / CMS / data | `31b50ea` `5a1bbe3` `20c07b3` `ca6b6df` | ~120 | ~18,000/2,000 | **no** | **high** — an admin API and a CMS store arrived inside a website branch |
| F. Docs and checkpoints | `94c55a9` `ec14035` `2d8359c` | 5 | 321/108 | yes | none |

**What can take production down.** `1130a09` is the only commit whose failure mode is an empty page, and I read it in full: the chunk-error matcher covers the five real Vite/Webpack phrasings (`chunkRecovery.ts:9-19`), the 60-second cooldown is stored before the reload so a loop cannot form (`:32-40`), `sessionStorage` failure returns `false` rather than reloading (`:41-44`), and the purge targets `monolith-pages` — which is the real cache name emitted by `vite-plugin-pwa` (`dist/public/sw.js`, `vite.config.ts:68`). The Express 404 for `/assets/*` is the part that actually stops cache poisoning. **This commit is sound**; the branch name is the only honest thing left in it.

**What is in the tree because nobody knows.** `fee9d3b` — "Add Etch Layer concept mockup", 796 lines in one file, never referenced again in the range. `d5392ee` and `ca6b6df` carry 38,000 insertions between them, most of it generated or vendored.

**Is the branch name honest?** No. A range that carries a full 2027 redesign, a radio rebuild, an admin CMS and a first-access funnel is named after a stale-chunk hotfix. Evidence: the staging table above — stage A is 8 files out of 1,246.

**The operational consequence of F-01.** If this disk is lost: production keeps serving, and nobody can rebuild it, patch it, or roll it back. The Netlify deploy `6af55344188087aa0ff3c842` is an artifact, not a source. There is no CI on a branch that does not exist upstream, so the 569 passing tests are a local fact, not a gate.

---

## 5. COMPLIANCE & CUSTOMER TRUTH

- **Collected:** email, first name, city (optional), three interest tags, 18+ confirmation, marketing consent, honeypot field. All validated server-side by zod (`services/first-access.ts:15-31`) — client validation is a convenience, not the boundary. `consent` and `adult` are `z.literal(true)`, so a client cannot omit them and still be stored. Good.
- **Recorded:** `consent: true`, `channelConsent: {email: true, sms: false, whatsapp: false}` hardcoded, `consentVersion: "email-signup-2026-09-21"` (`signup-capture.ts:62-63`). **The version does not describe this form.** → F-04.
- **Promised vs delivered:** the 502 copy says *"Your request is saved… Please retry"* (`:129`) — true, a receipt exists. The 409 `SUPPRESSED` copy says *"Contact events@monolithproject.com"* — true. The success copy says *"You're on the First Access list"* — true only when Brevo returned 2xx.
- **One promise the code does not keep:** the idempotency header (F-03). No customer sees it; every engineer who reads the client will believe it.
- **Missing from the copy:** no link to the privacy policy exists on the *success* screen, only in the form footer. Minor, and worth one line.

---

## 6. WHAT THE CODE CANNOT TELL YOU

| Gap | Why it cannot be closed here |
|---|---|
| Does Brevo actually accept the subscribe? | The tests mock `subscribeBrevoList`; the real call needs `BREVO_API_KEY` and a reachable list. `isBrevoListReachable` exists but is cached and was not exercised live. |
| Is `BREVO_LIST_ID` the *newsletter* list and not the SUNSETS music list? | Only the environment can answer; the comment at `services/first-access.ts:33-34` states the intent, not the value. |
| Does `/api/first-access` exist in the deployed function bundle? | `server/app.ts` registers it, but Netlify's function build was not inspected. |
| Is the prerendered `/newsletter` HTML consistent with the SPA? | `scripts/prerender_public_routes.mts:1075` emits a static fallback body; the SPA replaces it. Not verified in a browser. |
| Do the dead CSS rules (F-06) change anything visible? | Needs a visual diff of `/` and `/schedule` before and after the badge swap. Not done. |
| Is the 39-commit range safe beyond stage A? | 1,180 of 1,246 files were not opened. The prompt in `docs/reviews/PROMPT-DEEP-REVIEW-20261112.md` exists precisely to farm that out. |

---

## 7. THE FIX LIST (value per hour, highest first)

1. **Push the branch.** `git push -u origin fix/pr0-chunk-recovery-hotfix`. Prevents: unrecoverable production source.
2. **Decide the intake's fate.** Wire `FirstAccessIntake` to `/newsletter` behind the availability check, or move it out of the production bundle. Prevents: shipping a 2027 funnel nobody can reach.
3. **Honour or delete `Idempotency-Key`** in `routes/first-access.ts` using the `leads.ts` helpers. Prevents: duplicate provider writes on every retry you tell people to make.
4. **Thread `consentVersion`** from the form into `signup-capture.ts`. Prevents: a consent record that fails an audit.
5. **Save before checking availability** in `submitFirstAccess`. Prevents: lost signups during a provider outage.
6. **Hoist one `getPublishedEventState` per row** in `Schedule.tsx` and `HomeUpcomingShows.tsx`. Prevents: a badge that disagrees with its own CTA.
7. **Delete the five dead selectors** and add one `data-status` assertion per surface. Prevents: the same silent regression next swap.
8. **Guard `crypto.randomUUID`.** Prevents: a dead-end error on LAN testing.
9. **Return 200 from the honeypot.** Prevents: a bot learning the trap, and a support ticket you cannot triage.
10. **Add the `first-access` badge palette.** Prevents: the flagship state looking like the unconfigured default.

---

*Evidence or nothing: every claim above cites a path, or is marked as judgement. The commit-range section states its own coverage limits.*
