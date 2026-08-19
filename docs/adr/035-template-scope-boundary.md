---
title: 'ADR-035: Template Scope Boundary — Code vs Reference Documentation'
lastUpdated: 2026-02-22T00:00:00.000Z
description: >-
  Establish a clear inclusion policy defining what ships as modifiable template
  code versus reference documentation, providing a decision framework for
  evaluating new features.
tableOfContents: true
pagefind: true
---

## Status

Accepted (amended 2026-07-12: `versions.yml` removed — it had no programmatic consumers and its
hand-maintained fields drifted; `versions.json` is the sole version manifest, see
[ADR-061](./061-versions-json-public-contract.md). Amended 2026-08-02: `docs/temp-guides/`
has since been removed — the notes referencing it are annotated below. Amended 2026-08-19:
`.windsurfrules` removed from the scope table, #309 — Windsurf is no longer supported and reads
`AGENTS.md` natively regardless)

## Context

As the template grows, there is recurring ambiguity about whether a new feature belongs in the template code (files users modify), in the reference documentation (files AI/humans read), or both. This creates several problems:

1. **User confusion**: Template cloners encounter files and aren't sure if they should customize them, leave them alone, or delete them. Root-level files like `PERFORMANCE_ANALYSIS.md`, `FORCED_REFLOW_FIX.md`, and `PERFORMANCE_REGRESSION_FIX.md` are maintenance artifacts that don't belong in a clean template.
2. **Scope creep**: Without a decision framework, every useful feature tends to ship in the template itself rather than as documented recipes, increasing the surface area users must understand.
3. **AI assistant ambiguity**: AI assistants modifying the project need to know which files are "theirs to change" and which are reference material. Without an explicit boundary, assistants may modify documentation files or leave template files untouched.
4. **Contributor uncertainty**: New contributors aren't sure where to add things — should a new deployment recipe be a template file, a docs page, or both?

## Decision Drivers

- **User Experience**: Template cloners should find a clean, understandable set of files to customize
- **AI Clarity**: AI assistants need an unambiguous answer to "which files can I modify?"
- **Maintainability**: Clear boundaries prevent scope creep and reduce review burden
- **Flexibility**: The framework should handle edge cases without constant re-litigation

## Considered Options

### Option 1: No Formal Boundary (Status Quo)

**Description**: Continue adding features and documentation organically without a formal inclusion policy.

**Pros**:

- No governance overhead

**Cons**:

- Root directory accumulates maintenance artifacts
- Every new feature requires a case-by-case discussion
- Template surface area grows unbounded

### Option 2: Strict Minimalism

**Description**: Template ships with only the bare minimum files. Everything else lives exclusively in the docs site.

**Pros**:

- Extremely clean template

**Cons**:

- Loses the AI Context Layer value (ADR-034)
- Users must set up docs access separately
- Over-corrects for the scope creep problem

### Option 3: Explicit Scope Policy with Decision Framework

**Description**: Define three categories (Template Code, Reference Docs, External Only) with a decision framework for categorizing new features.

**Pros**:

- Clear, repeatable decision-making
- Balances clean template with rich context
- AI assistants get explicit guidance

**Cons**:

- Requires discipline to follow
- Some features genuinely straddle categories

## Decision

We will implement **Option 3: Explicit Scope Policy with Decision Framework**.

### Category 1: Template Code (Files Users Modify)

These files ship in the template and users are expected to customize them for their project.

| Path | Purpose |
|------|---------|
| `src/` | All source code — components, layouts, pages, styles, content schemas, utilities |
| `astro.config.mjs` | Astro configuration |
| `tsconfig.json` | TypeScript configuration |
| `biome.json` | Linting and formatting rules |
| `src/styles/global.css` | Tailwind v4 CSS-native config with `@theme inline` design tokens |
| `package.json` | Dependencies and scripts |
| `tokens/` | Design token source files |
| `public/` | Static assets (favicon, robots.txt, manifest) |
| `.github/workflows/` | CI pipeline |
| `.env.example` | Environment variable documentation |
| `README.md` | User-facing project README |
| `LICENSE.txt` | License file |
| `AGENTS.md` | Cross-tool AI agent context (generated from the layered constitution; see ADR-045) |

### Category 2: Reference Documentation (Files AI/Humans Read)

These files ship in the template as context but users are not expected to modify them unless forking the methodology. See ADR-034 for the full documentation architecture.

| Path | Purpose |
|------|---------|
| `docs/adr/` | Architectural Decision Records |
| `docs/ai-context/` | AI assistant context and prompt libraries |
| `docs/implementation-guides/` | Phase guides, code examples, reference material |
| `docs/patterns/` | Component, performance, and accessibility patterns |
| `docs/development/` | Development workflows and setup guides |
| `docs/getting-started/` | Onboarding documentation |
| `docs/snippets/` | Reusable code snippet documentation |
| `docs/assets/` | Documentation images and diagrams |
| `docs/README.md` | Documentation directory explanation |

### Category 3: Does Not Ship in Template

These items live exclusively on the docs site, in separate repositories, or are removed before template publication.

| Item | Where It Lives Instead |
|------|----------------------|
| Deployment-specific workflows (Vercel, Netlify, AWS) | Documented as recipes in `docs/implementation-guides/` |
| Extended tutorials and walkthroughs | Docs site only (if deployed separately) |
| Comparison content (vs other starters) | Docs site or marketing material |
| Marketing and promotional content | Docs site landing page |
| Maintenance artifacts and one-off fix docs | Remove or archive after resolution |
| Phase completion issue templates | GitHub Issues, not template files |
| `CHANGELOG.md` for the template itself | GitHub Releases |

### Root Directory Cleanup

The following root-level files should be evaluated against this policy:

| File | Recommendation | Rationale |
|------|---------------|-----------|
| `CONTRIBUTING.md` | **Keep** — Category 1 | Users forking the template may accept contributions |
| `ONBOARDING.md` | **Move** → `docs/getting-started/` | Reference documentation, not template code |
| `DOCS_SYNC_QUICKSTART.md` | **Move** → `docs/development/` | Development workflow reference |
| `PERFORMANCE_ANALYSIS.md` | **Move** → `docs/temp-guides/` or remove | Maintenance artifact, not template feature |
| `PERFORMANCE_REGRESSION_FIX.md` | **Move** → `docs/temp-guides/` or remove | One-off fix documentation |
| `FORCED_REFLOW_FIX.md` | **Move** → `docs/temp-guides/` or remove | One-off fix documentation |
| `CHANGELOG.md` | **Evaluate** — keep if actively maintained, move to Releases if not | Depends on release workflow |
| `versions.json` | **Keep** — Category 1 | Build configuration (`versions.yml` removed 2026-07-12, see ADR-061) |
| `budget-overrides.json` | **Keep** — Category 1 | Performance budget configuration |

### Decision Framework for New Features

When considering whether to add something to the template, apply this test:

```text
┌─────────────────────────────────────────────────────┐
│ Would removing this file break the build             │
│ or degrade the running site?                         │
├──────────┬──────────────────────────────────────────┤
│   YES    │ → Category 1: Template Code               │
│          │   Ship in src/, config, or public/         │
├──────────┼──────────────────────────────────────────┤
│   NO     │ Does it provide context that AI assistants │
│          │ or developers need during development?     │
│          ├──────────┬───────────────────────────────┤
│          │   YES    │ → Category 2: Reference Docs   │
│          │          │   Ship in docs/                 │
│          ├──────────┼───────────────────────────────┤
│          │   NO     │ → Category 3: External Only    │
│          │          │   Docs site or separate repo    │
└──────────┴──────────┴───────────────────────────────┘
```

**Additional heuristic**: If it's configuration that varies by project → `.env.example` entry with a docs reference.

### AI Assistant Guidance

Based on this policy, AI assistants operating in the project should:

1. **Modify freely**: Files in Category 1 (`src/`, config files, `public/`)
2. **Read but don't modify**: Files in Category 2 (`docs/`) unless explicitly updating documentation
3. **Suggest but don't create**: Files that would fall into Category 3 — recommend adding to docs site instead

This guidance should be reflected in `AGENTS.md` (via the layered constitution) and `docs/ai-context/INDEX.md`. *(amended 2026-08-19: originally named `.windsurfrules`, removed in #309)*

## Consequences

### Positive

- Clear, repeatable framework for evaluating new features
- Root directory becomes cleaner as maintenance artifacts are relocated
- AI assistants have explicit guidance on modification scope
- Contributors know exactly where new content belongs
- Template surface area is bounded and intentional

### Negative

- Some features that feel like they "belong" in the template (e.g., Lighthouse CI config, CSP header recipes) get pushed to Category 2 or 3. This is the correct tradeoff for a starter but may feel incomplete to users expecting an all-in-one solution.
- Relocating existing files requires updating internal references and ensuring no broken links
- The decision framework requires judgment — edge cases will still need discussion

### Neutral

- This policy applies to the template repository specifically. A rendered docs site (if deployed separately) can include any content regardless of this policy.
- The policy doesn't change what content exists — only where it lives and how it's categorized
- `docs/temp-guides/` already exists and can serve as the landing spot for relocated maintenance artifacts pending further cleanup *(amended 2026-08-02: the cleanup is complete — `docs/temp-guides/` has since been removed)*

## Validation

- **Root Cleanliness**: Root directory contains only Category 1 files plus `docs/` and standard dotfiles
- **AI Clarity**: AI assistants asked "which files can I modify?" produce answers consistent with this policy
- **Contributor Success**: New contributors can categorize a proposed addition without asking for guidance
- **No Scope Creep**: Template PRs are reviewed against this policy (add checklist item to PR template)

## References

- [ADR-034: Dual-Purpose Docs Strategy](/adr/034-dual-purpose-docs-strategy/) — Formalizes the role of `docs/` as AI context
- [ADR-033: Track Consolidation](/adr/033-track-consolidation/) — Simplifies the documentation structure
- [ADR-008: Documentation Sync Strategy](/adr/008-docs-sync-strategy/) — Superseded by ADR-059's drift gate; the Starlight push-sync is retired

## Notes

The `docs/temp-guides/` directory currently contains `github-template-structure.md` and serves as a natural holding area for maintenance artifacts that haven't been formally categorized yet. As part of implementing this ADR, that directory should be reviewed and either formalized (if it serves an ongoing purpose) or cleared (if its contents have been resolved). *(Amended 2026-08-02: this review happened — `docs/temp-guides/` and `github-template-structure.md` have been removed.)*

The PR template (`.github/PULL_REQUEST_TEMPLATE.md`) should include a checkbox: "Files added/modified are in the correct category per ADR-035."

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-064). The original record above is unmodified. -->

- **Testable consequences:**
  - TC-1: the repo root contains only Category-1 files, standard dotfiles, and `docs/`.
  - TC-2: no maintenance-artifact files (`*_FIX.md`, `*_ANALYSIS.md`, and similar one-off reports) exist at the root.
- **Checks:**
  - TC-1, TC-2 → check `scope-boundary` (status: **warn**)
- **Not machine-checkable:** category judgment for genuinely novel additions still follows the decision framework by hand.
- **Graduation log:** *(empty at creation; entries added when a check changes status)*

---
**Date**: 2026-02-22\
**Participants**: Template maintainers\
**Outcome**: Accepted
