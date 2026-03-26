---
title: 'ADR-032: Dark Mode Strategy — Class-Based Toggle with System Preference'
lastUpdated: 2026-02-18T00:00:00.000Z
description: >-
  Documents the decision to use Tailwind's darkMode: "class" strategy with
  a small inline script for system preference detection, rather than the
  CSS-only "media" strategy.
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

Tailwind CSS supports two dark mode strategies:

- `darkMode: "media"` — uses the `prefers-color-scheme` CSS media query; purely CSS, zero JS
- `darkMode: "class"` — applies dark styles when a `.dark` class is present on `<html>`; requires JS to toggle

The starter uses class-based dark mode, configured via `@variant dark (&:where(.dark, .dark *))` in `src/styles/global.css`. This is a deliberate departure from the zero-JS philosophy and requires justification.

## Decision Drivers

- **User preference persistence**: Users who manually toggle dark/light mode expect their choice to persist across page loads and sessions
- **Flash of incorrect theme (FOIT)**: Without inline JS, users with dark system preference see a white flash before CSS loads
- **Manual toggle support**: A dark mode toggle button requires JS regardless of strategy — `"media"` only works for automatic system-preference detection
- **Design token integration**: The design token system uses CSS variables scoped to `.dark` — this requires class-based toggling
- **Zero-JS philosophy**: Any JS addition must be minimal and justified

## Considered Options

### Option 1: `darkMode: "media"` (CSS-only)

```css
@media (prefers-color-scheme: dark) {
  :root { --color-background: #0a0a0a; }
}
```

**Pros**:

- Zero JavaScript
- Automatic — respects system preference without any code
- No flash of incorrect theme

**Cons**:

- No user toggle — cannot override system preference
- Cannot persist user preference in `localStorage`
- Incompatible with the design token CSS variable system (variables are scoped to `.dark` class)
- Cannot support a dark mode toggle button without adding JS anyway

### Option 2: `darkMode: "class"` with inline script (chosen)

```html
<script>
  const theme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (theme === 'dark' || (!theme && prefersDark)) {
    document.documentElement.classList.add('dark');
  }
</script>
```

**Pros**:

- Supports both system preference and manual toggle
- Persists user choice in `localStorage`
- Inline script in `<head>` runs before paint — eliminates flash of incorrect theme
- Compatible with design token CSS variable scoping

**Cons**:

- Adds a small inline script (~200 bytes) to every page
- Requires `ThemeSetup.astro` component to be included in every layout

### Option 3: CSS-only with `:has()` selector (future)

```css
html:has(input[data-theme-toggle]:checked) { /* dark styles */ }
```

**Pros**: Zero JS toggle

**Cons**: `:has()` with form state for theme toggling is a hack; no persistence; browser support was limited until 2024; not suitable as a default

## Decision

**Use `darkMode: "class"` with an inline `ThemeSetup.astro` script.**

The inline script is placed as the first child of `<head>` to run synchronously before any rendering occurs. This eliminates the flash of incorrect theme (FOIT) that would occur if the script were deferred or loaded asynchronously.

### Implementation

`src/components/ThemeSetup.astro` contains the inline script:

```astro
---
// No frontmatter needed — pure client script
---
<script is:inline>
  (function () {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  })();
</script>
```

The IIFE wrapper prevents variable leakage into global scope. `is:inline` prevents Astro from processing or deferring the script.

### Toggle Button

A dark mode toggle button dispatches a custom event and updates `localStorage`:

```js
const toggle = () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
};
```

### Design Token Integration

CSS variables are scoped to `.dark` in `tokens/dist/tokens.css`:

```css
:root {
  --color-background-primary: hsl(0 0% 100%);
}
.dark {
  --color-background-primary: hsl(222 47% 7%);
}
```

This means the class-based strategy is required — the token system cannot be changed to `"media"` without rewriting the entire token output format.

## Consequences

### Positive

- No flash of incorrect theme — inline script runs before paint
- User preference persists across sessions via `localStorage`
- Manual toggle supported without additional JS overhead
- System preference respected as the default when no stored preference exists

### Negative

- ~200 bytes of inline JavaScript on every page (non-negotiable for FOIT prevention)
- `ThemeSetup.astro` must be included in every layout — forgetting it causes FOIT
- `localStorage` is not available in SSR contexts — the script is client-only

### Neutral

- `prefers-color-scheme` changes after page load (e.g. OS switches to dark at sunset) are not automatically applied — the user must reload or toggle manually. This is acceptable behaviour for a starter.

## Validation

- **No FOIT**: Dark-mode users must not see a white flash on page load
- **Persistence**: Toggling dark mode and reloading must preserve the choice
- **System preference**: First visit with no stored preference must match OS theme
- **Lighthouse**: Inline script must not appear as a render-blocking resource warning

## References

- [Tailwind CSS Dark Mode Documentation](https://tailwindcss.com/docs/dark-mode)
- [prefers-color-scheme (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [ADR-000: Starter Template Architecture](./000-starter-decisions.md)
- `src/components/ThemeSetup.astro` — implementation

---
**Date**: 2026-02-18\
**Participants**: Template maintainers\
**Outcome**: Accepted
