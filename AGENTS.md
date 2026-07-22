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

The nested checkout at
`/Users/starkindustries/Documents/GitHub/Fairgrounds-dev/monolithproject.com`
is stale and read-only. Never transfer work back into it.

Preserve existing user changes and keep all Monolith website commits in this
canonical repository.
