---
title: 'ADR-042: Mutation Testing with Stryker'
description: >-
  Adopts Stryker Mutator (@stryker-mutator/core + vitest-runner) as the
  test-quality verification layer on top of Vitest coverage. Establishes
  thresholds at the measured baseline of 81% (well above the 50% break),
  runs nightly in CI as a tracked metric, and does NOT gate PRs.
lastUpdated: 2026-05-16T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

[ADR-023](023-testing-strategy.md) targets 80/75/70 line/function/branch coverage on units. After Phase 1 and Phase 2 of the testing+agentic-discipline plan, the actual measured coverage is **96.19% lines / 98.62% branches / 100% functions** on `src/utils/**`. By any classical metric the test suite looks excellent.

Coverage measures only whether each line was executed. It does not measure whether the assertions actually catch wrong behaviour. A test that runs every line of a function but only asserts `expect(result).toBeDefined()` shows 100% coverage and zero signal. Mutation testing is the verification layer that closes this gap: it mutates the source code (changes operators, deletes statements, flips conditionals) and runs the tests; tests that pass against mutated code are weak by definition.

[Robert C. Martin's testing literature](https://cleancoder.com/products) and modern testing practice both treat mutation testing as the test-of-the-tests. For TypeScript projects, [Stryker Mutator](https://stryker-mutator.io) is the canonical implementation. Its `vitest-runner` plugin executes mutations against the existing Vitest suite — no parallel test infrastructure required.

This ADR adopts Stryker as the verification layer.

## Decision Drivers

- **Signal verification**: prove that 96% coverage actually catches regressions rather than measuring code-traversal theatre
- **No PR gating**: mutation runs are slow (~1 min for the current scope; much longer at full repo scale). Gating PRs on mutation would punish iteration cost; the value is the trend signal, not the per-PR vote
- **Composability**: must run against the existing Vitest suite, not a parallel test framework
- **Realistic thresholds**: the first run produces the baseline; targets are set above it, not aspirationally
- **Scope discipline**: `.astro` files and build scripts don't carry useful mutation signal under this setup; scope to `src/utils/**` matches the Vitest coverage scope from ADR-023

## Considered Options

### Option 1: Don't adopt mutation testing

**Description**: Trust 96% coverage. Trust the F.I.R.S.T. checklist from ADR-037 to enforce quality.

**Pros**:

- No new dependency
- No CI slowdown
- The discipline already documented in ADR-037 catches most weak tests at review time

**Cons**:

- Coverage remains an unverified claim — when someone says "our utils are 96% covered" the listener has no way to weigh that against test quality
- Review discipline degrades over time; mutation testing is mechanical
- Phase 1's plan committed to this layer

### Option 2: Adopt mutation testing as a PR gate

**Description**: Run Stryker on every PR. Fail the PR if mutation score drops.

**Pros**:

- Maximum strictness
- Test quality regressions caught immediately

**Cons**:

- Stryker runs measured at ~1 min for current scope; at full repo (post-Phase 2) it grows
- Per-PR penalty for iterative work is expensive
- Flaky-mutation patterns (e.g. timestamp-dependent assertions) would block legitimate work
- Doesn't match the project's "no parallel CI jobs yet" stance from ADR-039

### Option 3: Adopt mutation testing as a nightly tracked metric (this ADR)

**Description**: Install Stryker + vitest-runner. Run on `src/utils/**` scope matching the Vitest coverage scope. Configure thresholds at the measured baseline (break: 50, low: 50, high: 80) so the gate exists but is far from punishing. Run nightly in `.github/workflows/mutation.yml` and surface the score; do not gate PRs.

**Pros**:

- Trend signal without per-PR cost
- Thresholds based on actual measured baseline, not aspirational fiction
- Composes with existing Vitest setup (no parallel test runner)
- Scope-matched to Vitest coverage scope — no surprise broad mutation runs
- HTML report uploads as a CI artefact for inspection

**Cons**:

- Nightly cadence means a weak test can ship and survive overnight
- Stryker version pinning becomes a maintenance task
- The first-run baseline becomes load-bearing — if it's wrong, future targets are wrong

## Decision

We will go with **Option 3 (Mutation testing as a nightly tracked metric)** because it captures the verification signal at sustainable cost, and the measured baseline justifies the choice empirically rather than aspirationally.

### Baseline measurement

First mutation run on `src/utils/**`:

| File | Mutation score | Killed | Survived | No-coverage |
|---|---|---|---|---|
| `blog.ts` | 91.67% | 22 | 2 | 0 |
| `socialShare.ts` | 92.59% | 25 | 2 | 0 |
| `url-utils.ts` | 81.98% | 91 | 20 | 0 |
| `formatDate.ts` | 78.79% | 182 | 43 | 6 |
| `validateOgImage.ts` | 77.55% | 38 | 9 | 2 |
| **All files** | **81.00%** | **358** | **76** | **8** |

The 19% of survived/no-coverage mutants are concentrated in string literals (error messages) and edge branches that are already documented as unreachable in the source. The signal is honest.

### Configuration

**`stryker.conf.json`:**

- `testRunner: vitest` with the `@stryker-mutator/vitest-runner` plugin explicitly registered
- `mutate: ["src/utils/**/*.ts"]` matched to Vitest coverage scope
- `thresholds: { high: 80, low: 50, break: 50 }` — break threshold below current baseline so a single weak test won't break the run; high threshold at the current floor so improvements are visible
- `reporters: ["html", "json", "progress", "clear-text"]` — HTML for human inspection, JSON for CI artefacts
- `concurrency: 4`, `timeoutMS: 60000`

**`package.json`:**

```json
"test:mutate": "SITE_URL=http://localhost:4321 stryker run"
```

**`.github/workflows/mutation.yml`:**

- Cron: `0 7 * * *` (nightly at 07:00 UTC, ~midnight Pacific)
- Also triggerable via `workflow_dispatch`
- Uploads `reports/mutation/` as artefact (14-day retention)
- Does NOT gate PRs

**`.gitignore`:**

- `.stryker-tmp/` and `reports/mutation/` excluded from version control

### Threshold review cadence

Quarterly: revisit the thresholds based on rolling mutation score trends. If the score consistently rises above the `high` threshold, raise it; if it consistently runs into the `break`, investigate before adjusting (regression first, threshold tweak last).

### Optionality (clone critical path)

Mutation testing is a **maintainer/advanced** capability, not part of the
clone-and-ship critical path. It is deliberately:

- **Not in `quality:ci`** — the gate a cloner (or their agent) must clear is
  `format:check → lint → lint:md → check → test:unit → agents:check → version:check → og:check → docs:count`
  *(amended 2026-08-02: chain updated to the current `quality:ci`; as originally
  written it listed the six gates of the day, ending at `agents:check`)*.
  `test:mutate` is absent and stays absent.
- **Nightly + on-demand only** — it runs in `.github/workflows/mutation.yml` on a
  schedule and via `workflow_dispatch`, never on PRs.
- **Grouped as a maintainer script** in `package.json` (see ADR-052) and labelled
  Advanced/optional in the README and `.claude/stack.md`.

A cloner can use the template, pass CI, and ship without ever running Stryker.
The wedge value is the *trend signal for template maintainers*; nothing here
requires cloners to adopt it.

### Out of scope (for this ADR)

- **`.astro` component mutation testing.** The Container API microtests assert against rendered HTML strings; Stryker can mutate `.astro` source but the resulting tests-vs-mutations signal is noisy under the current setup. Revisit when Astro adds first-class type-safe component testing.
- **Build scripts in `scripts/src/`.** I/O-heavy; Stryker can mutate them but the tests don't exist yet (deferred from earlier ADRs). Revisit when `scripts/src/__tests__/` exists.
- **README mutation badge.** Adding a badge requires a public reporter (Stryker Dashboard or Shields.io with a workflow-generated endpoint). Deferred to a future minor-ADR.

## Consequences

### Positive

- Coverage numbers gain credibility — the 96% line coverage is backed by 81% mutation kill rate
- Regression in test quality is detectable mechanically rather than depending on review discipline
- Nightly cadence is sustainable; iteration cost unaffected
- Composes with the existing Vitest setup — no second test runner
- HTML report is a debugging aid when adding tests to a new module

### Negative

- Nightly latency: a weak test can ship at 09:00 and survive until 07:00 the next morning
- Stryker is one more tool to keep updated; v9 → v10 will eventually require a config sweep
- Reports directory adds another excluded path in `.gitignore`

### Neutral

- Test count and coverage targets unchanged
- ADR-023, ADR-037 coverage and discipline rules unchanged
- No production code changes

## Validation

- `pnpm run test:mutate` exits 0 with a score ≥ 50% (the break threshold)
- `reports/mutation/index.html` exists locally after a run and reports per-file scores
- `.github/workflows/mutation.yml` runs nightly; the artefact uploads
- `.gitignore` excludes `.stryker-tmp/` and `reports/mutation/`
- A deliberately weakened test (replacing an assertion with `expect(result).toBeDefined()`) drops the score on the next mutation run, even if Vitest coverage stays flat

## References

- [ADR-023: Testing Strategy and Coverage Targets](023-testing-strategy.md) — the coverage baseline this ADR verifies
- [ADR-037: Testing Philosophy](037-testing-philosophy.md) — the discipline that produced the test suite Stryker validates
- [Stryker Mutator for JavaScript/TypeScript](https://stryker-mutator.io)
- [`@stryker-mutator/vitest-runner`](https://stryker-mutator.io/docs/stryker-js/vitest-runner/)

## Notes

The choice to scope mutations to `src/utils/**` (matching Vitest coverage scope) is deliberate. Stryker can mutate broader paths, but doing so without proportional test coverage produces high "no-coverage mutants" counts that obscure the real signal. Phase 3's success criterion is *running mutation testing*, not *achieving X score on every file*.

The 50% break threshold is low by design. It exists to catch a catastrophic test-suite regression (e.g. someone deletes half the assertions), not to enforce quality at every change. The `high: 80` threshold is the aspirational target that maps to the current baseline. Both will be revisited quarterly.

Future enhancements deliberately deferred:

- **Public mutation badge** (Stryker Dashboard or Shields.io endpoint)
- **Per-PR incremental mutation** runs (`incremental: true` once base configuration stabilises)
- **Mutation testing for `.astro` components** (requires upstream tooling or framework changes)
- **Mutation testing for `scripts/src/`** (requires tests for those scripts first)

---

**Date**: 2026-05-16\
**Participants**: Chris Pezza, Claude\
**Outcome**: Accepted

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-064). The original record above is unmodified. -->

- **Testable consequences:**
  - TC-1: the scheduled mutation workflow exists and runs against the Vitest suite.
- **Checks:**
  - TC-1 → `mutation.yml` workflow (status: **warn** — deliberately never graduates; this ADR forbids PR gating on mutation score)
- **Not machine-checkable:** mutation-score trend interpretation is a maintainer judgment.
- **Graduation log:** *(empty at creation; entries added when a check changes status)*
