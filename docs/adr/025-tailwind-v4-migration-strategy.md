---
title: 'ADR-025: Tailwind CSS v4 Migration'
lastUpdated: 2026-03-26T00:00:00.000Z
description: >-
  Documents the completed migration from Tailwind CSS v3 to v4, replacing the
  tailwind.config.ts + @astrojs/tailwind setup with a CSS-native @theme inline
  configuration via the @tailwindcss/vite plugin.
tableOfContents: true
pagefind: true
---

## Status

Accepted (migration completed 2026-03-26) — supersedes [ADR-002: Future CSS Tooling Considerations](./002-future-css-tooling-considerations.md)

## Context

This ADR was originally written on 2026-02-18 as a decision to **stay on Tailwind CSS v3** and defer the v4 upgrade. On 2026-03-26, the migration was performed. This document has been updated to reflect the completed state.

The original concerns from the deferred decision were:

1. **`@astrojs/tailwind` is deprecated for v4** — resolved by switching to `@tailwindcss/vite`
2. **Design token pipeline would break** — resolved by using `@theme inline` in CSS, which references the existing `--color-*` CSS custom properties from `tokens/dist/tokens.css`
3. **`tailwind.config.ts` has no equivalent** — resolved; the file was deleted and all theme configuration lives in `src/styles/global.css`
4. **`@tailwindcss/typography` compatibility** — resolved; v0.5.19 declares `>=4.0.0-beta.1` peer dependency support

## Decision

**Migrate to Tailwind CSS v4.** All four preconditions from the original deferred decision were satisfied during the migration sprint.

## What Changed

### Integration

| Before | After |
|---|---|
| `@astrojs/tailwind` v6.x integration | `@tailwindcss/vite` v4.2.2 Vite plugin |
| `tailwind.config.ts` JS config file | Deleted — replaced by CSS |
| `@tailwind base/components/utilities` | `@import 'tailwindcss'` |

### Configuration model

**Before**: `tailwind.config.ts` loaded design tokens via a `transformTokens()` function that read `tokens/dist/tailwind-tokens.json` at build time.

**After**: `src/styles/global.css` uses `@theme inline` to map existing CSS custom properties (defined in `tokens/dist/tokens.css`) to Tailwind utility classes — no JSON import, no JS function:

```css
@theme inline {
  --color-primary-500: hsl(var(--color-primary-500));
  /* ... all tokens ... */
}
```

Using `@theme inline` (not `@theme`) is deliberate: it avoids creating new CSS custom properties that would conflict with the `--color-*` vars already defined in `tokens/dist/tokens.css`.

### Dark mode

`darkMode: "class"` in the old JS config is replaced by a CSS variant declaration:

```css
@variant dark (&:where(.dark, .dark *));
```

### Typography plugin

The JS config's `typography()` function with CSS variable overrides is replaced by plain CSS in `global.css`:

```css
@plugin "@tailwindcss/typography";

.prose {
  --tw-prose-body: hsl(var(--color-foreground-secondary));
  --tw-prose-headings: hsl(var(--color-foreground-primary));
  /* ... */
}
```

### Custom utilities

The inline `addUtilities` plugin (`focus-ring`, `focus-visible-ring`, `sr-only`) is replaced by `@utility` blocks in `global.css`, using native CSS `outline` for focus rings (more accessible, works in Windows High Contrast mode).

### Component `@apply` fix

Three component style blocks that used `@apply` with custom utility classes now include `@reference` to allow Tailwind to resolve utility names:

- `src/layouts/ProjectLayout.astro`
- `src/layouts/BlogLayout.astro`
- `src/pages/projects/index.astro`

### Class renames (automated by `@tailwindcss/upgrade`)

| Old | New |
|---|---|
| `bg-gradient-to-*` | `bg-linear-to-*` |
| `flex-shrink-0` | `shrink-0` |
| `flex-grow` | `grow` |
| `outline-none` (focus) | `outline-hidden` |
| `supports-[backdrop-filter]:` | `supports-backdrop-filter:` |

## Consequences

### Positive

- `@astrojs/tailwind` deprecation resolved permanently
- Build times significantly faster (Tailwind v4 uses a Rust-based engine: ~100x faster incremental builds)
- CSS configuration is now co-located in `src/styles/global.css` — single source of truth for styling
- Design token pipeline (`tokens/dist/tokens.css`) unchanged — no migration of the build-tokens script required
- Zero TypeScript errors after migration; 0 warnings from `astro check`

### Neutral

- `tailwindcss-themer` (optional dependency) has a peer dependency warning against tailwindcss ^3. If theme switching features are used, this package needs to be replaced with v4-native theming (which has built-in multi-theme support via `@variant`). *(Resolved 2026-07-27: the package was unused — zero references in src/, tokens/, or scripts/ — and was removed rather than replaced. v4-native `@variant` theming remains the documented path if multi-theme support is ever needed.)*

## References

- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Tailwind CSS v4 Release Blog](https://tailwindcss.com/blog/tailwindcss-v4)
- [Astro 5.2 Release Notes — Tailwind v4 support](https://astro.build/blog/astro-520/)
- [ADR-002: Future CSS Tooling Considerations](./002-future-css-tooling-considerations.md) — superseded
- [ADR-000: Starter Template Architecture](./000-starter-decisions.md)

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-062). The original record above is unmodified. -->

- **Testable consequences:**
  - TC-1: no `tailwind.config.{js,ts,mjs,cjs}` file exists.
  - TC-2: `@astrojs/tailwind` is absent from dependencies and `@tailwindcss/vite` is present.
  - TC-3: `src/styles/global.css` contains an `@theme inline` block.
- **Checks:**
  - TC-1, TC-2, TC-3 → check `tw4-shape` (status: **warn**)
- **Not machine-checkable:** utility-vs-token style judgment inside components.
- **Graduation log:** _(empty at creation; entries added when a check changes status)_

---
**Date**: 2026-03-26\
**Participants**: Template maintainers\
**Outcome**: Completed
