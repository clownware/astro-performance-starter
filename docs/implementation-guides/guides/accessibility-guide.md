---
title: Accessibility Guide - WCAG Compliance
description: '> ♿ **Purpose**: Ensure your Astro site meets WCAG 2.1 AA standards'
lastUpdated: true
tableOfContents: true
pagefind: true
---
# Accessibility Guide - WCAG Compliance

> ♿ **Purpose**: Ensure your Astro site meets WCAG 2.1 AA standards

## Overview

This guide provides practical implementation details for building accessible Astro sites. We target WCAG 2.1 Level AA compliance as our baseline, with Level AAA considerations where practical.

## WCAG Principles

### 1. Perceivable

Information and UI components must be presentable in ways users can perceive.

### 2. Operable

UI components and navigation must be operable by all users.

### 3. Understandable

Information and UI operation must be understandable.

### 4. Robust

Content must be robust enough to work with various assistive technologies.

## Core Requirements

### Success Criteria Checklist

```markdown
## WCAG 2.1 Level AA Checklist

### ✅ Perceivable
- [ ] Images have alt text (1.1.1)
- [ ] Videos have captions (1.2.2)
- [ ] Audio has transcripts (1.2.1)
- [ ] Color contrast 4.5:1 normal text (1.4.3)
- [ ] Color contrast 3:1 large text (1.4.3)
- [ ] Text can resize to 200% (1.4.4)
- [ ] Images of text avoided (1.4.5)
- [ ] Content reflows at 320px (1.4.10)
- [ ] Non-text contrast 3:1 (1.4.11)

### ✅ Operable
- [ ] Keyboard accessible (2.1.1)
- [ ] No keyboard traps (2.1.2)
- [ ] Skip links available (2.4.1)
- [ ] Page has title (2.4.2)
- [ ] Focus order logical (2.4.3)
- [ ] Link purpose clear (2.4.4)
- [ ] Multiple navigation ways (2.4.5)
- [ ] Headings descriptive (2.4.6)
- [ ] Focus visible (2.4.7)
- [ ] No seizure triggers (2.3.1)
- [ ] Timing adjustable (2.2.1)

### ✅ Understandable
- [ ] Language specified (3.1.1)
- [ ] On focus predictable (3.2.1)
- [ ] On input predictable (3.2.2)
- [ ] Error identification (3.3.1)
- [ ] Labels provided (3.3.2)
- [ ] Error suggestions (3.3.3)
- [ ] Error prevention (3.3.4)

### ✅ Robust
- [ ] Valid HTML (4.1.1)
- [ ] Name, role, value (4.1.2)
- [ ] Status messages (4.1.3)
```

## Implementation Guide

### 1. Semantic HTML Structure

The shipped layout puts the landmarks in place once, so every page inherits them. The skip link is its own component (`src/components/a11y/SkipLink.astro`) and targets `#main-content` — the `id` on `<main>` in `BaseLayout.astro`:

```astro
---
// src/layouts/BaseLayout.astro (shipped — trimmed to the landmark structure)
import { ClientRouter } from "astro:transitions";
import SkipLink from "@/components/a11y/SkipLink.astro";
import Head from "@/components/molecules/Head.astro";
import Footer from "@/components/structural/Footer.astro";
import Header from "@/components/structural/Header.astro";
import ThemeSetup from "@/components/ThemeSetup.astro";
---

<!doctype html>
<html lang="en">
  <head>
    <Head {...Astro.props} />
    <ThemeSetup />
    <ClientRouter />
  </head>
  <body class="flex min-h-screen flex-col bg-background text-foreground antialiased">
    <!-- Skip link: href="#main-content" by default -->
    <SkipLink />
    <!-- <header> + <nav aria-label="Main navigation"> live in Header.astro -->
    <Header />
    <main
      id="main-content"
      class="flex-1"
      aria-label="Main content"
      role="main"
      tabindex="-1"
    >
      <slot />
    </main>
    <!-- <footer> landmark lives in Footer.astro -->
    <Footer />
  </body>
</html>
```

```astro
---
// src/components/a11y/SkipLink.astro (shipped — inline validation script omitted)
interface Props {
  /** The id of the element to skip to (without the #). Defaults to 'main-content'. */
  targetId?: string;
  /** Optional extra classes to merge */
  class?: string;
}
const { targetId = "main-content", class: className = "" } = Astro.props as Props;
---

<a
  href={`#${targetId}`}
  aria-controls={targetId}
  data-skiplink
  class={`sr-only fixed left-4 top-4 z-[999] rounded-md bg-background px-[1rem] py-[0.5rem] text-foreground motion-safe:transition-colors motion-reduce:transition-none focus:not-sr-only focus:outline-hidden focus:ring-2 focus:ring-primary-500 hover:bg-surface ${className}`}
>
  <slot>Skip to content</slot>
</a>
```

Three details worth copying:

- `sr-only` + `focus:not-sr-only` replaces the classic off-screen/`top: -40px` trick — the `sr-only` utility is defined in `src/styles/global.css`.
- `tabindex="-1"` on `<main>` lets the skip link actually move focus in every browser, not just scroll.
- The component's inline script checks that the target `id` exists (and re-checks after each `<ClientRouter />` navigation via `astro:page-load`); if it is missing, the link is disabled and a warning is logged rather than shipping a dead skip link.

### 2. Accessible Navigation

```astro
---
// Navigation.astro (illustrative — the shipped navigation lives in
// src/components/structural/Header.astro and reads src/content/navigation/header.json)
export interface Props {
  items: Array<{
    label: string;
    href: string;
    current?: boolean;
  }>;
}

const { items } = Astro.props;
const currentPath = Astro.url.pathname;
---
<nav role="navigation" aria-label="Main">
  <ul class="nav-list">
    {items.map((item) => {
      const isCurrent = currentPath === item.href;
      return (
        <li>
          <a 
            href={item.href}
            aria-current={isCurrent ? 'page' : undefined}
            class:list={['nav-link', { 'nav-link--active': isCurrent }]}
          >
            {item.label}
          </a>
        </li>
      );
    })}
  </ul>
</nav>

<style>
  .nav-link {
    /* Ensure 44x44px touch target */
    min-height: 44px;
    min-width: 44px;
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
  }
  
  .nav-link:focus-visible {
    /* Token-driven focus indicator — same as the `focus-visible-ring` utility in global.css */
    outline: 2px solid hsl(var(--color-primary-500));
    outline-offset: 2px;
  }
  
  .nav-link--active {
    font-weight: bold;
    text-decoration: underline;
  }
</style>
```

### 3. Accessible Forms

```astro
---
// ContactForm.astro (illustrative, simplified). The shipped form is
// src/components/molecules/ContactForm.astro + ContactFormScript.ts (ADR-021):
// native constraint validation works with JavaScript disabled, a honeypot
// field catches bots, and the script only adds `novalidate` + inline errors
// once it has attached its own handlers.
---

<form method="POST" action="/contact" novalidate>
  <fieldset>
    <legend class="sr-only">Contact Information</legend>
    
    <!-- Name field -->
    <div class="form-group">
      <label for="name">
        Name
        <span aria-label="required" class="required">*</span>
      </label>
      <input 
        type="text" 
        id="name" 
        name="name" 
        required
        aria-required="true"
        aria-describedby="name-error"
      />
      <span 
        id="name-error" 
        class="error-message" 
        role="alert"
        aria-live="polite"
      ></span>
    </div>
    
    <!-- Email field -->
    <div class="form-group">
      <label for="email">
        Email
        <span aria-label="required" class="required">*</span>
      </label>
      <input 
        type="email" 
        id="email" 
        name="email" 
        required
        aria-required="true"
        aria-describedby="email-error email-hint"
        autocomplete="email"
      />
      <span id="email-hint" class="hint">
        We'll never share your email
      </span>
      <span 
        id="email-error" 
        class="error-message" 
        role="alert"
        aria-live="polite"
      ></span>
    </div>
    
    <!-- Message field -->
    <div class="form-group">
      <label for="message">
        Message
        <span aria-label="required" class="required">*</span>
      </label>
      <textarea 
        id="message" 
        name="message" 
        rows="5"
        required
        aria-required="true"
        aria-describedby="message-error message-hint"
      ></textarea>
      <span id="message-hint" class="hint">
        Maximum 500 characters
      </span>
      <span 
        id="message-error" 
        class="error-message" 
        role="alert"
        aria-live="polite"
      ></span>
    </div>
  </fieldset>
  
  <!-- Submit button -->
  <button type="submit" class="btn btn-primary">
    Send Message
  </button>
  
  <!-- Success message -->
  <div 
    role="status" 
    aria-live="polite" 
    aria-atomic="true"
    class="success-message hidden"
  >
    Thank you! Your message has been sent.
  </div>
</form>

<style>
  /* Role tokens from tokens/dist/tokens.css are HSL channel triplets */
  .required {
    color: hsl(var(--color-error));
  }
  
  .error-message {
    color: hsl(var(--color-error));
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
  }
  
  .hint {
    color: hsl(var(--color-muted-foreground));
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
  }
  
  /* Ensure visible focus */
  input:focus-visible,
  textarea:focus-visible,
  button:focus-visible {
    outline: 2px solid hsl(var(--color-primary-500));
    outline-offset: 2px;
  }
  
  /* Error state styling */
  input[aria-invalid="true"],
  textarea[aria-invalid="true"] {
    border-color: hsl(var(--color-error));
  }
</style>

<script>
  // Form validation with accessibility
  const form = document.querySelector('form');
  
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Clear previous errors
    document.querySelectorAll('[role="alert"]').forEach(alert => {
      alert.textContent = '';
    });
    
    // Validate fields
    const fields = form.querySelectorAll('[required]');
    let firstError = null;
    
    fields.forEach(field => {
      if (!field.value.trim()) {
        const errorId = field.getAttribute('aria-describedby')?.split(' ')[0];
        const errorElement = document.getElementById(errorId);
        
        if (errorElement) {
          errorElement.textContent = `${field.labels[0].textContent.replace('*', '').trim()} is required`;
          field.setAttribute('aria-invalid', 'true');
          
          if (!firstError) {
            firstError = field;
          }
        }
      } else {
        field.setAttribute('aria-invalid', 'false');
      }
    });
    
    // Focus first error field
    if (firstError) {
      firstError.focus();
    } else {
      // Submit form
      // Show success message
      const successMessage = form.querySelector('[role="status"]');
      successMessage?.classList.remove('hidden');
    }
  });
</script>
```

### 4. Color and Contrast

There is no separate `accessibility.css`. Colour lives in the design tokens (`tokens/base.json` + `tokens/semantic.json`, built to `tokens/dist/tokens.css` by `pnpm run tokens:build` — [ADR-047](/adr/047-design-tokens-v2-role-based-naming/)), and contrast is **enforced**, not just documented:

- `pnpm run design:validate` (`scripts/src/validate-contrast.ts`) runs in CI and fails the build if any body-text role pair is below 4.5:1 or any large-text / non-text pair is below 3:1 — in **both** light and dark mode.
- `src/__tests__/design-tokens.test.ts`, `gradient-contrast.test.ts` and `no-bypass-color-utilities.test.ts` guard the token contract and reject hard-coded colour utilities in components.

Role tokens are HSL channel triplets, redefined under `.dark`, so components never need `dark:` colour variants:

```css
/* tokens/dist/tokens.css (generated — excerpt) */
:root {
  --color-background: 228 22% 98%;
  --color-surface: 228 24% 99%;
  --color-foreground: 228 24% 12%;
  --color-muted-foreground: 228 13% 42%;
  --color-link: 256 72% 54%;
  --color-error: 344 73% 42%;
  /* … */
}
.dark {
  --color-background: 230 22% 7%;
  --color-surface: 228 20% 13%;
  --color-foreground: 228 22% 98%;
  --color-muted-foreground: 228 13% 66%;
  --color-link: 257 92% 80%;
  --color-error: 344 87% 70%;
  /* … */
}
```

Consume them through the Tailwind utilities `global.css` maps with `@theme inline` (`text-foreground`, `bg-surface`, `text-muted-foreground`, `border-border`) or, in scoped CSS, via `hsl(var(--color-…))`. The same file defines the focus and motion helpers:

```css
/* src/styles/global.css (shipped excerpt) */
@utility focus-visible-ring {
  &:focus-visible {
    outline: 2px solid hsl(var(--color-primary-500));
    outline-offset: 2px;
  }
}

@utility motion-reduced {
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}
```

- **Reduced motion**: the CSS-native motion system ([ADR-048](/adr/048-css-native-motion-system/)) gates every animation behind `motion-safe:` / `motion-reduce:` variants or `@media (prefers-reduced-motion)` blocks in `global.css`; `e2e/a11y-axe.spec.ts` runs with `reducedMotion: "reduce"` so axe measures settled colours.
- **Forced colours / high contrast**: use Tailwind's `forced-colors:` variant where a component relies on colour alone — `Button.astro` adds `forced-colors:border forced-colors:text-[ButtonText]`.
- **Non-text contrast (1.4.11)**: `Button.astro`'s secondary variant uses `border-border-emphasis` specifically because the plain `border-border` token sat at ~1.56:1 against the page background.

### 5. Images and Media

```astro
---
// AccessibleImage.astro (illustrative). The shipped wrapper is
// src/components/atoms/Image.astro — its `alt` prop is required, so a
// missing alt fails type-checking rather than shipping.
import { Image } from 'astro:assets';

export interface Props {
  src: ImageMetadata;
  alt: string;
  caption?: string;
  decorative?: boolean;
}

const { src, alt, caption, decorative = false } = Astro.props;
---
{decorative ? (
  <Image 
    src={src} 
    alt=""
    role="presentation"
    {...Astro.props}
  />
) : (
  <figure>
    <Image 
      src={src} 
      alt={alt}
      {...Astro.props}
    />
    {caption && (
      <figcaption>{caption}</figcaption>
    )}
  </figure>
)}
```

### 6. Interactive Components

```astro
---
// AccessibleModal.astro (illustrative hand-rolled focus trap). Prefer the
// shipped src/components/molecules/Dialog.astro, which uses the native
// <dialog> element so the browser provides focus trapping and the backdrop.
export interface Props {
  id: string;
  title: string;
}

const { id, title } = Astro.props;
---
<div 
  id={id}
  class="modal"
  role="dialog"
  aria-modal="true"
  aria-labelledby={`${id}-title`}
  aria-describedby={`${id}-desc`}
  hidden
>
  <div class="modal-content">
    <h2 id={`${id}-title`}>{title}</h2>
    <div id={`${id}-desc`}>
      <slot />
    </div>
    <button 
      type="button"
      class="modal-close"
      aria-label="Close dialog"
    >
      ×
    </button>
  </div>
</div>

<script define:vars={{ id }}>
  const modal = document.getElementById(id);
  const closeBtn = modal?.querySelector('.modal-close');
  let previousFocus;
  
  // Trap focus within modal
  function trapFocus(e) {
    const focusableElements = modal.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
    
    if (e.key === 'Escape') {
      closeModal();
    }
  }
  
  function openModal() {
    previousFocus = document.activeElement;
    modal.hidden = false;
    modal.querySelector('h2').focus();
    document.addEventListener('keydown', trapFocus);
  }
  
  function closeModal() {
    modal.hidden = true;
    document.removeEventListener('keydown', trapFocus);
    previousFocus?.focus();
  }
  
  closeBtn?.addEventListener('click', closeModal);
  
  // Expose functions globally
  window[`open${id}`] = openModal;
  window[`close${id}`] = closeModal;
</script>
```

### 7. Tables

```astro
---
// AccessibleTable.astro (illustrative — not shipped)
export interface Props {
  caption: string;
  data: Array<Record<string, any>>;
  columns: Array<{
    key: string;
    label: string;
    sortable?: boolean;
  }>;
}

const { caption, data, columns } = Astro.props;
---
<table>
  <caption>{caption}</caption>
  <thead>
    <tr>
      {columns.map((column) => (
        <th 
          scope="col"
          aria-sort={column.sortable ? 'none' : undefined}
        >
          {column.sortable ? (
            <button 
              type="button"
              class="sort-button"
              aria-label={`Sort by ${column.label}`}
            >
              {column.label}
              <span aria-hidden="true"> ↕</span>
            </button>
          ) : (
            column.label
          )}
        </th>
      ))}
    </tr>
  </thead>
  <tbody>
    {data.map((row, index) => (
      <tr>
        {columns.map((column) => (
          <td>
            {row[column.key]}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>

<style>
  table {
    border-collapse: collapse;
    width: 100%;
  }
  
  caption {
    text-align: left;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid hsl(var(--color-border));
  }
  
  th {
    font-weight: bold;
    background-color: hsl(var(--color-surface));
  }
  
  .sort-button {
    background: none;
    border: none;
    cursor: pointer;
    font: inherit;
    padding: 0;
    text-align: left;
    width: 100%;
  }
  
  .sort-button:hover,
  .sort-button:focus {
    text-decoration: underline;
  }
</style>
```

## Testing for Accessibility

### 1. Automated Testing

The engine-driven sweep ships as `e2e/a11y-axe.spec.ts` (`@axe-core/playwright` is a devDependency). Every test title carries the `@a11y` tag, so `pnpm run test:a11y` (`playwright test --grep="@a11y"`) selects it together with the hand-written structural checks (landmarks, heading order) tagged `@a11y` in the sibling page specs:

```typescript
// e2e/a11y-axe.spec.ts (shipped)
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Automated axe-core sweep (ADR-018/ADR-019): every key page passes the
 * WCAG 2.1 A/AA rulesets with zero serious or critical violations. The
 * hand-written @a11y tests in the sibling specs cover structural checks
 * (landmarks, heading order); this spec is the engine-driven complement.
 */
const PAGES = [
  "/",
  "/about/",
  "/blog/",
  "/projects/",
  "/contact/",
  "/how-it-works/",
  "/showcase/",
];

test.describe("axe-core accessibility scan", () => {
  for (const path of PAGES) {
    test(`@a11y ${path} has no serious or critical axe violations`, async ({ page }) => {
      // Reduced motion settles ADR-048's scroll-reveal animations, so axe
      // measures the real text colors instead of mid-animation opacity blends
      // (and mirrors how many assistive-tech users actually browse).
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();
      const blocking = results.violations.filter((v) =>
        ["serious", "critical"].includes(v.impact ?? ""),
      );
      expect(
        blocking,
        blocking
          .map((v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} node(s)`)
          .join("\n"),
      ).toEqual([]);
    });
  }
});
```

Extra checks you can add in the same style (illustrative):

```typescript
// e2e/a11y-extra.spec.ts (illustrative)
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Additional accessibility checks', () => {
  test('color contrast should meet WCAG AA', async ({ page }) => {
    await page.goto('/');
    
    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();
    
    expect(results.violations).toEqual([]);
  });
  
  test('all images should have alt text', async ({ page }) => {
    await page.goto('/');
    
    const images = await page.$('img:not([alt])');
    expect(images).toHaveLength(0);
  });
});
```

## Real-World Implementation: BlogLayout

The `src/layouts/BlogLayout.astro` component demonstrates production-ready WCAG 2.1 AA compliance:

### Decorative SVGs (WCAG 1.1.1)

All decorative icons are hidden from assistive technology — either the `<svg>` carries `aria-hidden="true"`, or (for the breadcrumb chevrons) the wrapping `<li>` does:

```astro
<!-- Breadcrumb chevron: the list item is hidden, so the SVG inside needs nothing -->
<li aria-hidden="true">
  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
    <path fill-rule="evenodd" d="..." clip-rule="evenodd" />
  </svg>
</li>

<!-- Meta icons (author, date, reading time) -->
<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="..." />
</svg>
```

### Semantic Navigation (WCAG 2.4.1, 4.1.2)

The table of contents is rendered by the `ScrollSpy` molecule, which receives the heading list and an accessible name:

```astro
<!-- src/layouts/BlogLayout.astro (excerpt) -->
{tocSections.length > 0 && (
  <div class="rounded-lg border border-border bg-surface p-6 shadow-lg">
    <h3 class="mb-4 text-sm font-semibold text-foreground">
      Table of Contents
    </h3>
    <ScrollSpy sections={tocSections} ariaLabel="Table of contents" />
  </div>
)}
```

The headings (with their generated `slug`s) come from the Content Layer's `render()` function — entries have no `.render()` method — called once in the route and passed down as a prop so the post is not rendered twice:

```astro
---
// src/pages/blog/[slug].astro (excerpt)
import { getCollection, render } from "astro:content";

// Render the post content once (pass headings to layout to avoid double render)
const { Content, headings } = await render(post);
---

<BlogLayout post={post} prevPost={prevPost} nextPost={nextPost} headings={headings}>
  <Content />
</BlogLayout>
```

`BlogLayout` keeps only depths 1–3 (`headings.filter((h) => h.depth <= 3)`) and maps `{ id: h.slug, label: h.text }` — the `id`s match the heading anchors Astro emits, so the ToC links resolve.

### Focus Indicators (WCAG 2.4.7)

The `Button` atom carries visible focus states, so the previous/next post navigation inherits them:

```astro
<!-- src/layouts/BlogLayout.astro (excerpt) — entries are keyed by `id` -->
<Button
  href={withBase(`/blog/${prevPost.id}/`)}
  variant="ghost"
  class="h-auto p-4 text-left justify-start group-hover:bg-surface"
>
  <!-- Button content -->
</Button>
```

Focus styles defined in `src/components/atoms/Button.astro`:

```typescript
const baseStyles =
  "inline-flex items-center justify-center rounded-lg font-semibold no-underline transition-colors duration-200 motion-reduce:transition-none focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 forced-colors:border forced-colors:text-[ButtonText]";
// each variant adds `focus:ring-primary-500`
```

### External Links (Security & A11y)

The `SocialLink` atom (`src/components/atoms/SocialLink.astro`) implements best practices — the accessible name states the destination and that it opens a new tab, the icons are decorative, and the "(opens in new tab)" hint is also present as `sr-only` text:

```astro
---
const ariaText =
  purpose === "share"
    ? `Share this post on ${config.name} (opens in new tab)`
    : `Visit my ${config.name} profile (opens in new tab)`;
---

<a
  href={href}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={ariaText}
  {...attrs}
>
  {showIcon && <Icon name={config.icon} class="size-4 mr-2 shrink-0" decorative />}
  <span class="social-link__text">{config.name}</span>
  <Icon name="external-link" class="size-3 ml-1 opacity-60" decorative />
  <span class="sr-only">(opens in new tab)</span>
</a>
```

### Breadcrumb Navigation

Proper semantic structure with `aria-current` (`withBase()` keeps links correct under a GitHub Pages base path):

```astro
<nav class="mb-6 text-sm" aria-label="Breadcrumb">
  <ol class="flex items-center space-x-2 text-muted-foreground">
    <li>
      <a href={withBase("/")} class="hover:text-foreground transition-colors">Home</a>
    </li>
    <li aria-hidden="true">
      <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><!-- chevron --></svg>
    </li>
    <li>
      <a href={withBase("/blog/")} class="hover:text-foreground transition-colors">Blog</a>
    </li>
    <li aria-hidden="true">
      <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><!-- chevron --></svg>
    </li>
    <li class="text-foreground" aria-current="page">
      {title}
    </li>
  </ol>
</nav>
```

### Contrast & Readability (WCAG 1.4.3)

Design tokens ensure theme-aware contrast:

```astro
<div class="prose prose-lg prose-slate dark:prose-invert max-w-none">
  <slot />
</div>
```

- Uses semantic color variables (`text-foreground`, `bg-surface`)
- `prose-invert` for dark mode
- `leading-relaxed` for improved readability

**Recommendation**: Run WAVE or axe DevTools to verify 4.5:1 contrast ratio across all color combinations.

### Decorative Icons and Emojis (WCAG 1.1.1)

#### Emoji Best Practices

All decorative emojis should be wrapped with `aria-hidden="true"` to prevent screen readers from announcing them:

```astro
<!-- ✅ Correct: Decorative emoji hidden from screen readers -->
<h2>
  <span aria-hidden="true">🎯</span> Lighthouse Performance Scores
</h2>

<!-- ✅ Correct: Emoji in button -->
<Button>
  <span aria-hidden="true">🚀</span> Get Started Now
</Button>

<!-- ❌ Incorrect: Emoji without aria-hidden -->
<h2>🎯 Lighthouse Performance Scores</h2>
```

#### Checkmark Lists with Screen Reader Context

When using visual checkmarks (✓) in lists, provide context for screen readers using the `.sr-only` utility class:

```astro
<ul role="list" aria-label="Key features">
  <li class="flex items-center gap-1">
    <span aria-hidden="true">✓</span>
    <span><span class="sr-only">Included: </span>TypeScript strict mode</span>
  </li>
  <li class="flex items-center gap-1">
    <span aria-hidden="true">✓</span>
    <span><span class="sr-only">Included: </span>WCAG AA compliant</span>
  </li>
</ul>
```

**Screen reader output**: "Included: TypeScript strict mode" instead of just "TypeScript strict mode"

#### Icon Component Pattern

The `Icon.astro` component provides proper accessibility support:

```astro
<!-- Decorative icon (hidden from screen readers) -->
<Icon name="github" class="w-5 h-5" decorative />

<!-- Semantic icon (announced to screen readers) -->
<Icon name="arrow-down" class="w-6 h-6" ariaLabel="Scroll down" />
```

Implementation:

```astro
<svg
  class:list={[className]}
  aria-hidden={decorative ? "true" : undefined}
  aria-label={ariaLabel}
  role={!decorative && ariaLabel ? "img" : undefined}
>
  <!-- SVG content -->
</svg>
```

### Screen Reader Only Content

The `sr-only` utility (declared with `@utility` in `src/styles/global.css`) hides content visually while keeping it accessible to screen readers:

```css
/* src/styles/global.css */
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
```

**Use cases**:

- Adding context to visual indicators (checkmarks, icons)
- Providing additional information for screen reader users
- Labeling form fields when visual labels aren't appropriate
