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
| `semantic.json` | Light/dark *semantic* aliases (background, border, etc.) |
| `dist/` | Build output – **do not edit directly** |

The build process automatically generates:

- `tokens/dist/tailwind-tokens.json` – imported by `tailwind.config.ts`.
- `tokens/dist/tokens.css` – CSS variables (light + `.dark`).

Tokens compile automatically during `pnpm run dev` or `pnpm run build`. Manual compilation (rarely needed): `pnpm run build:tokens`.

## 2. In templates/components

### Tailwind utilities

```astro
<div class="bg-background-primary text-foreground-primary p-4 rounded-lg shadow-md">
  …
</div>
```

- `bg-background-primary` – maps to `semantic.background.primary` (uses `--color-background-primary`).
- `text-foreground-primary` – semantic text color with automatic dark mode.
- `shadow-md` – from `shadow` scale in base tokens.
- All color tokens use the `--color-` prefix for consistency.

### CSS/SCSS

```css
.card {
  background-color: hsl(var(--color-background-primary));
  color: hsl(var(--color-foreground-primary));
  border-radius: var(--border-radius-lg);
}
```

- Access any token via CSS custom property – **wrap color tokens with `hsl()`**.
- All color variables use the `--color-` prefix (e.g., `--color-primary-500`, `--color-background-primary`).
- Dark-mode handled automatically via `.dark` class overrides.

## 3. Adding / updating tokens

1. Edit `tokens/base.json` or `tokens/semantic.json`.
2. Save the file – tokens auto-compile during `dev` or `build`.
3. Commit both source and *dist* files.

Manual compilation (if needed): `pnpm run build:tokens`

> **Tip:** keep scales consistent (increments of `4px` for spacing, `8ms` for durations, etc.).

## 4. Naming conventions

### JSON tokens (source)

- **Base tokens**: camelCase in JSON (`borderRadius.lg`, `color.moonstone.500`).
- **Semantic tokens**: purpose-based naming (`background.primary`, `foreground.secondary`).

### CSS variables (generated)

- **All color tokens**: `--color-` prefix for consistency.
  - Base: `--color-gray-500`, `--color-moonstone-600`
  - Semantic: `--color-primary-500`, `--color-background-primary`
- **Non-color tokens**: category prefix (`--spacing-4`, `--border-radius-lg`).

### Tailwind utilities

- Match CSS variable names: `bg-primary-500`, `text-foreground-primary`.
- Dark mode: handled automatically via `.dark` class (no manual `dark:` variants needed for semantic tokens).

## 5. Dark mode strategies

- System preference: enabled automatically via `prefers-color-scheme`.
- Manual toggle: add `.dark` class to `html` / `body`.

```ts
// Example: toggle
import { useEffect } from "preact/hooks";

useEffect(() => {
  document.documentElement.classList.toggle("dark");
});
```

## 6. Lint & validation

- `pnpm run validate:contrast` – ensures WCAG-AA contrast for semantic pairs.
- CI fails if new tokens break contrast budgets.

Need help? Check the [Design System implementation guide](/implementation-guides/01-foundation-phase-2-design-system/) or open an issue.
