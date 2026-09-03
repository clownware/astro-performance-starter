---
title: Phase 8 - Quality Assurance
lastUpdated: true
description: >-
  Covers test results, bug fixes, accessibility audit, and cross-browser
  validation with Essential, Recommended, and Advanced scope guidance
tableOfContents: true
pagefind: true
sidebar:
  order: 8
---

## Overview

- **Tier**: Build (Phase 8 of 12)
- **Effort**: Varies by scope and testing depth
- **Dependencies**: Phase 0-7 completed
- **Deliverables**: Test results, bug fixes, accessibility audit, cross-browser validation

## Entry Criteria

- [ ] All pages and components built
- [ ] Content populated
- [ ] Images optimized
- [ ] Development feature-complete

## Implementation Steps

| Step | Task | Scope | Notes |
|------|------|-------|-------|
| 8.01 | Manual functionality test | Essential | All user flows |
| 8.02 | Mobile device testing | Essential | Real devices preferred |
| 8.03 | Cross-browser check | Essential | Chrome, Firefox, Safari |
| 8.04 | Accessibility audit | Essential | Browser DevTools; automate with axe-core as Recommended |
| 8.05 | Link validation | Essential | No broken links |
| 8.06 | Form testing | Essential | All inputs/validations |
| 8.07 | Performance check | Essential | Lighthouse audit |
| 8.08 | Fix critical issues | Essential | P0 bugs first; all severity levels as Recommended |
| 8.09 | Automated E2E tests | Recommended | Playwright suite (template ships specs in `e2e/`) |
| 8.10 | Visual regression tests | Advanced | Percy or similar |
| 8.11 | Security audit | Recommended | Headers, CSP, deps |
| 8.12 | SEO validation | Recommended | Technical SEO |
| 8.13 | API testing | Advanced | If applicable |
| 8.14 | Load testing | Advanced | Performance under load |
| 8.15 | Error monitoring | Advanced | Sentry integration |
| 8.16 | Analytics validation | Advanced | Tracking works |
| 8.17 | Progressive enhancement | Recommended | JS disabled testing |
| 8.18 | Unit test suite passing | Essential | Vitest; mandatory per TDD (ADR-037), runs in `quality:ci` |

## Testing Strategies

### 1. Manual Test Checklist (Essential)

```markdown
# Manual QA Checklist

## 🌐 Cross-Browser Testing
- [ ] Chrome (Latest)
- [ ] Firefox (Latest)  
- [ ] Safari (Latest)
- [ ] Edge (Latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## 📱 Responsive Testing
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone 12)
- [ ] 768px (iPad)
- [ ] 1024px (iPad Pro)
- [ ] 1440px (Laptop)
- [ ] 1920px (Desktop)
- [ ] 2560px (Large Display)

## 🔗 Navigation & Links
- [ ] All menu items work
- [ ] Mobile menu functions
- [ ] Footer links valid
- [ ] Social links open in new tab
- [ ] Logo returns to home
- [ ] Skip links work
- [ ] Breadcrumbs accurate

## 📝 Forms & Interactions
- [ ] Contact form submits
- [ ] Validation messages show
- [ ] Success feedback displays
- [ ] Error states handled
- [ ] Required fields enforced
- [ ] Email validation works
- [ ] Honeypot spam protection

## ♿ Accessibility Basics
- [ ] Tab through entire site
- [ ] Focus indicators visible
- [ ] Skip to main content works
- [ ] Images have alt text
- [ ] Headings properly nested
- [ ] Color contrast sufficient
- [ ] Text readable when zoomed 200%

## 🚀 Performance Basics
- [ ] Pages load < 3 seconds
- [ ] Images don't cause layout shift
- [ ] No console errors
- [ ] Fonts load correctly
- [ ] Animations smooth

## 📊 Content & SEO
- [ ] All content displays correctly
- [ ] Meta descriptions present
- [ ] OG images working
- [ ] Sitemap accessible
- [ ] Robots.txt correct
- [ ] 404 page works
- [ ] Canonical URLs set
```

## Bug Tracking

### Bug Report Template

```markdown
# Bug Report

## Summary
[One line description]

## Environment
- **Browser**: [Chrome 120, Firefox 119, etc.]
- **Device**: [Desktop, iPhone 14, etc.]
- **OS**: [macOS 14, Windows 11, etc.]
- **Screen Size**: [1920x1080, 375x667, etc.]

## Steps to Reproduce
1. Go to [URL]
2. Click on [element]
3. Observe [behavior]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Screenshots/Video
[Attach if applicable]

## Severity
- [ ] P0 - Blocker (site unusable)
- [ ] P1 - Critical (major feature broken)
- [ ] P2 - Major (significant issue)
- [ ] P3 - Minor (cosmetic/edge case)

## Additional Context
[Any other relevant information]

## Possible Fix
[If you have ideas on the solution]
```

### Bug Priority Matrix

| Severity | Description | Examples | Fix Timeline |
|----------|-------------|----------|--------------|
| **P0 - Blocker** | Site/feature completely broken | Site doesn't load, forms don't submit, payment broken | Immediate |
| **P1 - Critical** | Major functionality impaired | Navigation broken on mobile, images not loading | Same day |
| **P2 - Major** | Noticeable issues affecting UX | Layout issues, broken links, slow performance | This sprint |
| **P3 - Minor** | Small issues, edge cases | Typos, minor spacing, rare browser issues | Next sprint |

## Common Pitfalls

1. **Testing Only Happy Paths**: Missing edge cases and error states
   - **Solution**: Test validation, errors, empty states, offline

2. **Ignoring Real Devices**: Only testing in DevTools
   - **Solution**: Test on actual phones/tablets with real networks

3. **Skipping Accessibility**: Assuming it's fine without testing
   - **Solution**: Use automated tools AND manual testing

4. **Not Testing Performance**: Only checking functionality
   - **Solution**: Include performance in QA process

5. **Missing Browser Quirks**: Testing only in Chrome
   - **Solution**: Test all major browsers, especially Safari

## Exit Criteria

### Essential (all projects)

- [ ] Manual tests passed (all functionality verified)
- [ ] Mobile testing complete (real devices tested)
- [ ] Cross-browser verified (Chrome, Firefox, Safari)
- [ ] Accessibility checked (manual audit at minimum)
- [ ] Forms working correctly (all validations verified)
- [ ] No broken links (all links validated)
- [ ] Lighthouse CI floors met (`lighthouserc.json` + `lighthouserc.mobile.json`: performance ≥ 0.90, accessibility ≥ 0.95, best-practices ≥ 0.95, SEO ≥ 0.90; 95+ is the measured headline, not the gate)
- [ ] P0 bugs fixed
- [ ] Unit test suite passing (Vitest)

### Recommended (most projects)

- [ ] E2E test suite passing (Playwright, `pnpm run test:e2e`)
- [ ] Automated accessibility tests passing (`pnpm run test:a11y`)
- [ ] Security headers verified (CSP, HSTS in `public/_headers`)
- [ ] SEO validation complete
- [ ] Progressive enhancement tested (JS disabled)
- [ ] All severity levels of bugs triaged and fixed

### Advanced (portfolio/enterprise)

- [ ] Visual regression baseline established
- [ ] Performance budgets enforced in CI (`pnpm run perf:budgets` already runs in `ci.yml`; tighten `budgets.json` for your site)
- [ ] Error monitoring active (Sentry or equivalent — not part of the starter)
- [ ] Load testing completed

## Rollback Strategy

If critical issues found:

1. **Blocking Bugs**:
   - Revert to last known good build
   - Fix in isolation
   - Re-test entire flow

2. **Performance Regression**:
   - Profile to find cause
   - Revert specific changes
   - Re-run performance tests

3. **Accessibility Failures**:
   - Document specific violations
   - Fix with highest priority
   - Re-audit entire site

## AI Assistant Notes

### Key Files to Reference

- `e2e/*` - End-to-end test suites (Playwright `testDir` is `./e2e` at the repo root)
- `playwright.config.ts` - Test configuration
- `e2e/a11y-axe.spec.ts` - axe-core sweep, run with `pnpm run test:a11y`
- `src/**/__tests__/*` - Colocated Vitest unit tests (Astro Container API helper in `src/components/__tests__/_helpers/container.ts`)
- `tests/fixtures/*` - Shared test fixtures (`posts.ts`, `tokens.ts`)
- `lighthouserc.json`, `budgets.json` - Performance thresholds
- Bug tracking templates

### Common Prompts for This Phase

- "Write E2E tests for the contact form flow"
- "Create accessibility test suite"
- "Set up visual regression testing"
- "Debug flaky test failures"

### Context Requirements

- User flows to test
- Browser/device matrix
- Performance thresholds
- Accessibility requirements
