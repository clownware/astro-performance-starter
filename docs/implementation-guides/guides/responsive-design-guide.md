---
title: Responsive Design Guide
description: Comprehensive guide to responsive design patterns, breakpoints, and mobile-first development in the Astro Performance Starter
lastUpdated: 2025-09-30T00:00:00.000Z
tableOfContents: true
pagefind: true
---

> 🎨 **Purpose**: Master responsive design patterns with mobile-first methodology and Tailwind CSS breakpoints

## Overview

The Astro Performance Starter uses a **mobile-first responsive design** approach with Tailwind CSS. This guide covers breakpoint strategy, responsive patterns, and practical examples from the template.

## Breakpoint System

### Default Tailwind Breakpoints

The template uses Tailwind's default breakpoint system (no custom overrides):

| Breakpoint | Min Width | Target Devices | Usage |
|------------|-----------|----------------|-------|
| `sm:` | 640px | Large phones (landscape), small tablets | Minor layout adjustments |
| `md:` | 768px | Tablets, small laptops | Navigation changes, 2-column layouts |
| `lg:` | 1024px | Laptops, desktops | 3-column layouts, expanded spacing |
| `xl:` | 1280px | Large desktops | 4-column layouts, maximum content width |
| `2xl:` | 1536px | Extra-large screens | Optional enhancements |

### Mobile-First Philosophy

**Base styles target mobile devices** (< 640px). Breakpoint prefixes add styles as screen size increases:

```css
/* ❌ Desktop-first (avoid) */
.element {
  width: 100%;           /* Desktop */
  @media (max-width: 768px) {
    width: 50%;          /* Mobile - requires override */
  }
}

/* ✅ Mobile-first (preferred) */
.element {
  width: 50%;            /* Mobile baseline */
  md:width: 100%;        /* Tablet and up */
}
```

## Core Responsive Patterns

### 1. Container Pattern

The `Container` component provides consistent horizontal padding and max-width:

```astro
---
// src/components/structural/Container.astro
interface Props {
  class?: string;
}

const { class: className } = Astro.props;
---

<div class:list={["mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className]}>
  <slot />
</div>
```

**Responsive behavior:**

- Mobile: `16px` padding (`px-4`)
- Tablet: `24px` padding (`sm:px-6`)
- Desktop: `32px` padding (`lg:px-8`)
- Max width: `1280px` (`max-w-7xl`)

**Usage:**

```astro
<Container>
  <h1>Your content here</h1>
</Container>
```

### 2. Grid Pattern

Responsive grid layouts that adapt column count by screen size:

```astro
---
// src/components/structural/Grid.astro
interface Props {
  class?: string;
}

const { class: className } = Astro.props;
---

<div class:list={["grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3", className]}>
  <slot />
</div>
```

**Responsive behavior:**

- Mobile: 1 column (`grid-cols-1`)
- Tablet: 2 columns (`md:grid-cols-2`)
- Desktop: 3 columns (`lg:grid-cols-3`)
- Gap: `32px` consistent across breakpoints

**Usage:**

```astro
<Grid>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>
```

### 3. Flexible Grid with Props

For more control, use the MDX Grid component with breakpoint props:

```astro
---
// src/components/mdx/Grid.astro
export interface Props {
  cols?: number;   // Base mobile columns
  sm?: number;     // Small screens
  md?: number;     // Medium screens
  lg?: number;     // Large screens
  xl?: number;     // Extra-large screens
  gap?: number;    // Gap size (Tailwind scale)
  class?: string;
}
---
```

**Usage examples:**

```astro
<!-- 1 col mobile, 2 col tablet, 4 col desktop -->
<Grid cols={1} md={2} lg={4}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
  <Card>Item 4</Card>
</Grid>

<!-- Custom gap -->
<Grid cols={1} md={2} gap={6}>
  <Card>Wider spacing</Card>
  <Card>Between items</Card>
</Grid>
```

### 4. Navigation Pattern

Hide/show navigation based on screen size with CSS-only mobile menu:

```astro
<header class="sticky top-0 z-50 w-full">
  <div class="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
    <!-- Logo -->
    <a href="/">Logo</a>

    <!-- Desktop Navigation: hidden on mobile, visible md+ -->
    <nav class="hidden md:flex items-center gap-8">
      <a href="/about">About</a>
      <a href="/blog">Blog</a>
    </nav>

    <!-- Mobile Menu Toggle: visible on mobile, hidden md+ -->
    <label class="md:hidden">
      <input type="checkbox" class="peer sr-only" />
      <!-- Hamburger icon -->
    </label>
  </div>

  <!-- Mobile Menu: hidden by default, shown when checkbox checked -->
  <nav class="hidden peer-checked:flex md:hidden">
    <a href="/about">About</a>
    <a href="/blog">Blog</a>
  </nav>
</header>
```

**Key techniques:**

- `hidden md:flex` - Hide on mobile, show as flex on tablet+
- `md:hidden` - Show on mobile, hide on tablet+
- `peer-checked:flex` - CSS-only toggle (no JavaScript)

### 5. Typography Scaling

Scale text sizes responsively for optimal readability:

```astro
<!-- Hero heading -->
<h1 class="text-3xl sm:text-4xl lg:text-6xl font-extrabold">
  Responsive Heading
</h1>

<!-- Body text -->
<p class="text-base sm:text-lg leading-6 sm:leading-7">
  Responsive paragraph with adjusted line height
</p>

<!-- Small text -->
<span class="text-xs sm:text-sm">
  Responsive caption
</span>
```

**Font size progression:**

- Mobile: Smaller, compact text
- Tablet: Moderate increase
- Desktop: Full size for comfortable reading

### 6. Spacing Adjustments

Adjust margins, padding, and gaps across breakpoints:

```astro
<!-- Vertical spacing -->
<Section class="py-12 sm:py-16 lg:py-24">
  <Container>
    <div class="space-y-8 sm:space-y-12 lg:space-y-16">
      <!-- Content with responsive vertical spacing -->
    </div>
  </Container>
</Section>

<!-- Button spacing -->
<div class="flex flex-col sm:flex-row gap-3 sm:gap-6">
  <Button>Primary</Button>
  <Button>Secondary</Button>
</div>
```

**Spacing strategy:**

- Mobile: Tighter spacing for smaller screens
- Tablet: Moderate spacing increase
- Desktop: Generous spacing for visual breathing room

### 7. Flex Direction Changes

Stack elements vertically on mobile, horizontally on larger screens:

```astro
<!-- Vertical on mobile, horizontal on tablet+ -->
<div class="flex flex-col sm:flex-row items-center gap-4">
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</div>

<!-- Footer layout -->
<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  <p>Copyright info</p>
  <div>Social links</div>
</div>
```

### 8. Component Size Adjustments

Scale component dimensions responsively:

```astro
<!-- Responsive button -->
<Button class="text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-6">
  Click Me
</Button>

<!-- Responsive badge -->
<Badge class="text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2">
  New Feature
</Badge>

<!-- Responsive icon -->
<svg class="w-4 h-4 sm:w-5 sm:h-5">
  <!-- Icon path -->
</svg>
```

## Real-World Examples

### Example 1: Hero Section

From `src/pages/index.astro`:

```astro
<Section class="min-h-[calc(100vh-4rem)]">
  <Container>
    <div class="mx-auto max-w-4xl text-center">
      <!-- Badge: responsive padding and text -->
      <Badge class="mb-4 sm:mb-6 text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2">
        🎆 Production-Ready Template
      </Badge>
      
      <!-- Heading: 3xl → 4xl → 6xl -->
      <h1 class="text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight">
        Astro Performance Starter
      </h1>
      
      <!-- Description: base → lg with line-height adjustment -->
      <p class="mt-3 sm:mt-4 text-base sm:text-lg leading-6 sm:leading-7">
        Build blazing-fast websites with modern architecture
      </p>
      
      <!-- Buttons: vertical → horizontal -->
      <div class="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
        <Button class="text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-6">
          View on GitHub
        </Button>
        <Button class="text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-6">
          Documentation
        </Button>
      </div>
    </div>
  </Container>
</Section>
```

**Responsive features:**

- Typography scales across 3 breakpoints
- Spacing increases progressively
- Button layout changes from stacked to horizontal
- Component sizes adjust proportionally

### Example 2: Feature Grid

From `src/pages/index.astro`:

```astro
<!-- 1 column mobile, 2 columns tablet, 3 columns desktop, 4 columns XL -->
<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {techStack.map((tech) => (
    <Card class="p-6 hover:shadow-lg transition-shadow">
      <h3 class="font-semibold">{tech.name}</h3>
      <p class="text-sm">{tech.description}</p>
    </Card>
  ))}
</div>
```

### Example 3: Footer Layout

From `src/components/structural/Footer.astro`:

```astro
<footer>
  <Container class="py-16 sm:py-20 lg:py-24">
    <!-- 1 column mobile, 4 columns desktop -->
    <div class="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-4 lg:gap-12">
      <div class="lg:col-span-1">
        <!-- Brand section -->
      </div>
      <div class="lg:col-span-1">
        <!-- Navigation links -->
      </div>
      <div class="lg:col-span-1">
        <!-- Docs links -->
      </div>
      <div class="lg:col-span-1">
        <!-- Social links -->
      </div>
    </div>

    <!-- Copyright: vertical → horizontal -->
    <div class="border-t mt-16 pt-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p class="text-sm">© 2025 Company</p>
        <div class="flex flex-wrap gap-4">
          <!-- Badges -->
        </div>
      </div>
    </div>
  </Container>
</footer>
```

### Example 4: Metrics Display

From `src/pages/index.astro`:

```astro
<!-- 2 columns mobile, 4 columns tablet+ -->
<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
  {metrics.map((metric) => (
    <Card class="p-6 text-center">
      <div class="text-3xl font-bold">{metric.score}</div>
      <div class="text-sm">{metric.label}</div>
    </Card>
  ))}
</div>
```

## Design Token Integration

### Responsive Spacing with Tokens

Design tokens from `tokens/base.json` work seamlessly with responsive utilities:

```astro
<!-- Using token-based spacing -->
<div class="px-4 sm:px-6 lg:px-8">
  <!-- 1rem → 1.5rem → 2rem -->
</div>

<div class="space-y-8 sm:space-y-12 lg:space-y-16">
  <!-- 2rem → 3rem → 4rem vertical spacing -->
</div>
```

### Responsive Typography Tokens

Font sizes from design tokens scale predictably:

```astro
<!-- xs → sm → base progression -->
<p class="text-xs sm:text-sm lg:text-base">
  Scales from 0.75rem → 0.875rem → 1rem
</p>

<!-- 2xl → 3xl → 4xl progression -->
<h2 class="text-2xl sm:text-3xl lg:text-4xl">
  Scales from 1.5rem → 1.875rem → 2.25rem
</h2>
```

## Best Practices

### 1. Mobile-First Mindset

Always start with mobile styles, then enhance for larger screens:

```astro
<!-- ✅ Correct: Mobile-first -->
<div class="w-full md:w-1/2 lg:w-1/3">
  <!-- 100% → 50% → 33.33% -->
</div>

<!-- ❌ Incorrect: Desktop-first -->
<div class="w-1/3 lg:w-1/2 md:w-full">
  <!-- Confusing, harder to maintain -->
</div>
```

### 2. Consistent Breakpoint Usage

Use the same breakpoints throughout your project:

```astro
<!-- ✅ Consistent: sm, md, lg pattern -->
<div class="text-sm sm:text-base lg:text-lg">
<div class="px-4 sm:px-6 lg:px-8">
<div class="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
```

```astro
<!-- ❌ Inconsistent: random breakpoint choices -->
<div class="text-sm md:text-base xl:text-lg">
<div class="px-4 lg:px-6 2xl:px-8">
```

### 3. Test at Breakpoint Boundaries

Test your layouts at exact breakpoint widths:

- 639px (just before `sm:`)
- 640px (at `sm:`)
- 767px (just before `md:`)
- 768px (at `md:`)
- etc.

### 4. Avoid Excessive Breakpoints

Don't specify every breakpoint if not needed:

```astro
<!-- ✅ Good: Only necessary breakpoints -->
<div class="text-base lg:text-lg">

<!-- ❌ Overkill: Too many breakpoints -->
<div class="text-base sm:text-base md:text-base lg:text-lg xl:text-lg">
```

### 5. Use Responsive Utilities Strategically

Common responsive patterns:

```astro
<!-- Hide/show elements -->
<div class="hidden md:block">Desktop only</div>
<div class="block md:hidden">Mobile only</div>

<!-- Change flex direction -->
<div class="flex flex-col md:flex-row">

<!-- Adjust alignment -->
<div class="text-center md:text-left">

<!-- Modify positioning -->
<div class="relative md:absolute">

<!-- Change display mode -->
<div class="block md:flex md:items-center">
```

### 6. Maintain Aspect Ratios

Use aspect ratio utilities for responsive images and videos:

```astro
<!-- 16:9 aspect ratio maintained across breakpoints -->
<div class="aspect-video">
  <iframe src="..." class="w-full h-full"></iframe>
</div>

<!-- Square on mobile, 16:9 on desktop -->
<div class="aspect-square md:aspect-video">
  <img src="..." class="w-full h-full object-cover" />
</div>
```

### 7. Responsive Images

Use Astro's Image component with responsive sizing:

```astro
---
import { Image } from 'astro:assets';
import heroImage from '@/assets/hero.png';
---

<!-- Responsive image with optimized formats -->
<Image
  src={heroImage}
  alt="Hero image"
  widths={[320, 640, 960, 1280]}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  class="w-full h-auto"
/>
```

## Performance Considerations

### 1. Minimize Layout Shifts

Avoid responsive changes that cause Cumulative Layout Shift (CLS):

```astro
<!-- ✅ Good: Maintains layout structure -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <!-- Content reflows smoothly -->
</div>

<!-- ⚠️ Caution: May cause layout shift -->
<div class="hidden md:block">
  <!-- Element appears/disappears -->
</div>
```

### 2. Use CSS Grid Over Floats

Modern CSS Grid handles responsive layouts efficiently:

```astro
<!-- ✅ Modern: CSS Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

<!-- ❌ Legacy: Float-based (avoid) -->
<div class="float-left w-full md:w-1/2 lg:w-1/3">
```

### 3. Optimize for Touch Targets

Ensure interactive elements are large enough on mobile (minimum 44x44px):

```astro
<!-- ✅ Good: Touch-friendly sizes -->
<button class="h-12 px-6 sm:h-10 sm:px-4">
  <!-- 48px height on mobile, 40px on desktop -->
</button>

<!-- ❌ Bad: Too small on mobile -->
<button class="h-8 px-2">
  <!-- 32px height - hard to tap -->
</button>
```

## Accessibility Considerations

### 1. Maintain Focus Visibility

Ensure focus indicators work across all breakpoints:

```astro
<a href="/about" class="focus-visible-ring">
  <!-- Focus ring visible at all sizes -->
</a>
```

### 2. Preserve Heading Hierarchy

Don't change heading levels based on screen size:

```astro
<!-- ✅ Correct: Same semantic level -->
<h2 class="text-2xl sm:text-3xl lg:text-4xl">
  Heading
</h2>

<!-- ❌ Wrong: Don't do this -->
<h3 class="md:h2 lg:h1">
  <!-- Breaks semantic structure -->
</h3>
```

### 3. Ensure Content Parity

Mobile users should access the same content as desktop users:

```astro
<!-- ✅ Good: Same content, different layout -->
<nav class="hidden md:flex">
  <a href="/about">About</a>
</nav>
<nav class="md:hidden">
  <a href="/about">About</a>
</nav>

<!-- ❌ Bad: Missing content on mobile -->
<nav class="hidden md:flex">
  <a href="/about">About</a>
</nav>
<!-- No mobile alternative -->
```

## Testing Responsive Designs

### 1. Browser DevTools

Use responsive design mode in Chrome/Firefox DevTools:

- Test at common device widths (375px, 768px, 1024px, 1440px)
- Test at breakpoint boundaries
- Test with device emulation (iPhone, iPad, etc.)

### 2. Real Device Testing

Test on actual devices when possible:

- iOS Safari (different rendering than Chrome)
- Android Chrome
- Tablets in both orientations

### 3. Automated Testing

Use Playwright for responsive testing:

```typescript
// tests/responsive.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('mobile layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Mobile menu should be visible
    await expect(page.locator('[aria-label="Toggle menu"]')).toBeVisible();
    
    // Desktop nav should be hidden
    await expect(page.locator('nav.hidden.md\\:flex')).not.toBeVisible();
  });

  test('desktop layout', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    
    // Desktop nav should be visible
    await expect(page.locator('nav.hidden.md\\:flex')).toBeVisible();
    
    // Mobile menu toggle should be hidden
    await expect(page.locator('[aria-label="Toggle menu"]')).not.toBeVisible();
  });
});
```

## Common Patterns Reference

### Quick Reference Table

| Pattern | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Container padding | `px-4` | `sm:px-6` | `lg:px-8` |
| Grid columns | `grid-cols-1` | `md:grid-cols-2` | `lg:grid-cols-3` |
| Hero heading | `text-3xl` | `sm:text-4xl` | `lg:text-6xl` |
| Body text | `text-base` | `sm:text-lg` | - |
| Section padding | `py-12` | `sm:py-16` | `lg:py-24` |
| Button height | `h-10` | `sm:h-12` | - |
| Flex direction | `flex-col` | `sm:flex-row` | - |
| Navigation | `hidden` | `md:flex` | - |

## Troubleshooting

### Issue: Breakpoint Not Working

**Problem:** Responsive class not applying at expected breakpoint.

**Solutions:**

1. Check class order: `base sm: md: lg:` (mobile-first)
2. Verify no conflicting styles
3. Inspect in DevTools to see computed styles
4. Ensure Tailwind is processing the file (check `content` in `tailwind.config.ts`)

### Issue: Layout Shift on Resize

**Problem:** Content jumps when resizing browser.

**Solutions:**

1. Use consistent spacing across breakpoints
2. Avoid `hidden`/`block` toggles for large content
3. Set explicit heights where appropriate
4. Use `transition-all` for smooth changes

### Issue: Text Too Small on Mobile

**Problem:** Text is hard to read on small screens.

**Solutions:**

1. Start with `text-base` (16px) minimum for body text
2. Use `text-lg` or larger for important content
3. Increase line-height: `leading-6` or `leading-7`
4. Test on real devices, not just DevTools

## Related Documentation

- [Component Patterns](/patterns/component-patterns/) - Component architecture
- [Design System](/implementation-guides/completed/phase-2-design-system/) - Design tokens and theming
- [Accessibility Guide](/implementation-guides/guides/accessibility-guide/) - WCAG compliance
- [Performance Patterns](/patterns/performance-patterns/) - Optimization techniques

## Summary

The Astro Performance Starter's responsive design system provides:

✅ **Mobile-first approach** with Tailwind's default breakpoints  
✅ **Consistent patterns** across components and layouts  
✅ **Design token integration** for scalable spacing and typography  
✅ **Performance-optimized** with minimal layout shifts  
✅ **Accessibility-focused** with proper semantic structure  
✅ **Real-world examples** from production components

Start with mobile styles, progressively enhance for larger screens, and test at breakpoint boundaries for optimal responsive experiences.
