---
title: Phase 8 - Code Examples  
lastUpdated: true
description: >-
  Code examples for Phase 8
tableOfContents: true
pagefind: true
---

## 2. Automated E2E Tests (Advanced)

```typescript
// tests/e2e/navigation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('desktop navigation works', async ({ page }) => {
    // Check all nav items visible
    const nav = page.locator('nav[aria-label="Main navigation"]');
    await expect(nav).toBeVisible();
    
    const navItems = ['Home', 'Projects', 'Blog', 'About', 'Contact'];
    for (const item of navItems) {
      await expect(nav.locator(`a:has-text("${item}")`)).toBeVisible();
    }
    
    // Test navigation
    await page.click('nav a:has-text("Projects")');
    await expect(page).toHaveURL('/projects');
    await expect(page.locator('h1')).toContainText('Projects');
  });

  test('mobile navigation works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Desktop nav should be hidden
    const desktopNav = page.locator('nav[aria-label="Main navigation"]');
    await expect(desktopNav).toBeHidden();
    
    // Open mobile menu
    const menuButton = page.locator('button[aria-label="Toggle navigation menu"]');
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    
    // Check menu opened
    const mobileMenu = page.locator('#mobile-menu');
    await expect(mobileMenu).toBeVisible();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    
    // Navigate via mobile menu
    await page.click('#mobile-menu a:has-text("About")');
    await expect(page).toHaveURL('/about');
    await expect(mobileMenu).toBeHidden();
  });

  test('keyboard navigation works', async ({ page }) => {
    // Tab through navigation
    await page.keyboard.press('Tab'); // Skip to main
    await page.keyboard.press('Tab'); // Logo
    await page.keyboard.press('Tab'); // First nav item
    
    // Check focus visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toHaveClass(/focus-visible/);
    
    // Navigate with Enter
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/projects|blog|about|contact/);
  });
});
```

```typescript
// tests/e2e/forms.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('validates required fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check validation messages
    await expect(page.locator('text=Please enter your name')).toBeVisible();
    await expect(page.locator('text=Please enter a valid email')).toBeVisible();
    await expect(page.locator('text=Please enter a message')).toBeVisible();
    
    // Form should not submit
    await expect(page).toHaveURL('/contact');
  });

  test('validates email format', async ({ page }) => {
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('textarea[name="message"]', 'Test message');
    await page.click('button[type="submit"]');
    
    // Should show email validation error
    await expect(page.locator('text=Please enter a valid email')).toBeVisible();
  });

  test('successfully submits form', async ({ page }) => {
    // Fill valid form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'This is a test message');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Check success message
    await expect(page.locator('text=Thank you! I\'ll get back to you soon.')).toBeVisible();
  });

  test('honeypot prevents spam', async ({ page }) => {
    // Fill form including honeypot
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'Test message');
    
    // Fill honeypot field (should be hidden from real users)
    await page.evaluate(() => {
      const honeypot = document.querySelector('input[name="website"]');
      if (honeypot) {
        (honeypot as HTMLInputElement).value = 'spam-value';
      }
    });
    
    await page.click('button[type="submit"]');
    
    // Form should not submit
    await expect(page).toHaveURL('/contact');
  });
});
```

### 3. Accessibility Testing (Advanced)

```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('homepage has no accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('all pages meet WCAG standards', async ({ page }) => {
    const pages = ['/', '/projects', '/blog', '/about', '/contact'];
    
    for (const path of pages) {
      await page.goto(path);
      
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      
      expect(results.violations).toEqual([]);
    }
  });

  test('focus management works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check skip link
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a:has-text("Skip to main content")');
    await expect(skipLink).toBeFocused();
    
    // Activate skip link
    await page.keyboard.press('Enter');
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeFocused();
  });

  test('images have appropriate alt text', async ({ page }) => {
    await page.goto('/projects');
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      
      // Alt text should exist and not be empty
      expect(alt).toBeTruthy();
      expect(alt?.length).toBeGreaterThan(0);
      
      // Alt text shouldn't contain "image" or "picture"
      expect(alt?.toLowerCase()).not.toContain('image of');
      expect(alt?.toLowerCase()).not.toContain('picture of');
    }
  });
});
```

### 4. Visual Regression Testing

```typescript
// tests/visual/visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('homepage appearance', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('dark mode appearance', async ({ page }) => {
    await page.goto('/');
    
    // Toggle dark mode
    await page.click('button[aria-label="Toggle dark mode"]');
    await page.waitForTimeout(300); // Wait for transition
    
    await expect(page).toHaveScreenshot('homepage-dark.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('mobile appearance', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('component states', async ({ page }) => {
    await page.goto('/styleguide');
    
    // Capture button states
    const button = page.locator('button').first();
    
    // Normal state
    await expect(button).toHaveScreenshot('button-normal.png');
    
    // Hover state
    await button.hover();
    await expect(button).toHaveScreenshot('button-hover.png');
    
    // Focus state
    await button.focus();
    await expect(button).toHaveScreenshot('button-focus.png');
  });
});
```

### 5. Performance Testing

```typescript
// tests/performance/lighthouse.spec.ts
import { test, expect } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

test.describe('Performance', () => {
  test('homepage meets performance budgets', async ({ page, browserName }) => {
    // Skip on webkit as Lighthouse doesn't support it
    test.skip(browserName === 'webkit');
    
    await page.goto('/');
    
    const auditResult = await playAudit({
      page,
      thresholds: {
        performance: 95,
        accessibility: 98,
        'best-practices': 95,
        seo: 95
      },
      reports: {
        formats: {
          html: true,
          json: true
        },
        name: `lighthouse-${new Date().getTime()}`
      }
    });
    
    expect(auditResult.lhr.categories.performance.score * 100).toBeGreaterThanOrEqual(95);
  });

  test('measures Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Measure LCP
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });
    
    expect(lcp).toBeLessThan(2500); // Good LCP threshold
    
    // Measure CLS
    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          resolve(clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
        
        // Resolve after page settles
        setTimeout(() => resolve(clsValue), 3000);
      });
    });
    
    expect(cls).toBeLessThan(0.1); // Good CLS threshold
  });
});
```

### 6. Security Testing

```typescript
// tests/security/security.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Security', () => {
  test('security headers are present', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers();
    
    // Check security headers
    expect(headers?.['x-frame-options']).toBe('DENY');
    expect(headers?.['x-content-type-options']).toBe('nosniff');
    expect(headers?.['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers?.['permissions-policy']).toBeDefined();
    
    // Check CSP
    const csp = headers?.['content-security-policy'];
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src 'self'");
  });

  test('no sensitive data exposed', async ({ page }) => {
    await page.goto('/');
    
    // Check page source doesn't contain sensitive data
    const content = await page.content();
    
    // No API keys
    expect(content).not.toContain('api_key');
    expect(content).not.toContain('apiKey');
    expect(content).not.toContain('secret');
    
    // No internal paths
    expect(content).not.toContain('/admin');
    expect(content).not.toContain('localhost');
    
    // No email addresses in source
    expect(content).not.toMatch(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  });

  test('forms have CSRF protection', async ({ page }) => {
    await page.goto('/contact');
    
    // Check for CSRF token
    const csrfToken = await page.locator('input[name="csrf_token"]').count();
    expect(csrfToken).toBeGreaterThan(0);
  });
});
```

## Testing Utilities

### Test Data Generators

```typescript
// tests/utils/test-data.ts
import { faker } from '@faker-js/faker';

export function generateContactFormData() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    message: faker.lorem.paragraphs(2)
  };
}

export function generateBlogPost() {
  return {
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    content: faker.lorem.paragraphs(5),
    tags: faker.helpers.arrayElements(
      ['JavaScript', 'TypeScript', 'React', 'Astro', 'Performance'],
      3
    ),
    date: faker.date.recent()
  };
}

export function generateProject() {
  return {
    title: faker.company.catchPhrase(),
    description: faker.lorem.paragraph(),
    client: faker.company.name(),
    technologies: faker.helpers.arrayElements(
      ['React', 'Vue', 'Astro', 'Node.js', 'PostgreSQL', 'Redis'],
      4
    ),
    duration: faker.helpers.arrayElement(['1 month', '3 months', '6 months'])
  };
}
```

### Browser Testing Helpers

```typescript
// tests/utils/browser-helpers.ts
import { Page } from '@playwright/test';

export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

export async function clearLocalStorage(page: Page) {
  await page.evaluate(() => localStorage.clear());
}

export async function setDarkMode(page: Page, enabled: boolean) {
  await page.evaluate((isDark) => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, enabled);
}

export async function mockAPIResponse(
  page: Page,
  url: string,
  response: any
) {
  await page.route(url, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response)
    });
  });
}

export async function checkNoConsoleErrors(page: Page) {
  const errors: string[] = [];
  
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  return () => {
    if (errors.length > 0) {
      throw new Error(`Console errors found: ${errors.join(', ')}`);
    }
  };
}
```

## Progressive Enhancement Testing

```typescript
// tests/progressive-enhancement.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Progressive Enhancement', () => {
  test('site works without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false
    });
    const page = await context.newPage();
    
    // Test navigation
    await page.goto('/');
    await page.click('a:has-text("Projects")');
    await expect(page).toHaveURL('/projects');
    
    // Test forms still submit
    await page.goto('/contact');
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'Test message');
    await page.click('button[type="submit"]');
    
    // Should navigate to success page or show message
    await expect(page.locator('text=Thank you')).toBeVisible();
    
    await context.close();
  });

  test('CSS handles all animations', async ({ page }) => {
    await page.goto('/');
    
    // Disable JavaScript
    await page.addScriptTag({
      content: `
        // Override any JS animations
        document.querySelectorAll('*').forEach(el => {
          el.style.animation = 'none';
          el.style.transition = 'none';
        });
      `
    });
    
    // Hover effects should still work with CSS
    const button = page.locator('button').first();
    
    // Normal state
    await expect(button).toHaveScreenshot('button-normal.png');
    
    // Hover state
    await button.hover();
    await expect(button).toHaveScreenshot('button-hover.png');
    
    // Focus state
    await button.focus();
    await expect(button).toHaveScreenshot('button-focus.png');
  });
});
```

## CI Integration

```yaml
# .github/workflows/qa.yml
name: Quality Assurance

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [master]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps ${{ matrix.browser }}
        
      - name: Build site
        run: pnpm run build
        
      - name: Run E2E tests
        run: pnpm exec playwright test --project=${{ matrix.browser }}
        
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-results-${{ matrix.browser }}
          path: playwright-report/
          
  accessibility:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Build site
        run: pnpm run build
        
      - name: Run accessibility tests
        run: pnpm run test:a11y
        
      - name: Upload accessibility report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: accessibility-report
          path: a11y-report/
          
  visual-regression:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Build site
        run: pnpm run build
        
      - name: Run visual tests
        run: pnpm run test:visual
        
      - name: Upload visual diffs
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: visual-diffs
          path: test-results/
```
