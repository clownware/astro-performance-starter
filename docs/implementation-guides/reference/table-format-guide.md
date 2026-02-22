---
title: Consolidated Table Format Guide
lastUpdated: 2025-06-19T00:00:00.000Z
description: >-
  Standard format for implementation step tables using Essential / Recommended /
  Advanced scope labels
tableOfContents: true
pagefind: true
---
> 🎯 **Purpose**: Consistent format for implementation step tables using Essential / Recommended / Advanced scope labels per ADR-033

## Standard Approach

All phase guides use a single implementation steps table with a **Scope** column. This replaces the old MVP/Showcase dual-column format.

- **Essential** — required for all projects
- **Recommended** — adds quality and polish for most projects
- **Advanced** — portfolio-grade or enterprise features

## Standard Table Format

### Implementation Steps Table

```markdown
| Step | Task | Scope | Notes |
|------|------|-------|-------|
| X.01 | Task name | Essential | Description |
| X.02 | Quality enhancement | Recommended | Adds polish for most projects |
| X.03 | Portfolio-grade feature | Advanced | Enterprise or showcase use |
| X.04 | Progressive task | Essential | Basic setup → Advanced with automation |
```

### Exit Criteria Table

```markdown
| Criteria | Scope | Description |
|----------|-------|-------------|
| Criterion name | Essential | What this means |
| Quality requirement | Recommended | Adds value for most projects |
| Enterprise feature | Advanced | Portfolio-grade requirement |
```

## Scope Indicators

### Standard Labels (per ADR-033)

- **Essential** — Required for all projects (Foundation tier minimum)
- **Recommended** — Adds quality and polish for most projects
- **Advanced** — Portfolio-grade or enterprise features

### Progressive Enhancement Notation

Use arrow notation in the Notes column for different implementation depths:

- `Basic → Advanced` — Different complexity levels
- `Manual → Automated` — Different approaches
- `Essential → Enhanced` — Different scope

## Migration Checklist

The original MVP/Showcase dual-column format has been consolidated into the single Scope column format per ADR-033. All phases have been migrated:

- [x] Phase 5 Components
- [x] Phase 6 Sections
- [x] Phase 8 QA
- [x] Phase 9 Performance
- [x] Phase 11 Documentation
- [x] Phase 12 Post Launch
- [x] Phases 0–4, 7, 10 — no duplication issues

## Benefits

1. **Simplicity**: One column (Scope) replaces two (MVP/Showcase)
2. **Consistency**: Standardized format across all phases
3. **Clarity**: Essential/Recommended/Advanced maps to real user decisions
4. **Alignment**: Matches the progressive tier model (ADR-033)

## Example Implementation

See `phase-8-qa.md` for a complete example of the scope-based format in action.
