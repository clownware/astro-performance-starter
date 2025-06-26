---
title: Testing Strategy Guide
description: "> **Purpose**: Comprehensive testing approach for MVP and Showcase tracks\r"
---
# Testing Strategy Guide

> **Purpose**: Comprehensive testing approach for MVP and Showcase tracks

## Overview

This guide outlines testing strategies tailored to each implementation track. MVP focuses on essential quality checks with manual testing, while Showcase implements comprehensive automated testing.

## Track Comparison

| Aspect | MVP Track | Showcase Track |
|--------|-----------|----------------|
| **Approach** | Manual checklists | Automated suites |
| **Coverage** | Critical paths only | Comprehensive |
| **Time Investment** | 1-2 days | 3-5 days |
| **Maintenance** | Minimal | Ongoing |
| **Tools** | Browser DevTools | Playwright, Vitest {{versions.vitest}}, Percy |
| **CI Integration** | Basic checks | Full test suite |

## MVP Track Testing

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

Before each deployment:

```bash
# Quick smoke test script
#!/bin/bash

echo "Running MVP smoke tests..."

# Build the site
npm run build || exit 1

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
  "dist/sitemap.xml"
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

## Showcase Track Testing

### Philosophy
Implement comprehensive automated testing with continuous integration to catch regressions early.

### 1. Testing Stack

```json
{
  "devDependencies": {
    "@playwright/test": "{{versions.playwright}}",
    "vitest": "{{versions.vitest}}",
    "@vitest/ui": "{{versions.vitest}}",
    "@percy/playwright": "^1.0.0",
    "axe-playwright": "^1.2.0",
    "@testing-library/preact": "^3.0.0"
  }
}
```

### 2. E2E Testing with Playwright

#### Basic Test Structure

```typescript
// tests/e2e/navigation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to all main pages', async ({ page }) => {
    // Test navigation to About
    await page.click('text=About');
    await expect(page).toHaveURL('/about');
    await expect(page.locator('h1')).toContainText('About');

    // Test navigation to Projects
    await page.click('text=Projects');
    await expect(page).toHaveURL('/projects');
    await expect(page.locator('h1')).toContainText('Projects');

    // Test navigation to Contact
    await page.click('text=Contact');
    await expect(page).toHaveURL('/contact');
    await expect(page.locator('h1')).toContainText('Contact');
  });

  test('mobile menu should work', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Open mobile menu
    await page.click('[aria-label="Open menu"]');
    await expect(page.locator('nav[aria-label="Mobile navigation"]')).toBeVisible();
    
    // Navigate via mobile menu
    await page.click('nav[aria-label="Mobile navigation"] >> text=About');
    await expect(page).toHaveURL('/about');
  });
});
```

#### Form Testing

```typescript
// tests/e2e/contact-form.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test('should submit successfully with valid data', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill form
    await page.fill('[name="name"]', 'Test User');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="message"]', 'This is a test message');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Check success message
    await expect(page.locator('.success-message')).toBeVisible();
    await expect(page.locator('.success-message')).toContainText('Thank you');
  });

  test('should show validation errors', async ({ page }) => {
    await page.goto('/contact');
    
    // Submit empty form
    await page.click('button[type="submit"]');
    
    // Check error messages
    await expect(page.locator('[data-error="name"]')).toContainText('Required');
    await expect(page.locator('[data-error="email"]')).toContainText('Required');
    await expect(page.locator('[data-error="message"]')).toContainText('Required');
  });
});
```

#### Performance Testing

```typescript
// tests/e2e/performance.spec.ts
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

```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('should have no accessibility violations on homepage', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

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

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // Percy integration
    percy: {
      enable: true,
    },
  },
  
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        browserName: 'chromium',
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        browserName: 'webkit',
        viewport: { width: 375, height: 667 },
      },
    },
  ],
});
```

```typescript
// tests/e2e/visual.spec.ts
import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Visual Regression', () => {
  test('homepage should match visual snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await percySnapshot(page, 'Homepage');
  });

  test('dark mode should match visual snapshot', async ({ page }) => {
    await page.goto('/');
    await page.click('[aria-label="Toggle dark mode"]');
    await page.waitForTimeout(300); // Wait for transition
    await percySnapshot(page, 'Homepage - Dark Mode');
  });
});
```

### 5. Component Testing

```typescript
// tests/unit/Button.test.tsx
import { render, fireEvent } from '@testing-library/preact';
import { expect, test } from 'vitest';
import Button from '../../src/components/ui/Button';

test('Button renders with correct text', () => {
  const { getByText } = render(<Button>Click me</Button>);
  expect(getByText('Click me')).toBeTruthy();
});

test('Button handles click events', () => {
  const handleClick = vi.fn();
  const { getByText } = render(
    <Button onClick={handleClick}>Click me</Button>
  );
  
  fireEvent.click(getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('Button applies variant classes', () => {
  const { container } = render(
    <Button variant="secondary">Secondary</Button>
  );
  
  const button = container.querySelector('button');
  expect(button?.className).toContain('btn-secondary');
});
```

### 6. Integration Testing

```typescript
// tests/integration/content-collections.test.ts
import { expect, test } from 'vitest';
import { getCollection } from 'astro:content';

test('all blog posts have required fields', async () => {
  const posts = await getCollection('blog');
  
  posts.forEach(post => {
    expect(post.data.title).toBeTruthy();
    expect(post.data.description).toBeTruthy();
    expect(post.data.date).toBeInstanceOf(Date);
    expect(post.data.draft).toBe(false);
  });
});

test('no draft content in production build', async () => {
  const posts = await getCollection('blog');
  const drafts = posts.filter(post => post.data.draft);
  
  expect(drafts).toHaveLength(0);
});
```

## CI/CD Integration

### GitHub Actions for MVP

```yaml
# .github/workflows/test-mvp.yml
name: MVP Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
          
      - run: pnpm install
      
      - name: Type Check
        run: pnpm run type-check
        
      - name: Lint
        run: pnpm run lint
        
      - name: Build
        run: pnpm run build
        
      - name: Smoke Tests
        run: pnpm run test:smoke
        
      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/about
            http://localhost:3000/contact
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### GitHub Actions for Showcase

```yaml
# .github/workflows/test-showcase.yml
name: Showcase Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
          
      - run: pnpm install
      
      - name: Install Playwright {{versions.playwright}} Browsers
        run: pnpm exec playwright install --with-deps ${{ matrix.browser }}
        
      - name: Type Check
        run: pnpm run type-check
        
      - name: Lint
        run: pnpm run lint
        
      - name: Unit Tests
        run: pnpm run test:unit
        
      - name: Build
        run: pnpm run build
        
      - name: E2E Tests
        run: pnpm run test:e2e --project="${{ matrix.browser }}"
        
      - name: Upload Test Results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results-${{ matrix.browser }}
          path: test-results/
          
      - name: Visual Tests
        if: matrix.browser == 'chromium'
        run: pnpm run test:visual
        env:
          PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}
          
      - name: Accessibility Tests
        if: matrix.browser == 'chromium'
        run: pnpm run test:a11y
        
      - name: Performance Tests
        if: matrix.browser == 'chromium'
        run: pnpm run test:perf
```

## Test Organization

### Directory Structure

```
tests/
├── e2e/                    # End-to-end tests
│   ├── navigation.spec.ts
│   ├── forms.spec.ts
│   ├── performance.spec.ts
│   ├── accessibility.spec.ts
│   └── visual.spec.ts
├── integration/            # Integration tests
│   ├── content.test.ts
│   ├── api.test.ts
│   └── build.test.ts
├── unit/                   # Unit tests
│   ├── components/
│   │   ├── Button.test.tsx
│   │   └── Card.test.tsx
│   └── utils/
│       ├── dates.test.ts
│       └── strings.test.ts
├── fixtures/               # Test data
│   ├── images/
│   └── content/
└── helpers/                # Test utilities
    ├── setup.ts
    └── utils.ts
```

### Test Scripts

```json
{
  "scripts": {
    // MVP Scripts
    "test:smoke": "./scripts/smoke-test.sh",
    "test:manual": "echo 'Follow manual testing checklist'",
    
    // Showcase Scripts
    "test": "vitest",
    "test:unit": "vitest run tests/unit",
    "test:integration": "vitest run tests/integration",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:visual": "percy exec -- playwright test tests/e2e/visual.spec.ts",
    "test:a11y": "playwright test tests/e2e/accessibility.spec.ts",
    "test:perf": "playwright test tests/e2e/performance.spec.ts",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "test:all": "pnpm run test:unit && pnpm run test:integration && pnpm run test:e2e"
  }
}
```

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
// tests/fixtures/test-data.ts
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
    fid: 0
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
pnpm run test:e2e --debug tests/e2e/contact-form.spec.ts

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

**MVP**: Don't automate everything
- Focus on critical paths
- Manual testing is often faster
- Maintain cost/benefit balance

**Showcase**: Don't test implementation details
- Test behavior, not structure
- Avoid brittle selectors
- Focus on user outcomes

### 2. Under-Testing

**MVP**: Don't skip accessibility
- Basic keyboard navigation
- Color contrast
- Screen reader basics

**Showcase**: Don't ignore edge cases
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

| Metric | MVP | Showcase |
|--------|-----|----------|
| **Critical Paths** | 100% manual | 100% automated |
| **Code Coverage** | N/A | 80%+ |
| **Visual Coverage** | Manual review | Automated snapshots |
| **A11y Coverage** | Basic manual | Automated WCAG AA |
| **Performance** | Manual Lighthouse | Automated budgets |

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
- **MVP**: Quick, focused manual testing
- **Showcase**: Comprehensive automated testing

Remember: The best test suite is one that gets maintained and provides value, not one that aims for 100% coverage at all costs.
