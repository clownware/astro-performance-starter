---
title: DOCUMENTATION REVIEW CADENCE
description: '***'
last_reviewed_on: '2025-07-01'
---

***

title: Documentation Review Cadence
description: "> **Solution for "Living" guides without review cadence**: Automated review date tracking and CI enforcement\r"
-----------------------------------------------------------------------------------------------------------------------------

# Documentation Review Cadence

> **Solution for "Living" guides without review cadence**: Automated review date tracking and CI enforcement

## Problem

Documentation containing critical constraints and promises of regular updates can become stale without a review cadence:

* **INDEX.md** lists "JS \< 160 KB" but no next review date
* **budgets-guardrails.md** promises "monthly audits" but has no changelog
* **tech-stack.md** contains version requirements that can become outdated
* No systematic way to track which documents need regular review

## Solution

**Automated review date tracking with CI enforcement** to ensure "living" guides stay current.

### System Components

1. **Review Date Frontmatter** - Required for critical documents
2. **Automated Detection** - Script identifies documents that should have review dates
3. **CI Enforcement** - Build fails when reviews are overdue
4. **Clear Warnings** - Actionable suggestions for maintainers

## Implementation

### 1. Review Date Frontmatter

Critical documents now include a `review:` field in frontmatter:

```yaml
---
title: "Technology Stack"
lastUpdated: "2025-06-19"
review: "2025-12-31"  # Next review due date
---
```

### 2. Automatic Detection

The review checker (`scripts/check-review-dates.mjs`) automatically identifies documents that should have review dates based on:

**File patterns:**

* `index.md`, `tech-stack.md`, `budgets-guardrails.md`
* Files in `adr/`, containing `security`, `performance`, `budget`

**Content patterns:**

* Budget constraints: `"JS < 160 KB"`
* Review promises: `"monthly audits"`, `"quarterly review"`
* Critical specifications: `"performance target"`, `"security requirement"`
* Core Web Vitals references, Lighthouse scores

### 3. CI Integration

Review dates are checked automatically in the CI pipeline:

```yaml
- name: Check documentation review dates
  run: pnpm run check:reviews
```

**Behavior:**

* ✅ **Pass**: All reviews are current or scheduled for future
* ⚠️ **Warn**: Documents missing review dates (suggestions only)
* ❌ **Fail**: Overdue reviews found (blocks deployment)

## Usage

### Check Review Status

```bash
# Check all documentation review dates
pnpm run check:reviews

# Example output:
🔍 Checking documentation review dates (2025-06-19)

✅ docs/ai-context/INDEX.md - Review scheduled in 195 days
✅ docs/implementation-guides/00-overview-tech-stack.md - Review scheduled in 195 days

💡 SUGGESTIONS (add review dates to these files):
   docs/implementation-guides/patterns/performance-patterns.md: Should have review date - contains critical constraints

📊 Checked 48 files
   0 warnings, 1 suggestions
```

### When Reviews Are Due

```bash
# Overdue reviews block CI
❌ 2 overdue reviews found - please update documentation

⚠️  REVIEW WARNINGS:
   docs/tech-stack.md: Review overdue by 15 days (due: 2025-06-04)
   docs/budgets-guardrails.md: Review overdue by 8 days (due: 2025-06-11)
```

## Review Categories & Cadence

### 🔴 Critical (Annual Review)

Documents with immediate impact on development decisions:

* **Tech Stack** (`tech-stack.md`) - Version requirements, tool decisions
* **Performance Budgets** (`budgets-guardrails.md`) - Core Web Vitals, bundle sizes
* **AI Context** (`INDEX.md`) - Critical constraints, project structure

**Review Schedule**: December 31st annually
**Frontmatter**: `review: "2025-12-31"`

### 🟡 Important (Quarterly Review)

Documents affecting implementation but with slower change cycles:

* **ADRs** - Architecture decisions may need updates
* **Security guides** - Security practices evolve
* **Performance patterns** - Best practices may change

**Review Schedule**: End of each quarter
**Frontmatter**: `review: "2025-09-30"` (quarterly)

### 🟢 Stable (As-Needed Review)

Documents unlikely to become stale:

* **Implementation guides** - Step-by-step processes
* **Pattern documentation** - Code examples
* **Migration guides** - Historical references

**Review Schedule**: Only when dependencies change
**Frontmatter**: No review date required

## Review Process

### When a Review is Due

1. **Update the content** based on:
   * Current tool versions
   * New best practices
   * Performance requirements changes
   * Security updates

2. **Update frontmatter**:
   ```yaml
   lastUpdated: "2025-06-19"  # Today's date
   review: "2025-12-31"       # Next review date
   ```

3. **Add changelog entry** (for major changes):
   ```markdown
   ## Changelog

   ### 2025-06-19
   - Updated Astro to v5.8, Tailwind CSS to v4.0 stable
   - Revised JavaScript bundle budget to 160KB (was 150KB)
   - Added new Core Web Vitals targets for 2025
   ```

### Setting Review Dates

**Annual reviews** (critical documents):

```yaml
review: "2025-12-31"  # End of year
```

**Quarterly reviews** (important documents):

```yaml
review: "2025-09-30"  # End of Q3
review: "2025-12-31"  # End of Q4
```

**Custom cadence** (specific needs):

```yaml
review: "2025-08-15"  # Before major version update
```

## Benefits

### Immediate

* ✅ **Prevent stale documentation** - CI blocks deployment on overdue reviews
* ✅ **Clear accountability** - Know exactly what needs review and when
* ✅ **Automatic detection** - No manual tracking of review-worthy documents
* ✅ **Zero maintenance** - System runs automatically

### Long-term

* ✅ **Documentation quality** - Regular review ensures accuracy
* ✅ **Reduced technical debt** - Prevents accumulation of outdated information
* ✅ **Team alignment** - Shared understanding of current constraints
* ✅ **Historical tracking** - Clear record of when documents were last reviewed

## Configuration

### Files Requiring Review Dates

The system automatically detects files that should have review dates. To customize:

```javascript
// scripts/check-review-dates.mjs
const criticalFiles = [
  'index.md',
  'tech-stack.md',
  'budgets-guardrails.md',
  'security',
  'performance'
];

const criticalPatterns = [
  /budget.*[<>]\s*\d+/i,        // Budget constraints
  /monthly.*audit/i,            // Review promises
  /technology.*stack/i,         // Technology decisions
];
```

### CI Behavior

**Strict mode** (recommended for production):

```yaml
- name: Check documentation review dates
  run: pnpm run check:reviews  # Fails on overdue reviews
```

**Lenient mode** (development):

```yaml
- name: Check documentation review dates
  run: pnpm run check:reviews || true  # Warn but don't fail
```

## Rollback Strategy

If the review system causes issues:

1. **Disable CI check** - Comment out the CI step temporarily
2. **Remove review dates** - Remove `review:` frontmatter from documents
3. **Keep script available** - Can re-enable when ready

The system gracefully handles missing review dates without breaking builds.

## Examples

### Before (Problematic)

```yaml
---
title: "Performance Budgets"
lastUpdated: "2024-01-15"
---

# Performance Budgets

We perform monthly audits of performance budgets.
JavaScript bundles must be < 160 KB.
```

❌ No review date, promises monthly audits, contains critical constraints

### After (Compliant)

```yaml
---
title: "Performance Budgets"
lastUpdated: "2025-06-19"
review: "2025-12-31"
---

# Performance Budgets

We perform monthly audits of performance budgets.
JavaScript bundles must be < 160 KB.

## Changelog

### 2025-06-19
- Updated bundle size from 150KB to 160KB
- Added Core Web Vitals targets for 2025
```

✅ Review date set, current content, changelog tracking

***

**Related Documentation:**

* [ADR-006: Documentation Review Cadence](/adr/006-documentation-review-cadence/) (TODO)
* [Contribution Guidelines](/CONTRIBUTING/) - Review responsibilities
* [AI Context Maintenance](/ai-context/context-updates/) - AI-specific reviews
