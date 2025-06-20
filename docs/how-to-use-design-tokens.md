---
sidebar_position: 2
title: "Using Design Tokens"
---

# Using Design Tokens

> Applies to both MVP & Showcase tracks.

This guide shows **developers** how to consume and extend the design–token system shipped with the Astro Performance Starter.

## 1. Quick recap

Token sources live in `tokens/`:

| File | Purpose |
|------|---------|
| `base.json` | **Atomic** design tokens (color, spacing, radii, motion, etc.) |
| `semantic.json` | Light/dark *semantic* aliases (background, border, etc.) |
| `dist/` | Build output – **do not edit directly** |

The build script (`pnpm run build:tokens`) generates:

* `tokens/dist/tailwind-tokens.json` – imported by `tailwind.config.ts`.
* `tokens/dist/tokens.css` – CSS variables (light + `.dark`).

## 2. In templates/components

### Tailwind utilities

```astro
<div class="bg-background-default text-foreground-default p-4 rounded-lg shadow-md transition-base duration-fast">
  …
</div>
```

* `bg-background-default` – maps to `semantic.background.default`.
* `shadow-md` – from `shadow` scale.
* `transition-base` & `duration-fast` – motion tokens.

### CSS/SCSS

```css
.card {
  background-color: hsl(var(--semantic-background-default));
  color: hsl(var(--semantic-foreground-default));
  border-radius: var(--border-radius-lg);
}
```

* Access any token via CSS custom property – **wrap HSL tokens with `hsl()`**.
* Dark-mode handled automatically via `.dark` variables.

## 3. Adding / updating tokens

1. Edit `tokens/base.json` or `tokens/semantic.json`.
2. Run `pnpm run build:tokens` to regenerate outputs.
3. Commit both source and *dist* files.

> **Tip:** keep scales consistent (increments of `4px` for spacing, `8ms` for durations, etc.).

## 4. Naming rules

* **Atomic tokens**: lowercase camelCase (`borderRadius.lg`).
* **Semantic tokens**: cascade from purpose → state (`background.default`).

## 5. Dark mode strategies

* System preference: enabled automatically via `prefers-color-scheme`.
* Manual toggle: add `.dark` class to `html` / `body`.

```ts
// Example: toggle
import { useEffect } from "preact/hooks";

useEffect(() => {
  document.documentElement.classList.toggle("dark");
});
```

## 6. Lint & validation

* `pnpm run validate:contrast` – ensures WCAG-AA contrast for semantic pairs.
* CI fails if new tokens break contrast budgets.

---

Need help? Check `docs/implementation-guides/01-foundation-phase-2-design-system.md` or open an issue.
