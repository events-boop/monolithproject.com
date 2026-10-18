# Kimi CMS recovery brief — September 21, 2026

Your CMS source is present locally. It is uncommitted work in the canonical repository,
not on GitHub and not in the separate Sunsets preview folder.

## Open the exact checkout

```sh
cd '/Users/starkindustries/Downloads/monolith-project website'
pwd -P
git rev-parse --show-toplevel
git branch --show-current
git status --short
```

Both path checks must return `/Users/starkindustries/Downloads/monolith-project website`
with NO trailing space. The current working branch is `main`, HEAD `9b67f2c`.
Read this checkout's `AGENTS.md` before writes/tests. The sibling folder whose name
ends with a space is only the old event-page design preview. The old nested
Fairgrounds checkout is archived and must not be recreated.

## Located CMS files

- `server/db/cmsRepo.ts` — draft/published revision repository, conflict and validation errors, revision history.
- `shared/cms/documents.ts` — registry for `events.catalogue`, `sunsets.publication`, `faqs.site`, `home.featured`.
- `shared/cms/schemas.ts` — payload validation for those four document types.
- `server/db/schema.ts` — uncommitted `cmsDocuments` and `cmsRevisions` tables.
- `server/db/migrations/0007_glossy_impossible_man.sql` — CMS migration.
- `server/db/migrations/meta/0007_snapshot.json` and modified `_journal.json` — migration metadata.
- `scripts/cms_seed.mts` — seed existing event, Sunsets, FAQ and featured-slot content; requires DATABASE_URL and writes to the database.
- `package.json` — uncommitted `cms:seed` command.
- `server/db/__tests__/cmsRepo.test.ts` — repository helpers and missing-database behavior.
- `server/db/__tests__/cmsPayloadSchemas.test.ts` — CMS payload validation checks.
- `shared/faqs.ts` — local shared FAQ content used by the seed script.
- `server/data/public-site-data.ts` — local featured-slot export used by the seed script.

Most of these files are UNTRACKED (`??`); schema, package and migration journal are
MODIFIED (`M`). That is why looking only at GitHub, git log, or tracked-file lists
will miss the work. Read the filesystem and `git status --short`.

## Recovery action

Inspect the existing files above and report what is implemented and what remains
before resuming your prior CMS scope. Do not recreate or overwrite this foundation.
This handoff confirms source-file presence; it does not establish that the migration
was applied, that seed data was inserted, or that a complete admin UI is live.
Do not run migrations, seed production, publish, or reset/clean the repository merely
to recover context. Preserve other uncommitted website changes.

## Coordination with Codex

Codex recovered the Brevo/signup work separately. Local review branch
`codex/brevo-signup-capture-20260921`, commit `ced88fd856afd015ef273c2b6d6de771418f4e12`,
contains only the 20 communications files. It was created without switching the
working branch or changing the regular Git index. It is pushed to `events-boop/monolithproject.com` on that review branch;
the remote commit was verified. Main has not been merged or deployed. The GitHub
connector could not create a draft PR because its integration returned HTTP 403.
Do not stage all files or combine the unfinished CMS migration with that release.

Read `docs/FESTIVAL_COMMS_STACK.md` for communications integration boundaries.
Capture-only mode saves pending opt-ins; it is not automatic provider delivery.
Brevo hosted connectivity/sender readiness remain unverified. No campaigns were sent.
Saving/publishing CMS event content must not automatically send communications.
