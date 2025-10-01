---
title: Testing Coverage Report
description: Comprehensive testing coverage for the Astro Performance Starter template
lastUpdated: true
pagefind: true
---

# Testing Coverage Report

This document outlines the testing strategy and coverage for the Astro Performance Starter template.

## Overview

The template now includes comprehensive testing coverage using:

- **Vitest** for unit tests and component structure validation
- **Playwright** for end-to-end (E2E) testing across browsers
- **@axe-core/playwright** for automated accessibility testing

## Test Files Created

### E2E Tests (Playwright)

#### `/e2e/index.spec.ts`

Tests for the homepage (`src/pages/index.astro`):

- ✅ Page load and title verification
- ✅ Hero section with main heading and CTAs
- ✅ GitHub and documentation links
- ✅ Lighthouse metrics display
- ✅ Key features section with expandable cards
- ✅ Tech stack with accurate versions (including Sharp v0.34.x)
- ✅ Implementation tracks (MVP & Showcase)
- ✅ CTA section with action buttons
- ✅ Real-world results disclaimer
- ✅ Scroll indicator
- ✅ Accessibility requirements (`@a11y` tag):
  - ✅ Lang attribute validation
  - ✅ Semantic lists with proper ARIA labels
  - ✅ Lighthouse metrics with ARIA labels
  - ✅ Expandable cards with `aria-label` and `role="region"`
  - ✅ Keyboard navigation on expandable cards
  - ✅ Decorative icons marked `aria-hidden="true"`
- ✅ Semantic HTML structure

#### `/e2e/blog.spec.ts`

Tests for blog pages (`src/pages/blog/index.astro` and `BlogLayout.astro`):

- ✅ Blog index page load and structure
- ✅ Featured posts section (when available)
- ✅ All posts section with cards
- ✅ Post metadata display
- ✅ Pagination controls
- ✅ Individual blog post layout
- ✅ Breadcrumb navigation
- ✅ Table of contents (when available)
- ✅ Social sharing buttons
- ✅ Post navigation (prev/next)
- ✅ Accessibility structure

#### `/e2e/about.spec.ts`

Tests for about page (`src/pages/about.astro`):

- ✅ Page load and hero section
- ✅ Profile image display
- ✅ Bio section
- ✅ Skills & technologies badges
- ✅ Experience timeline
- ✅ Social links section
- ✅ CTA with contact button
- ✅ Resume download link with proper security attributes
- ✅ Semantic structure and accessibility

#### `/e2e/contact.spec.ts`

Tests for contact page (`src/pages/contact.astro`):

- ✅ Page load and hero section
- ✅ Contact form display
- ✅ Alternative contact methods (email, phone, chat)
- ✅ Social media links
- ✅ Location and availability info
- ✅ Response expectations section
- ✅ Privacy policy notice
- ✅ Accessible form labels
- ✅ External link security attributes

### Unit Tests (Vitest)

#### `/src/pages/__tests__/index.test.ts`

Unit tests for homepage data structures:

- ✅ Feature data structure validation
- ✅ Tech stack with accurate versions (Sharp v0.34.x)
- ✅ Lighthouse metrics structure
- ✅ Tech term definitions
- ✅ External links structure
- ✅ Disclaimer content
- ✅ HTML structure validation
- ✅ Aria-labels for accessibility

## Configuration Files

### `/playwright.config.ts`

Playwright configuration with:

- Cross-browser testing (Chromium, Firefox, WebKit)
- Base URL configuration for local development
- CI/CD optimizations
- Automatic web server startup
- Trace on first retry for debugging

## Running Tests

### Unit Tests

```bash
# Run all unit tests
pnpm run test:unit

# Run tests in watch mode
pnpm run test

# Run with coverage
pnpm run test -- --coverage
```

### E2E Tests

```bash
# Run all E2E tests
pnpm run test:e2e

# Run with UI mode (interactive)
pnpm run test:e2e:ui

# Run accessibility tests only
pnpm run test:a11y
```

## Best Practices Compliance

### ✅ Resolved Issues

1. **Version Placeholders**

   - ✅ Updated Sharp version from `v0.x` to `v0.34.x` in `index.astro`
   - All other versions are accurate and match `package.json`

2. **Testing Coverage**

   - ✅ Vitest tests for component structure validation
   - ✅ Playwright E2E tests for all major pages
   - ✅ Accessibility tests with `@a11y` tag

3. **ADR Alignment**

   - ✅ No JavaScript added (zero-JS baseline maintained)
   - ✅ Follows ADR 001 Preact Island Usage Policy
   - ✅ Disclaimer about real-world results present

### ✅ Already Compliant

1. **Prefetch/Preload Performance**

   - `@astrojs/prefetch` integration enabled globally
   - Internal links automatically prefetched
   - External links handled appropriately (can't be prefetched)

2. **External Links**

   - GitHub links: `https://github.com/clownware/astro-starter-template`
   - Documentation links: `https://astro.clownware.org/*`
   - Social links with proper security attributes where needed

## Accessibility Testing

All E2E test files include `@a11y` tagged tests that verify:

- Proper semantic HTML structure
- ARIA labels and landmarks
- Heading hierarchy (single h1, proper nesting)
- Keyboard navigation
- Screen reader compatibility

Run accessibility tests specifically:

```bash
pnpm run test:a11y
```

## CI/CD Integration

Tests are configured to run in CI/CD pipelines:

- Automatic retries on failure (2 retries in CI)
- Single worker in CI for stability
- HTML reporter for test results
- Trace capture on first retry for debugging

## Coverage Gaps & Future Improvements

### Recommended Additions

1. **Projects Pages**
   - Add E2E tests for `/projects/` index and detail pages
   - Test project card interactions and navigation

2. **Error Pages**
   - Add tests for 404 and 500 error pages
   - Verify proper error handling and user guidance

3. **Component Unit Tests**
   - Add tests for atomic components (Button, Badge, Card)
   - Test component props and variants

4. **Performance Testing**
   - Add Lighthouse CI integration
   - Monitor Core Web Vitals in tests
   - Verify performance budgets

5. **Visual Regression Testing**
   - Consider adding Playwright screenshot comparison
   - Test responsive design breakpoints

## Test Maintenance

### When to Update Tests

- **New Features**: Add corresponding tests before or during implementation
- **Bug Fixes**: Add regression tests to prevent reoccurrence
- **Content Changes**: Update test selectors if content structure changes
- **Version Updates**: Update version checks when dependencies are upgraded

### Test Naming Convention

- Use descriptive test names: `should display hero section with main heading`
- Group related tests with `describe` blocks
- Tag accessibility tests with `@a11y`
- Use `test.skip()` for temporarily disabled tests (with comments)

## Performance Benchmarks

Expected test execution times:

- Unit tests: < 5 seconds
- E2E tests (single browser): < 2 minutes
- E2E tests (all browsers): < 5 minutes
- Accessibility tests: < 1 minute

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Axe Accessibility Testing](https://github.com/dequelabs/axe-core)
- [Testing Best Practices ADR](../adr/001-preact-island-usage-policy.md)

## Summary

The Astro Performance Starter now has comprehensive testing coverage that ensures:

- ✅ All major pages are tested end-to-end
- ✅ Component structures are validated
- ✅ Accessibility standards are enforced
- ✅ Version information is accurate
- ✅ ADR compliance is maintained
- ✅ Zero-JS baseline is preserved

Run `pnpm run test:unit && pnpm run test:e2e` to execute the full test suite.
