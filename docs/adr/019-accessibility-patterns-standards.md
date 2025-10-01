# ADR 019: Accessibility Patterns & Standards

**Status**: Accepted  
**Date**: 2025-10-01  
**Deciders**: Development Team  
**Tags**: accessibility, wcag-aa, patterns, standards

## Context

The Astro Performance Starter targets **WCAG 2.1 Level AA compliance** across all components and pages. As the codebase has grown, we need a consolidated reference for accessibility patterns to ensure consistency and maintainability.

This ADR consolidates all accessibility architectural decisions and patterns into a single source of truth.

## Compliance Target

**WCAG 2.1 Level AA** - All components and pages must meet or exceed this standard.

Key principles:

- **Perceivable**: Information must be presentable to users in ways they can perceive
- **Operable**: UI components must be operable by all users
- **Understandable**: Information and UI operation must be understandable
- **Robust**: Content must be robust enough for assistive technologies

## Accessibility Patterns

### 1. Decorative Content

#### Emojis

**Pattern**: All decorative emojis must be hidden from screen readers.

```astro
<!-- ✅ Correct: Decorative emoji with adjacent text -->
<span aria-hidden="true">📧</span>
<h3>Email</h3>

<!-- ❌ Incorrect: Screen reader announces "envelope" redundantly -->
<span>📧</span>
<h3>Email</h3>

<!-- ✅ Correct: Meaningful emoji (rare case) -->
<span role="img" aria-label="Warning">⚠️</span>
```

**When to use**:

- Emoji serves purely visual enhancement
- Adjacent text conveys the same meaning
- Emoji is decorative/illustrative

**When NOT to use**:

- Emoji is the only indicator of meaning (use `role="img"` + `aria-label`)
- Emoji conveys unique information not in text

**Implementation**: See [ADR 018](./018-contact-page-accessibility.md) for contact page example.

---

#### Icons

**Pattern**: Decorative icons should be hidden; functional icons need labels.

```astro
<!-- ✅ Decorative icon with adjacent text -->
<img src={icon.src} alt="" aria-hidden="true" />
<span>GitHub</span>

<!-- ✅ Functional icon-only button -->
<button aria-label="Close menu">
  <img src={closeIcon.src} alt="" aria-hidden="true" />
</button>

<!-- ❌ Icon-only button without label -->
<button>
  <img src={closeIcon.src} alt="Close" />
</button>
```

**Guidelines**:

- Use `alt=""` for decorative images (not `alt="icon"`)
- Add `aria-hidden="true"` to prevent redundant announcements
- Icon-only interactive elements MUST have `aria-label`
- Prefer text + icon over icon-only when possible

---

#### Images

**Pattern**: Use appropriate alt text based on image purpose.

```astro
<!-- ✅ Informative image -->
<Image src={screenshot} alt="Dashboard showing performance metrics" />

<!-- ✅ Decorative image -->
<Image src={background} alt="" />

<!-- ✅ Functional image (link/button) -->
<a href="/about">
  <Image src={avatar} alt="About Jane Doe" />
</a>

<!-- ❌ Missing alt text -->
<Image src={photo} />
```

**Alt text guidelines**:

- **Informative**: Describe content and function
- **Decorative**: Use `alt=""` (empty string, not omitted)
- **Functional**: Describe destination/action
- **Complex**: Provide long description via adjacent text or `aria-describedby`

---

### 2. ARIA Roles

#### Badge Component

**Pattern**: Use semantic roles based on badge purpose.

```astro
<!-- ✅ Decorative/Informational badge -->
<Badge role="presentation">Available for projects</Badge>
<Badge role="presentation">Remote-friendly</Badge>

<!-- ✅ Live status update -->
<Badge role="status">Online now</Badge>
<Badge role="status">Processing...</Badge>

<!-- ✅ Default informational (no role) -->
<Badge>TypeScript</Badge>
```

**Decision tree**:

```
Is the badge announcing a live status change?
├─ YES → role="status"
│   Examples: "Online now", "Processing", "3 unread"
└─ NO → Is it purely decorative?
    ├─ YES → role="presentation"
    │   Examples: "Remote-friendly", "Quick response"
    └─ NO → No role (default)
        Examples: Technology tags, categories
```

**Rationale**: `role="status"` causes screen readers to announce changes, which is only appropriate for live updates.

---

#### Interactive Components

**Pattern**: Ensure all interactive elements have accessible names.

```astro
<!-- ✅ SocialLink with context -->
<SocialLink 
  platform="github" 
  href="https://github.com/user"
  aria-label="Visit my GitHub profile (opens in new tab)"
/>

<!-- ✅ Button with explicit label -->
<Button href="/contact" aria-label="Contact us">
  Get In Touch
</Button>

<!-- ✅ Form input with associated label -->
<label for="email">Email Address</label>
<input id="email" type="email" required />
```

**Requirements**:

- All interactive elements must have accessible names
- Use `aria-label` when visible text is insufficient
- Associate form inputs with `<label>` elements
- Provide context for links that open in new tabs

---

### 3. Focus Management

#### Skip Links

**Pattern**: All pages must include skip links for keyboard navigation.

```astro
<!-- ✅ Skip link in BaseLayout -->
<SkipLink href="#main-content">Skip to main content</SkipLink>

<main id="main-content">
  <!-- Page content -->
</main>
```

**Requirements**:

- Skip link must be first focusable element
- Target must be a valid `id` on the page
- Skip link can be visually hidden until focused
- Must be keyboard accessible (Tab key)

**Implementation**: `src/components/a11y/SkipLink.astro`

---

#### Focus Order

**Pattern**: Focus order must follow logical reading order (left-to-right, top-to-bottom).

```astro
<!-- ✅ Natural DOM order -->
<div class="grid md:grid-cols-3 gap-8">
  <div>First item</div>
  <div>Second item</div>
  <div>Third item</div>
</div>

<!-- ❌ CSS reordering that breaks tab order -->
<div class="flex">
  <div class="order-2">Visually first</div>
  <div class="order-1">Visually second</div>
</div>
```

**Guidelines**:

- Use natural DOM order for tab navigation
- Avoid CSS `order` property that conflicts with DOM order
- Test with keyboard-only navigation
- Document complex focus flows with HTML comments

---

#### Focus Indicators

**Pattern**: All focusable elements must have visible focus indicators.

```astro
<!-- ✅ Tailwind focus utilities -->
<button class="focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
  Click me
</button>

<!-- ✅ Custom focus-ring utility (from tailwind.config.ts) -->
<a href="/about" class="focus-ring">
  About
</a>
```

**Requirements**:

- Focus indicators must have 3:1 contrast ratio with background
- Never use `outline: none` without replacement
- Use `focus-visible:` for keyboard-only indicators
- Test with keyboard navigation

---

### 4. Forms & Validation

#### Form Labels

**Pattern**: All form inputs must have associated labels.

```astro
<!-- ✅ Explicit label association -->
<label for="name">Full Name</label>
<input id="name" type="text" required />

<!-- ✅ Implicit label (less preferred) -->
<label>
  Email Address
  <input type="email" required />
</label>

<!-- ✅ Hidden label with aria-label -->
<input 
  type="search" 
  aria-label="Search blog posts"
  placeholder="Search..."
/>
```

**Requirements**:

- Use explicit `for`/`id` association when possible
- Provide visible labels (not just placeholders)
- Use `aria-label` only when visible label isn't feasible
- Group related inputs with `<fieldset>` and `<legend>`

---

#### Error Messages

**Pattern**: Error messages must be programmatically associated with inputs.

```astro
<!-- ✅ Error with aria-describedby -->
<label for="email">Email</label>
<input 
  id="email" 
  type="email" 
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">
  Please enter a valid email address
</span>

<!-- ✅ Live region for dynamic errors -->
<div role="alert" aria-live="polite">
  {errorMessage}
</div>
```

**Requirements**:

- Use `aria-invalid="true"` on invalid inputs
- Associate errors with `aria-describedby`
- Use `role="alert"` for error messages
- Provide clear, actionable error text

---

### 5. Semantic HTML

#### Landmarks

**Pattern**: Use semantic HTML5 elements for page structure.

```astro
<!-- ✅ Semantic structure -->
<header>
  <nav aria-label="Main navigation">
    <!-- Navigation links -->
  </nav>
</header>

<main id="main-content">
  <article>
    <h1>Page Title</h1>
    <!-- Content -->
  </article>
</main>

<footer>
  <!-- Footer content -->
</footer>

<!-- ❌ Non-semantic divs -->
<div class="header">
  <div class="nav">
    <!-- Navigation -->
  </div>
</div>
```

**Requirements**:

- Use `<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>`
- One `<main>` landmark per page
- Use `aria-label` to distinguish multiple `<nav>` elements
- Avoid redundant ARIA roles on semantic elements

---

#### Headings

**Pattern**: Use proper heading hierarchy (h1-h6).

```astro
<!-- ✅ Proper hierarchy -->
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>
  <h2>Another Section</h2>

<!-- ❌ Skipped levels -->
<h1>Page Title</h1>
  <h3>Section</h3> <!-- Skipped h2 -->
```

**Requirements**:

- One `<h1>` per page
- Don't skip heading levels
- Use headings for structure, not styling
- Use CSS for visual hierarchy

---

### 6. Color & Contrast

#### Contrast Ratios

**Pattern**: All text must meet WCAG AA contrast requirements.

**Requirements**:

- **Normal text**: 4.5:1 minimum contrast ratio
- **Large text** (18pt+ or 14pt+ bold): 3:1 minimum
- **UI components**: 3:1 for interactive elements
- **Disabled elements**: Exempt from contrast requirements

**Validation**: Use `pnpm run design:validate` to check token contrast.

---

#### Color Alone

**Pattern**: Don't rely on color alone to convey information.

```astro
<!-- ✅ Color + icon + text -->
<div class="text-red-600">
  <span aria-hidden="true">❌</span>
  <span>Error: Invalid input</span>
</div>

<!-- ❌ Color only -->
<div class="text-red-600">
  Invalid input
</div>
```

**Requirements**:

- Use icons, text, or patterns in addition to color
- Provide text alternatives for color-coded information
- Test with grayscale/colorblind simulators

---

### 7. Motion & Animation

#### Reduced Motion

**Pattern**: Respect `prefers-reduced-motion` user preference.

```css
/* ✅ Respect user preference */
.animate {
  animation: slide-in 0.3s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .animate {
    animation: none;
  }
}
```

**Tailwind utilities**:

```astro
<!-- ✅ Motion-safe utilities -->
<div class="motion-safe:transition-transform motion-reduce:transition-none">
  Content
</div>
```

**Requirements**:

- All animations must respect `prefers-reduced-motion`
- Use Tailwind `motion-safe:` and `motion-reduce:` utilities
- Provide instant state changes for reduced motion
- Never use animation for critical information

---

## Testing Strategy

### Manual Testing

1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Verify focus indicators are visible
   - Test Shift+Tab (reverse navigation)
   - Ensure no keyboard traps

2. **Screen Readers**
   - **NVDA** (Windows + Firefox)
   - **JAWS** (Windows + Chrome/Edge)
   - **VoiceOver** (macOS + Safari)
   - **TalkBack** (Android + Chrome)

3. **Browser DevTools**
   - Chrome Lighthouse accessibility audit
   - Firefox Accessibility Inspector
   - axe DevTools browser extension

### Automated Testing

```bash
# Run accessibility tests
pnpm run test:a11y

# Validate design token contrast
pnpm run design:validate

# Full quality check
pnpm run quality
```

**Tools**:

- **Playwright** with `@axe-core/playwright` for automated testing
- **Lighthouse CI** for performance + accessibility scores
- **Custom scripts** for contrast validation

---

## Implementation Examples

### Contact Page (ADR 018)

See [ADR 018: Contact Page Accessibility](./018-contact-page-accessibility.md) for a complete implementation example covering:

- Decorative emoji patterns
- Semantic badge roles
- Focus order documentation

### Component Library

All atomic components follow these patterns:

- `src/components/atoms/Badge.astro` - Semantic roles
- `src/components/atoms/SocialLink.astro` - Accessible links
- `src/components/atoms/Button.astro` - Focus indicators
- `src/components/a11y/SkipLink.astro` - Skip navigation

---

## Consequences

### Positive

- **Single Source of Truth**: One document for all accessibility patterns
- **Consistency**: Clear guidelines prevent accessibility debt
- **Onboarding**: New developers have comprehensive reference
- **Maintainability**: Easier to update patterns in one place
- **Compliance**: Systematic approach ensures WCAG AA compliance

### Negative

- **Initial Overhead**: Requires upfront documentation effort
- **Maintenance**: Must keep ADR updated as patterns evolve

### Neutral

- **Living Document**: This ADR will be updated as new patterns emerge
- **Not Exhaustive**: Covers common patterns; edge cases may need additional documentation

---

## Related ADRs

- [ADR 000: Starter Decisions](./000-starter-decisions.md) - WCAG AA compliance requirement
- [ADR 018: Contact Page Accessibility](./018-contact-page-accessibility.md) - Implementation example

---

## References

### WCAG Guidelines

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Understanding WCAG 2.1](https://www.w3.org/WAI/WCAG21/Understanding/)

### ARIA Specifications

- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [ARIA Roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)

### Testing Resources

- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Screen Reader Testing](https://www.accessibility-developer-guide.com/knowledge/screen-readers/)

### Tools

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
