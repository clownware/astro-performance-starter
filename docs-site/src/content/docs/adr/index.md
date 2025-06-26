---
title: Architecture Decision Records
description: Technical decisions and rationale behind the Astro Performance Starter architecture
---

# Architecture Decision Records (ADRs)

This section documents the key architectural decisions made in the development of the Astro Performance Starter template. Each ADR explains the context, decision, and consequences of important technical choices.

## About ADRs

Architecture Decision Records help maintain institutional knowledge by documenting:
- **Context**: The situation and forces at play
- **Decision**: What was decided and why  
- **Status**: Current status of the decision
- **Consequences**: Trade-offs and implications

## Template Decisions

- **[000: Starter Decisions](./000-starter-decisions)** - Foundational technology choices and principles
- **[001: Preact Island Usage Policy](./001-preact-island-usage-policy)** - When and how to use interactive islands
- **[002: Future CSS Tooling Considerations](./002-future-css-tooling-considerations)** - CSS architecture and tooling strategy
- **[003: Unified Component Structure](./003-unified-component-structure)** - Component organization patterns
- **[004: Optional Design System Tooling](./004-optional-design-system-tooling)** - Design token and theming approach
- **[005: Link Validation Strategy](./005-link-validation-strategy)** - Ensuring link integrity across the site
- **[006: Documentation Review Cadence](./006-documentation-review-cadence)** - Maintaining documentation quality

## Creating New ADRs

Use the [ADR Template](./template) when documenting new architectural decisions. This ensures consistency and completeness across all decision records.

### When to Create an ADR

Create an ADR for decisions that:
- Are architecturally significant
- Affect multiple components or teams
- Have long-term implications
- Involve trade-offs between alternatives
- Need to be remembered and understood by future developers

## Decision Status

- **Proposed**: Under consideration
- **Accepted**: Decided and implemented
- **Deprecated**: No longer recommended
- **Superseded**: Replaced by a newer decision
