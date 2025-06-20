# ADR-006: Documentation Review Cadence

**Date**: 2025-06-19  
**Status**: Accepted  
**Context**: Documentation governance and maintenance automation  
**Supersedes**: None  
**Review**: 2025-12-31

## Context

The Astro Performance Starter Template includes "living" documentation that makes specific promises and constraints but lacks systematic review cadence:

### Problems Identified

1. **Stale Promises**: Documents promise "monthly audits" but lack changelog or review tracking
2. **Critical Constraints**: Tech stack versions, performance budgets, security requirements can become outdated
3. **No Accountability**: No clear ownership or schedule for documentation maintenance
4. **Impact on AI Context**: Outdated documentation misleads AI assistants and developers

### Examples of At-Risk Documentation

```markdown
# From INDEX.md
"JS < 160 KB" - Budget constraint with no review date

# From budgets-guardrails.md  
"We perform monthly audits" - Promise without tracking

# From tech-stack.md
"Astro 5.x" - Version requirement that can become outdated
```

## Decision

Implement **automated documentation review cadence with CI enforcement** using frontmatter review dates and build-time validation.

### Solution Components

1. **Frontmatter Review Dates** - Required `review:` field for critical documents
2. **Automatic Detection** - Script identifies documents requiring review dates
3. **CI Integration** - Build fails when reviews are overdue
4. **Review Categories** - Different cadences for different document types

## Implementation

### Review Date Schema
```yaml
---
title: "Document Title"
lastUpdated: "2025-06-19"    # When content was last changed
review: "2025-12-31"         # When next review is due
---
```

### Automatic Detection Criteria

**File Pattern Matching:**
- `index.md`, `tech-stack.md`, `budgets-guardrails.md`
- Files in `adr/` directory
- Files containing: `security`, `performance`, `budget`

**Content Pattern Matching:**
- Budget constraints: `/budget.*[<>]\s*\d+/i`
- Review promises: `/monthly.*audit|quarterly.*review/i`
- Performance targets: `/lighthouse.*\d+|core.*web.*vitals/i`
- Technology requirements: `/node.*\d+|astro.*\d+/i`

### CI Integration
```yaml
- name: Check documentation review dates
  run: pnpm run check:reviews
```

Exits with error code 1 if any reviews are overdue.

### Review Cadence Categories

| Category | Documents | Schedule | Frontmatter |
|----------|-----------|----------|-------------|
| **Critical** | Tech stack, budgets, AI context | Annual (Dec 31) | `review: "2025-12-31"` |
| **Important** | ADRs, security, performance patterns | Quarterly | `review: "2025-09-30"` |
| **Stable** | Implementation guides, tutorials | As-needed | No review date required |

## Alternatives Considered

### 1. Manual Review Tracking
**Approach**: Spreadsheet or issue-based tracking  
**Rejected**: Manual systems are ignored, no automation, easy to forget

### 2. External Documentation Tools
**Approach**: Use GitBook, Notion with built-in review features  
**Rejected**: Adds complexity, breaks local-first development, vendor lock-in

### 3. Git-based Review Tracking
**Approach**: Use Git hooks or commit messages for review tracking  
**Rejected**: Doesn't integrate with frontmatter, harder to query, not visible in docs

### 4. Calendar-based Reviews
**Approach**: Schedule reviews in team calendar  
**Rejected**: No connection to actual documents, easy to skip, no enforcement

## Consequences

### Positive

✅ **Automated Enforcement**: CI blocks deployment on overdue reviews  
✅ **Zero Maintenance**: Once configured, runs automatically  
✅ **Clear Accountability**: Explicit dates for when reviews are due  
✅ **Smart Detection**: Automatically identifies review-worthy documents  
✅ **Flexible Cadence**: Different schedules for different document types  
✅ **Developer-Friendly**: Uses familiar frontmatter, integrates with existing tools  
✅ **Historical Tracking**: Clear record in Git of when documents were reviewed

### Negative

❌ **Initial Setup**: Requires adding review dates to existing documents  
❌ **CI Dependency**: Requires CI pipeline to be effective  
❌ **False Positives**: May flag documents that don't actually need review  
❌ **Developer Overhead**: Must remember to update review dates when editing

### Neutral

⚪ **Frontmatter Dependency**: Relies on YAML frontmatter (already used extensively)  
⚪ **Node.js Script**: Adds another script to the project (consistent with existing tooling)

## Success Metrics

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

### Phase 1: Core Implementation ✅
- [x] Create review date detection script (`scripts/check-review-dates.mjs`)
- [x] Add CI integration (`.github/workflows/ci.yml`)
- [x] Add package.json script (`check:reviews`)

### Phase 2: Documentation Updates ✅
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

## Related Decisions

- **ADR-005**: Link Validation Strategy - Both systems ensure documentation quality
- **Future ADR**: AI Context Maintenance Strategy - Will reference this review system

## Configuration

### Script Location
`scripts/check-review-dates.mjs` - Standalone Node.js script

### Package.json Integration
```json
{
  "scripts": {
    "check:reviews": "node scripts/check-review-dates.mjs"
  }
}
```

### CI Integration  
```yaml
- name: Check documentation review dates
  run: pnpm run check:reviews
```

## Example Usage

```bash
# Check all documentation review dates
pnpm run check:reviews

# Example output:
✅ docs/tech-stack.md - Review scheduled in 195 days
❌ docs/budgets-guardrails.md - Review overdue by 8 days
💡 docs/performance-patterns.md - Should have review date
```

---

**Authors**: AI Assistant (Cascade)  
**Reviewers**: Development Team  
**Implementation**: 2025-06-19  
**Next Review**: 2025-12-31
