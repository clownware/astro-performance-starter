---
title: Design System Changelog
description: >-
  Tracks changes and updates to the design system, including tokens, components,
  and styling guidelines.
lastUpdated: true
tableOfContents: true
pagefind: true
---

This document tracks changes and updates specifically to the design system, including tokens, components, and styling guidelines.

## 2025-09-30 - Token System Improvements

### Changed

- **CSS Variable Naming Convention**: All color tokens now use consistent `--color-` prefix following industry standards (Tailwind CSS, Radix UI, shadcn/ui).
  - Base tokens: `--color-gray-500`, `--color-moonstone-600`
  - Semantic tokens: `--color-primary-500`, `--color-background-primary`, `--color-foreground-primary`
  - **Breaking change**: Previous semantic tokens without prefix (e.g., `--primary-100`) now use `--color-primary-100`
  - Updated `build-tokens.ts` and `tailwind.config.ts` to generate consistent naming

### Removed

- **Unused `chocolateCosmos` color**: Removed from `base.json` as it was never referenced in semantic tokens (~1KB bundle reduction)

### Added

- **Documentation**: Added inline comment in `semantic.json` explaining partial semantic scales (success/warning/error only have 100/600/700 values for semantic clarity)

### Technical Details

- `build-tokens.ts` now applies `color-` prefix to all semantic tokens in both CSS and Tailwind outputs
- Dark mode continues to work via `.dark` class overrides in generated CSS
- All existing code already used correct `--color-` prefixed variables, so no breaking changes in components
