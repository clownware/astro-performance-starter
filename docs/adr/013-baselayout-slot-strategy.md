---
title: 'ADR-013: BaseLayout Slot Strategy for Hero and CTA Sections'
description: >-
  Defines the approach for handling hero and CTA sections in BaseLayout,
  choosing single default slot over named slots for maximum flexibility
  and minimal layout coupling.
lastUpdated: 2025-10-01T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

The `BaseLayout.astro` component currently uses a single default `<slot />` for page content. A suggestion was raised to add named slots for hero and CTA sections to provide more structured extensibility. However, this raises questions about:

- Whether BaseLayout should dictate specific content patterns (hero/CTA)
- How to maintain flexibility for diverse page layouts
- The balance between structure and coupling
- Consistency with Astro's composition patterns

## Decision Drivers

- **Separation of Concerns**: BaseLayout should handle document structure (HTML, head, body), not content patterns
- **Flexibility**: Pages should compose their own content structure without layout constraints
- **Atomic Design Principles**: Content sections (hero, CTA) are organisms/templates, not layout concerns
- **Zero-JS Performance**: Avoid unnecessary layout complexity that could impact performance
- **Developer Experience**: Minimize cognitive load and maximize composability

## Considered Options

### Option 1: Add named slots for hero and CTA sections

```astro
<BaseLayout>
  <slot name="hero" slot="hero" />
  <main>
    <slot />
  </main>
  <slot name="cta" slot="cta" />
</BaseLayout>
```

**Pros**:

- Explicit structure for common patterns
- Could enforce consistent hero/CTA placement

**Cons**:

- Couples layout to specific content patterns
- Reduces flexibility for non-standard page layouts
- Violates single responsibility principle (layout vs. content structure)
- Adds complexity for pages that don't need hero/CTA
- Hero/CTA are content concerns, not layout concerns

### Option 2: Keep single default slot (current approach)

```astro
<BaseLayout>
  <main>
    <slot />
  </main>
</BaseLayout>
```

**Pros**:

- Maximum flexibility for page composition
- Clear separation: BaseLayout = document structure, pages = content structure
- Simpler mental model
- Aligns with Astro's composition philosophy
- Pages can use Section components to build any structure

**Cons**:

- No enforced structure for hero/CTA placement
- Developers must understand Section-based composition

### Option 3: Create specialized layout variants

Create `HeroLayout.astro`, `CTALayout.astro` that extend BaseLayout.

**Pros**:

- Provides structured options without forcing them
- Could be useful for very specific page types

**Cons**:

- Layout proliferation
- Still couples layout to content patterns
- Adds maintenance burden
- Unclear when to use which layout

## Decision

**Option 2 is chosen: Keep single default slot in BaseLayout.**

`BaseLayout.astro` will continue to provide only document-level structure:

- HTML document setup
- Head management (via Head component)
- Body structure with Header, main, Footer
- Theme setup and accessibility features

**Content structure is the responsibility of pages**, which compose their layouts using:

- `Section.astro` for semantic sections
- `Container.astro` for content width constraints
- Organism components for complex patterns (hero, CTA, etc.)

This approach:

1. **Maintains separation of concerns**: BaseLayout = document, pages = content
2. **Maximizes flexibility**: Any page can compose any structure
3. **Follows Atomic Design**: Hero/CTA are organisms composed within pages
4. **Aligns with Astro patterns**: Single slot is the Astro-idiomatic approach
5. **Simplifies maintenance**: One layout to maintain, not multiple variants

## Consequences

### Positive

- **Clear responsibility boundaries**: BaseLayout handles document, pages handle content
- **Maximum composability**: Pages can create any structure using Section/Container
- **Simpler codebase**: No layout variants to maintain
- **Better DX**: Single pattern to learn (compose with Section components)
- **Performance**: No unnecessary layout complexity

### Neutral/To Address

- **Documentation**: Must clearly document the composition pattern
  - Add examples showing hero/CTA composition in pages
  - Document Section/Container usage patterns
  - Show how to build common page structures
- **Component library**: Ensure organism-level components exist for common patterns
  - Consider `HeroSection.astro` organism if pattern repeats
  - Consider `CTASection.astro` organism if pattern repeats
  - Keep these as organisms, not layout concerns

### Negative

- **No enforced structure**: Developers must understand composition patterns
  - Mitigated by: Clear documentation and examples
  - Mitigated by: Existing pages as reference implementations

## Implementation Notes

### Current BaseLayout Structure (Correct)

```astro
<BaseLayout title="..." description="...">
  <!-- Page composes its own structure -->
  <Section><!-- Hero --></Section>
  <Section><!-- Content --></Section>
  <Section><!-- CTA --></Section>
</BaseLayout>
```

### If Hero/CTA Pattern Repeats Frequently

Create organism components, not layout slots:

```astro
<!-- src/components/organisms/HeroSection.astro -->
<Section class="hero-specific-styles">
  <Container>
    <slot />
  </Container>
</Section>

<!-- Usage in pages -->
<BaseLayout>
  <HeroSection>
    <h1>Title</h1>
    <p>Description</p>
  </HeroSection>
</BaseLayout>
```

## Validation

- ✅ BaseLayout maintains single default slot
- ✅ Pages compose structure using Section/Container
- ✅ No layout variants created without ADR justification
- ✅ Documentation includes composition examples
- ✅ Code reviews enforce separation of layout vs. content concerns

## References

- [Astro Layouts Documentation](https://docs.astro.build/en/core-concepts/layouts/)
- [Atomic Design by Brad Frost](https://atomicdesign.bradfrost.com/)
- ADR-003: Unified Component Structure and Atomic Design Adherence
- Internal: `src/layouts/BaseLayout.astro`
- Internal: `src/components/structural/Section.astro`

---
**Date**: 2025-10-01 (footer backfilled 2026-07-05 from git history; this record predates the footer convention)\
**Participants**: Template maintainers\
**Outcome**: Accepted
