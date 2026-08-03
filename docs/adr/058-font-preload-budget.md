---
title: 'ADR-058: Font Preload Budget Gate'
description: >-
  Cap the number of preloaded font files per page and enforce it in CI, so
  over-preloading fonts can't silently regress LCP.
lastUpdated: 2026-07-02T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

An adopter audit surfaced a subtle regression class: **over-preloading fonts**.
`<link rel="preload" as="font">` fetches a font at highest priority, competing
for bandwidth with the LCP resource. One or two preloads warm the critical
fonts; beyond that, each additional preload delays the very paint it was meant
to speed up. The failure is quiet — nothing errors, the page just gets slower,
and Lighthouse's category score absorbs the loss without naming the cause.

This starter uses the Astro Fonts API ([ADR-053](053-fonts-via-astro-fonts-api.md))
with two families (Geist display, Inter text), and currently preloads exactly
**two** variable `woff2` files — one per family — on every page. That is the
correct, deliberate number. Nothing stops a future change (adding a weight, a
third family, a second script subset) from quietly pushing the preload count up
and eroding LCP. The JS, CSS, image, and Lighthouse budgets are all gated;
font preloads are not.

## Decision Drivers

- **Protect LCP**: preloads are a scarce, high-priority resource; more is not
  better past the critical fonts.
- **Halt-on-violation parity** (ADR-039): make the implicit "two preloads"
  rule explicit and enforced.
- **Fit the existing gate architecture**: reuse the build-output-scan pattern
  the JS bundle-size and image gates already use.
- **Configurable**: adopters with different font strategies can raise the cap.

## Considered Options

### Option 1: Build-time scan of the emitted HTML

**Description**: A script counts `rel="preload" … as="font"` links per page in
`dist/**/*.html` after build and fails if any page exceeds the cap (default 2,
`MAX_FONT_PRELOADS` override).

**Pros**:

- Measures what actually ships, regardless of how the preloads were produced
  (Astro Fonts API, a manual `<link>`, a future integration).
- Mirrors the existing JS-bundle and image gates (post-build CI step, pure
  testable core). No new concepts.

**Cons**:

- Needs a build before it can run (already true for the sibling gates).

### Option 2: Lighthouse CI budget assertion

**Description**: Assert a resource-count budget on fonts in `lighthouserc`.

**Pros**:

- No new script.

**Cons**:

- LHCI resource-summary budgets count _all_ font requests, not _preloads_
  specifically — it can't distinguish a preload from a normal font load, which
  is exactly the signal we care about. Wrong instrument.

### Option 3: Biome/lint rule on source

**Description**: Lint the source for preload `<link>`s.

**Pros**:

- Runs in `quality:ci` with no build.

**Cons**:

- The preloads are _generated_ by the Astro Fonts API, not written in source.
  A source lint is blind to them. Wrong layer.

## Decision

We will implement **Option 1**: `scripts/src/check-font-preloads.ts` counts
preloaded font files per built page and fails CI when any page exceeds the cap.

- **Default cap**: **2** preloaded font files per page — the current, deliberate
  count (one per family). Override with `MAX_FONT_PRELOADS=<n>`.
- **Placement**: a post-build CI step alongside the JS bundle-size and image
  gates. New `fonts:gate` script.
- **Scope**: `<link rel="preload" … as="font">` occurrences per `dist` HTML
  page. It counts preload _links_, which is the LCP-relevant signal.

### Implementation Details

```typescript
// Pure, unit-tested core — the CLI wires it to the built HTML.
export function findFontPreloadViolations(
  pages: FontPreloadCount[],
  maxPreloads: number,
): FontPreloadCount[] {
  return pages
    .filter((page) => page.count > maxPreloads)
    .sort((a, b) => b.count - a.count);
}
```

## Consequences

### Positive

- Over-preloading fonts becomes a hard CI failure with a per-page report, not a
  silent LCP tax.
- The deliberate "two preloads" decision is now enforced, not just documented.

### Negative

- Counts preload links, not their byte weight — two enormous preloaded fonts
  would pass. The per-image gate has no font analogue; font _weight_ is bounded
  in practice by the `woff2` variable-subset strategy (ADR-053), not by this
  gate.

### Neutral

- Adopters who legitimately need more preloads raise `MAX_FONT_PRELOADS`.

## Validation

- **Metric 1**: a fixture page with 3 font preloads fails at cap 2; a page with
  2 passes. Covered by unit + fixture tests.
- **Metric 2**: the current demo passes — every one of its 84 built pages
  preloads exactly two fonts.

## References

- [ADR-053: Fonts via the Astro Fonts API](053-fonts-via-astro-fonts-api.md)
- [ADR-026: Font Strategy](026-font-strategy.md)
- [ADR-039: Halt-on-Violation Enforcement](039-halt-on-violation-enforcement.md)
- [ADR-057: Per-Image Size Budget Gate](057-image-budget-gate.md) — sibling
  build-output gate

## Notes

The cap counts links, deliberately. The point is to stop _preload proliferation_
competing with LCP, not to police individual font size (the variable-subset
`woff2` strategy already keeps each face small).

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-062). The original record above is unmodified. -->

- **Testable consequences:**
  - TC-1: no emitted page exceeds the font preload cap.
- **Checks:**
  - TC-1 → `fonts:gate` in CI (status: **block**, pre-existing gate)
- **Not machine-checkable:** which fonts deserve the scarce preload slots.
- **Graduation log:** _(empty at creation; entries added when a check changes status)_

---
**Date**: 2026-07-02\
**Participants**: Engineering\
**Outcome**: Accepted
