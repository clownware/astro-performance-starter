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

```astro
---
// src/layouts/BaseLayout.astro
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} - {siteTitle}</title>
</head>
<body>
  <!-- Skip to content link -->
  <a href="#main" class="skip-link">Skip to content</a>
  
  <!-- Header with banner role -->
  <header role="banner">
    <nav role="navigation" aria-label="Main navigation">
      <!-- Navigation items -->
    </nav>
  </header>
  
  <!-- Main content area -->
  <main id="main" role="main">
    <slot />
  </main>
  
  <!-- Complementary sidebar if needed -->
  <aside role="complementary" aria-label="Related information">
    <!-- Sidebar content -->
  </aside>
  
  <!-- Footer with contentinfo role -->
  <footer role="contentinfo">
    <!-- Footer content -->
  </footer>
</body>
</html>

<style>
  /* Skip link styling */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--color-primary);
    color: white;
    padding: 8px;
    text-decoration: none;
    z-index: 100;
  }
  
  .skip-link:focus {
    top: 0;
  }
</style>
```

### 2. Accessible Navigation

```astro
---
// src/components/Navigation.astro
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
  
  .nav-link:focus {
    /* High contrast focus indicator */
    outline: 3px solid var(--color-focus);
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
// src/components/ContactForm.astro
---

<form method="POST" action="/api/contact" novalidate>
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
  .required {
    color: var(--color-error);
  }
  
  .error-message {
    color: var(--color-error);
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
  }
  
  .hint {
    color: var(--color-text-muted);
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
  }
  
  /* Ensure visible focus */
  input:focus,
  textarea:focus,
  button:focus {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }
  
  /* Error state styling */
  input[aria-invalid="true"],
  textarea[aria-invalid="true"] {
    border-color: var(--color-error);
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

```css
/* src/styles/accessibility.css */

:root {
  /* Ensure all color combinations meet WCAG AA */
  --color-text: #1a1a1a; /* On white: 12.63:1 */
  --color-text-muted: #666666; /* On white: 5.74:1 */
  --color-background: #ffffff;
  --color-primary: #0066cc; /* On white: 4.53:1 */
  --color-error: #d32f2f; /* On white: 5.84:1 */
  --color-success: #2e7d32; /* On white: 5.26:1 */
  --color-focus: #0066cc;
  
  /* Dark mode with proper contrast */
  --dark-color-text: #f0f0f0; /* On dark: 13.27:1 */
  --dark-color-text-muted: #b0b0b0; /* On dark: 7.31:1 */
  --dark-color-background: #1a1a1a;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --color-text: #000000;
    --color-background: #ffffff;
    --color-primary: #0052cc;
    --color-focus: #000000;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Focus indicators */
:focus {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}

/* Remove outline for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}

/* Ensure focus visible for keyboard users */
:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}
```

### 5. Images and Media

```astro
---
// src/components/AccessibleImage.astro
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
// src/components/AccessibleModal.astro
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
// src/components/AccessibleTable.astro
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
    border-bottom: 1px solid var(--color-border);
  }
  
  th {
    font-weight: bold;
    background-color: var(--color-background-alt);
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

```typescript
// tests/a11y/automated.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Automated Accessibility Tests', () => {
  const pages = ['/', '/about', '/contact', '/blog'];
  
  pages.forEach(path => {
    test(`${path} should have no accessibility violations`, async ({ page }) => {
      await page.goto(path);
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });
  
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