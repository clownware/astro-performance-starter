---
title: Maintaining AI Context
lastUpdated: 2025-06-10T00:00:00.000Z
description: Guidelines for keeping AI context documents accurate and helpful
tableOfContents: true
pagefind: true
---
> 🔄 **Purpose**: Keep AI context documents accurate and helpful

## When to Update Context

### Immediate Updates Required

1. **Phase Completion**
   - Check off completed phase in INDEX.md
   - Update "Active Phase" section
   - Add any new patterns discovered
   - Document unexpected challenges

2. **New Architecture Decisions**
   - Add ADR reference to relevant sections
   - Update constraints in INDEX.md
   - Modify affected phase guides
   - Update tech stack if tools change

3. **Performance Budget Changes**
   - Update budgets-guardrails.md
   - Modify CI scripts if needed
   - Update budget-overrides.json
   - Document reason in ADR

4. **Schema Modifications**
   - Update content-collections.md
   - Modify example fixtures
   - Update TypeScript types
   - Add migration notes

5. **Dependency Updates**
   - Update version numbers in tech-stack.md
   - Document breaking changes
   - Update installation commands
   - Test all examples still work

## How to Update Context

### 1. Phase Status Updates

```bash
# After completing Phase 5
1. Open ai-context/INDEX.md
2. Check the Phase 5 box: [x] Phase 5: Components
3. Update Active Phase to Phase 6
4. Add any new constraints discovered
5. Commit with message: "docs: complete phase 5, update AI context"
```

### 2. Adding New Patterns

```bash
# When discovering a new pattern
1. Create new file: patterns/[pattern-name].md
2. Follow the pattern template:
   - Problem description
   - Solution with code
   - When to use/avoid
   - Performance impact
3. Add reference in relevant phase guide
4. Update INDEX.md with pattern link
```

### 3. Updating Code Examples

```bash
# When code examples change
1. Test the new code in a real project
2. Update the example in the guide
3. Include all necessary imports
4. Add comments explaining changes
5. Update any dependent examples
```

### 4. Performance Metric Updates

```bash
# When metrics change
1. Run fresh Lighthouse audit
2. Update baseline in perf-baseline/
3. Modify budgets if needed (with ADR)
4. Update monitoring thresholds
5. Document impact on development
```

## Context Validation

### Weekly Checklist

```markdown
## Weekly AI Context Review - [Date]

### Accuracy Check
- [ ] Phase status reflects reality
- [ ] Active phase is correct
- [ ] No broken internal links
- [ ] Code examples still valid
- [ ] Dependencies up to date

### Completeness Check
- [ ] New patterns documented
- [ ] Recent decisions included
- [ ] Common issues addressed
- [ ] FAQs updated if needed

### Clarity Check
- [ ] Instructions are clear
- [ ] Examples are practical
- [ ] No contradictions
- [ ] Terminology consistent
```

### Monthly Deep Review

1. **Test All Examples**

   ```bash
   # Create fresh project
   pnpm create astro@latest -- --template ./
   
   # Test each code example
   # Document any that fail
   ```

2. **Dependency Audit**

   ```bash
   # Check for updates
   pnpm outdated
   
   # Review breaking changes
   # Update docs if needed
   ```

3. **Pattern Effectiveness**
   - Survey team on pattern usage
   - Identify unused patterns
   - Find missing patterns
   - Update based on feedback

4. **Cross-Reference Check**
   - Verify all internal links work
   - Check external links still valid
   - Ensure consistency across docs
   - Update outdated references

## Automated Context Updates

### Git Hooks for Context

```bash
#!/bin/bash
# .husky/post-commit
# Auto-update context on certain commits

# Check if committing to main
if [ "$(git branch --show-current)" = "main" ]; then
  # Check for phase completion markers
  if git diff HEAD^ HEAD --name-only | grep -q "phase-.*-complete"; then
    echo "Phase completed! Remember to update AI context"
    echo "Run: pnpm agents:build"
  fi
fi
```

### CI Integration

```yaml
# .github/workflows/context-check.yml
name: Validate AI Context

on:
  pull_request:
    paths:
      - 'docs/**'
      - 'src/**'

jobs:
  context-freshness:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Check context references
        run: |
          # Verify all referenced files exist
          grep -r "phase-[0-9]" docs/ai-context/ | while read line; do
            file=$(echo $line | sed 's/.*phase-/phase-/' | cut -d' ' -f1)
            if [ ! -f "docs/implementation-guides/$file" ]; then
              echo "Missing file referenced: $file"
              exit 1
            fi
          done
      
      - name: Check for outdated examples
        run: |
          # Find code blocks older than 30 days
          # Alert if examples might be stale
```

## Common Context Issues

### 1. Stale Phase Status

**Problem**: Phase checkboxes don't reflect actual progress
**Solution**:

- Review completed work against phase exit criteria
- Update checkboxes based on actual completion
- Add notes about partial completion

### 2. Outdated Code Examples

**Problem**: Examples use old syntax or deprecated features
**Solution**:

- Test examples in fresh project
- Update to current best practices
- Add version notes if needed
- Include migration path

### 3. Missing Context

**Problem**: AI makes incorrect assumptions
**Solution**:

- Add explicit constraints
- Document implicit knowledge
- Include more examples
- Clarify ambiguous instructions

### 4. Contradictory Information

**Problem**: Different guides say different things
**Solution**:

- Identify source of truth
- Update all references
- Add clarification notes
- Document in decision log

## Context Update Templates

### Pattern Addition

```markdown
# [Pattern Name]

## Problem
[What problem does this solve?]

## Solution
[Code example with explanation]

## When to Use
- [Scenario 1]
- [Scenario 2]

## When to Avoid
- [Anti-pattern 1]
- [Anti-pattern 2]

## Performance Impact
[Metrics and considerations]

## Related Patterns
- [Link to similar pattern]
- [Link to alternative approach]
```

### Decision Update

```markdown
## Decision: [Title]

**Date**: [YYYY-MM-DD]
**Impact**: [High/Medium/Low]

### What Changed
[Description of the change]

### Why It Changed
[Reasoning and context]

### Migration Path
[How to update existing code]

### Updated Constraints
- [New constraint 1]
- [New constraint 2]
```

## Review Schedule

### Daily

- Quick scan for obvious errors during development

### Weekly

- Phase status accuracy
- Active development areas
- New patterns or issues

### Monthly

- Full accuracy audit
- Dependency updates
- Pattern effectiveness
- Team feedback

### Quarterly

- Complete restructure evaluation
- Archive outdated content
- Plan major updates
- Solicit community feedback

## Tips for Maintainers

1. **Small, Frequent Updates** are better than large, infrequent ones
2. **Document Why** not just what when making changes
3. **Test Everything** before updating examples
4. **Version Sensitive** information when it might change
5. **Ask for Feedback** from developers using the context
6. **Automate Checks** where possible
7. **Keep It Practical** - focus on real-world usage

Remember: The goal is to make AI assistants more helpful, not to create perfect documentation. Practical accuracy beats theoretical completeness.
