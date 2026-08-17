---
title: Using Design Tokens
description: A guide for developers on how to consume and extend the design-token system
lastUpdated: true
tableOfContents: true
pagefind: true
---
This guide shows **developers** how to consume and extend the design–token system shipped with the Astro Performance Starter.

## 1. Quick recap

Token sources live in `tokens/`:

| File | Purpose |
|------|---------|
| `base.json` | **Atomic** design tokens (color, spacing, radii, motion, etc.) |
| `semantic.json` | Light/dark _semantic_ aliases (background, border, etc.) |
| `dist/` | Build output – **do not edit directly** |

The build process automatically generates:

- `tokens/dist/tailwind-tokens.json` – retained for reference; token values are mapped to Tailwind utilities via `@theme inline` in `src/styles/global.css`.
- `tokens/dist/tokens.css` – CSS variables (light + `.dark`).

Tokens compile automatically during `pnpm run dev` or `pnpm run build`. Manual compilation (rarely needed): `pnpm run tokens:build`.

## 2. In templates/components

### Tailwind utilities

```astro
<div class="bg-background text-foreground p-4 rounded-lg shadow-md">
  …
</div>
```

- `bg-background` – maps to `semantic.background` (uses `--color-background`).
- `text-foreground` – semantic text color with automatic dark mode.
- `shadow-md` – from `shadow` scale in base tokens.
- All color tokens use the `--color-` prefix for consistency.

### CSS/SCSS

```css
.card {
  background-color: hsl(var(--color-background));
  color: hsl(var(--color-foreground));
  border-radius: var(--border-radius-lg);
}
```

- Access any token via CSS custom property – **wrap color tokens with `hsl()`**.
- All color variables use the `--color-` prefix (e.g., `--color-primary-500`, `--color-background`).
- Dark-mode handled automatically via `.dark` class overrides.

## 3. Adding / updating tokens

1. Edit `tokens/base.json` or `tokens/semantic.json`.
2. Save the file – tokens auto-compile during `dev` or `build`.
3. Commit both source and _dist_ files.

Manual compilation (if needed): `pnpm run tokens:build`

> **Tip:** keep scales consistent (increments of `4px` for spacing, `8ms` for durations, etc.).

## 4. Naming conventions

### JSON tokens (source)

- **Base tokens**: camelCase in JSON (`borderRadius.lg`, `color.slate.500` — the base palette is `slate`, `violet`, `rose`, `amber`, `green`, `spaceCadet`, `white`, `charcoal`).
- **Semantic tokens**: role-based naming per ADR-047 (`surface`, `foreground`, `mutedForeground`, `borderEmphasis`).

### CSS variables (generated)

- **All color tokens**: `--color-` prefix for consistency.
  - Base: `--color-slate-500`, `--color-violet-600`
  - Semantic: `--color-primary-500`, `--color-surface`, `--color-foreground`
- **Non-color tokens**: category prefix (`--spacing-4`, `--border-radius-lg`).

### Tailwind utilities

- Match CSS variable names: `bg-primary-500`, `text-foreground`, `bg-surface`, `border-border-emphasis`.
- Dark mode: handled automatically via the `.dark` class (no manual `dark:` variants needed for semantic tokens).

## 5. Dark mode strategies

Dark mode ships with the template (ADR-032) — you don't build it:

- `ThemeSetup.astro` (in `BaseLayout`) applies the stored choice before paint: it sets the `.dark` class and `data-theme` attribute on `<html>` from `localStorage`, falling back to `prefers-color-scheme`.
- `ThemeToggle.astro` cycles light → dark → system and persists the choice.
- Tailwind's `dark:` variants activate via `@variant dark (&:where(.dark, .dark *))` in `src/styles/global.css`; semantic role tokens flip automatically in `tokens.css`, so components using them need no `dark:` variants at all.

## 6. Lint & validation

- `pnpm run design:validate` – ensures WCAG-AA contrast for semantic pairs.
- CI fails if new tokens break contrast budgets.

Need help? Check the [Design System implementation guide](/implementation-guides/completed/phase-2-design-system/) or open an issue.
