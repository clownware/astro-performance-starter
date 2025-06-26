---
title: "\U0001F4DA Documentation Hub"
version: 1.0.0
lastUpdated: 2025-06-10T00:00:00.000Z
description: Central hub for all documentation related to the Astro Performance Starter.
---
> Canonical documentation entry point is the **root [`README.md`](../README.md`)** of this repository.
>
> This stub exists to avoid 404s and duplicate sources of truth. Please navigate to the root README for the latest quick-links, roadmap and contribution guidelines.

---

For a deep dive into phase-by-phase guides, browse the `implementation-guides/` directory or open the [Implementation Roadmap](./ROADMAP.md).

> Your guide to understanding and extending the Astro Performance Starter

## Quick Navigation

### 🚀 Getting Started
- **[Onboarding Guide](../ONBOARDING.md)** - Start here if you're new
- **[Quick Track: Deploy Your First Site](./quick-track-deploy.md)** - The fastest path to a live, personalized site (minimal changes needed!)
- **[Implementation Roadmap](./ROADMAP.md)** - Comprehensive phase-by-phase development path for a deep dive
- **[Track Comparison](./implementation-guides/tracks/track-comparison.md)** - MVP vs Showcase decision guide

### 📖 Implementation Guides

## 🗺️ Implementation Roadmap {#implementation-roadmap}

> **Quick Navigation**: Direct links to each implementation phase in order

### Foundation (Days 1-4)
These phases establish immutable decisions that are costly to change later.

1. **[Phase 0: Foundation](./implementation-guides/01-foundation-phase-0-foundation.md)** ⏱️ 1 day  
   Set up repository, choose core technologies, establish development environment

2. **[Phase 1: Content Architecture](./implementation-guides/01-foundation-phase-1-content-arch.md)** ⏱️ 1-2 days  
   Design content schema, URL structure, establish TypeScript types

3. **[Phase 2: Design System](./implementation-guides/01-foundation-phase-2-design-system.md)** ⏱️ 1-2 days  
   Create design tokens, configure Tailwind, set up dark mode

4. **[Phase 3: Tooling](./implementation-guides/01-foundation-phase-3-tooling.md)** ⏱️ 1 day  
   Configure linting, formatting, CI pipeline, quality gates

### Structure (Days 5-10)
Build the application skeleton and component library.

5. **[Phase 4: Skeleton](./implementation-guides/02-structure-phase-4-skeleton.md)** ⏱️ 2-3 days  
   Create layouts, routing, navigation, SEO metadata

6. **[Phase 5: Components](./implementation-guides/02-structure-phase-5-components.md)** ⏱️ 2-4 days  
   Build UI component library (MVP: essential only, Showcase: full library)

7. **[Phase 6: Sections](./implementation-guides/02-structure-phase-6-sections.md)** ⏱️ 2-3 days  
   Compose page sections from components

### Implementation (Days 11-15)
Create content and ensure quality.

8. **[Phase 7: Content](./implementation-guides/03-content-phase-7-content.md)** ⏱️ 3-5 days  
   Author content, optimize images, populate site

9. **[Phase 8: QA](./implementation-guides/04-quality-phase-8-qa.md)** ⏱️ 1-3 days  
   Test functionality, accessibility, cross-browser

10. **[Phase 9: Performance](./implementation-guides/04-quality-phase-9-performance.md)** ⏱️ 1-2 days  
    Optimize for Core Web Vitals, enforce budgets

### Deployment (Days 16-18)
Ship to production and establish maintenance.

11. **[Phase 10: Deployment](./implementation-guides/05-deployment-phase-10-deployment.md)** ⏱️ 1 day  
    Deploy to hosting, configure CDN, set up monitoring

12. **[Phase 11: Documentation](./implementation-guides/05-deployment-phase-11-documentation.md)** ⏱️ 1-2 days  
    Document architecture, components, maintenance procedures

13. **[Phase 12: Post-Launch](./implementation-guides/05-deployment-phase-12-post-launch.md)** ⏱️ 1 day  
    Establish monitoring, feedback loops, iteration plan

### Progress Tracking

> This checklist is automatically updated based on the `status: complete` frontmatter in each phase guide.

<!-- ROADMAP_STATUS_START -->
<!-- The script will automatically update this section. Do not manually edit. -->
- [ ] Phase 0: Foundation
- [ ] Phase 1: Content Architecture
- [ ] Phase 2: Design System
- [ ] Phase 3: Tooling
- [ ] Phase 4: Skeleton
- [ ] Phase 5: Components
- [ ] Phase 6: Sections
- [ ] Phase 7: Content
- [ ] Phase 8: QA
- [ ] Phase 9: Performance
- [ ] Phase 10: Deployment
- [ ] Phase 11: Documentation
- [ ] Phase 12: Post-Launch
<!-- ROADMAP_STATUS_END -->

### 🏗️ Architecture & Patterns

#### Core Documentation
- **[Technology Stack](./implementation-guides/00-overview-tech-stack.md)** - Why we chose these tools
- **[Performance Budgets](./implementation-guides/00-overview-budgets-guardrails.md)** - Quality gates and metrics
- **[Directory Structure](./implementation-guides/00-overview-directory-structure.md)** - Project organization

#### Design Patterns
- **[Islands Architecture](./implementation-guides/patterns/islands-architecture.md)** - When to add JavaScript
- **[Component Patterns](./implementation-guides/patterns/component-patterns.md)** - Reusable UI patterns
- **[Performance Patterns](./implementation-guides/patterns/performance-patterns.md)** - Optimization techniques
- **[Content Collections](./implementation-guides/patterns/content-collections.md)** - Advanced content patterns

### 🤖 AI & Automation
- **[AI Context Index](./implementation-guides/ai-context/INDEX.md)** - For AI assistants
- **[Prompt Templates](./implementation-guides/ai-context/prompt-templates.md)** - Common AI prompts
- **[Context Maintenance](./implementation-guides/ai-context/context-updates.md)** - Keeping AI context current

### 📋 Architecture Decisions
- **[ADR Template](./adr/template.md)** - How to document decisions
- **[ADR-000: Starter Decisions](./adr/000-starter-decisions.md)** - Initial architecture choices
- **[ADR-005: Link Validation Strategy](./adr/005-link-validation-strategy.md)** - Build-time link validation
- **[ADR-006: Documentation Review Cadence](./adr/006-documentation-review-cadence.md)** - Automated review date tracking

### 🔗 Migration Guides
- **[Link Migration Guide](./LINK-MIGRATION-GUIDE.md)** - Converting relative links to validated references
- **[Documentation Review Cadence](./DOCUMENTATION-REVIEW-CADENCE.md)** - Review date system and CI enforcement

## Document Types

### Implementation Guides
Step-by-step instructions for building each phase of the project. Each guide includes:
- Overview and dependencies
- Entry/exit criteria
- Code examples
- Common pitfalls
- Rollback strategies

### Pattern Documentation
Reusable solutions to common problems:
- When to use the pattern
- Implementation examples
- Performance considerations
- Accessibility notes

### Architecture Decision Records (ADRs)
Documenting important technical decisions:
- Context and problem statement
- Considered options
- Decision and rationale
- Consequences

## How to Use This Documentation

This documentation is structured in two layers to cater to different needs:

*   **Quick Track**: For users who want to deploy a personalized site as quickly as possible with minimal changes, start with the **[Quick Track: Deploy Your First Site](./quick-track-deploy.md)** guide.
*   **Comprehensive Guides**: For a deep understanding, feature-rich customization, or contributing to the starter's development, follow the full [Implementation Roadmap](./ROADMAP.md) and its detailed phase guides.

### For New Projects
1. Start with the [Onboarding Guide](../ONBOARDING.md)
2. Choose your track (MVP or Showcase)
3. Follow the [Implementation Roadmap](./ROADMAP.md) phase by phase
4. Reference pattern guides as needed

### For Existing Projects
1. Find your current phase in the roadmap
2. Use relevant pattern guides for specific features
3. Check ADRs for architectural guidance
4. Update documentation as you make changes

### For AI Assistants
1. Start with the [AI Context Index](./implementation-guides/ai-context/INDEX.md)
2. Reference specific phase guides as needed
3. Use prompt templates for consistency
4. Keep context updated with changes

## Contributing to Documentation

See our [Contributing Guide](../CONTRIBUTING.md) for:
- Documentation standards
- How to add new patterns
- Creating ADRs
- Updating AI context

## Quick Reference

### File Naming Conventions
- `phase-X-name.md` - Implementation phases
- `pattern-name.md` - Reusable patterns
- `ADR-XXX-title.md` - Architecture decisions
- `README.md` - Section overviews

### Markdown Standards
- Use ATX headings (`#` not underlines)
- Include code examples with language tags
- Add tables for comparisons
- Use task lists for checklists

### Cross-References
- Use relative links between documents
- Include section anchors for deep linking
- Maintain link integrity when moving files

---

*Questions? Check our [FAQ](./FAQ.md) or open a [Discussion](#) <!-- TODO: Update GitHub Discussions link -->*
