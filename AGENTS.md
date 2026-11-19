# Canonical Monolith website repository

This checkout is the sole canonical working repository for the Monolith Project
public website:

`/Users/starkindustries/Downloads/monolith-project website`

Before the first write, build, generation command, test, commit, or push, run:

```sh
pwd -P
git rev-parse --show-toplevel
```

Both commands must resolve to the exact path above. If either differs, stop and
switch to this checkout. Do not infer repository identity from matching files,
routes, branches, or content.

The former nested checkout at
`/Users/starkindustries/Documents/GitHub/Fairgrounds-dev/monolithproject.com`
has been removed and must not be recreated. Its preserved read-only archive is
`/Users/starkindustries/Documents/GitHub/_archive/monolithproject.com-stale-20260722`.
Never transfer work into the archive.

Preserve existing user changes and keep all Monolith website commits in this
canonical repository.

## Non-negotiable SEO, static history, and URL permanence

These user-required rules apply to Sol 6.1 and every future UX/UI, content, and
release pass. Improvements must preserve and compound Monolith's searchable
history.

- **Permanent canonical URLs:** Update existing pages in place. Never introduce
  `/v2`, `/-2027`, or other versioned or ephemeral replacement paths that strand
  backlinks. Never delete historical routes or silo their replacements. When
  unifying genuine duplicates, use an explicit permanent 301 redirect (for
  example, `/story` to `/untold-story`) and update internal links, canonical
  metadata, and sitemap entries consistently. Preserve existing dated event and
  season URLs; their dates identify history rather than a redesign version.
- **Permanent artist dossiers:** Preserve all 32 current `/artists/<slug>` pages
  and keep every roster entry statically prerendered by
  `scripts/prerender_public_routes.mts` into
  `dist/public/artists/<slug>/index.html`. After shows wrap, append newly
  contracted/performed artists to `client/src/data/artists.ts` and retain their
  permanent dossiers, with accurate performance history across Chicago rooms.
  Update prerender and sitemap coverage as the roster grows; never replace or
  remove past artists merely because they are no longer on the current lineup.
- **Permanent event, recap, and archive history:** Preserve historical dossiers
  under `/events/*`, `/archive/*`, `/insights/*`, and `/radio/*`, including
  `css-jul04`, `css-aug22`, `css-oct10`, `monolith-launch`, and
  `eran-hersh-untold-story-iv`. Completed events transition to `status: "past"`
  with accurate `recapUrl` / `archiveSlug` receipts rather than being deleted.
  Do not mark postponed or cancelled events as completed performances or invent
  recap receipts. The October 10 launch never happened; preserve the historical
  URL truthfully without claiming it was performed. The current removal/calendar
  redirects require reconciliation with these permanence rules before release.
  Expand `scripts/prerender_public_routes.mts` and
  `shared/seo/public-seo.js` so every past event, recap, archive, insight, radio
  episode, and gallery season under `/chasing-sunsets/:season` and
  `/untold-story/:season` ships meaningful static HTML, not a CSR-only shell.
- **Canonical metadata and structured data:** Keep static HTML canonicals,
  metadata, and JSON-LD consistent with client `SEO.tsx` and the entity's actual
  lifecycle. Preserve sitemap.xml coverage and indexability for all canonical
  historical entities. A visual redesign or removal from an upcoming-events
  view must never remove the underlying historical page from prerendering,
  internal discovery, or the sitemap.
- **Required release validation:** Run `npm run validate:events` and
  `npm run pixel:guard` for every release. Verify generated static HTML coverage
  for the entire artist roster and historical routes, canonical/JSON-LD parity,
  sitemap inclusion, and any explicit 301 redirects before reporting the release
  ready. A passing build alone is not evidence that every historical URL is
  preserved, and local checks are not evidence of a live deployment.

## Route architecture and activation handoff

Read `docs/MONOLITH_ROUTE_ARCHITECTURE_ACTIVATION_ROADMAP.md` before a UX/UI or
activation pass. It records the owner-supplied route map, source-verified
corrections, backend/environment dependencies, multi-state design matrix,
unresolved owner decisions, and release evidence requirements. A status badge,
this handoff, or a recommendation does not authorize enabling gates or deploying.

## Classified source code and external distribution

- **All source code is classified:** Never bundle, zip, flatten into `.txt`/`.md`,
  upload, email, push to public/external destinations, or transmit repository
  source files (`client/`, `server/`, `shared/`, `scripts/`, `netlify/`, internal
  configs) outside this canonical environment **without explicit `TRACI-13`
  sign-off recorded first** (`TRACI-13` = authorized principal sign-off alias).
- **Public assets vs. proprietary logic:** Public marketing media/images may be
  shared when cleared, but application source code, business logic, ticketing/state
  internals, and environment templates stay strictly confidential pending
  `TRACI-13` explicit sign-off.
