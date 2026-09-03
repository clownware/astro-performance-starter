---
title: Documentation — Reference & AI Context
lastUpdated: 2026-02-22T00:00:00.000Z
description: >-
  Reference documentation and AI assistant context for the Astro Performance
  Starter. Serves both Starlight rendering and filesystem-based AI context.
tableOfContents: true
pagefind: true
---

This directory contains reference documentation that serves two purposes:

1. **Rendered documentation** via Starlight (if you deploy a separate docs site)
2. **AI assistant context** read directly from the filesystem by IDE-integrated AI tools (Claude Code, Cursor, VS Code Copilot)

See [ADR-034](/adr/034-dual-purpose-docs-strategy/) for the rationale behind this dual-purpose approach.

## For Template Users

You don't need to modify these files to use the template. They provide architectural context and implementation guidance. If you're customizing the template for your own project, you may want to:

- Update ADRs to reflect your own architectural decisions
- Modify implementation guides to match your project scope
- Keep the AI context index current for your AI-assisted workflow

## For Contributors

- **ADRs** go in `docs/adr/` following the template in `docs/adr/template.md`
- **Implementation guides** go in `docs/implementation-guides/`
- **AI-specific context** goes in `docs/ai-context/`
- **Pattern documentation** goes in `docs/patterns/`

## For AI Assistants

Start with `docs/ai-context/INDEX.md` for the full project context contract.

## Documentation Zone Map

| Directory | Content | AI Relevance |
|-----------|---------|--------------|
| `docs/adr/` | Architectural Decision Records | High — constraints AI must respect |
| `docs/ai-context/` | AI-specific guidance, prompt libraries | Critical — primary AI entry point |
| `docs/implementation-guides/` | Phase guides, code examples, reference | Medium — implementation context |
| `docs/patterns/` | Component, performance, accessibility patterns | High — conventions AI must follow |
| `docs/development/` | Development workflows, setup guides | Low — primarily human-facing |
| `docs/snippets/` | Reusable code snippet includes | Medium — code examples |

Human onboarding (launch demo, quick deploy, FAQ, onboarding) lives on the docs site at [docs.clownware.org/astro/getting-started/](https://docs.clownware.org/astro/getting-started/), which owns those pages.

## Implementation Roadmap

Work through phases sequentially and stop when you've reached your goals. See [Implementation Guide Master Index](/implementation-guides/) for the full guide.

### 🔴 Foundation (Phases 0–4) — Everyone does these

| Phase | Name | Effort |
|-------|------|--------|
| 0 | [Foundation Decisions](/implementation-guides/completed/phase-0-foundation/) | 1 day |
| 1 | [Content Architecture](/implementation-guides/completed/phase-1-content-arch/) | 1-2 days |
| 2 | [Design System](/implementation-guides/completed/phase-2-design-system/) | 1-2 days |
| 3 | [Tooling](/implementation-guides/completed/phase-3-tooling/) | 1 day |
| 4 | [Skeleton Layout](/implementation-guides/completed/phase-4-skeleton/) | 2-3 days |

### 🟡 Build (Phases 5–8) — Make it yours

| Phase | Name | Effort |
|-------|------|--------|
| 5 | [Components](/implementation-guides/active-phases/phase-5-components/) | 2-4 days |
| 6 | [Sections](/implementation-guides/active-phases/phase-6-sections/) | 2-3 days |
| 7 | [Content](/implementation-guides/active-phases/phase-7-content/) | 3-5 days |
| 8 | [QA](/implementation-guides/active-phases/phase-8-qa/) | 1-3 days |

### 🟢 Polish (Phases 9–12) — Production-harden

| Phase | Name | Effort |
|-------|------|--------|
| 9 | [Performance](/implementation-guides/active-phases/phase-9-performance/) | 1-2 days |
| 10 | [Deployment](/implementation-guides/active-phases/phase-10-deployment/) | 1 day |
| 11 | [Documentation](/implementation-guides/active-phases/phase-11-documentation/) | 1-2 days |
| 12 | [Post-Launch](/implementation-guides/active-phases/phase-12-post-launch/) | 1 day |

### Progress Tracking

> This checklist is synced by running `pnpm run roadmap:update` — a phase counts as complete when its guide lives in `implementation-guides/completed/` (or carries a `status: complete` frontmatter override).

<!-- ROADMAP_STATUS_START -->
<!-- Synced by `pnpm run roadmap:update`. Do not manually edit. -->
- [x] Phase 0: Foundation
- [x] Phase 1: Content Architecture
- [x] Phase 2: Design System
- [x] Phase 3: Tooling
- [x] Phase 4: Skeleton
- [ ] Phase 5: Components
- [ ] Phase 6: Sections
- [ ] Phase 7: Content
- [ ] Phase 8: QA
- [ ] Phase 9: Performance
- [ ] Phase 10: Deployment
- [ ] Phase 11: Documentation
- [ ] Phase 12: Post-Launch
<!-- ROADMAP_STATUS_END -->

## Architecture & Patterns

### Core Reference

- **[Technology Stack](/implementation-guides/reference/tech-stack/)** - Why we chose these tools
- **[Performance Budgets](/implementation-guides/reference/budgets-guardrails/)** - Quality gates and metrics
- **[Directory Structure](/implementation-guides/reference/directory-structure/)** - Project organization
- **[Portfolio Checklist](/implementation-guides/reference/portfolio-checklist/)** - Curated scope items for portfolio-quality sites

### Design Patterns

- **[Islands Architecture](/patterns/islands-architecture/)** - When to add JavaScript
- **[Component Patterns](/patterns/component-patterns/)** - Reusable UI patterns
- **[Performance Patterns](/patterns/performance-patterns/)** - Optimization techniques
- **[Content Collections](/patterns/content-collections/)** - Advanced content patterns

### Architecture Decisions

- **[ADR Template](/adr/template/)** - How to document decisions
- **[ADR-000: Starter Decisions](/adr/000-starter-decisions/)** - Initial architecture choices
- **[ADR-033: Track Consolidation](/adr/033-track-consolidation/)** - Progressive tier model
- **[ADR-034: Dual-Purpose Docs](/adr/034-dual-purpose-docs-strategy/)** - AI Context Layer strategy
- **[ADR-035: Template Scope Boundary](/adr/035-template-scope-boundary/)** - What ships in the template

## Document Types

### Implementation Guides

Step-by-step instructions for building each phase. Each guide includes:

- Tier and scope (Essential / Recommended / Advanced)
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

---
_Questions? Open a Discussion on GitHub_
