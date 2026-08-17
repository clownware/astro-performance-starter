---
title: 'ADR-047: Design Tokens v2 — Role-Based Semantic Naming'
lastUpdated: 2026-06-06T00:00:00.000Z
description: >-
  Adopts the cold-minimal v2 design language: role-based semantic token names,
  renamed base palettes, status colours as single light/dark role tokens, and a
  swappable fontFamily group. Records the rename map and the scale-retention
  rationale.
tableOfContents: true
pagefind: true
---

## Status

Accepted (amended 2026-07-05 to record the v2.1 token changes shipped 2026-06-07)

## Context

The `docs/2026-06_design_system/` package introduces a "cold-minimal, dark-first" visual
language. Its token sources restructure the semantic layer away from tiered names
(`background.primary`, `foreground.secondary`, three-step status scales) toward **role-based
names** that map one-to-one with intent (`background`, `surface`, `foreground`,
`muted-foreground`, `border`, `border-emphasis`, `link`, single-token `success` /
`warning` / `error`).

The change is structural, not cosmetic. It renames the base palettes, collapses status
scales into single light/dark role tokens, adds a `fontFamily` token group so typography
becomes swappable like colour, and cascades into `global.css`, ~478 utility-class usages
across 40+ components and pages, the design-token test, the AI constitution, and the
component showcase.

## Decision Drivers

- **Intent-revealing names**: `bg-surface` reads better than `bg-background-secondary`; a
  utility name should describe the role, not a tier number.
- **Dark mode by token, not by variant**: role tokens flip in `.dark` via generated CSS,
  removing manual `dark:` variants from components.
- **Status colour correctness**: the old three-step scales (`-100/-600/-700`) encouraged
  hardcoded tints; single role tokens + opacity utilities (`bg-success/10`) are leaner and
  consistent across light/dark.
- **Swappable typography**: a `fontFamily` token group lets the display face change without
  editing component files.
- **Accessibility preserved**: every gated pair must still pass the WCAG sweep in
  `pnpm design:validate`.

## Considered Options

### Option 1: Keep v1 tiered names, restyle only values

**Description**: Re-tune colour values inside the existing `background.primary` /
`foreground.secondary` structure.

**Pros**:

- No component churn
- No test or constitution updates

**Cons**:

- Locks in the weaker tier-number vocabulary
- Status colours stay as three-step scales
- No typography token group — display face stays hardcoded

### Option 2: Role-based v2 token layer (chosen)

**Description**: Replace `tokens/base.json` + `tokens/semantic.json` with the Path-B pair:
renamed palettes (`gray→slate`, `moonstone→violet`, `imperialRed→rose`, `orangeWeb→amber`),
role-based semantic names, single-token status colours, and a `fontFamily` group. Apply the
rename map across components via a scoped codemod.

**Pros**:

- Intent-revealing utilities; less manual dark-mode handling
- Status colours become single role tokens + opacity
- Typography swappable via tokens
- Brand scales (`primary` / `secondary` 50–950) retained for gradients and hover states

**Cons**:

- Large one-time codemod (~478 usages)
- Status colour change is a real refactor, not a find-replace
- Touches the AI constitution and showcase

### Option 3: Run v1 and v2 token names in parallel (aliases)

**Description**: Emit both old and new utilities and deprecate the old gradually.

**Pros**: No big-bang migration

**Cons**: Doubles the token surface; CSS budget pressure; ambiguous source of truth; the
starter is small enough to migrate atomically

## Decision

**Adopt the role-based v2 token layer (Option 2).**

### Palette rename map

| v1 (base) | v2 (base) |
| --- | --- |
| `gray` | `slate` |
| `moonstone` | `violet` |
| `imperialRed` | `rose` |
| `orangeWeb` | `amber` |

### Semantic role mapping

| Role token | Light | Dark |
| --- | --- | --- |
| `background` | `slate-50` | `spaceCadet` |
| `surface` | `white` | `slate-900` |
| `surfaceRaised` † | raw HSL (near-white) | raw HSL (raised slate) |
| `surfaceAccent` † | raw HSL (violet tint) | raw HSL (violet tint) |
| `foreground` | `charcoal` | `slate-50` |
| `muted-foreground` | `slate-600` | `slate-400` |
| `border` | `slate-200` | `slate-800` |
| `border-emphasis` | `slate-500` | `slate-500` |
| `primary-foreground` | `white` | `white` |
| `link` | `violet-600` | `violet-300` |
| `success` † | `green-700` | `green-400` |
| `warning` | `amber-700` | `amber-500` |
| `error` | `rose-700` | `rose-400` |

† Amended in v2.1 — see the amendment below. As originally accepted, `success` was
`violet-600`/`violet-400` ("a positive state is on-brand rather than introducing a
separate green") and there were no raised/accent surface tiers.

### Amendment — v2.1 tokens (shipped 2026-06-07, recorded 2026-07-05)

The design-system v2.1 merge (commit `89fc9c69`) changed the semantic layer in two
ways this record originally required an amendment for:

- **`success` moved off violet onto a dedicated green family** (`green-700` light /
  `green-400` dark, with a full green 50–950 scale added to `tokens/base.json`).
  In practice the violet-success experiment failed the "status colour must read as
  status" test: success states were indistinguishable from primary/link emphasis.
- **Two additional surface tiers** were added under the Tonal-tiers escape hatch:
  `surfaceRaised` (cards/popovers above `surface`) and `surfaceAccent` (violet-tinted
  emphasis panels). Both are raw HSL values rather than base-palette references.

The drift-guard test (`src/__tests__/design-tokens.test.ts`) pins the green mapping;
this amendment is the "ADR-047 v2.1" it refers to.

### Utility rename map (component codemod)

| Old utility | New utility |
| --- | --- |
| `bg-background-primary` | `bg-background` |
| `bg-background-secondary` | `bg-surface` |
| `text-foreground-primary` | `text-foreground` |
| `text-foreground-secondary` | `text-muted-foreground` |
| `text-foreground-subtle` | `text-muted-foreground` |
| `border-border-primary` / `border-border-default` | `border-border` |
| `text-primary-600` (links) | `text-link` |
| `text-primary-300` (dark links) | _(deleted — `text-link` flips in dark)_ |
| `bg-success-100` / `text-success-700` | `bg-success/10` / `text-success` (and warning/error) |
| `bg-primary-*`, `text-primary-*`, `ring-primary-*` | unchanged (scale retained) |

### Scale-retention rationale

The `primary` and `secondary` colours keep their full 50–950 scales even though the role
layer is flat. The signature gradient headline and button hover/active states reference
specific steps (e.g. `violet-400` dark / `violet-600` light gradient stops, `primary-300`
inner-shadow highlights), so collapsing them to a single token would break those.

### Tonal tiers

The canonical token file ships **two** surface tiers (`background`, `surface`) and **two**
text tiers (`foreground`, `muted-foreground`). The Component Sheet illustrates a third
tier; we collapse to two by default and only add `muted` (`slate-500`) or a raised surface
token if a visual-diff regression requires it. Any such addition is recorded as an
amendment here. (Exercised by the v2.1 amendment above: `surfaceRaised` and
`surfaceAccent`.)

## Consequences

### Positive

- Intent-revealing utilities; fewer manual `dark:` variants
- Status colours unified as role token + opacity
- Typography swappable via the `fontFamily` token group
- One source of truth — no parallel alias layer

### Negative

- One-time ~478-usage codemod plus a hand-reviewed status refactor
- AI constitution examples and the showcase need updating

### Neutral

- The token build pipeline (`scripts/src/build-tokens.ts`) is unchanged — it already
  resolves nested scales and single role tokens with `dark` references, and flattens the
  new `fontFamily` group to `--font-family-display` / `--font-family-text`

## Validation

- **Token build**: `pnpm tokens:build` emits the new `--color-*` and `--font-family-*` vars
- **Contrast**: `pnpm design:validate` passes every gated pair in both modes
- **Tests**: `src/__tests__/design-tokens.test.ts` asserts the role set, source mappings,
  retained brand scales, and Geist-first display family
- **No dead classes**: `pnpm build` + a light/dark visual diff of `/showcase` shows no
  unstyled utilities
- **CSS budget**: total CSS stays < 50KB (`pnpm perf:budgets`)

## References

- `docs/2026-06_design_system/wiring/path-b-wiring.md` — the wiring guide
- `docs/2026-06_design_system/wiring/base.json`, `.../wiring/semantic.json` — canonical Style-Dictionary sources
- [ADR-026: Font Strategy](./026-font-strategy.md)
- [ADR-032: Dark Mode Strategy](./032-dark-mode-strategy.md)
- [ADR-048: CSS-Native Motion System](./048-css-native-motion-system.md)

## Notes

The canonical Style-Dictionary source is the `wiring/base.json` + `wiring/semantic.json`
pair (palettes `slate/violet/rose/amber`, `{value}` token wrappers). The sibling
`tokens/base.json` is a flat prototype the Visual Language HTML fetches — it uses the _old_
palette names (`gray/moonstone/imperialRed/orangeWeb`) and is reference/intent only. Only
the `wiring/*` pair is copied into `tokens/base.json` + `tokens/semantic.json` and wired
into the build.

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-064). The original record above is unmodified. -->

- **Testable consequences:**
  - TC-1: every gated token pair passes the WCAG contrast sweep.
  - TC-2: no `dark:` variant utilities appear in `src/` — role tokens flip in `.dark` via generated CSS.
  - TC-3: no hardcoded colour literals (hex/rgb/hsl) appear outside `tokens/` and generated token CSS.
- **Checks:**
  - TC-1 → `design:validate` in CI (status: **block**, pre-existing gate)
  - TC-2 → check `no-dark-variants` (status: **warn**)
  - TC-3 → check `no-hardcoded-colors` (status: **warn**)
- **Not machine-checkable:** whether a token name is intent-revealing is a naming judgment.
- **Graduation log:** _(empty at creation; entries added when a check changes status)_

---
**Date**: 2026-06-06\
**Participants**: Chris Pezza, template maintainers\
**Outcome**: Accepted
