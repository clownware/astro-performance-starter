# ADR 018: Contact Page Accessibility Enhancements

**Status**: Accepted  
**Date**: 2025-10-01  
**Deciders**: Development Team  
**Tags**: accessibility, wcag-aa, contact-page, emojis, aria

## Context

The `contact.astro` page contained several accessibility issues that could impact screen reader users:

1. **Decorative emojis** were not hidden from assistive technology, causing redundant announcements
2. **Badge components** used `role="status"` for all instances, even when decorative or informational
3. **Focus order** in grid layouts needed validation documentation

These issues violated WCAG 2.1 Level AA guidelines for perceivable and operable content.

## Decision

We will implement the following accessibility enhancements:

### 1. Decorative Emojis with `aria-hidden="true"`

All decorative emojis that serve purely visual purposes will be hidden from screen readers:

```astro
<!-- Before -->
<span class="text-2xl">📧</span>

<!-- After -->
<span class="text-2xl" aria-hidden="true">📧</span>
```

**Affected emojis** (9 total):

- 📧 Email icon
- 💬 Chat icon
- 📞 Phone icon
- 📍 Location icon
- 🕒 Time icon
- 🌍 Globe icon
- ⚡ Lightning icon
- 🎯 Target icon
- 🤝 Handshake icon

**Rationale**: Adjacent text already conveys the meaning (e.g., "Email" heading next to 📧), making emoji announcement redundant and potentially confusing.

### 2. Semantic Badge Roles

Badge components now use appropriate ARIA roles based on their purpose:

```astro
<!-- Decorative/Informational badges -->
<Badge role="presentation">Available for new projects</Badge>
<Badge role="presentation">Remote-friendly</Badge>

<!-- Status badges (live updates) -->
<Badge role="status">Online now</Badge>
```

**Role Guidelines**:

- `role="presentation"` - Decorative or informational badges that don't announce status changes
- `role="status"` - Live status updates that should be announced (e.g., "Online now")
- No role - Default for general informational content

### 3. Focus Order Documentation

Added HTML comments documenting that grid layouts follow natural DOM order for keyboard navigation:

```astro
<!-- Focus order: Grid flows naturally left-to-right, top-to-bottom for keyboard navigation -->
<section class="py-16 bg-background-surface">
  <div class="grid md:grid-cols-3 gap-8">
    <!-- Content flows naturally -->
  </div>
</section>
```

## Consequences

### Positive

- **Screen Reader Experience**: Eliminates redundant emoji announcements, reducing cognitive load
- **Semantic Correctness**: Badge roles accurately reflect their purpose
- **WCAG AA Compliance**: Meets WCAG 2.1 Level AA criteria for:
  - 1.1.1 Non-text Content (Level A)
  - 1.3.1 Info and Relationships (Level A)
  - 2.4.3 Focus Order (Level A)
- **Developer Clarity**: Comments document accessibility considerations for future maintainers
- **Testing Ready**: Changes enable proper automated accessibility testing

### Negative

- **Minimal**: No negative consequences - these are pure accessibility improvements

### Neutral

- **Visual Appearance**: No visual changes - only affects assistive technology
- **Performance**: No performance impact

## Implementation Details

### Emoji Accessibility Pattern

```astro
<!-- Decorative emoji (visual enhancement only) -->
<span aria-hidden="true">📧</span>
<h3>Email</h3> <!-- Text conveys meaning -->

<!-- Meaningful emoji (rare - would need alt text via title or aria-label) -->
<span role="img" aria-label="Warning">⚠️</span>
```

### Badge Role Decision Tree

```
Is the badge announcing a live status change?
├─ YES → role="status" (e.g., "Online now", "Processing")
└─ NO → Is it purely decorative?
    ├─ YES → role="presentation"
    └─ NO → No role (default semantic span)
```

## Testing Recommendations

1. **Screen Reader Testing**:
   - NVDA (Windows)
   - JAWS (Windows)
   - VoiceOver (macOS/iOS)

2. **Keyboard Navigation**:
   - Tab through all interactive elements
   - Verify focus order is logical (left-to-right, top-to-bottom)
   - Ensure no keyboard traps

3. **Automated Testing**:

   ```bash
   pnpm run test:a11y  # Playwright with axe-core
   ```

## Related ADRs

- ADR 000: Starter Decisions (WCAG AA compliance requirement)
- ADR 016: Badge Component (Atomic design pattern)

## References

- [WCAG 2.1 - Non-text Content](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html)
- [ARIA: presentation role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/presentation_role)
- [ARIA: status role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/status_role)
- [Accessible Emoji Guidelines](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA24)
