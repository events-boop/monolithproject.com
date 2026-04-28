# Monolith DESIGN.md Workspace

This folder is the design-system workspace for the site using the `@google/design.md` format.

Each series gets its own design file:

- `docs/design/monolith-project/DESIGN.md`
- `docs/design/chasing-sunsets/DESIGN.md`
- `docs/design/untold-story/DESIGN.md`
- `docs/design/chasing-sunsets-radio/DESIGN.md`

These files are meant to do two jobs at once:

1. Capture the current visual system in a structured format
2. Document the top aesthetic fixes we want to make next

That means each file is not just a brand brief. It is a reverse-engineered design operating document tied to the real route structure and components already in the codebase.

## Commands

```bash
npm run design:spec
npm run design:lint
```

To lint one file directly:

```bash
npx @google/design.md lint docs/design/monolith-project/DESIGN.md
```

## How To Use These Files

- Update the YAML frontmatter when token values change
- Update the prose sections when the route structure, component strategy, or art direction changes
- Keep the `Do's and Don'ts` section practical; it should read like a live fix list for the next pass

## New Series Workflow

For a new series:

1. Create `docs/design/<series-slug>/DESIGN.md`
2. Start from the closest existing brand family
3. Replace route references, color tokens, typography emphasis, and component rules
4. Add a short list of immediate design corrections under `Do's and Don'ts`
