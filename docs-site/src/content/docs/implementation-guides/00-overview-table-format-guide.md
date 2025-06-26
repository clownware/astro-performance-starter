---
title: Consolidated Table Format Guide
version: 1.0.0
lastUpdated: 2025-06-19T00:00:00.000Z
description: >-
  Standard format for MVP vs Showcase track tables to eliminate duplication and
  improve maintainability.
---

# Consolidated Table Format Guide

> 🎯 **Purpose**: Eliminate duplicate content between MVP and Showcase tracks while maintaining clear differentiation

## Problem Addressed

**Before**: Separate tables for each track leading to:
- Duplicate task names and descriptions
- Higher maintenance burden
- Inconsistent formatting
- Content drift between tracks

**After**: Single consolidated table with track indicators providing:
- Single source of truth
- Consistent formatting
- Easier maintenance
- JavaScript-based filtering capability

## Standard Table Format

### Implementation Steps Table

```markdown
| Step | Task | MVP | Showcase | Notes |
|------|------|-----|----------|-------|
| X.01 | Task name | ✅ | ✅ | Description |
| X.02 | MVP-only task | ✅ | ❌ | MVP-specific notes |
| X.03 | Showcase-only task | ❌ | ✅ | Showcase-specific notes |
| X.04 | Different implementation | ✅ | ✅ | Basic → Advanced approach |
```

### Exit Criteria Table

```markdown
| Criteria | MVP | Showcase | Description |
|----------|-----|----------|-------------|
| Criterion name | ✅ | ✅ | What this means |
| MVP-only requirement | ✅ | ❌ | MVP-specific requirement |
| Showcase enhancement | ❌ | ✅ | Advanced requirement |
| Progressive requirement | ✅ | ✅ | Basic → Enhanced version |
```

## Track Indicators

### Standard Symbols
- ✅ = Required for this track
- ❌ = Not required for this track
- 📋 = Optional/recommended for this track

### Progressive Enhancement Notation
Use arrow notation in the Notes column for different implementations:
- `Basic → Advanced` - Different complexity levels
- `Manual → Automated` - Different approaches
- `Essential → Enhanced` - Different scope

## JavaScript Filter Component

For docs sites, use this interactive filter:

```javascript
// Track filter component for docs site
function TrackFilter() {
  const [selectedTrack, setSelectedTrack] = useState('both');

  const filterRows = () => {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      const rows = table.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const mvpCell = row.cells[2]; // MVP column
        const showcaseCell = row.cells[3]; // Showcase column
        
        let show = true;
        
        if (selectedTrack === 'mvp') {
          show = mvpCell?.textContent.includes('✅');
        } else if (selectedTrack === 'showcase') {
          show = showcaseCell?.textContent.includes('✅');
        }
        
        row.style.display = show ? '' : 'none';
      });
    });
  };

  return (
    <div className="track-filter">
      <label>Show tasks for:</label>
      <select onChange={(e) => {
        setSelectedTrack(e.target.value);
        filterRows();
      }}>
        <option value="both">Both Tracks</option>
        <option value="mvp">MVP Track Only</option>
        <option value="showcase">Showcase Track Only</option>
      </select>
    </div>
  );
}
```

## Migration Checklist

When converting existing tables:

- [x] Identify all MVP/Showcase duplicate tables
- [x] Merge task lists into single table
- [x] Add MVP and Showcase columns with ✅/❌ indicators
- [x] Use progressive enhancement notation for different implementations
- [x] Update exit criteria to consolidated format
- [ ] Test with JavaScript filter (if using docs site)
- [x] Verify all content is preserved
- [x] Update cross-references

### Consolidation Status

**Completed Phases:**
- [x] Phase 8 QA - Implementation steps & exit criteria consolidated
- [x] Phase 11 Documentation - Implementation steps & exit criteria consolidated  
- [x] Phase 12 Post Launch - Implementation steps & exit criteria consolidated
- [x] Phase 6 Sections - Implementation steps & exit criteria consolidated
- [x] Phase 5 Components - Implementation steps consolidated

**Already Using Consolidated Format:**
- Phase 4 Skeleton - Uses consolidated format ✅
- Phase 9 Performance - Uses consolidated format ✅

**No Duplication Issues:**
- Phases 0-3, 7, 10 - Single track or no table duplication

## Benefits

1. **Reduced Maintenance**: Edit once, applies to both tracks
2. **Consistency**: Standardized format across all phases
3. **Clarity**: Easy to see track differences at a glance
4. **Flexibility**: JavaScript filtering for focused view
5. **Completeness**: Harder to miss tasks when merging

## Example Implementation

See `phase-8-qa.md` for a complete example of the consolidated format in action.

## Future Enhancements

- Interactive filtering in docs site
- Track-specific view toggles
- Progressive disclosure of details
- Color coding for track differentiation
