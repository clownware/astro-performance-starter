# Path B — Wiring Guide

The new `tokens/base.json` + `tokens/semantic.json` use role-based semantic names. This is everything else that has to change so the build, styles, components, and agents stay in sync.

> **One caveat:** the exact CSS var names `tokens:build` emits depend on your Style Dictionary config's name transform. The original config emitted **both** raw and semantic tokens under a `--color-*` prefix, kebab-cased. The mappings below assume the same convention (so `mutedForeground` → `--color-muted-foreground`). Mirror the `@theme inline` block to whatever `tokens/dist/tokens.css` actually emits — same as the existing pattern.

---

## 1. `global.css` — `@theme inline` (color + font block)

Replace the old color mappings with these. Spacing / fontSize / radius / shadow / motion mappings are unchanged except `--shadow-base` (now restored) and the new `--font-*`.

```css
@theme inline {
  /* Neutrals (renamed gray → slate) */
  --color-slate-50:  hsl(var(--color-slate-50));
  /* …100–900… */
  --color-slate-950: hsl(var(--color-slate-950));

  /* Brand scales (still full 50–950 — gradient + hover states need them) */
  --color-primary-50:  hsl(var(--color-primary-50));
  /* …–950 */
  --color-secondary-50: hsl(var(--color-secondary-50));
  /* …–950 */

  /* Role tokens (these flip in .dark via tokens.css) */
  --color-background:        hsl(var(--color-background));
  --color-surface:           hsl(var(--color-surface));
  --color-foreground:        hsl(var(--color-foreground));
  --color-muted-foreground:  hsl(var(--color-muted-foreground));
  --color-border:            hsl(var(--color-border));
  --color-border-emphasis:   hsl(var(--color-border-emphasis));
  --color-primary-foreground:hsl(var(--color-primary-foreground));
  --color-link:              hsl(var(--color-link));
  --color-success:           hsl(var(--color-success));
  --color-warning:           hsl(var(--color-warning));
  --color-error:             hsl(var(--color-error));

  /* Fonts (NEW) */
  --font-display: var(--font-family-display);
  --font-text:    var(--font-family-text);

  /* Shadow base restored */
  --shadow-base: 0 2px 6px -2px hsl(230 40% 3% / 0.25);
}
```

Set the body font to the text family (in `@theme` or BaseLayout): `--default-font-family: var(--font-text)`. Apply `font-display` to headings.

## 2. `global.css` — base layer changes

```css
/* Default border color: was --color-gray-200, now the role token */
@layer base {
  *, ::after, ::before, ::backdrop, ::file-selector-button {
    border-color: var(--color-border, currentcolor);
  }
}

/* Links: collapse the two-mode rule — the link token flips in dark automatically */
@layer base {
  a {
    @apply text-link rounded-sm focus:outline-hidden focus:ring-2;
    --tw-ring-color: hsl(var(--color-primary-500));
  }
  /* delete the old `.dark a { … }` override — no longer needed */
}
```

Prose plugin vars: repoint `--tw-prose-links` to `hsl(var(--color-link))`, `--tw-prose-body` to `--color-muted-foreground`, `--tw-prose-headings` to `--color-foreground`, etc. (drop the `.dark .prose` link override — token handles it).

## 3. Utility rename map (component find-and-replace)

| Old utility | New utility |
| --- | --- |
| `bg-background-primary` | `bg-background` |
| `bg-background-secondary` | `bg-surface` |
| `text-foreground-primary` | `text-foreground` |
| `text-foreground-secondary` | `text-muted-foreground` |
| `text-foreground-subtle` | `text-muted-foreground` _(or keep a distinct `--color-muted` = slate-500 if you want three tiers)_ |
| `border-border-primary` | `border-border` |
| `border-border-default` | `border-border` |
| `border-border-emphasis` | `border-border-emphasis` |
| `text-primary-600` (links) | `text-link` |
| `text-primary-300` (dark links) | _(delete — `text-link` flips in dark)_ |
| `bg-primary-*`, `text-primary-*`, `ring-primary-500` | **unchanged** (scale retained) |

Run as a scoped codemod across `src/components/**` and `src/pages/**`, then `pnpm check` + visual diff.

## 4. Status colors — real refactor, not a rename

`success` / `warning` / `error` moved from 3-step scales (`-100/-600/-700`) to **single role tokens** with light/dark. Anything using the old steps must change:

- tinted background → `bg-success/10` (opacity utility) instead of `bg-success-100`
- text/icon → `text-success` instead of `text-success-700`
- Audit `Badge`, `Callout`, `ContactForm` (error states), `Dialog`.

## 5. Downstream files to update

- `ColorTokenSwatch` usages in `showcase.astro` — point at the new token names; add `surface`, `muted-foreground`, `link`, `primary-foreground` swatches.
- `src/__tests__/design-tokens.test.ts` — assert the new token set.
- **AI constitution** (the easy miss): `CLAUDE.md`, `.claude/engineering.md`, `AGENTS.md` — any example using `bg-background-primary` etc. is now a dead class. Update + `pnpm agents:build` (CI fails on drift).
- New ADR: "Design tokens v2 — role-based semantic naming" (record the rename + the scale-retention rationale).

## 6. Fonts

Self-host **Space Grotesk** (display) and **Inter** (text); subset to used weights, `font-display: swap`. Two faces max — confirm CSS stays < 15KB gzipped after. _(Shipped: Geist replaced Space Grotesk as the display face — ADR-053.)_

## Gate

`pnpm tokens:build && pnpm design:validate && pnpm build && pnpm perf:budgets && pnpm check:types && pnpm test:unit` — all green before Phase 2.
