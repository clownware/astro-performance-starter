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
| `base.json` | **Atomic** design tokens (color, fontFamily, fontSize, spacing, borderRadius, shadow, motion) |
| `semantic.json` | Role-based semantic aliases with light/dark values (background, surface, foreground, border, …) |
| `dist/` | Build output – **do not edit directly** (gitignored) |

The build script (`pnpm run tokens:build`, [`scripts/src/build-tokens.ts`](https://github.com/clownware/astro-performance-starter/blob/master/scripts/src/build-tokens.ts)) generates:

- `tokens/dist/tokens.css` – CSS variables in two blocks: `:root` (light values) and `.dark` (dark overrides). Imported by `src/styles/global.css` and mapped to Tailwind utilities via `@theme inline` (Tailwind is CSS-first here — there is no `tailwind.config.*`).
- `tokens/dist/tailwind-tokens.json` – a JSON export of the token scales for tooling.

Tokens compile automatically before `pnpm run dev` (`predev`) and as part of `pnpm run build`. Manual compilation (rarely needed): `pnpm run tokens:build`.

## 2. In templates/components

### Tailwind utilities

```astro
<div class="bg-background text-foreground p-4 rounded-lg shadow-md transition duration-fast">
  …
</div>
```

- `bg-background` / `text-foreground` – map to the semantic role tokens (`semantic.background`, `semantic.foreground`), exposed as `--color-background` / `--color-foreground` via `@theme inline`.
- `shadow-md` – from the `shadow` scale in base tokens.
- `duration-fast` – motion tokens (`--duration-fast` / `base` / `slow`, plus `ease-in` / `ease-out` / `ease-in-out`); `transition` itself is Tailwind's built-in utility.
- All color tokens use the `--color-` prefix for consistency.

### CSS/SCSS

```css
.card {
  background-color: hsl(var(--color-background));
  color: hsl(var(--color-foreground));
  border-radius: var(--border-radius-lg);
}
```

- Access any token via CSS custom property – **wrap color tokens with `hsl()`** (they are stored as raw HSL channels).
- All color variables use the `--color-` prefix (e.g., `--color-primary-500`, `--color-background`).
- Dark mode is handled automatically: the `.dark` block in `tokens.css` overrides the semantic variables.

## 3. Adding / updating tokens

1. Edit `tokens/base.json` or `tokens/semantic.json`.
2. Run `pnpm run tokens:build` to regenerate outputs (`predev` and `build` do this for you).
3. Commit only the source files — `tokens/dist/` is gitignored and regenerated on every dev/build.

> **Tip:** keep scales consistent — spacing steps of `0.25rem` (4px), and motion durations on the existing `fast` / `base` / `slow` steps rather than ad-hoc values.

## 4. Naming conventions

### JSON tokens (source)

- **Base tokens**: camelCase in JSON (`borderRadius.lg`, `color.slate.500` — the base palette is `slate`, `violet`, `rose`, `amber`, `green`, `spaceCadet`, `white`, `charcoal`).
- **Semantic tokens**: flat, role-based names per [ADR-047](/adr/047-design-tokens-v2-role-based-naming/) (`background`, `surface`, `surfaceRaised`, `foreground`, `mutedForeground`, `borderEmphasis`, `link`, `success`).

### CSS variables (generated)

- **All color tokens**: `--color-` prefix for consistency.
  - Base: `--color-slate-500`, `--color-violet-600`
  - Semantic: `--color-primary-500`, `--color-surface`, `--color-foreground`
- **Non-color tokens**: category prefix (`--spacing-4`, `--border-radius-lg`, `--motion-duration-fast`).

### Tailwind utilities

- Match CSS variable names: `bg-primary-500`, `text-foreground`, `bg-surface`, `border-border-emphasis`.
- Dark mode: handled automatically via the `.dark` class (no manual `dark:` variants needed for semantic tokens).

## 5. Dark mode

Dark mode ships with the template ([ADR-032](/adr/032-dark-mode-strategy/)) — you don't build it. The default is **dark-first**: the OS `prefers-color-scheme` setting does not pick the theme.

- [`src/components/ThemeSetup.astro`](https://github.com/clownware/astro-performance-starter/blob/master/src/components/ThemeSetup.astro) runs an inline script before paint. If `localStorage` has an explicit `theme` of `light` or `dark`, it applies that; otherwise it applies dark. It sets the `.dark` class and the `data-theme` attribute on `<html>`, re-applies after Astro view transitions, and syncs the choice across tabs.
- [`src/components/atoms/ThemeToggle.astro`](https://github.com/clownware/astro-performance-starter/blob/master/src/components/atoms/ThemeToggle.astro) cycles light → dark → system. "System" clears the stored choice, which under the dark-first rule renders dark.
- `tokens/dist/tokens.css` only contains `:root` and `.dark` blocks — there is no `prefers-color-scheme` media query. Tailwind's `dark:` variants activate via `@variant dark (&:where(.dark, .dark *))` in `src/styles/global.css`; semantic role tokens flip automatically, so components using them need no `dark:` variants at all.

## 6. Lint & validation

- `pnpm run design:validate` – ensures WCAG-AA contrast for semantic pairs.
- CI fails if new tokens break contrast budgets.

Need help? Check the [Design System implementation guide](/implementation-guides/completed/phase-2-design-system/), the [Design System Changelog](/development/design-system-changelog/), or open an issue.
