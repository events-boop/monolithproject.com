# PROMPT — INDEPENDENT DEEP REVIEW: the 14 uncommitted files and the 39-commit range

**Target record:** `~/Downloads/monolith-project website` (quote the space)
**Repo:** `github.com/events-boop/monolithproject.com` · branch `fix/pr0-chunk-recovery-hotfix`
**Written:** 2026-11-12 · **Seat:** any independent model (GLM / Gemini / Codex / Claude)
**Purpose:** one pass that is stronger than the tests, on exactly two things: the dirty working tree and the unpushed commit range.

---

> **ENVIRONMENT**
> Read-only. Do not commit, push, stash, reset, or run `npm run build` (it writes `dist/`).
> You may run: `tsc --noEmit`, `vitest run`, `git diff`, `git show`, `npm run check`.
> Do not read `node_modules/`, `dist/`, `.netlify/`, or `test-results/`.
> Node 22 is required and present.

# MISSION

Two reviews, in this order. Do not blend them.

1. **The 14 uncommitted files** — 7 modified, 7 new. 1,704 new lines, 43 insertions / 27 deletions in the modified set. This is a First Access 2027 intake (client flow + API + service + tests + CSS) plus a shared event status badge replacing three ad-hoc status spans. Review it as if it were about to be committed and shipped.
2. **The 39 unpushed commits** (`origin/main..HEAD`) — 1,246 files, +71,146 / −9,197. Do not attempt to read it linearly. Review it as a release-risk audit: what is in it, what is unreviewable, what is dangerous, and what must be true before it is pushed.

You are not summarising a diff. You are answering: **what would break, what would mislead a customer, and what would fail an audit.**

# SCOPE — the exact 14 files

Modified (working tree):
```
client/src/components/HomeNextChapter.tsx       +6  −4
client/src/components/HomeUpcomingShows.tsx    +10  −3
client/src/components/SeasonInvitation.tsx      +7  −3
client/src/pages/Newsletter.tsx                 +7  −0
client/src/pages/Schedule.tsx                  +29  −12
client/src/styles/home-next-chapter.css         +3  −6
server/app.ts                                   +2  −0
```
New (untracked):
```
client/src/components/EventStatusBadge.tsx            28 lines
client/src/components/FirstAccessIntake.tsx          666 lines
client/src/styles/event-status-badge.css              50 lines
client/src/styles/first-access-intake.css            651 lines
server/routes/first-access.ts                         39 lines
server/services/first-access.ts                      133 lines
server/__tests__/first-access.test.ts                137 lines
```

# SCOPE — the 39 commits

Full list, newest first. `files` = files touched, `churn` = +added/−removed.
```
94c55a9 docs: record verified Monolith production release          2 files      176/106
3a3edfc style: uppercase 2027 collective brand names                5 files        9/8
7db1bb3 feat: connect Monolith projects and refresh Lake First Access 7 files   247/772
4d11204 chore: preserve pending responsive media and handoff work  702 files      121/5
991a2ba feat: extend 2027 design to series and collection pages     12 files     626/119
b4a04bc feat: unify 2027 First Access and preserve public history   72 files    3273/463
b353ff7 feat(radio): rebuilt episode page, deck player, 13 covers    8 files      876/188
9d26e9d ci: pin quality and lighthouse jobs to ubuntu-24.04          2 files        6/2
c42d8a5 feat: Sep 19 carries a Postponed badge                       4 files       26/5
118fd01 fix(events): remove the October 10 launch date               6 files       34/41
b1e921d fix(nav): Calendar header button navigates in-app            1 file        19/2
4ab844b feat: one link-in-bio layout for sunsets.vip and untold.vip 10 files     493/254
3678ec8 feat: menu names radio and SUNSETS.FM, radio hero rotates    3 files       84/7
1e2031b checkpoint: save the staged site work                       64 files    3083/469
8113870 style: polish pass — 11px text floor, larger covers         11 files     292/176
1130a09 fix(stability): stale chunk recovery + SPA cache poisoning   5 files      253/13
ec14035 docs: save verified radio preview and release checkpoint     2 files      135/2
11a55a4 feat: refresh Chasing Sunsets radio                         24 files    1332/192
db29e44 fix: brand Monolith radio as Chasing Sunsets                12 files      68/29
2d8359c docs: save post-commit Monolith polish priorities            1 file        10/0
d5392ee feat: integrate SUNSETS network and launch homepage carousel 190 files 15503/913
ae05e2c fix(open-network): report RAFAEL playback availability       2 files        2/2
ad5e932 feat(open-network): green SUNSETS radio and RAFAEL           39 files     833/3
55938f2 Clarify SUNSETS.FM lineage and record SEO PR submission      1 file        14/0
8b2ad48 Enable radio canonicals after verified SUNSETS.FM SEO        3 files      137/11
6c8b779 Add SUNSETS.FM doorway and gated radio SEO migration        21 files    1105/11
573da84 perf: recompress oversized artist images (156MB→21MB)       10 files        0/0
3333cb6 fix: CSP hosts, artist sitemap, real 404s, countdown         8 files      300/69
fee9d3b Add Etch Layer concept mockup                                1 file       796/0
dd3949f Preload hero fonts on prerendered pages                      1 file        24/1
6ebd378 Keep full CSS and app chunks off the first-paint path        3 files       69/18
e56921a Prerender real page markup for inner routes                  8 files      508/4
caa8c0a Speed up first paint on inner pages                         11 files     196/45
4192ff7 Generate hardening constants before CMS storage tests        1 file         1/0
ce5ac29 Unbreak build, restore hero media, modernize toolchain      91 files    4273/4592
ca6b6df Package isolated Audience OS Neon intake for Netlify        10 files   23337/10
20c07b3 Polish Monolith design and connect show discovery           75 files    4853/2007
5a1bbe3 Install controlled Audience OS signup and local preview     16 files    1606/0
31b50ea Add versioned CMS document store with admin API             24 files    7784/16
```

# ALREADY VERIFIED — do not redo, do not contradict without evidence

Run 2026-11-12 on the dirty tree, by the commissioning agent:
```
tsc --noEmit                     exit 0, no diagnostics
vitest run                       61 files passed, 1 skipped · 569 tests passed, 11 skipped
vitest run server/__tests__/first-access.test.ts   13 passed
```
The suite is green and the types are clean. **A finding that says "there are no tests" or "this won't compile" is wrong.** Your value is in what a green suite cannot see: unreachable code, contract drift between client and server, consent-record truthfulness, dead styling, product risk.

# EXECUTION RULES

- Label every claim `[VERIFIED]` (you read it at `path:line`), `[INFERRED]` (deduced across files), `[UNKNOWN]`.
- **Cite `path:line` for every claim.** No path, no claim.
- Never invent a score or a number. Every number is either measured by you (say how) or marked `[JUDGMENT]`.
- Do not restate the diff back. If a paragraph would survive deleting the code, cut it.
- Do not praise. No "well-structured", no "nice touch". If something is genuinely correct and load-bearing, say why in one line and move on.
- **A green test is not evidence of product correctness.** The intake tests mock the provider and the database; say what that leaves unproven.
- Answer the question "who is harmed and how" for every High finding.

# READING ORDER (stop when the marginal file stops paying)

| # | Read | Why |
|---|---|---|
| 1 | `git status`, `git diff` | the 7 modified files, in full |
| 2 | `server/services/first-access.ts` → `server/routes/first-access.ts` | the API contract, the fail-closed logic, the ordering |
| 3 | `client/src/components/FirstAccessIntake.tsx` (666 lines) | the flow: validation, availability gate, idempotency, honeypot, a11y |
| 4 | `server/__tests__/first-access.test.ts` | what is actually asserted, and what the mocks erase |
| 5 | `server/services/signup-capture.ts`, `server/routes/leads.ts` | the house patterns this new route does or does not follow |
| 6 | `client/src/pages/Newsletter.tsx`, `client/src/App.tsx` | is the new component reachable by a real visitor? |
| 7 | `client/src/pages/Schedule.tsx` (`statusLabel`, the editorial card) | the badge swap |
| 8 | `client/src/components/HomeUpcomingShows.tsx`, `SeasonInvitation.tsx`, `HomeNextChapter.tsx` | the other three swaps |
| 9 | `client/src/styles/event-status-badge.css`, `first-access-intake.css`, `schedule.css`, `home.css`, `event-alert.css`, `art-direction.css` | which selectors still match, which are now dead |
| 10 | `shared/events/publishedState.ts` (header + `getPublishedEventState`) | the `now` contract the badge call sites must respect |
| 11 | `git show 1130a09`, `git show e56921a`, `git show 31b50ea` | the three commits that can take the site down |
| 12 | sample the rest of the range by subject | declare what you did not open |

# REQUIRED OUTPUT

## 0. CERTIFICATION & COVERAGE
```
MODEL: <exact>   FAMILY: <vendor>   PRIOR KNOWLEDGE OF THIS REPO: NONE | disclose
CERTIFICATION: "Evaluated only against files inside ~/Downloads/monolith-project website. Deviations: none."
```
Then: files read in full / sampled / not opened, with counts, and why.

## 1. VERDICT
Two lines: (a) can the 14 files be committed as-is; (b) should the 39 commits be pushed as-is. Then the single change you would make first.

## 2. FINDINGS, RANKED
```
| Rank | ID | Finding | Category | Impact 0–10 | Reach 0–10 | Confidence 0–10 | Ease 0–10 | VALUE 0–100 | Evidence |
```
`VALUE = round(100 × (0.35·Impact + 0.25·Reach + 0.20·Confidence + 0.20·Ease) / 10)`
Bands: 85–100 critical · 70–84 high · 55–69 medium · 40–54 low · <40 note.
Categories: `REACHABILITY` · `CONTRACT` · `COMPLIANCE` · `SECURITY` · `CORRECTNESS` · `REGRESSION` · `DATA` · `A11Y` · `PERF` · `PROCESS` · `POLISH`.

For each finding: one-sentence harm, the `path:line`, and the smallest correct fix. Minimum 8 findings, maximum 20. A finding with no evidence path is not a finding.

## 3. THE 14 FILES, ONE SECTION EACH
For every file: what it is for, what changed, what is now unreachable or orphaned, and one verdict (`KEEP` / `FIX` / `SPLIT` / `DROP`). `FirstAccessIntake.tsx` gets the deepest treatment: state machine, validation ordering, focus management, the availability gate, the idempotency header, and what happens on a slow network.

## 4. THE 39 COMMITS — RELEASE-RISK AUDIT
```
| Stage | Commits | Files | Churn | Reviewable? | Risk | What must be true |
```
Stage them yourself. At minimum separate: (a) production-stability commits, (b) the 2027 design/rebuild, (c) media/binary dumps, (d) docs/checkpoints, (e) the Audience OS / CMS layer. Then answer directly:
- Which commits can take production down, and why.
- Which file is in the tree only because nobody knows if it is still used.
- Is the branch name `fix/pr0-chunk-recovery-hotfix` still honest for a range that carries an entire redesign? Evidence.
- The release record says production was deployed from this branch **and the source branch was not pushed**. State the consequence in operational terms (bus factor, rollback, audit).

## 5. COMPLIANCE & CUSTOMER TRUTH
The form collects email, first name, city, three interest tags, an 18+ confirmation and a marketing consent. The record writes a `consentVersion`. Read both sides and say whether the stored consent record can be tied to the disclosure the visitor actually saw. Then: does any UI text promise something the server does not do?

## 6. WHAT THE CODE CANNOT TELL YOU
List what you cannot verify from this tree (provider behaviour, real deliverability, Netlify env, production traffic) and what would be needed to close each gap. Do not guess at production state.

## 7. THE FIX LIST
Ten changes or fewer, ordered by value per hour. Each: the file, the change in one imperative sentence, and what it prevents.

---

**Cite or cut.** If you cannot point at a line, the claim does not go in the document.
