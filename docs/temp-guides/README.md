# Temporary Guides — Resolved Issues Archive

This directory holds maintenance artifacts and one-off fix documentation that
don't belong in the template root (per [ADR-035](../adr/035-template-scope-boundary.md))
but may still contain useful context for debugging recurring issues.

## Contents

| File | Origin | Status |
|------|--------|--------|
| `github-template-structure.md` | Pre-existing reference | Review for relevance |
| `FORCED_REFLOW_FIX.md` | Root cleanup (ADR-035) | Archived — resolved issue |
| `PERFORMANCE_ANALYSIS.md` | Root cleanup (ADR-035) | Archived — resolved issue |
| `PERFORMANCE_REGRESSION_FIX.md` | Root cleanup (ADR-035) | Archived — resolved issue |
| `CHANGELOG.md` | Root cleanup (ADR-035) | Archived — not actively maintained; use GitHub Releases |
| `GO_ALPINE_LESSONS_LEARNED.md` | Moved from `docs/adr/` (ADR-035) | Archived — Go/Alpine reference, not an ADR |

## Policy

- Files here are **not rendered** on the docs site and are **not AI context**.
- This directory is listed in the `docs/README.md` zone map for completeness but has **Low** AI relevance.
- Review quarterly (next: 2026-05-22). Remove files whose issues are fully resolved
  and unlikely to recur. Promote files with lasting value to `docs/development/`.
- New maintenance artifacts should land here rather than at the repo root.
