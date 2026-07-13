---
title: 'ADR-002: Future CSS Tooling Considerations (UnoCSS/Plugins)'
lastUpdated: 2025-06-10T00:00:00.000Z
description: >-
  A note on potential future exploration of UnoCSS or advanced Tailwind plugins
  for specific CSS needs
tableOfContents: true
pagefind: true
---
## Status

Superseded by [ADR-025: Tailwind CSS v4 Migration Strategy](./025-tailwind-v4-migration-strategy.md)

## Context

The project currently utilizes Tailwind CSS 3.x, which provides a comprehensive utility-first CSS framework and integrates with our design token system. This ADR serves as a backlog item to note potential future CSS tooling enhancements that could be considered if specific needs arise, such as:

- **Per-component tokens**: More granular token scoping directly within component definitions
- **Design-system-driven class extraction**: Automating the generation of CSS classes based on design system usage
- **Build time optimization**: Leveraging on-demand CSS engines to potentially reduce build times for very large projects

This is **not an urgent requirement** nor a proposal to change the current CSS tooling immediately. Tailwind CSS 3.x is the established choice for this project.

## Decision Drivers

- **Build Performance**: Very large projects may see slower builds with utility-first CSS
- **Token Granularity**: Current design token system may need per-component scoping as the system grows
- **Ecosystem Evolution**: CSS tooling landscape is evolving rapidly (UnoCSS, Lightning CSS, etc.)

## Considered Options

### Option 1: Stay with Tailwind CSS 3.x (Current)

**Description**: Continue using the current Tailwind CSS setup with no changes

**Pros**:

- Proven, stable, well-documented
- Already integrated with design token system
- Large ecosystem of plugins and community support

**Cons**:

- May encounter build performance limits at scale
- Per-component token scoping is limited

### Option 2: UnoCSS

**Description**: An on-demand atomic CSS engine that offers high customizability and performance

**Pros**:

- On-demand generation may improve build speed
- Highly customizable and flexible configuration
- Compatible with Tailwind-like syntax via presets

**Cons**:

- Smaller ecosystem than Tailwind
- Migration effort from existing Tailwind setup
- Less mature tooling and IDE support

### Option 3: Advanced Tailwind CSS Plugins

**Description**: Develop or adopt custom Tailwind plugins for more sophisticated token management or class extraction

**Pros**:

- No framework migration required
- Builds on existing Tailwind knowledge
- Incremental adoption possible

**Cons**:

- Custom plugin maintenance burden
- May not address fundamental build performance concerns

## Decision

No immediate action. This ADR is recorded for the backlog to be revisited if the project scales significantly or specific limitations in the current CSS workflow become apparent. Re-evaluate if:

- Build performance with a very large number of utilities degrades noticeably
- A strong need for per-component token scoping or class extraction emerges that cannot be efficiently addressed with current tooling
- The Tailwind CSS ecosystem introduces breaking changes during a major version upgrade

## Consequences

### Positive

- No disruption to current workflows
- Decision is documented for future reference, preventing ad-hoc tooling changes

### Negative

- Potential build performance issues are deferred rather than proactively addressed

### Neutral

- This ADR will be revisited during quarterly documentation reviews (see ADR-006)

## Validation

- **Trigger Criteria**: Re-evaluate if Tailwind build time exceeds 30 seconds for a full build
- **Review Cadence**: Quarterly, aligned with ADR-006 documentation review schedule

## References

- [UnoCSS Documentation](https://unocss.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [ADR-000: Starter Template Architecture](/adr/000-starter-decisions/) - Foundation decisions
- [ADR-006: Documentation Review Cadence](/adr/006-documentation-review-cadence/) - Review schedule

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-062). The original record above is unmodified. -->

Not enforced — this record's status is **Superseded**; only Accepted ADRs are binding
(see the status table in the ADR README and ADR-039).

---
**Date**: 2025-06-10\
**Participants**: Template maintainers\
**Outcome**: Superseded by ADR-025
