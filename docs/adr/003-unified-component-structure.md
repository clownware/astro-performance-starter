---
title: 'ADR-003: Unified Component Structure and Atomic Design Adherence'
description: >-
  Enforces strict Atomic Design hierarchy for all UI components, preventing
  ad-hoc directory proliferation and maintaining a single organizational system
lastUpdated: 2025-06-10T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

The current `docs/implementation-guides/reference/directory-structure.md` defines a clear Atomic Design methodology for organizing components within the `src/components/` directory. This structure includes subdirectories such as `atoms/`, `molecules/`, `organisms/`, `structural/`, and `mdx/`.

There is a potential for future development phases (e.g., a hypothetical "Phase 5 UI Components" or similar initiatives) to introduce new, potentially overlapping component categorization schemes, such as a `src/components/ui/` directory. This could lead to:

- Developer confusion about where to find or place components.
- Inconsistent import paths and aliases.
- Dilution of the established Atomic Design principles.
- Increased cognitive load when navigating the codebase.

This ADR aims to proactively prevent such fragmentation by reinforcing a unified component structure.

## Decision Drivers

- **Clarity & Consistency**: Maintain a single, unambiguous system for component organization.
- **Developer Experience**: Reduce cognitive load and simplify component discovery and usage.
- **Maintainability**: Ensure consistent import paths and a predictable structure.
- **Architectural Integrity**: Uphold and reinforce the chosen Atomic Design methodology.
- **Scalability**: Provide a clear framework for adding new components as the project grows.

## Considered Options

### Option 1: Allow a new `src/components/ui/` directory for future UI components

- **Pros**: Might seem intuitive for grouping general UI elements introduced in a specific phase.
- **Cons**: Directly conflicts with the Atomic Design principle of categorizing by complexity/granularity. Creates overlap with `atoms/`, `molecules/`, `organisms/`. Leads to the problems outlined in the Context section.

### Option 2: Strictly adhere to the existing Atomic Design subdirectories (`atoms/`, `molecules/`, `organisms/`) for all new UI components. The `structural/` directory remains for layout utilities

- **Pros**: Reinforces the existing, well-defined structure. Ensures all components are categorized by their role and complexity within the Atomic Design system. Avoids ambiguity and folder proliferation.
- **Cons**: Requires developers to consciously apply Atomic Design principles when adding any new component.

## Decision

> **Amendment (2026-08-02):** `src/components/organisms/` has never actually been
> created — `directory-structure.md` lists it as a category created when first
> needed, so "existing" below overstates it (`atoms/`, `molecules/`,
> `structural/`, and `mdx/` exist). The tree has since gained two additional
> sanctioned subdirectories outside this taxonomy: `islands/` for hydrated Preact
> demo components ([ADR-060](./060-showcase-interactive-demo-islands.md)) and
> `a11y/` for accessibility utilities (`SkipLink.astro`).

**Option 2 is chosen.**

All new UI components, regardless of the project phase or feature initiative they belong to, **must** be categorized and placed within the existing `src/components/atoms/`, `src/components/molecules/`, or `src/components/organisms/` subdirectories. The choice of subdirectory should be based on the component's complexity, reusability, and its role in the Atomic Design hierarchy:

- **Atoms**: Basic building blocks (e.g., Button, Input, Label, Icon).
- **Molecules**: Simple groups of atoms functioning together as a unit (e.g., SearchForm (input + button), NavItem (icon + text)).
- **Organisms**: More complex UI components composed of molecules and/or atoms, representing distinct sections of an interface (e.g., Header, ProductCard, ArticleList).

The `src/components/structural/` directory will continue to house layout-specific utility components (e.g., `Container.astro`, `Grid.astro`, `Section.astro`) that define page structure rather than specific UI interactions or appearances.

The `src/components/mdx/` directory is reserved for components specifically designed to be used within MDX content.

No new top-level component categorization folders (e.g., `src/components/ui/`, `src/components/common/`, `src/components/shared/` beyond the established atomic categories) should be created within `src/components/` without a subsequent ADR that explicitly justifies the need and defines its scope in relation to the Atomic Design principles.

## Consequences

### Positive

- Maintains a clear, consistent, and predictable component architecture
- Reduces the likelihood of duplicated or misplaced components
- Strengthens the adoption and understanding of Atomic Design across the development team

### Negative

- Requires developers to consciously apply Atomic Design principles when adding any new component
- May require judgment calls on borderline atom/molecule/organism classification

### Neutral

- Developers must be familiar with Atomic Design principles to correctly categorize new components
- Any future documentation for phases that introduce UI components (e.g., "Phase 5 UI Components") must explicitly instruct developers to follow this established Atomic Design structure
- The `docs/implementation-guides/reference/directory-structure.md` should be considered the primary source of truth for component organization and may need minor clarifications to reinforce this decision if any ambiguity is found

## Validation

- Code reviews will enforce the correct placement of new components according to this ADR.
- The `directory-structure.md` document will be periodically reviewed against this ADR to ensure alignment.
- Automated linting or tree-shaking analysis might indirectly highlight misplaced or poorly categorized components if they lead to import issues or bundling inefficiencies, though this is not a direct validation of categorization itself.

## References

- [Atomic Design by Brad Frost](https://atomicdesign.bradfrost.com/)
- Internal: `docs/implementation-guides/reference/directory-structure.md`

---
**Date**: 2025-06-10\
**Participants**: Template maintainers\
**Outcome**: Accepted
