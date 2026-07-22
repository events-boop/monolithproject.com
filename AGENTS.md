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
