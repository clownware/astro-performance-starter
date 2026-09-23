---
title: 'ADR-065: pnpm 11 With the One-Day Release-Age Gate'
description: >-
  Move the package manager from pnpm 10 to pnpm 11 (the TypeScript CLI) rather
  than pnpm 12 (the Rust port), keep pnpm 11's default one-day
  minimumReleaseAge supply-chain gate, pair it with a one-day Dependabot
  cooldown, and exempt urgent security fixes individually through
  minimumReleaseAgeExclude rather than lowering the gate
lastUpdated: 2026-09-23T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

The template pinned `pnpm@10.13.1` while the advertised stack claimed to be current. By
2026-09 that pin was two majors behind (#409): pnpm 11.0 shipped 2026-04-28 and 12.0 on
2026-08-26. The 10.x line itself last released 10.34.5 on 2026-07-10, so the pin was also 21
patches behind its own line with no sign of further 10.x releases.

The two majors are different kinds of change:

- **pnpm 11** is the TypeScript CLI with new defaults. The ones that matter here: Node 22+,
  `minimumReleaseAge` defaulting to 1440 minutes (a version is not resolved until it has been
  public for a day), `strictDepBuilds` (an unlisted dependency build script is an install
  error), `blockExoticSubdeps`, and — easy to miss — **it no longer reads settings from the
  `pnpm` field of `package.json`** (pnpm/pnpm#10086). It does not warn. Every override this
  repository had lived in that field, including the two advisory guards added days earlier
  (`devalue`, `smol-toml`; #423), so a plain version bump would have silently reopened both
  Dependabot alerts.
- **pnpm 12** is pacquet, a Rust port of the CLI, generally available for less than a month at
  the time of this decision.

The migration track (#409) left one decision open: the release-age gate. It is a supply-chain control — most
malicious npm publishes are detected and pulled within hours — but it would have delayed the
2026-09-08 Astro AVIF-RCE patch by a day, and this repository takes its dependency updates
from Dependabot. The gate also re-verifies entries **already in the lockfile**, not just new
resolutions.

That last point showed up concretely during the migration. Dependabot's #432, merged the
same day under pnpm 10, had resolved 25 versions published hours earlier — `rolldown@1.2.10`
97 minutes after it was published, the `@sentry/*` 10.75.3 family within an hour. Under pnpm 11
every install, local and CI, refused that lockfile until the newest entry aged past a day.

## Decision Drivers

- **Template blast radius**: package-manager behaviour propagates to every clone and every
  workflow; a new native rewrite should earn trust before adopters inherit it
- **Consistency with existing precedent**: TypeScript 7, also a native-code rewrite, is held
  until the toolchain certifies it (#340)
- **Supply-chain posture**: the template advertises itself as secure by default
- **Security-fix latency**: a real advisory must still be patchable the day its fix ships
- **No silent regressions**: moving settings must not drop an override without a failing check

## Considered Options

### Option 1: pnpm 11, keep the one-day gate, align Dependabot, exempt urgent fixes

**Description**: Move to the latest pnpm 11. Leave `minimumReleaseAge` at its default. Set
Dependabot's npm `cooldown.default-days` to 1 so version updates only propose releases the
gate will accept. When a security fix is younger than a day, exempt that exact version with
`minimumReleaseAgeExclude` — `pnpm audit --fix` writes the entry.

**Pros**:

- Supply-chain protection on by default, for the template and every clone
- Dependabot PRs and CI agree: cooldown applies to transitive resolutions too, via pnpm's own
  gate (dependabot-core `release_age_gate_config`)
- Security updates are unaffected by the cooldown — Dependabot skips it for them
  (`update_cooldown: job.security_updates_only? ? nil : job.cooldown`)
- The urgent-fix path is one targeted, reviewable line rather than a policy change

**Cons**:

- A same-day security fix needs a human to add the exemption before CI goes green
- Version updates arrive a day later than before
- pnpm edits `pnpm-workspace.yaml` itself in loose mode, so exemptions can accumulate and
  need occasional pruning

### Option 2: pnpm 11 with the gate disabled (`minimumReleaseAge: 0`)

**Description**: Take pnpm 11 but opt out of the release-age gate.

**Pros**:

- No change to update latency or the security-fix path

**Cons**:

- Discards the main supply-chain improvement pnpm 11 ships, in a template whose adopters
  would inherit the opt-out
- The 25-entry episode above is exactly the exposure it would leave open

### Option 3: pnpm 12

**Description**: Jump straight to the Rust port.

**Pros**:

- Newest line; faster installs

**Cons**:

- Under a month of general availability for a tool every workflow depends on
- Contradicts the settle-first rule this repository already applies to TypeScript 7

### Option 4: Stay on pnpm 10

**Description**: Keep the 10.x pin.

**Pros**:

- No migration work

**Cons**:

- The line has stopped releasing; the pin is 21 patches behind even within it
- No release-age protection

## Decision

We will go with **Option 1** because it takes the supply-chain default instead of opting out of
it, keeps Dependabot and CI consistent, and preserves a same-day path for security fixes that
costs one reviewable line. pnpm 12 is deferred under the same rule as TypeScript 7.

### Implementation Details

- `packageManager: pnpm@11.27.1`; `engines.pnpm: ">=11.0.0"`
- All pnpm settings move to `pnpm-workspace.yaml`. The `overrides` map is carried over
  unchanged, now with comments recording why each verified entry exists.
- `allowBuilds: { esbuild: false }` keeps pnpm 10's behaviour: esbuild's postinstall was
  always skipped, and builds work because the binary ships as a platform optional dependency.
  No dependency script runs at install time.
- `.github/dependabot.yml` npm ecosystem: `cooldown: default-days: 1`
- The 25 lockfile entries resolved without the gate are exempted by exact `name@version` in a
  commented, transitional `minimumReleaseAgeExclude` list, removed once they age out (#436).
  Each was already reviewed and merged, so the exemption admits nothing new.
- `versions.json`'s `pnpm` key is now stamped from `packageManager` by `version:fix` and
  compared by `version:check`, like the Node fields. It had been hand-maintained.

Emergency procedure for a same-day security fix: run `pnpm audit --fix` (or add
`"<name>@<patched version>"` to `minimumReleaseAgeExclude` by hand), commit the workspace
change with the Dependabot PR, and remove the entry once it ages.

## Consequences

### Positive

- Supply-chain gate on by default for the template and its clones
- Overrides can no longer be silently ignored: `scripts/src/pnpm-config.test.ts` fails if a
  `pnpm` field reappears in `package.json` or the advisory guards leave `pnpm-workspace.yaml`
- The `pnpm` pin in the public `versions.json` contract (ADR-061) is machine-guarded
- Off an unmaintained release line

### Negative

- Same-day security fixes need a manual exemption step
- Existing clones see a one-time `node_modules` purge prompt on their first pnpm 11 install

### Neutral

- The lockfile is unchanged by the migration: pnpm 11 still writes lockfile v9, and every
  resolution is identical
- pnpm 12 is tracked for adoption once it has settled (#437)

## Validation

- **Metric 1**: `CI=true pnpm install --frozen-lockfile` passes under pnpm 11
- **Metric 2**: `pnpm audit` stays clean after the move, proving the overrides still apply
- **Metric 3**: Dependabot version-update PRs pass CI's frozen install without manual
  exemptions

## References

- [ADR-000: Starter Decisions](./000-starter-decisions.md) — the original pnpm choice
- [ADR-061: versions.json Public Consumption Contract](./061-versions-json-public-contract.md)
- pnpm 11.0.0 changelog — defaults, the `package.json#pnpm` removal (pnpm/pnpm#10086)
- #409 (migration track), #423 (the advisory overrides), #432 (the ungated resolutions), #340
  (TypeScript 7 precedent)

## Enforcement

- **Testable consequences:**
  - TC-1: `package.json` has no `pnpm` field, and `pnpm-workspace.yaml` declares the live
    advisory overrides.
  - TC-2: `packageManager` pins pnpm 11, and `minimumReleaseAge` is not lowered below one day.
  - TC-3: Dependabot's npm ecosystem has a cooldown of at least one day.
  - TC-4: `versions.json`'s `pnpm` matches `packageManager`.
- **Checks:**
  - TC-1..3 → `scripts/src/pnpm-config.test.ts` via `test:unit` (status: **block**)
  - TC-4 → `version:check` in `quality:ci` (status: **block**)
- **Not machine-checkable:** whether a given `minimumReleaseAgeExclude` entry was justified is a
  review judgement.
- **Graduation log:** *(empty at creation; entries added when a check changes status)*
