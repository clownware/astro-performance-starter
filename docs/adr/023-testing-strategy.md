---
title: 'ADR-023: Testing Strategy and Coverage Targets'
lastUpdated: 2025-11-15T00:00:00.000Z
description: Defines testing philosophy, coverage targets, and test data management
tableOfContents: true
pagefind: true
---

# ADR-023: Testing Strategy and Coverage Targets

## Status

Proposed

## Context

The Astro starter template currently has some E2E tests (Playwright) but lacks a comprehensive testing strategy. We need to define:

- **Testing pyramid**: Balance of unit, integration, and E2E tests
- **Coverage targets**: What percentage of code should be tested
- **Test data management**: How to create and maintain test fixtures
- **Performance testing**: How to validate performance budgets
- **Accessibility testing**: How to ensure WCAG compliance

## Decision Drivers

- **Quality**: Catch bugs before production
- **Confidence**: Safe refactoring and feature additions
- **Performance**: Tests should run fast (< 5 minutes)
- **Maintainability**: Tests should be easy to update
- **Cost**: Balance test coverage with development velocity

## Considered Options

### Option 1: E2E Only (Current State)

**Description**: Only Playwright E2E tests, no unit tests

**Pros**:

- Tests real user flows
- Catches integration issues
- Simple test setup

**Cons**:

- Slow (seconds per test)
- Flaky (network, timing issues)
- Hard to test edge cases
- No coverage for build scripts

### Option 2: Full Testing Pyramid

**Description**: Unit (70%), Integration (20%), E2E (10%)

**Pros**:

- Fast feedback (unit tests run in ms)
- High coverage of edge cases
- Easy to debug failures
- Tests all layers

**Cons**:

- More tests to maintain
- Requires mocking/stubbing
- Higher initial investment

### Option 3: Hybrid Approach

**Description**: Unit tests for critical logic, E2E for user flows

**Pros**:

- Balanced coverage and speed
- Focus on high-value tests
- Pragmatic for small teams

**Cons**:

- Requires judgment calls
- May miss some edge cases

## Decision

We will implement **Option 3 (Hybrid Approach)** with the following strategy:

### 1. Testing Pyramid

```
        /\
       /  \     E2E (10%)
      /____\    - Critical user flows
     /      \   - Cross-browser testing
    /        \  
   /__________\ Integration (20%)
  /            \ - Component integration
 /              \ - Content collection queries
/________________\ Unit (70%)
                   - Utility functions
                   - Data transformations
                   - Build scripts
```

### 2. Coverage Targets

| Layer | Target | Tools |
|-------|--------|-------|
| **Unit** | 80% | Vitest |
| **Integration** | 60% | Vitest + Astro test utils |
| **E2E** | Critical paths | Playwright |
| **Performance** | 100% of budgets | Lighthouse CI |
| **Accessibility** | 100% of pages | axe-core |

### 3. What to Test

#### Unit Tests (Vitest)

```typescript
// ✅ Utility functions
describe('formatDate', () => {
  it('formats date with reading time', () => {
    const result = formatDate(new Date('2024-01-01'), 'Hello world');
    expect(result).toContain('1 min read');
  });
  
  it('handles null updated date', () => {
    const result = formatDate(new Date('2024-01-01'), 'content', null);
    expect(result).not.toContain('Updated');
  });
});

// ✅ Data transformations
describe('sortPosts', () => {
  it('sorts posts by date descending', () => {
    const posts = [
      { data: { date: new Date('2024-01-01') } },
      { data: { date: new Date('2024-01-02') } },
    ];
    const sorted = sortPosts(posts);
    expect(sorted[0].data.date).toEqual(new Date('2024-01-02'));
  });
});

// ✅ Build scripts
describe('validateContrast', () => {
  it('fails on low contrast', () => {
    const tokens = [
      { fg: '#ffffff', bg: '#eeeeee' }, // 1.2:1 contrast
    ];
    expect(() => validateContrast(tokens)).toThrow('Contrast ratio');
  });
});
```

#### Integration Tests (Vitest + Astro)

```typescript
// ✅ Content collection queries
describe('getBlogPosts', () => {
  it('returns sorted published posts', async () => {
    const posts = await getBlogPosts();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0].data.date).toBeInstanceOf(Date);
  });
  
  it('excludes draft posts in production', async () => {
    process.env.NODE_ENV = 'production';
    const posts = await getBlogPosts();
    expect(posts.every(p => !p.data.draft)).toBe(true);
  });
});

// ✅ Component rendering
describe('Card component', () => {
  it('renders with title and description', () => {
    const result = render(Card, {
      props: { title: 'Test', description: 'Description' },
    });
    expect(result.html).toContain('Test');
    expect(result.html).toContain('Description');
  });
});
```

#### E2E Tests (Playwright)

```typescript
// ✅ Critical user flows
test('user can navigate blog', async ({ page }) => {
  await page.goto('/blog');
  
  // Click first post
  await page.click('article:first-child a');
  await expect(page).toHaveURL(/\/blog\/.+/);
  
  // Navigate to next post
  await page.click('text=Next Post');
  await expect(page).toHaveURL(/\/blog\/.+/);
});

// ✅ Form submissions
test('user can submit contact form', async ({ page }) => {
  await page.goto('/contact');
  
  await page.fill('#email', 'test@example.com');
  await page.fill('#message', 'Test message');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/thank-you');
});

// ✅ Accessibility
test('homepage is accessible', async ({ page }) => {
  await page.goto('/');
  
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

### 4. Performance Testing

```typescript
// lighthouse-ci.config.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4321/', 'http://localhost:4321/blog'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.98 }],
        'categories:best-practices': ['error', { minScore: 1.0 }],
        'categories:seo': ['error', { minScore: 1.0 }],
      },
    },
  },
};
```

### 5. Test Data Management

```typescript
// tests/fixtures/posts.ts
export const mockPost = {
  id: 'test-post',
  slug: 'test-post',
  body: 'Test content',
  collection: 'blog',
  data: {
    title: 'Test Post',
    description: 'Test description',
    date: new Date('2024-01-01'),
    tags: ['test'],
    draft: false,
  },
};

// tests/fixtures/tokens.ts
export const mockTokens = {
  colors: {
    primary: { value: '#3b82f6' },
    background: { value: '#ffffff' },
  },
};
```

### 6. CI Integration

```yaml
# .github/workflows/ci.yml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    
    # Unit + Integration tests
    - run: pnpm test:unit
    
    # E2E tests
    - run: pnpm test:e2e
    
    # Performance tests
    - run: pnpm test:perf
    
    # Coverage report
    - uses: codecov/codecov-action@v3
      with:
        files: ./coverage/coverage-final.json
```

## Consequences

### Positive

- **Fast feedback**: Unit tests run in < 1 second
- **High confidence**: 80% coverage catches most bugs
- **Maintainable**: Tests are focused and easy to update
- **Performance**: Automated budget validation
- **Accessibility**: Automated WCAG compliance checks

### Negative

- **Initial investment**: Writing tests takes time
- **Maintenance**: Tests need updates when code changes
- **Mocking**: Some tests require mocking (complexity)

### Neutral

- **Test count**: ~100-200 tests for full coverage
- **CI time**: ~5 minutes for full test suite

## Validation

- **Coverage**: Run `pnpm test:coverage` to check targets
- **Performance**: Lighthouse CI fails if budgets exceeded
- **Accessibility**: axe-core reports violations
- **Flakiness**: E2E tests should pass 99% of the time

## Implementation Checklist

- [ ] Set up Vitest for unit tests
- [ ] Add test scripts to `package.json`
- [ ] Create test fixtures in `tests/fixtures/`
- [ ] Write unit tests for utilities (`src/utils/`)
- [ ] Write integration tests for content collections
- [ ] Add Lighthouse CI configuration
- [ ] Add axe-core to Playwright tests
- [ ] Configure code coverage reporting
- [ ] Document testing patterns in CONTRIBUTING.md

## References

- [Testing Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [axe-core](https://github.com/dequelabs/axe-core)

## Related ADRs

- ADR-000: Starter Decisions (performance budgets)
- ADR-019: Accessibility Patterns (WCAG compliance)
- ADR-020: Page Performance Patterns (performance testing)

---

**Date**: 2025-11-15  
**Participants**: Development Team  
**Outcome**: Proposed
