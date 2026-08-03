---
title: 'ADR-034: Documentation Architecture — Dual-Purpose Docs Strategy'
lastUpdated: 2026-02-22T00:00:00.000Z
description: >-
  Formalize the dual-purpose documentation strategy where docs serve both as a
  rendered Starlight site and as in-repo AI assistant context, with explicit
  partitioning and an AI context contract.
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

The project includes extensive documentation in the repository (`docs/` directory) that serves two distinct audiences simultaneously:

1. **Human developers** reading the rendered Starlight documentation site (if deployed separately)
2. **AI coding assistants** reading files directly from the filesystem during agentic development in IDEs like Windsurf, Cursor, or VS Code with Copilot

This dual-purpose approach is a deliberate, differentiating feature — not accidental complexity. No other Astro starter template provides structured AI-readable context alongside its documentation. However, the current implementation has gaps:

- There is no explicit documentation explaining that `docs/` files serve as AI context (it's an implicit convention)
- The boundary between "template files you'll modify" and "reference documentation for context" isn't clearly marked
- The AI Context Index (`docs/ai-context/INDEX.md`) exists but doesn't formalize a contract that AI assistants can rely on
- Contributors aren't sure where to add new documentation — `docs/` root, `docs/ai-context/`, or `src/content/docs/`
- The existing docs sync strategy (ADR-008) handles propagation to the Starlight repo but doesn't address the in-repo context role

### Why Not Separate the Docs?

Three alternatives were evaluated and rejected:

**Separate docs repo**: Would degrade AI context quality. AI assistants reading from the filesystem get zero-config access to `docs/`. A separate repo requires explicit configuration (git submodules, MCP connections, or manual setup) that most users won't complete.

**MCP server for docs**: Adds infrastructure complexity (server maintenance, version management, connection configuration) disproportionate to the benefit. The files are already _there_ — an MCP server for static markdown is overengineered.

**Docs only on rendered site**: AI assistants would need web access to read context. Most IDE-integrated assistants read from the local filesystem, not URLs. This would eliminate the primary value of co-located docs.

## Decision Drivers

- **AI Context Quality**: AI assistants must get rich, structured context with zero configuration
- **Contributor Clarity**: Clear guidance on where documentation belongs
- **User Experience**: Template cloners should understand what `docs/` is and whether they need to modify it
- **Maintenance**: Docs and code must stay in sync naturally (co-location helps)
- **Differentiation**: This is a genuine competitive advantage worth formalizing

## Considered Options

### Option 1: Status Quo (Implicit Convention)

**Description**: Keep docs in repo, continue without explicit documentation of the dual-purpose strategy.

**Pros**:

- No work required

**Cons**:

- Contributors add docs inconsistently
- AI assistants don't know what to expect or where to find it
- Users may delete `docs/` thinking it's unnecessary

### Option 2: Explicit Partition with AI Context Contract

**Description**: Formalize three documentation zones, add a `docs/README.md` explaining the dual purpose, and establish a contract that AI assistants can rely on.

**Pros**:

- Contributors know exactly where to add docs
- AI assistants have a reliable contract
- Users understand they shouldn't delete `docs/`
- Differentiating feature gets proper documentation

**Cons**:

- Requires updating existing documentation structure
- Contract requires maintenance when conventions change

### Option 3: Separate AI Context from Human Docs

**Description**: Split into `docs/` (human-only, rendered by Starlight) and `.ai-context/` (AI-only, not rendered).

**Pros**:

- Clean separation of concerns

**Cons**:

- Duplicates information (ADRs relevant to both humans and AI)
- Double maintenance burden
- Loses the elegant dual-purpose property

## Decision

We will implement **Option 2: Explicit Partition with AI Context Contract**.

### Documentation Zones

Three zones with clear ownership and purpose:

#### Zone 1: `docs/` — Reference Documentation

**Purpose**: Architecture decisions, implementation guides, AI context, patterns, and reference material.

**Audience**: AI assistants (filesystem reads) and humans (Starlight rendering).

**Rule**: Users are not expected to modify these files unless forking the methodology itself. A `docs/README.md` will state this explicitly.

**Subdirectories**:

| Directory | Content | AI Relevance |
|-----------|---------|--------------|
| `docs/adr/` | Architectural decisions | High — constraints AI must respect |
| `docs/ai-context/` | AI-specific guidance, prompt libraries | Critical — primary AI entry point |
| `docs/implementation-guides/` | Phase guides, code examples, reference | Medium — provides implementation context |
| `docs/patterns/` | Component, performance, accessibility patterns | High — conventions AI must follow |
| `docs/development/` | Development workflows, setup guides | Low — primarily human-facing |
| `docs/getting-started/` | Onboarding documentation | Low — primarily human-facing |

#### Zone 2: `src/` — Template Source Code

**Purpose**: All code, layouts, components, content schemas, styles, and configuration that users will modify.

**Audience**: Developers building their site.

**Rule**: This is what you clone and customize. AI assistants should modify files here based on context from `docs/`.

**AI context within this zone**: JSDoc comments, TypeScript interfaces, and `config.ts` schemas provide code-level context.

#### Zone 3: Root Configuration

**Purpose**: Build tooling, CI, package management, editor configuration.

**Audience**: Build systems and developers.

**Files**: `astro.config.mjs`, `tsconfig.json`, `biome.json`, `package.json`, `.github/`, `.windsurfrules`

**Rule**: AI assistants should read these for project configuration context. Users modify these as needed for their project.

### AI Context Contract

The AI Context Index (`docs/ai-context/INDEX.md`) will be updated to include a formal contract specifying what AI assistants can expect to find and where:

```markdown
## AI Assistant Contract

### Entry Point
- Start here: `docs/ai-context/INDEX.md`
- This file provides project overview, constraints, and navigation

### Architectural Constraints
- Location: `docs/adr/`
- Contract: Every accepted ADR represents a constraint AI must respect
- Key ADRs: 001 (island policy), 023 (testing strategy), 033 (tier model)

### Performance Limits
- Location: `docs/implementation-guides/reference/budgets-guardrails.md`
- Contract: All changes must stay within documented budgets
- Quick reference: JS <160KB, CSS <50KB, Images <200KB, Lighthouse 95+

### Component Conventions
- Location: `docs/patterns/component-patterns.md`
- Contract: New components must follow documented atomic design hierarchy

### Current Project State
- Location: `docs/ai-context/INDEX.md` frontmatter (`current_phase`)
- Contract: CI updates this value on phase completion

### Rules of Engagement
1. Read `docs/adr/` before suggesting architectural changes
2. Do not suggest `client:load` without referencing ADR-001
3. Use design tokens from `tokens/` — never hardcode color/spacing values
4. TypeScript strict mode is non-negotiable
5. Use Biome, not ESLint/Prettier
6. Use pnpm, not npm or yarn
```

### docs/README.md Content

A new or updated `docs/README.md` will include:

```markdown
# Documentation — Reference & AI Context

This directory contains reference documentation that serves two purposes:

1. **Rendered documentation** via Starlight (if you deploy a separate docs site)
2. **AI assistant context** read directly from the filesystem by IDE-integrated AI tools

## For Template Users

You don't need to modify these files to use the template. They provide architectural
context and implementation guidance. If you're customizing the template for your own
project, you may want to:

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
```

### .gitattributes Addition

To reduce noise for GitHub users browsing the repo:

```txt
# Collapse reference documentation in GitHub diffs
docs/** linguist-documentation
```

## Consequences

### Positive

- AI assistants get rich, structured context with zero configuration — no MCP server, no API, just files
- Contributors have unambiguous guidance on where to add documentation
- Template users understand that `docs/` is reference material, not something they need to customize
- The AI context contract makes the AI-readiness feature visible and marketable
- Co-location keeps docs in sync with code naturally

### Negative

- Template cloners get ~50+ markdown files they may never read. Mitigated by `docs/README.md` explaining this and `.gitattributes` collapsing the directory in GitHub diffs.
- The AI context contract requires maintenance when conventions change. Mitigated by including contract validation in the existing review schedule documented in `INDEX.md`.
- Starlight rendering configuration must handle the `docs/` source path, which is non-standard. Mitigated by documenting this in the Starlight config file with inline comments.

### Neutral

- The docs sync workflow (ADR-008) continues to work unchanged — it syncs `docs/` to the Starlight repo regardless of the dual-purpose framing
- No changes to the build pipeline or deployment process
- The `docs/ai-context/` subdirectory already exists — this ADR formalizes its role rather than creating something new

## Validation

- **AI Assistant Effectiveness**: Test that a fresh AI assistant session (Windsurf, Cursor) can correctly identify project constraints after reading `docs/ai-context/INDEX.md`
- **Contributor Onboarding**: New contributors can correctly identify where to add a new ADR, guide, or pattern without asking
- **User Clarity**: Template users do not open issues asking "should I delete docs/"
- **Contract Currency**: AI context contract reflects actual project state (validated in review schedule)

## References

- [ADR-008: Documentation Sync Strategy](/adr/008-docs-sync-strategy/) — Handles docs → Starlight propagation
- [AI Context Index](https://github.com/clownware/astro-performance-starter/tree/master/docs/ai-context) — Current AI entry point
- [ADR-033: Track Consolidation](/adr/033-track-consolidation/) — Simplifies AI context by removing track ambiguity

## Notes

The term "AI Context Layer" is proposed as a marketable name for this feature. It can be used in the README, landing page, and any promotional material. The positioning is: "This template includes an AI Context Layer — structured documentation designed to help AI coding assistants understand and respect your project's architecture."

This is distinct from `.windsurfrules` / `.cursorrules` files (which are IDE-specific rule files) and from MCP servers (which require infrastructure). The AI Context Layer is simply well-structured markdown that any filesystem-reading AI can consume. Its power comes from being co-located, comprehensive, and contractual.

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-062). The original record above is unmodified. -->

- **Testable consequences:**
  - TC-1: `docs/README.md` exists and the documented zone directories are present.
- **Checks:**
  - TC-1 → check `scope-boundary` (status: **warn**)
- **Not machine-checkable:** whether new documentation lands in the correct zone is a review concern.
- **Graduation log:** _(empty at creation; entries added when a check changes status)_

---
**Date**: 2026-02-22\
**Participants**: Template maintainers\
**Outcome**: Accepted
