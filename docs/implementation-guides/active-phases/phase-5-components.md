---
title: Phase 5 - UI Component Library
lastUpdated: true
description: >-
  Details development of reusable UI components, documentation, and
  accessibility patterns with Essential, Recommended, and Advanced scope guidance
tableOfContents: true
pagefind: true
sidebar:
  order: 5
---

## Overview

- **Tier**: Build (Phase 5 of 12)
- **Duration**: 2-4 days
- **Dependencies**: Phase 0-4 completed
- **Deliverables**: Reusable UI components, component documentation, accessibility patterns

## Entry Criteria

- [ ] Design system tokens available
- [ ] Skeleton layout functional
- [ ] TypeScript configured
- [ ] Tailwind CSS working

## Implementation Steps

| Step | Task | Scope | Notes |
|------|------|-------|-------|
| 5.01 | Build Button component | Essential | Primary, secondary, ghost variants |
| 5.02 | Create Card component | Essential | For content display |
| 5.03 | Build Section wrapper | Essential | Consistent spacing |
| 5.04 | Create Container component | Essential | Responsive widths |
| 5.05 | Document Link Component | Essential | Create tutorial guide |
| 5.06 | Build Image component | Essential | Wrapper for Astro Image |
| 5.07 | Create basic Badge | Essential | For tags/labels |
| 5.08 | Add Grid component | Essential | Responsive layouts |
| 5.09 | Extend `/showcase` style guide | Advanced | Component documentation (ADR-049) |
| 5.10 | Create Input components | Recommended | Forms, validation |
| 5.11 | Build Modal component | Recommended | Accessible dialogs |
| 5.12 | Add Tooltip component | Advanced | Hover information |
| 5.13 | Create Tabs component | Recommended | Content organization |
| 5.14 | Build Accordion | Recommended | Collapsible content |
| 5.15 | Add Loading states | Advanced | Skeletons, spinners |
| 5.16 | Create Alert component | Recommended | User feedback |
| 5.17 | Build Pagination | Recommended | List navigation |

## Component Management Strategy

Components are organised by **atomic design** (ADR-003): `src/components/{atoms,molecules,structural,islands,a11y,mdx}/`. Build Essential components first; add Recommended and Advanced components as your project scope requires. There is no separate file per scope level — a single component file is extended with additional props and variants as needed.

### Component Scope Reference

| Component | Scope | Notes |
|---|---|---|
| Button | Essential | Start with primary/secondary; add ghost/destructive variants as needed |
| Card | Essential | Extended with additional props for richer layouts |
| Section | Essential | Shared spacing wrapper |
| Container | Essential | Responsive width constraints |
| Image | Essential | Wrapper for Astro's `<Image>` component |
| Badge | Essential | Add color variants incrementally |
| Grid | Essential | Responsive layout utility |
| Input | Recommended | Add when contact form or search is needed |
| Modal | Recommended | Accessible dialog with focus trap |
| Accordion | Recommended | Collapsible content sections |
| Tabs | Recommended | Content organization |
| Alert | Recommended | User feedback messages |
| Pagination | Recommended | List navigation for blog/projects |
| Tooltip | Advanced | Add only if UX requires it |
| Loading states | Advanced | Skeletons/spinners for island components |

## Common Pitfalls

1. **Over-engineering**: Creating complex components too early
   - **Solution**: Start simple, enhance iteratively

2. **Missing Accessibility**: Forgetting ARIA labels, keyboard nav
   - **Solution**: Test with keyboard and screen readers

3. **Prop Drilling**: Too many component props
   - **Solution**: Use composition over configuration

4. **Style Conflicts**: Tailwind classes overriding each other
   - **Solution**: Use consistent ordering, avoid arbitrary values

## Exit Criteria

### Essential (all projects)

- [ ] Core components built (Button, Card, Section, Container, Image, Badge, Grid)
- [ ] All components accessible (keyboard nav, ARIA labels)
- [ ] TypeScript interfaces defined for all props
- [ ] Components render correctly at all breakpoints

### Recommended (most projects)

- [ ] Form input components built
- [ ] Interactive components (Modal, Accordion, Tabs) implemented where needed
- [ ] Component usage documented in phase guide or README

### Advanced (portfolio/enterprise)

- [ ] `/showcase` style guide extended with your components (ADR-049)
- [ ] Visual regression baseline established
- [ ] All interactive components have automated accessibility tests

## Rollback Strategy

If components need major refactoring:

1. **Component API Changes**:
   - Keep old version temporarily
   - Add deprecation warnings
   - Migrate usage gradually

2. **Style System Changes**:
   - Use CSS variables for migration
   - Test in isolated pages
   - Update documentation

3. **Breaking Changes**:
   - Version components (v1, v2)
   - Provide migration guide
   - Update in phases

## AI Assistant Notes

### Key Files to Reference

- `src/components/{atoms,molecules,structural,islands,a11y,mdx}/*` - Component library (atomic design, ADR-003)
- `src/pages/showcase.astro` - Living style guide / component catalog (ADR-049)
- Component usage in pages

### Common Prompts for This Phase

- "Create accessible button component with variants"
- "Build responsive grid system with Tailwind"
- "Extend the /showcase style guide with a new component section"
- "Create modal with focus trap and ARIA"

### Context Requirements

- Design system tokens
- Component requirements
- Accessibility standards
- Browser support targets
