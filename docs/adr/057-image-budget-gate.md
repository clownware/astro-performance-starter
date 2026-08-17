---
title: 'ADR-057: Per-Image Size Budget Gate'
description: >-
  Enforce a per-asset size ceiling on raster images in CI, turning the
  previously advisory 200KB image budget into a halt-on-violation gate.
lastUpdated: 2026-07-02T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

The single largest real-world performance regression an adopter of this
starter hit was a **1.4MB hero PNG** — one oversized asset cost 27 Lighthouse
points on its own. The template already gates JavaScript (< 160KB raw,
enforced in CI), CSS, and Lighthouse category scores, and `.claude/stack.md`
even documents an image budget — "**Images:** < 200KB each after optimisation".

But that image budget was never enforced. The only image tooling was
`images:analyze` (`scripts/src/optimize-images.ts`), which _reports_ sizes and
prints recommendations without ever failing the build. Analysis without
enforcement directly contradicts the halt-on-violation philosophy
([ADR-039](039-halt-on-violation-enforcement.md)): a budget nobody enforces is
a suggestion, and suggestions do not stop a 1.4MB PNG from shipping.

Images are the number-one perf killer for adopters, so the gap matters more
than the equivalent gap would for, say, CSS. We need a gate that fails CI when
a raster asset exceeds the documented ceiling.

## Decision Drivers

- **Halt-on-violation parity**: images should be gated like JS/CSS/Lighthouse,
  not merely analysed (ADR-039).
- **Catch the real failure mode**: an oversized raster served as-is
  (`public/`) or committed to source, regardless of format.
- **Low false-positive rate**: must not break legitimate assets (OG cards,
  touch icons) that are already well under budget.
- **Configurable**: adopters with different constraints can raise or lower the
  ceiling without editing the script.
- **Consistency**: mirror the existing pure-function-plus-CLI script pattern
  (`check-doc-counts.ts`, `check-version-consistency.ts`) wired into CI.

## Considered Options

### Option 1: Per-asset size ceiling on source raster, enforced in CI

**Description**: A script scans `public/` and `src/` for raster files
(`.png .jpg .jpeg .webp .avif .gif`), asserts each is under a configurable
per-file ceiling (default 200KB, matching the documented budget), and exits
non-zero with a per-file violation report. SVG is unrestricted; format is
advisory in the report, not hard-enforced.

**Pros**:

- Directly catches the actual failure mode (one giant asset) in any format.
- Zero false positives on the current demo (largest asset is 80KB).
- Reuses the established gate pattern; trivial CI cost (a `stat` walk).

**Cons**:

- Size-only: does not enforce format choice (AVIF/WebP vs PNG) as a hard rule.

### Option 2: Hard-enforce format policy (reject PNG/JPEG over a threshold)

**Description**: Fail the build on any photographic raster not shipped as
AVIF/WebP.

**Pros**:

- Pushes adopters toward modern formats aggressively.

**Cons**:

- High false-positive risk: the generated OG cards and touch icon are
  legitimate PNGs. Format is context-dependent; a hard rule punishes correct
  lossless use (icons, screenshots) and would need a sprawling exception list.

### Option 3: Gate the build output (`dist/`) instead of source

**Description**: Scan `dist/` after build to catch what actually ships.

**Pros**:

- Measures post-optimisation reality, including any raster fallbacks Astro
  emits.

**Cons**:

- Requires a full build before the gate can run (slower feedback).
- Astro's hashed output is harder to map back to a source file for a
  human-actionable "fix this file" message.
- Does not catch an oversized asset in `public/` any earlier than source scan
  does (`public/` is copied verbatim).

## Decision

We will implement **Option 1**: a `scripts/src/check-image-budget.ts` gate that
enforces a configurable per-file size ceiling on raster assets under `public/`
and `src/`, wired into GitHub Actions CI alongside the JS bundle-size gate.

- **Default ceiling**: **200KB** per raster file — the number `.claude/stack.md`
  already documents. Override with `IMAGE_BUDGET_KB=<kb>`.
- **Scope**: `.png .jpg .jpeg .webp .avif .gif` under `public/` and `src/`. SVG
  is unrestricted (vector; size is not a proxy for weight the same way).
- **Format policy (documented, advisory in the report — not a hard gate)**:
  prefer AVIF/WebP for photographic raster; PNG only where lossless is
  justified (icons, screenshots) and under the cap. The violation report
  suggests a format fix per extension.
- **Anti-pattern called out explicitly**: generating multi-MB PNG _fallbacks_
  alongside AVIF/WebP. Astro's `<Picture>`/`<Image>` pipeline emits modern
  formats; a heavyweight PNG fallback re-introduces exactly the weight this
  gate exists to stop. Adopters must not add such fallbacks. This is enforced at
  the build-output level too: CI runs the same gate again with
  `IMAGE_GATE_ROOTS=dist` after the build, so any oversized emitted raster fails
  regardless of source (added alongside ADR-058).

### Implementation Details

```typescript
// Pure, unit-tested core — the CLI wires it to the filesystem.
export function findImageBudgetViolations(
  assets: ImageAsset[],
  budgetBytes: number,
): ImageAsset[] {
  return assets
    .filter((asset) => asset.bytes > budgetBytes)
    .sort((a, b) => b.bytes - a.bytes); // worst offender first
}
```

## Consequences

### Positive

- The documented 200KB image budget is now enforced, not aspirational.
- A 1.4MB-hero-PNG regression fails CI with a clear, per-file report instead of
  silently costing Lighthouse points in production.
- The ceiling is one env var away from adopter-specific tuning.

### Negative

- Size-only enforcement: a correctly-sized but suboptimally-formatted image
  (e.g. a 150KB PNG that could be a 40KB WebP) passes the gate. The report
  flags it; the gate does not fail on it.

### Neutral

- `images:analyze` remains as the richer advisory tool; `images:gate` is the
  pass/fail companion. Two scripts, two jobs (analyse vs enforce).

## Validation

- **Metric 1**: a fixture image over the ceiling fails the gate (exit 1); a
  compliant fixture passes (exit 0). Covered by unit + fixture tests.
- **Metric 2**: the current demo passes the gate (largest raster is 80KB).
- **Metric 3**: CI fails on a PR that adds an over-budget raster.

## References

- [ADR-039: Halt-on-Violation Enforcement](039-halt-on-violation-enforcement.md)
- [ADR-052: Script Taxonomy](052-script-taxonomy.md)
- `.claude/stack.md` — Performance Budgets (documented image budget)
- `scripts/src/optimize-images.ts` — the pre-existing advisory analyser

## Notes

By default the gate scans source (`public/`, `src/`) so feedback needs no build
and violation messages point at a real source file. CI additionally runs it with
`IMAGE_GATE_ROOTS=dist` after the build to catch oversized emitted raster (e.g.
PNG fallbacks), as called out in the format anti-pattern above.

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-064). The original record above is unmodified. -->

- **Testable consequences:**
  - TC-1: every raster in `public/`/`src/` and in the build output is under the per-file ceiling.
- **Checks:**
  - TC-1 → `images:gate` (source + dist) in CI (status: **block**, pre-existing gate)
- **Not machine-checkable:** whether the configured ceiling remains appropriate is a maintainer judgment (the value is config, not code).
- **Graduation log:** _(empty at creation; entries added when a check changes status)_

---
**Date**: 2026-07-02\
**Participants**: Engineering\
**Outcome**: Accepted
