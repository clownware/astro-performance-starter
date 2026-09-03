---
title: Testing Strategy Guide
description: '> **Purpose**: Comprehensive testing approach with Essential, Recommended, and Advanced scope guidance'
lastUpdated: true
tableOfContents: true
pagefind: true
---
# Testing Strategy Guide

> **Purpose**: Comprehensive testing approach with Essential, Recommended, and Advanced scope guidance

## Overview

This guide outlines testing strategies using the Essential / Recommended / Advanced scope model. Start with Essential testing for all projects; add Recommended and Advanced testing as your project's quality requirements grow.

## Scope Comparison

| Aspect | Essential | Recommended | Advanced |
|--------|-----------|-------------|----------|
| **Approach** | Manual checklists | Playwright critical paths | Full automated suites |
| **Coverage** | Critical paths only | Key user flows | Comprehensive |
| **Time Investment** | 1-2 days | 2-3 days | 3-5 days |
| **Maintenance** | Minimal | Moderate | Ongoing |
| **Tools** | Browser DevTools | Playwright, axe-core | Playwright, Vitest (Container API), Stryker |
| **CI Integration** | Basic checks | E2E on critical paths | Full test suite |

## Essential Testing

### Philosophy

Focus on critical user paths and core functionality with efficient manual testing.

### 1. Manual Testing Checklist

```markdown
## Pre-Launch Checklist

### Functionality
- [ ] All links work (no 404s)
- [ ] Forms submit correctly
- [ ] Navigation works on all pages
- [ ] Search functionality (if applicable)
- [ ] Contact methods functional
- [ ] Social links open correctly

### Responsive Design
- [ ] Mobile (320px - 768px)
  - [ ] Navigation menu works
  - [ ] Text is readable
  - [ ] Images scale properly
  - [ ] Touch targets are 44px+
- [ ] Tablet (768px - 1024px)
  - [ ] Layout adjusts properly
  - [ ] No horizontal scroll
- [ ] Desktop (1024px+)
  - [ ] Full layout visible
  - [ ] Hover states work

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari
- [ ] Chrome Android

### Performance
- [ ] Lighthouse score 95+ on mobile
- [ ] Images optimized (< 200KB)
- [ ] Page load < 3 seconds on 3G
- [ ] No console errors

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader tested (basic)
- [ ] Color contrast passes
- [ ] Alt text on all images
```

### 2. Critical Path Testing

Define and test the most important user journeys:

```yaml
Critical Paths:
  1. Homepage → About → Contact
  2. Homepage → Portfolio → Project Details
  3. Homepage → Blog → Article → Back
  4. Any page → Contact Form → Submit
  5. Any page → Navigation → All sections
```

### 3. Quick Regression Tests

Before each deployment, run a quick smoke test script (guide-authored — save it as `scripts/smoke-test.sh` and invoke it with `bash scripts/smoke-test.sh`; it is not a package script):

```bash
#!/bin/bash
# scripts/smoke-test.sh

echo "Running smoke tests..."

# Build the site
pnpm run build || exit 1

# Check for build errors
if [ -d "dist" ]; then
  echo "Build successful"
else
  echo "Build failed"
  exit 1
fi

# Check critical files exist
critical_files=(
  "dist/index.html"
  "dist/about/index.html"
  "dist/contact/index.html"
  "dist/404.html"
  "dist/robots.txt"
  "dist/sitemap-index.xml"
)

for file in "${critical_files[@]}"; do
  if [ -f "$file" ]; then
    echo "$file exists"
  else
    echo "$file missing"
    exit 1
  fi
done

echo "All smoke tests passed!"
```

## Recommended / Advanced Testing

### Philosophy

Implement automated testing with continuous integration to catch regressions early. Recommended scope covers critical paths; Advanced scope adds full coverage, visual regression, and cross-browser testing.

### 1. Testing Stack

The starter ships its testing stack — `package.json` is the source of truth and every pinned version is published in `versions.json`, so this guide names packages, not numbers:

| Layer | Package(s) | Where it runs |
|-------|------------|---------------|
| Unit + component microtests | `vitest`, `@vitest/coverage-v8`, `jsdom`, Astro's Container API (`astro/container`, [ADR-040](/adr/040-container-api-for-component-microtests/)) | `pnpm run test:unit`, pre-push hook, CI (`quality:ci`, `test:coverage`) |
| End-to-end | `@playwright/test` | `pnpm run test:e2e`, CI (Chromium project) |
| Accessibility engine | `@axe-core/playwright` (a **devDependency**, not optional) | `pnpm run test:a11y`, CI via the e2e run |
| Mutation testing | `@stryker-mutator/core`, `@stryker-mutator/vitest-runner` ([ADR-042](/adr/042-mutation-testing-with-stryker/)) | `pnpm run test:mutate`, scheduled `mutation.yml` |
| Performance | `@lhci/cli`, `lighthouse` | `pnpm run perf:lhci`, `lighthouse.yml` |

Not shipped, by design: no `@testing-library/preact` (`.astro` components cannot be rendered by it — the Container API covers them, and the two Preact islands are exercised through Playwright), and no Percy or other snapshot service (see [Visual Regression Testing](#4-visual-regression-testing)).

### 2. E2E Testing with Playwright

#### Configuration (shipped)

`playwright.config.ts` defines three desktop browser projects from Playwright's `devices` presets, points `testDir` at `e2e/`, and starts `astro preview` for you:

```typescript
// playwright.config.ts (shipped)
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:4321",
    trace: "on-first-retry",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],

  webServer: {
    command: "pnpm run preview",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
  },
});
```

Run `pnpm run build` first (preview serves `dist/`). CI runs only the `chromium` project (`pnpm exec playwright test --project=chromium`); run `pnpm run test:e2e` locally for all three. Because `trailingSlash: "always"` is set in `astro.config.mjs`, assert on `/about/`, not `/about`.

#### Basic Test Structure

The shipped page specs (`e2e/index.spec.ts`, `about.spec.ts`, `header.spec.ts`, …) are the reference; this example is illustrative and uses the real selectors from `Header.astro`:

```typescript
// e2e/navigation.spec.ts (illustrative)
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to all main pages', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Main navigation' });

    await nav.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/\/about\/$/);
    await expect(page.locator('h1')).toBeVisible();

    await nav.getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL(/\/projects\/$/);

    await nav.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/\/contact\/$/);
  });

  test('mobile menu should work', async ({ page }) => {
    // Header switches to the sandwich menu below lg (1024px)
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Open mobile menu (label button marked data-mobile-menu-button in Header.astro)
    await page.locator('[data-mobile-menu-button]').click();
    await expect(page.locator('#mobile-menu')).toBeVisible();
    
    // Navigate via mobile menu
    await page.locator('#mobile-menu').getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/\/about\/$/);
  });
});
```

#### Form Testing

The shipped `e2e/contact.spec.ts` covers the contact page; the form itself works without JavaScript and is progressively enhanced by `ContactFormScript.ts` ([ADR-021](/adr/021-contact-form-progressive-enhancement/)). Selectors below are the real BEM classes from `src/components/molecules/ContactForm.astro`:

```typescript
// e2e/contact-form.spec.ts (illustrative)
import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test('should show inline validation errors', async ({ page }) => {
    await page.goto('/contact/');
    
    // Submit empty form — the script adds `novalidate` and renders inline errors
    await page.click('.contact-form__submit');
    
    // Each field has an aria-live error container: #name-error, #email-error, …
    await expect(page.locator('#name-error')).not.toBeEmpty();
    await expect(page.locator('#email-error')).not.toBeEmpty();
    await expect(page.locator('#message-error')).not.toBeEmpty();
  });

  test('should announce success after submission', async ({ page }) => {
    await page.goto('/contact/');
    
    await page.fill('#contact-name', 'Test User');
    await page.fill('#contact-email', 'test@example.com');
    await page.fill('#contact-message', 'This is a test message');
    await page.click('.contact-form__submit');
    
    // The status region (role="status") reveals the success message
    await expect(page.locator('.contact-form__success')).toBeVisible();
  });
});
```

#### Performance Testing

```typescript
// e2e/performance.spec.ts (illustrative — budgets are enforced by Lighthouse CI and perf:budgets, not by Playwright)
import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('should load homepage within performance budget', async ({ page }) => {
    const metrics = await page.goto('/', { waitUntil: 'networkidle' });
    
    // Check TTFB
    const timing = await page.evaluate(() => performance.timing);
    const ttfb = timing.responseStart - timing.navigationStart;
    expect(ttfb).toBeLessThan(800);
    
    // Check total load time
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    expect(loadTime).toBeLessThan(3000);
  });

  test('should not have layout shifts', async ({ page }) => {
    await page.goto('/');
    
    // Wait for all images to load
    await page.waitForLoadState('networkidle');
    
    // Check CLS
    const cls = await page.evaluate(() => {
      return new Promise(resolve => {
        let cls = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              cls += entry.value;
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });
        
        setTimeout(() => resolve(cls), 3000);
      });
    });
    
    expect(cls).toBeLessThan(0.1);
  });
});
```

### 3. Accessibility Testing

The shipped engine sweep is `e2e/a11y-axe.spec.ts`: it scans `/`, `/about/`, `/blog/`, `/projects/`, `/contact/`, `/how-it-works/` and `/showcase/` against the WCAG 2.1 A/AA rulesets under `reducedMotion: "reduce"`, and fails on any **serious** or **critical** violation. Its titles carry the `@a11y` tag, as do the structural checks (landmarks, heading order) in the page specs, so `pnpm run test:a11y` (`playwright test --grep="@a11y"`) runs the whole accessibility slice.

```typescript
// e2e/a11y-axe.spec.ts (shipped — per-page loop trimmed)
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test(`@a11y / has no serious or critical axe violations`, async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  const blocking = results.violations.filter((v) =>
    ["serious", "critical"].includes(v.impact ?? ""),
  );
  expect(blocking).toEqual([]);
});
```

Hand-written checks in the same spirit (illustrative):

```typescript
// e2e/accessibility.spec.ts (illustrative)
import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    const firstFocus = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(firstFocus);
    
    // Check skip link
    await page.keyboard.press('Tab');
    const skipLink = await page.locator(':focus');
    await expect(skipLink).toContainText('Skip to content');
  });

  test('should work with screen reader', async ({ page }) => {
    await page.goto('/');
    
    // Check ARIA landmarks
    await expect(page.locator('header[role="banner"]')).toBeVisible();
    await expect(page.locator('nav[role="navigation"]')).toBeVisible();
    await expect(page.locator('main[role="main"]')).toBeVisible();
    await expect(page.locator('footer[role="contentinfo"]')).toBeVisible();
    
    // Check heading hierarchy
    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', 
      elements => elements.map(el => ({
        level: parseInt(el.tagName[1]),
        text: el.textContent
      }))
    );
    
    // Ensure only one h1
    const h1Count = headings.filter(h => h.level === 1).length;
    expect(h1Count).toBe(1);
  });
});
```

### 4. Visual Regression Testing

**Not shipped.** The starter has no visual-regression suite — there is no `toHaveScreenshot` call and no snapshot service anywhere in the repo. The `/showcase` living style guide ([ADR-049](/adr/049-showcase-living-style-guide/)) is the manual review surface. If your component churn justifies automating it, Playwright's built-in screenshot assertions need no external service or extra dependency:

```typescript
// e2e/visual.spec.ts (illustrative — add only if you want snapshot baselines committed)
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('homepage should match visual snapshot', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' }); // settle ADR-048 animations
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage.png', { fullPage: true });
  });

  test('light theme should match visual snapshot', async ({ page }) => {
    // The site is dark-first (ADR-032); an explicit stored preference wins
    await page.addInitScript(() => localStorage.setItem('theme', 'light'));
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage-light.png', { fullPage: true });
  });
});
```

### 5. Component Testing

`.astro` components render on the server, so they cannot be mounted with `@testing-library/preact` (not installed). The starter tests them through Astro's Container API ([ADR-040](/adr/040-container-api-for-component-microtests/)) via the shared helper `src/components/__tests__/_helpers/container.ts` — the only file that imports `experimental_AstroContainer`, so an upstream API change means one edit. Tests sit beside the component in `__tests__/` and run in Vitest's `node` environment:

```typescript
// src/components/atoms/__tests__/Button.test.ts (shipped — excerpt)
// @vitest-environment node
// Astro container renders components on the server — needs node, not jsdom.

import { describe, expect, it } from "vitest";
import { render } from "../../__tests__/_helpers/container";
import Button from "../Button.astro";

const renderButton = (props: Record<string, unknown> = {}, slot = "Click me") =>
  render(Button, props, { default: slot });

describe("Button (atom)", () => {
  it("renders a <button> by default", async () => {
    const html = await renderButton();
    expect(html).toMatch(/<button[^>]*type="button"/);
    expect(html).not.toMatch(/<a /);
  });

  it("renders an <a> when href is provided", async () => {
    const html = await renderButton({ href: "/about" });
    expect(html).toMatch(/<a [^>]*href="\/about"/);
  });

  it("applies secondary variant classes", async () => {
    const html = await renderButton({ variant: "secondary" });
    expect(html).toContain("bg-surface");
    expect(html).toContain("border-border-emphasis");
  });
});
```

Pure logic in `src/utils/` is tested directly — this is the layer the coverage thresholds apply to:

```typescript
// src/utils/__tests__/formatDate.test.ts (shipped — excerpt)
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatDateFull } from "../formatDate";

describe("formatDate utilities", () => {
  // Freeze the clock (ADR-037 Rule 3: deterministic fixtures)
  beforeEach(() => {
    vi.useFakeTimers({ now: new Date("2026-03-15T12:00:00.000Z") });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("formats a valid date in full format", () => {
    expect(formatDateFull(new Date("2024-03-15T10:30:00Z"))).toBe("March 15, 2024");
  });

  it("returns null for invalid date", () => {
    expect(formatDateFull("invalid-date")).toBeNull();
  });
});
```

The two Preact islands (`src/components/islands/*.tsx`) are exercised through Playwright on `/showcase`. If you want DOM-level unit tests for an island, add `@testing-library/preact` yourself (it is not part of the stack) and run those files under the default `jsdom` environment.

### 6. Content Integrity Checks

`astro:content` is a virtual module, so `vitest.config.ts` aliases it to the stub in `src/__mocks__/astro-content.ts` — unit tests that import `getCollection()` get a fixture dataset controlled by the stub's `setMockCollection()` / `resetMockCollection()` exports, which is how `src/utils/__tests__/blog.test.ts` covers `getPublishedPosts()` and `getFeaturedPosts()` with the fixtures in `tests/fixtures/posts.ts`. Schema validation of the real content is a **build** concern: `pnpm run build` (and `pnpm run check`) fail on any entry that violates `src/content.config.ts`, so a "no drafts in production" rule belongs in the page query (`data.draft !== true`, see `src/utils/blog.ts`) plus an e2e assertion, not in Vitest:

```typescript
// src/utils/__tests__/blog.test.ts (shipped — excerpt)
import { sortPostsByDate } from "@utils/blog";
import { describe, expect, it } from "vitest";

// Build a minimal post shape — only the fields sortPostsByDate accesses.
const makePost = (date: Date, title = "Test Post") =>
  ({
    data: { date, draft: false as const, title },
  }) as unknown as Parameters<typeof sortPostsByDate>[0][number];

describe("sortPostsByDate", () => {
  it("sorts posts by date in descending order (newest first)", () => {
    const posts = [
      makePost(new Date("2024-01-01")),
      makePost(new Date("2024-03-01")),
      makePost(new Date("2024-02-01")),
    ];

    const sorted = sortPostsByDate(posts);

    expect(sorted[0].data.date).toEqual(new Date("2024-03-01"));
    expect(sorted[1].data.date).toEqual(new Date("2024-02-01"));
    expect(sorted[2].data.date).toEqual(new Date("2024-01-01"));
  });

  it("handles empty array", () => {
    expect(sortPostsByDate([])).toEqual([]);
  });
});
```

### 7. Mutation Testing (Advanced)

Coverage says a line ran; mutation testing says a test would notice if it broke. Stryker is wired up ([ADR-042](/adr/042-mutation-testing-with-stryker/)) with the same scope as coverage — `src/utils/**/*.ts` — and a `break` threshold of 50% (`stryker.conf.json`). It is slow, so it runs on a schedule in `mutation.yml` rather than on every PR:

```bash
pnpm run test:mutate   # SITE_URL=http://localhost:4321 stryker run
```

## CI/CD Integration

The starter ships its CI, so there is nothing to author per tier — you *remove* steps if you scope down, you do not add them. Every gate is halt-on-violation ([ADR-039](/adr/039-halt-on-violation-enforcement/)).

### `ci.yml` (shipped — step list)

```yaml
# .github/workflows/ci.yml — build-test job, in order (setup steps omitted)
- name: Lint, format & type-check
  run: pnpm run quality:ci            # format:check, lint, lint:md, astro check, test:unit, agents:check, version:check, og:check, docs:count

- name: ADR enforcement suite (ADR-064, warn-only launch)
  run: pnpm run enforce

- name: Unit tests with coverage
  run: pnpm run test:coverage         # vitest.config.ts thresholds: 90 lines / 95 functions / 90 branches on src/utils/**

- name: Upload coverage report
  if: always()
  uses: actions/upload-artifact@v7

- name: Validate budget overrides
  run: pnpm run budgets:validate

- name: Validate semantic color contrast
  run: pnpm run design:validate

- name: Build site
  run: pnpm run build

- name: Enforce JS bundle size budget     # inline: total raw JS in dist/_astro ≤ 160KB
- name: Enforce raw-size budgets — budgets.json (with budget-overrides applied)
  run: pnpm run perf:budgets
- name: Enforce per-image size budget — source (ADR-057)
  run: pnpm run images:gate
- name: Enforce per-image size budget — build output (ADR-057)
  run: IMAGE_GATE_ROOTS=dist pnpm run images:gate
- name: Enforce font preload budget (ADR-058)
  run: pnpm run fonts:gate

- name: Run E2E tests (Chromium)
  run: pnpm exec playwright test --project=chromium   # includes the @a11y axe sweep

- name: Security audit (high severity)
  run: pnpm run audit:ci
- name: Trivy SBOM scan
```

Two further jobs in the same workflow run Semgrep SAST and gitleaks secret scanning in their official containers ([ADR-046](/adr/046-security-scanning-pipeline/)).

### Companion workflows

| Workflow | Trigger | What it gates |
|----------|---------|---------------|
| `lighthouse.yml` | push / PR | `lhci autorun` against `lighthouserc.json` **and** `lighthouserc.mobile.json` — floors of 0.90 performance, 0.95 accessibility, 0.95 best-practices, 0.90 SEO |
| `mutation.yml` | schedule | `pnpm run test:mutate` (Stryker, `src/utils`) |
| `link-check.yml` | schedule | markdown-link-check over the docs |

Locally, `.husky/pre-push` runs `pnpm run test:unit` before every push so unit failures surface before CI.

## Test Organization

### Directory Structure

Playwright specs live in `e2e/` at the repo root (`playwright.config.ts` sets `testDir: "./e2e"`); unit tests live in `__tests__/` directories beside the code they cover, and Vitest excludes `e2e/`:

```bash
e2e/                          # Playwright end-to-end + a11y specs (10)
├── a11y-axe.spec.ts          # axe-core WCAG 2.1 A/AA sweep over the key pages
├── about.spec.ts
├── blog.spec.ts
├── contact.spec.ts
├── docs-adr.spec.ts
├── header.spec.ts
├── how-it-works.spec.ts
├── index.spec.ts
├── showcase.spec.ts
└── theme.spec.ts
src/
├── __mocks__/astro-content.ts    # astro:content stub aliased in vitest.config.ts
├── __tests__/                    # Design-token, contrast and policy unit tests
├── components/**/__tests__/      # Container API component microtests (ADR-040)
│   └── _helpers/container.ts     # The one place experimental_AstroContainer is imported
├── scripts/__tests__/            # featureCardSync
└── utils/__tests__/              # Pure-logic unit tests (coverage-gated)
scripts/src/__tests__/            # Build/tooling script unit tests + fixtures/
tests/
└── fixtures/                     # Shared test data (posts.ts, tokens.ts)
```

### Test Scripts

These are the test scripts the starter ships in `package.json` (the `SITE_URL` prefix satisfies `env:validate`):

```json
{
  "scripts": {
    "test": "SITE_URL=http://localhost:4321 vitest",
    "test:unit": "SITE_URL=http://localhost:4321 vitest run",
    "test:coverage": "SITE_URL=http://localhost:4321 vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:a11y": "playwright test --grep=\"@a11y\"",
    "test:mutate": "SITE_URL=http://localhost:4321 stryker run"
  }
}
```

`test:a11y` selects every Playwright test whose title contains `@a11y`; `test:unit` runs the whole Vitest suite (utils, scripts, component microtests, token tests). The smoke script above is guide-authored — invoke it directly with `bash scripts/smoke-test.sh`.

## Testing Best Practices

### 1. Test Naming Conventions

```typescript
// Good test names
test('should display error message when email is invalid')
test('navigation menu should be accessible via keyboard')
test('homepage should load within 3 seconds on 3G')

// Bad test names
test('test email')
test('navigation works')
test('performance')
```

### 2. Test Data Management

```typescript
// tests/fixtures/test-data.ts (illustrative — the shipped fixtures are tests/fixtures/posts.ts and tokens.ts)
export const testUsers = {
  valid: {
    name: 'Test User',
    email: 'test@example.com',
    message: 'This is a test message'
  },
  invalid: {
    email: 'notanemail',
    message: ''
  }
};

export const testContent = {
  blogPost: {
    title: 'Test Blog Post',
    description: 'Test description',
    content: '# Test Content\n\nThis is test content.',
    date: new Date('2024-01-01')
  }
};
```

### 3. Page Object Model

```typescript
// tests/pages/ContactPage.ts
export class ContactPage {
  constructor(private page: Page) {}
  
  async navigate() {
    await this.page.goto('/contact');
  }
  
  async fillForm(data: ContactFormData) {
    await this.page.fill('[name="name"]', data.name);
    await this.page.fill('[name="email"]', data.email);
    await this.page.fill('[name="message"]', data.message);
  }
  
  async submit() {
    await this.page.click('button[type="submit"]');
  }
  
  async getSuccessMessage() {
    return this.page.locator('.success-message').textContent();
  }
  
  async getErrorMessage(field: string) {
    return this.page.locator(`[data-error="${field}"]`).textContent();
  }
}
```

### 4. Test Helpers

```typescript
// tests/helpers/performance.ts
export async function measurePageLoad(page: Page, url: string) {
  const metrics = {
    ttfb: 0,
    fcp: 0,
    lcp: 0,
    cls: 0,
    inp: 0
  };
  
  await page.goto(url, { waitUntil: 'networkidle' });
  
  // Get navigation timing
  const timing = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      ttfb: nav.responseStart - nav.requestStart,
      domContentLoaded: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
      load: nav.loadEventEnd - nav.loadEventStart
    };
  });
  
  // Get Web Vitals
  const vitals = await page.evaluate(() => {
    return new Promise(resolve => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        resolve({
          lcp: entries.find(e => e.entryType === 'largest-contentful-paint')?.startTime,
          fcp: entries.find(e => e.name === 'first-contentful-paint')?.startTime,
          cls: entries.filter(e => e.entryType === 'layout-shift')
            .reduce((sum, entry) => sum + entry.value, 0)
        });
      }).observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });
    });
  });
  
  return { ...metrics, ...timing, ...vitals };
}
```

## Debugging Failed Tests

### 1. Screenshot on Failure

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
});
```

### 2. Debug Mode

```bash
# Run specific test in debug mode
pnpm run test:e2e --debug e2e/contact.spec.ts

# Run with UI mode for better debugging
pnpm run test:e2e:ui
```

### 3. Verbose Logging

```typescript
// tests/helpers/logger.ts
export function logTestStep(step: string) {
  if (process.env.DEBUG_TESTS) {
    console.log(`[TEST] ${new Date().toISOString()} - ${step}`);
  }
}

// Usage in tests
test('should submit form', async ({ page }) => {
  logTestStep('Navigating to contact page');
  await page.goto('/contact');
  
  logTestStep('Filling form fields');
  await page.fill('[name="email"]', 'test@example.com');
  
  logTestStep('Submitting form');
  await page.click('button[type="submit"]');
});
```

## Test Maintenance

### 1. Regular Test Audits

```markdown
## Monthly Test Audit Checklist

- [ ] Remove obsolete tests
- [ ] Update selectors that have changed
- [ ] Review flaky tests
- [ ] Update test data
- [ ] Check test coverage reports
- [ ] Review test execution time
- [ ] Update visual snapshots
- [ ] Verify CI configuration
```

### 2. Handling Flaky Tests

```typescript
// Retry flaky tests
test.describe('Flaky Test Suite', () => {
  test.describe.configure({ retries: 2 });
  
  test('potentially flaky test', async ({ page }) => {
    // Add explicit waits instead of arbitrary timeouts
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.dynamic-content', { state: 'visible' });
  });
});
```

### 3. Test Performance

Keep tests fast by:

- Running tests in parallel
- Using test fixtures
- Mocking external services
- Minimizing browser restarts
- Using appropriate wait strategies

## Common Testing Pitfalls

### 1. Over-Testing

**Essential**: Don't automate everything

- Focus on critical paths
- Manual testing is often faster
- Maintain cost/benefit balance

**Advanced**: Don't test implementation details

- Test behavior, not structure
- Avoid brittle selectors
- Focus on user outcomes

### 2. Under-Testing

**Essential**: Don't skip accessibility

- Basic keyboard navigation
- Color contrast
- Screen reader basics

**Advanced**: Don't ignore edge cases

- Error states
- Loading states
- Empty states
- Offline behavior

### 3. Poor Test Organization

- Group related tests
- Use consistent naming
- Share common setup
- Avoid test interdependence

## Metrics and Reporting

### Coverage Goals

| Metric | Essential | Advanced (what the starter enforces) |
|--------|-----|----------|
| **Critical Paths** | 100% manual | 100% automated (`e2e/`, Chromium in CI) |
| **Code Coverage** | N/A | `src/utils/**` only: 90% lines / 95% functions / 90% branches (`vitest.config.ts` thresholds, run by `test:coverage` in CI); mutation score ≥ 50% via Stryker on a schedule |
| **Visual Coverage** | Manual review | Manual `/showcase` review — no automated snapshots ship |
| **A11y Coverage** | Basic manual | Automated WCAG 2.1 A/AA via axe (`e2e/a11y-axe.spec.ts`) + Lighthouse accessibility ≥ 0.95 |
| **Performance** | Manual Lighthouse | Automated budgets (`budgets.json`, image/font gates) + Lighthouse CI desktop and mobile |

### Test Reports

```typescript
// Generate comprehensive test report
{
  "scripts": {
    "test:report": "playwright test --reporter=html && vitest run --reporter=html"
  }
}
```

## Conclusion

Choose your testing strategy based on project needs:

- **Essential**: Quick, focused manual testing
- **Advanced**: Comprehensive automated testing

Remember: The best test suite is one that gets maintained and provides value, not one that aims for 100% coverage at all costs.
