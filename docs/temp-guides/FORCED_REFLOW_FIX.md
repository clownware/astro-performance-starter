# Forced Reflow Fix: Projects Filter

## Issue

Lighthouse and browser DevTools detected a **forced reflow** performance issue in the projects page filter functionality. Forced reflows occur when JavaScript reads layout properties (like `offsetWidth`, `clientHeight`, etc.) or performs DOM queries after making style changes, causing the browser to synchronously recalculate layout.

## Root Cause

In `/src/pages/projects/index.astro`, the `filterProjects` function was causing layout thrashing by:

1. **Interleaving DOM reads and writes** in a loop
2. **Modifying styles synchronously** without batching
3. **Triggering multiple layout recalculations** during filtering

### Before (Problematic Code)

```typescript
const filterProjects = (filterValue: string) => {
  allCards.forEach((card: HTMLElement) => {
    const techStack = card.getAttribute('data-tech-stack') || ''; // READ
    const shouldShow = filterValue === 'all' || techStack.includes(filterValue);
    card.style.display = shouldShow ? 'block' : 'none'; // WRITE (forces reflow)
  });
  
  // More DOM writes scattered throughout
  emptyState.classList.toggle('hidden', visibleCount !== 0);
  filterButtons.forEach((btn) => btn.classList.remove('active'));
  // ... etc
};
```

**Problem**: Each `card.style.display` write potentially forces the browser to recalculate layout before the next iteration.

## Solution

Applied the **read-then-write pattern** with `requestAnimationFrame` batching:

### After (Optimized Code)

```typescript
const filterProjects = (filterValue: string, activeElement?: HTMLElement) => {
  // Phase 1: Batch all DOM READS first
  const updates: Array<{ card: HTMLElement; shouldShow: boolean }> = [];
  allCards.forEach((card: HTMLElement) => {
    const techStack = card.getAttribute('data-tech-stack') || '';
    const shouldShow = filterValue === 'all' || techStack.includes(filterValue);
    updates.push({ card, shouldShow }); // Store decision, don't write yet
    if (shouldShow) visibleCount++;
  });

  // Phase 2: Batch all DOM WRITES in next frame
  requestAnimationFrame(() => {
    updates.forEach(({ card, shouldShow }) => {
      card.style.display = shouldShow ? 'block' : 'none';
    });
    
    // All other DOM writes batched together
    if (emptyState) {
      emptyState.classList.toggle('hidden', visibleCount !== 0);
    }
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    filterBadges.forEach((badge) => {
      badge.classList.remove('active');
      badge.setAttribute('aria-pressed', 'false');
    });
    
    if (activeElement) {
      activeElement.classList.add('active');
      if (activeElement.hasAttribute('data-filter')) {
        activeElement.setAttribute('aria-pressed', 'true');
      }
    }
  });
};
```

## Performance Improvements

### Before

- **Multiple forced reflows** per filter operation
- Layout recalculated after each card style change
- Synchronous DOM updates block main thread

### After

- **Single layout calculation** per filter operation
- All DOM reads complete before any writes
- DOM updates batched in `requestAnimationFrame`
- Browser optimizes paint/composite phases

## Best Practices Applied

1. **Separate reads from writes**: Complete all DOM queries before making changes
2. **Batch updates**: Use `requestAnimationFrame` to group DOM modifications
3. **Minimize layout thrashing**: Avoid interleaving style changes with property reads
4. **Maintain functionality**: All filtering and button state logic preserved

## Testing

To verify the fix:

1. **Chrome DevTools Performance Tab**:

   ```bash
   pnpm run dev
   # Navigate to /projects
   # Open DevTools > Performance
   # Record while clicking filter buttons
   # Check for reduced "Recalculate Style" and "Layout" events
   ```

2. **Lighthouse Audit**:

   ```bash
   pnpm run build
   pnpm run preview
   # Run Lighthouse on http://localhost:4323/projects
   # Verify no "Avoid forced reflow" warnings
   ```

## References

- [Minimize browser reflow (MDN)](https://developer.mozilla.org/en-US/docs/Glossary/Reflow)
- [Avoid large, complex layouts and layout thrashing (web.dev)](https://web.dev/avoid-large-complex-layouts-and-layout-thrashing/)
- [What forces layout/reflow (gist)](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)

## Related Files

- `/src/pages/projects/index.astro` - Filter implementation
- `/PERFORMANCE_ANALYSIS.md` - Overall performance documentation

---

**Fixed**: 2025-10-17  
**Impact**: Improved filter performance, eliminated forced reflow warnings
