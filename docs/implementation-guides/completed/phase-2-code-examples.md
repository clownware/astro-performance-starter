---
title: Phase 2 - Code Examples
description: >-
  Code examples for Phase 2
lastUpdated: true
tableOfContents: true
pagefind: true
---

## Code Examples

Companion to [Phase 2 - Design System & Tokens](/implementation-guides/completed/phase-2-design-system/). Blocks marked *condensed* are trimmed copies of the starter's real files.

### Design Tokens Structure

The tokens were redesigned under [ADR-047](/adr/047-design-tokens-v2-role-based-naming/) (role-based v2, "cold minimal"): the base palette is `slate`, `violet`, `rose`, `amber`, `green`, `spaceCadet`, `white`, and `charcoal` — there is no `gray` scale and no blue `primary` ramp in `base.json` (primary is mapped in `semantic.json`).

```json
// tokens/base.json (condensed — the real file also holds fontFamily,
// fontSize, spacing, borderRadius, shadow, and motion groups)
{
  "color": {
    "slate": {
      "50": { "value": "228 22% 98%" },
      "100": { "value": "228 20% 96%" },
      "200": { "value": "228 16% 90%" },
      "300": { "value": "228 14% 80%" },
      "400": { "value": "228 13% 66%" },
      "500": { "value": "228 12% 52%" },
      "600": { "value": "228 13% 42%" },
      "700": { "value": "228 15% 30%" },
      "800": { "value": "228 17% 20%" },
      "900": { "value": "228 20% 13%" },
      "950": { "value": "228 24% 9%" }
    },
    "violet": { "50": { "value": "257 100% 97%" }, "500": { "value": "256 86% 63%" }, "950": { "value": "256 50% 21%" } },
    "rose": { "...": "accent ramp" },
    "amber": { "...": "warning ramp" },
    "green": { "...": "success ramp" },
    "spaceCadet": { "value": "230 22% 7%" },
    "white": { "value": "228 24% 99%" },
    "charcoal": { "value": "228 24% 12%" }
  },
  "motion": {
    "duration": {
      "fast": { "value": "120ms" },
      "base": { "value": "220ms" },
      "slow": { "value": "420ms" }
    },
    "ease": {
      "in": { "value": "cubic-bezier(0.55, 0.06, 0.68, 0.19)" },
      "out": { "value": "cubic-bezier(0.22, 0.61, 0.36, 1)" },
      "in-out": { "value": "cubic-bezier(0.65, 0, 0.35, 1)" }
    }
  }
}
```

Full file: [`tokens/base.json`](https://github.com/clownware/astro-performance-starter/blob/master/tokens/base.json).

### Semantic Tokens

`semantic.json` holds full 11-step `primary`/`secondary` scales (referencing the violet and rose ramps) plus flat role tokens, each with a light `value` and a `dark` override:

```json
// tokens/semantic.json (condensed — the full set also includes
// surfaceRaised, surfaceAccent, borderEmphasis, primaryForeground,
// link, success, warning, and error)
{
  "semantic": {
    "primary": {
      "50": { "value": "{color.violet.50}" },
      "500": { "value": "{color.violet.500}" },
      "950": { "value": "{color.violet.950}" }
    },
    "background": {
      "value": "{color.slate.50}",
      "dark": "{color.spaceCadet}"
    },
    "surface": {
      "value": "{color.white}",
      "dark": "{color.slate.900}"
    },
    "foreground": {
      "value": "{color.charcoal}",
      "dark": "{color.slate.50}"
    },
    "mutedForeground": {
      "value": "{color.slate.600}",
      "dark": "{color.slate.400}"
    },
    "border": {
      "value": "{color.slate.200}",
      "dark": "{color.slate.800}"
    }
  }
}
```

Full file: [`tokens/semantic.json`](https://github.com/clownware/astro-performance-starter/blob/master/tokens/semantic.json).

### Tailwind CSS Considerations

Background on the Tailwind v4 choice and the image-optimization strategy lives in [Phase 2 - Design System & Tokens](/implementation-guides/completed/phase-2-design-system/) — the notes are not duplicated here.

### Tailwind Configuration (v4, CSS-first)

Tailwind v4 has no `tailwind.config.ts` and no JSON-import-into-config step. Configuration lives in CSS: `src/styles/global.css` imports Tailwind, imports the generated token stylesheet (`tokens/dist/tokens.css`, produced by `pnpm run tokens:build`), and maps those CSS variables to Tailwind utilities via `@theme inline`. The plugin is registered in `astro.config.mjs` under `vite.plugins` as `@tailwindcss/vite` — not as an Astro integration.

```css
/* src/styles/global.css (condensed) — Tailwind v4 CSS-first configuration */

/* Tailwind first, so tokens.css overrides the vars it emits */
@import 'tailwindcss';

/* Design tokens: defines --color-*, --spacing-*, etc. in :root and .dark */
@import '../../tokens/dist/tokens.css';

/* Optional plugins are registered in CSS too */
@plugin "@tailwindcss/typography";

/* Class-based dark mode (equivalent to v3 darkMode: "class") */
@variant dark (&:where(.dark, .dark *));

/* Map design tokens → Tailwind utilities.
   `inline` makes Tailwind inline the values instead of emitting new
   custom properties, avoiding a naming clash with tokens.css. */
@theme inline {
  /* Colors wrap the HSL channel vars from tokens.css */
  --color-slate-50: hsl(var(--color-slate-50));
  /* ... one line per slate / primary / secondary scale step ... */
  --color-primary-500: hsl(var(--color-primary-500));

  /* Role tokens flip in .dark via tokens.css */
  --color-background: hsl(var(--color-background));
  --color-surface: hsl(var(--color-surface));
  --color-foreground: hsl(var(--color-foreground));
  --color-muted-foreground: hsl(var(--color-muted-foreground));
  --color-border: hsl(var(--color-border));
  --color-link: hsl(var(--color-link));

  /* Radius and motion are sourced from tokens.css the same way */
  --radius-md: var(--border-radius-md);
  --duration-fast: var(--motion-duration-fast);
  --ease-out: var(--motion-ease-out);

  /* Fonts come from the Astro Fonts API vars (ADR-053) */
  --font-display: var(--font-geist);
  --font-text: var(--font-inter);
  --default-font-family: var(--font-text);
}

/* Custom utilities replace v3 plugin addUtilities() calls */
@utility focus-visible-ring {
  &:focus-visible {
    outline: 2px solid hsl(var(--color-primary-500));
    outline-offset: 2px;
  }
}
```

Step 2.06's note applies here: a motion token only becomes a utility (`duration-fast`, `ease-out`) once it is mapped in this `@theme inline` block. Full file: [`src/styles/global.css`](https://github.com/clownware/astro-performance-starter/blob/master/src/styles/global.css); usage guidance in [How to Use Design Tokens](/development/how-to-use-design-tokens/).

### CSS Architecture

`global.css` does **not** redeclare the token variables — `tokens/dist/tokens.css` owns every `--color-*`, `--spacing-*`, `--motion-*` declaration (light values in `:root`, overrides in `.dark`). What `global.css` adds on top of the `@theme inline` mapping is a small base layer and a handful of custom utilities:

```css
/* src/styles/global.css (condensed — base layer and utilities) */

@layer base {
  /* Tailwind v4 defaults border-color to currentcolor; restore the token */
  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    border-color: var(--color-border, currentcolor);
  }

  /* Account for the sticky header on anchor jumps */
  html {
    scroll-behavior: auto;
    scroll-padding-top: 5rem;
  }

  /* Headings use the display face; body inherits --default-font-family */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
  }

  /* Global focus-visible baseline for interactive elements */
  a:focus-visible,
  button:focus-visible,
  [role="button"]:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    outline: 2px solid hsl(var(--color-primary-500));
    outline-offset: 2px;
  }
}

/* Screen-reader only (the starter defines its own sr-only utility) */
@utility sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Reduced motion: opt a component out of transitions */
@utility motion-reduced {
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

/* Semantic focus ring utilities using design token colors */
@utility focus-ring {
  &:focus {
    outline: 2px solid hsl(var(--color-primary-500));
    outline-offset: 2px;
  }
}

/* OS preference as a fallback; the .dark class toggle takes precedence */
@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
  }
}
```

There is no global `prefers-reduced-motion` reset. Motion is gated per component with Tailwind's `motion-safe:` / `motion-reduce:` variants (see `Header.astro` and `SkipLink.astro`), and `ThemeSetup.astro` suppresses transitions during a theme switch when the user prefers reduced motion — the approach is recorded in [ADR-048](/adr/048-css-native-motion-system/).

### Token Build Script

`pnpm run tokens:build` runs `scripts/src/build-tokens.ts` (`predev` and `build` run it automatically). It reads `tokens/base.json` and `tokens/semantic.json`, resolves `{color.x.y}` references (including `dark` references) against the base palette, and emits two artifacts into the gitignored `tokens/dist/`:

- `tailwind-tokens.json` — a flat token map kept for tooling that wants JSON (colors are expressed as `hsl(var(--color-…) / <alpha-value>)`).
- `tokens.css` — the CSS custom properties Tailwind v4 consumes via `@theme inline`: a `:root { … }` block with every light value and a `.dark { … }` block with the overrides.

Keys are kebab-cased on the way out (`mutedForeground` → `--color-muted-foreground`, `spaceCadet` → `--color-space-cadet`) and semantic tokens are prefixed with `color-` so role and palette variables share one namespace.

```typescript
// scripts/src/build-tokens.ts (condensed — CSS side only; see the starter for the full file)
interface Token {
  value: string;
  dark?: string;
}
type TokenGroup = { [key: string]: Token | TokenGroup };

const toKebabCase = (str: string) =>
  str.replace(/([a-z0-9]|(?<=[a-z0-9]))([A-Z])/g, "$1-$2").toLowerCase();

// Flatten nested groups into `--a-b-c: value` pairs; dark overrides are
// tracked under a `|dark` suffix so the CSS generator can split them out.
function flattenTokensRecursive(obj: TokenGroup, prefix: string[], acc: Record<string, string>) {
  for (const [key, value] of Object.entries(obj)) {
    const newPrefix = [...prefix, toKebabCase(key)];
    if (value && typeof value === "object" && !("value" in value)) {
      const nestedTokens = flattenTokens(value as TokenGroup, newPrefix);
      for (const [nestedKey, nestedValue] of Object.entries(nestedTokens)) {
        acc[nestedKey] = nestedValue;
      }
    } else if (value && typeof value === "object" && "value" in value) {
      const token = value as Token;
      const varName = `--${newPrefix.join("-")}`;
      acc[varName] = token.value;
      if (token.dark) {
        acc[`${varName}|dark`] = token.dark;
      }
    }
  }
}

const flattenTokens = (obj: TokenGroup, prefix: string[] = []): Record<string, string> => {
  const acc: Record<string, string> = {};
  flattenTokensRecursive(obj, prefix, acc);
  return acc;
};

const generateCssVariables = (tokens: Record<string, string>): string => {
  let lightCss = ":root {\n";
  let darkCss = ".dark {\n";
  for (const [name, value] of Object.entries(tokens)) {
    if (name.endsWith("|dark")) {
      darkCss += `  ${name.replace("|dark", "")}: ${value};\n`;
    } else {
      lightCss += `  ${name}: ${value};\n`;
    }
  }
  return `${lightCss}}\n${darkCss}}\n`;
};

// resolveTokenReferences() dereferences {color.x.y} (value and dark) against base.json
const resolvedSemanticForCss = resolveTokenReferences(semanticTokens.semantic ?? {}, baseTokens);

const allVars = {
  ...flattenTokens(baseTokens as TokenGroup),
  // Add 'color-' prefix to semantic tokens for consistent naming convention
  ...flattenTokens(resolvedSemanticForCss, ["color"]),
};

writeFileSync(join(distDir, "tokens.css"), generateCssVariables(allVars));
```

Full file: [`scripts/src/build-tokens.ts`](https://github.com/clownware/astro-performance-starter/blob/master/scripts/src/build-tokens.ts).

### Accessibility Utilities

The starter ships no `VisuallyHidden` component — `src/components/a11y/` contains only `SkipLink.astro`. Visually-hidden text uses the `sr-only` utility directly (defined in `global.css`, shown above), which removes a component's worth of indirection for a one-class pattern:

```astro
<span class="sr-only">Toggle menu</span>
```

### WCAG Contrast Validation

The contrast gate (`pnpm run design:validate`, run in CI as "Validate semantic color contrast") resolves the flat semantic role tokens — token references like `{color.slate.600}` and literal HSL alike — and sweeps **both** light and dark mode. It exits non-zero if any body-text pair drops below 4.5:1 or any large-text / non-text pair below 3:1:

```typescript
// scripts/src/validate-contrast.ts (condensed — see the starter for the full file)
const aaNormal = 4.5; // body text
const aaLarge = 3.0; // large text (>=18pt / 14pt bold) and non-text UI

interface Pair {
  fg: string;
  bg: string;
  min: number;
  note?: string;
}

// Body-text roles over the two surfaces they sit on.
const pairs: Pair[] = [
  { fg: 'foreground', bg: 'background', min: aaNormal },
  { fg: 'foreground', bg: 'surface', min: aaNormal },
  { fg: 'mutedForeground', bg: 'background', min: aaNormal },
  { fg: 'mutedForeground', bg: 'surface', min: aaNormal },
  { fg: 'link', bg: 'background', min: aaNormal },
  { fg: 'link', bg: 'surface', min: aaNormal },
  { fg: 'success', bg: 'background', min: aaNormal },
  { fg: 'success', bg: 'surface', min: aaNormal },
  { fg: 'error', bg: 'background', min: aaNormal },
  { fg: 'error', bg: 'surface', min: aaNormal },
  { fg: 'primaryForeground', bg: 'primary.600', min: aaNormal },
  // warning is amber — held to the 3:1 large-text / non-text bar; its real
  // usages are decorative marks, badge fills, and large Callout headings.
  { fg: 'warning', bg: 'background', min: aaLarge, note: 'large-text/non-text only' },
  { fg: 'warning', bg: 'surface', min: aaLarge, note: 'large-text/non-text only' },
];

// channel(role, mode) resolves a role (or scale step like primary.600) to an
// HSL channel string for the given mode ('light' uses .value, 'dark' prefers
// .dark), dereferencing {color.*} against base.json. contrast() is the
// standard WCAG relative-luminance ratio.
const modes = ['light', 'dark'] as const;
const failures: string[] = [];

for (const { fg, bg, min, note } of pairs) {
  for (const mode of modes) {
    const ratio = contrast(hslStringToRgb(channel(fg, mode)), hslStringToRgb(channel(bg, mode)));
    if (ratio < min) {
      const tag = note ? ` (${note})` : '';
      failures.push(`${fg} on ${bg} [${mode}]${tag}: ${ratio.toFixed(2)}:1 (<${min})`);
    }
  }
}

if (failures.length) {
  console.error('❌ WCAG-AA contrast failures:');
  for (const f of failures) {
    console.error(`  ${f}`);
  }
  process.exit(1);
}
console.log(`✅ All ${pairs.length} semantic colour pairs meet WCAG-AA contrast (light + dark).`);
```

Full file: [`scripts/src/validate-contrast.ts`](https://github.com/clownware/astro-performance-starter/blob/master/scripts/src/validate-contrast.ts).

### Dark Mode Implementation

Dark mode is class-based and **dark-first** ([ADR-032](/adr/032-dark-mode-strategy/)): `ThemeSetup.astro` runs an inline script before first paint that applies the stored choice, or `dark` when nothing is stored, by toggling `.dark` on `<html>` and exposing `window.__themeSetupApply` for later re-runs (view transitions, `storage` events, OS preference changes). `ThemeToggle.astro` (an atom, rendered by the header) never touches the DOM class itself — it writes `localStorage.theme` and calls that hook.

```astro
---
// src/components/ThemeSetup.astro (condensed — see the starter for the full file)
---

<script is:inline>
  (function () {
    if (window.__themeSetupApply) {
      window.__themeSetupApply();
      return;
    }

    const DOC = document.documentElement;

    const setTheme = (theme) => {
      DOC.classList.remove('light', 'dark');
      if (theme === 'dark') DOC.classList.add('dark');
      DOC.setAttribute('data-theme', theme);
      DOC.style.colorScheme = theme;
    };

    const getPreferredTheme = () => {
      // Dark-first default (ADR-032): an explicit stored choice wins; otherwise
      // default to dark rather than echoing the OS preference.
      const fromStorage = localStorage.getItem('theme');
      if (fromStorage) return fromStorage;
      return 'dark';
    };

    const applyTheme = () => setTheme(getPreferredTheme());

    // Single re-apply hook for the toggle and subsequent navigations
    window.__themeSetupApply = applyTheme;
    applyTheme();

    document.addEventListener('astro:after-swap', applyTheme);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
    window.addEventListener('storage', (e) => {
      if (e.key === 'theme') applyTheme();
    });
  })();
</script>
```

```astro
---
// src/components/atoms/ThemeToggle.astro (condensed — see the starter for the full file)
// Cycles light → dark → system. The visible icon reflects the *current* mode;
// the aria-label spells out the next state for screen-reader users.
---

<button
  type="button"
  data-theme-toggle
  aria-label="Switch theme"
  title="Switch theme"
  class="inline-flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-md text-muted-foreground transition hover:text-foreground hover:bg-surface focus-visible-ring"
>
  <span class="sr-only">Toggle theme</span>
  <svg data-theme-icon="light" class="h-5 w-5" aria-hidden="true"><!-- sun --></svg>
  <svg data-theme-icon="dark" class="h-5 w-5 hidden" aria-hidden="true"><!-- moon --></svg>
  <svg data-theme-icon="system" class="h-5 w-5 hidden" aria-hidden="true"><!-- monitor --></svg>
</button>

<script>
  (() => {
    function setupThemeToggle() {
      const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
      if (!button || button.dataset.themeToggleBound === 'true') return;
      button.dataset.themeToggleBound = 'true';

      type Mode = 'light' | 'dark' | 'system';
      const ORDER: Mode[] = ['light', 'dark', 'system'];

      const readMode = (): Mode => {
        const stored = localStorage.getItem('theme');
        return stored === 'light' || stored === 'dark' ? stored : 'system';
      };

      const renderIcon = (mode: Mode) => {
        for (const icon of button.querySelectorAll<HTMLElement>('[data-theme-icon]')) {
          icon.classList.toggle('hidden', icon.dataset.themeIcon !== mode);
        }
        // ... update aria-label to name the next state ...
      };

      const writeMode = (mode: Mode) => {
        if (mode === 'system') localStorage.removeItem('theme');
        else localStorage.setItem('theme', mode);
        // Reuse the apply hook from ThemeSetup.astro so the DOM class and
        // color-scheme stay in sync without re-implementing the logic here.
        (window as unknown as { __themeSetupApply?: () => void }).__themeSetupApply?.();
        renderIcon(mode);
      };

      button.addEventListener('click', () => {
        const current = readMode();
        writeMode(ORDER[(ORDER.indexOf(current) + 1) % ORDER.length] as Mode);
      });

      renderIcon(readMode());
    }

    setupThemeToggle();
    document.addEventListener('astro:after-swap', setupThemeToggle);
  })();
</script>
```

Full files: [`src/components/ThemeSetup.astro`](https://github.com/clownware/astro-performance-starter/blob/master/src/components/ThemeSetup.astro) and [`src/components/atoms/ThemeToggle.astro`](https://github.com/clownware/astro-performance-starter/blob/master/src/components/atoms/ThemeToggle.astro).
