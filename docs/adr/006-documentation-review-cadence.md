---
title: 'ADR-006: Documentation Review Cadence'
description: >-
  Architectural Decision Record for automated documentation review cadence
  using frontmatter-based review dates and CI enforcement
lastUpdated: 2025-06-19T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

Documentation in this project serves multiple audiences: contributors, users of the template, and AI-assisted development tools. Without a systematic review process, documentation drifts out of date — budget thresholds become stale, technology version references lag behind, and security guidance loses relevance. The project needed an automated, enforceable mechanism to ensure critical documents are reviewed on a predictable cadence.

## Decision Drivers

- **Documentation Accuracy**: Stale docs erode trust and cause incorrect development decisions
- **Automation**: Manual review tracking is consistently ignored across teams
- **CI Integration**: Enforcement must be automated to be effective
- **Developer Experience**: The system must use familiar patterns (frontmatter, scripts) and not add friction
- **Flexibility**: Different document types have different staleness risk profiles

## Considered Options

### Option 1: Manual Review Tracking

**Description**: Spreadsheet or issue-based tracking

**Pros**:

- No tooling required

**Cons**:

- Manual systems are ignored, no automation, easy to forget

### Option 2: External Documentation Tools

**Description**: Use GitBook, Notion with built-in review features

**Pros**:

- Built-in review workflows

**Cons**:

- Adds complexity, breaks local-first development, vendor lock-in

### Option 3: Git-based Review Tracking

**Description**: Use Git hooks or commit messages for review tracking

**Pros**:

- Leverages existing Git infrastructure

**Cons**:

- Doesn't integrate with frontmatter, harder to query, not visible in docs

### Option 4: Calendar-based Reviews

**Description**: Schedule reviews in team calendar

**Pros**:

- Familiar process for teams

**Cons**:

- No connection to actual documents, easy to skip, no enforcement

### Option 5: Frontmatter-based Review Dates with CI Enforcement

**Description**: Add `review:` field to document frontmatter, with a CI script that detects overdue reviews and fails the build

**Pros**:

- Automated enforcement via CI
- Uses familiar frontmatter patterns
- Different cadences for different document categories
- Clear audit trail in Git

**Cons**:

- Initial setup overhead for adding review dates
- Requires CI pipeline to be effective
- May produce false positives

## Decision

We will go with **Option 5** — frontmatter-based review dates with CI enforcement.

### Implementation Details

A Node.js script (`scripts/check-review-dates.mjs`) scans documentation files for `review:` frontmatter fields and reports overdue or missing review dates. The script integrates with CI to block deployment when reviews are overdue.

#### Automatic Detection Criteria

**File Pattern Matching:**

- `index.md`, `tech-stack.md`, `budgets-guardrails.md`
- Files in `adr/` directory
- Files containing: `security`, `performance`, `budget`

**Content Pattern Matching:**

- Budget constraints: `/budget.*[<>]\s*\d+/i`
- Review promises: `/monthly.*audit|quarterly.*review/i`
- Performance targets: `/lighthouse.*\d+|core.*web.*vitals/i`
- Technology requirements: `/node.*\d+|astro.*\d+/i`

#### Review Cadence Categories

| Category | Documents | Schedule | Frontmatter |
|----------|-----------|----------|-------------|
| **Critical** | Tech stack, budgets, AI context | Annual (Dec 31) | `review: "2025-12-31"` |
| **Important** | ADRs, security, performance patterns | Quarterly | `review: "2025-09-30"` |
| **Stable** | Implementation guides, tutorials | As-needed | No review date required |

#### CI Integration

```yaml
- name: Check documentation review dates
  run: pnpm run check:reviews
```

Exits with error code 1 if any reviews are overdue.

#### Example Usage

```bash
# Check all documentation review dates
pnpm run check:reviews

# Example output:
# docs/tech-stack.md - Review scheduled in 195 days
# docs/budgets-guardrails.md - Review overdue by 8 days
# docs/performance-patterns.md - Should have review date
```

## Consequences

### Positive

- **Automated Enforcement**: CI blocks deployment on overdue reviews
- **Zero Maintenance**: Once configured, runs automatically
- **Clear Accountability**: Explicit dates for when reviews are due
- **Smart Detection**: Automatically identifies review-worthy documents
- **Flexible Cadence**: Different schedules for different document types
- **Developer-Friendly**: Uses familiar frontmatter, integrates with existing tools
- **Historical Tracking**: Clear record in Git of when documents were reviewed

### Negative

- **Initial Setup**: Requires adding review dates to existing documents
- **CI Dependency**: Requires CI pipeline to be effective
- **False Positives**: May flag documents that don't actually need review
- **Developer Overhead**: Must remember to update review dates when editing

### Neutral

- **Frontmatter Dependency**: Relies on YAML frontmatter (already used extensively)
- **Node.js Script**: Adds another script to the project (consistent with existing tooling)

## Validation

### Immediate (Within 3 months)

- [ ] All critical documents have review dates
- [ ] CI pipeline catches overdue reviews
- [ ] Zero false positives in review detection

### Medium-term (6 months)

- [ ] Documentation review cadence consistently followed
- [ ] Reduced incidents of stale documentation affecting development
- [ ] Team reports improved confidence in documentation accuracy

### Long-term (12 months)

- [ ] Documentation quality measurably improved
- [ ] Reduced technical debt from outdated constraints
- [ ] AI assistants have more accurate context for development decisions

## Implementation Plan

### Phase 1: Core Implementation (Complete)

- [x] Create review date detection script (`scripts/check-review-dates.mjs`)
- [x] Add CI integration (`.github/workflows/ci.yml`)
- [x] Add package.json script (`check:reviews`)

### Phase 2: Documentation Updates (Complete)

- [x] Add review dates to critical documents:
  - [x] `tech-stack.md` → `review: "2025-12-31"`
  - [x] `budgets-guardrails.md` → `review: "2025-12-31"`
  - [x] `INDEX.md` → `review: "2025-12-31"`
- [x] Create documentation review guide
- [x] Document ADR for decision

### Phase 3: Testing & Refinement (Next)

- [ ] Test CI integration with overdue dates
- [ ] Validate detection accuracy on all docs
- [ ] Adjust detection patterns based on false positives
- [ ] Add quarterly review dates to ADRs

### Phase 4: Process Integration (Future)

- [ ] Update CONTRIBUTING.md with review responsibilities
- [ ] Add review date to PR templates for documentation changes
- [ ] Consider changelog requirements for critical documents

## Rollback Plan

If the review system proves problematic:

1. **Immediate**: Comment out CI check in workflow
2. **Short-term**: Remove `review:` frontmatter from documents
3. **Long-term**: Keep script available for future re-implementation

System is designed to gracefully handle missing review dates without breaking builds.

## References

- **ADR-005**: Link Validation Strategy - Both systems ensure documentation quality
- Internal: `scripts/check-review-dates.mjs`
- Internal: `.github/workflows/ci.yml`

---
**Date**: 2025-06-19\
**Participants**: AI Assistant (Cascade), Development Team\
**Outcome**: Accepted
