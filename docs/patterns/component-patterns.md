---
title: Component Patterns
lastUpdated: true
description: Reusable UI patterns for creating consistent and accessible components
tableOfContents: true
pagefind: true
---
> 🎨 **Purpose**: Reusable UI patterns for consistent, accessible components

## Component Creation Principles

### 1. Composition Over Configuration

```astro
<!-- ❌ Avoid: Too many props -->
<Card 
  title="..."
  subtitle="..."
  image="..."
  imageAlt="..."
  showButton={true}
  buttonText="..."
  buttonHref="..."
/>

<!-- ✅ Prefer: Composable slots -->
<Card>
  <h3>Title</h3>
  <p>Subtitle</p>
  <Image src="..." alt="..." />
  <Button href="...">Action</Button>
</Card>
```

### 2. TypeScript-First

```astro
---
// Always define props interface
export interface Props {
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

// Destructure with defaults
const { 
  variant = 'default',
  size = 'md' 
} = Astro.props;
---
```

### 3. Accessibility Built-In

```astro
---
// Components handle their own a11y
const uniqueId = `component-${Math.random().toString(36).substr(2, 9)}`;
---
<div 
  role="region"
  aria-labelledby={uniqueId}
>
  <h2 id={uniqueId}>
    <slot name="title" />
  </h2>
  <slot />
</div>
```

## Common Component Patterns

### 1. Polymorphic Components

Allow components to render as different HTML elements:

```astro
---
// PolymorphicBox.astro
export interface Props {
  as?: keyof HTMLElementTagNameMap;
}

const { as: Tag = 'div', ...props } = Astro.props;
---
<Tag {...props}>
  <slot />
</Tag>
```

Usage:

```astro
<PolymorphicBox as="section" class="hero">
  <h1>Hero Content</h1>
</PolymorphicBox>
```

### 2. Compound Components

Components that work together as a group:

```astro
---
// Tabs/TabGroup.astro
---
<div class="tab-group" role="tablist">
  <slot />
</div>
---
// Tabs/Tab.astro
export interface Props {
  id: string;
  active?: boolean;
}
---
<button
  role="tab"
  aria-selected={active}
  aria-controls={`panel-${id}`}
>
  <slot />
</button>
---
// Tabs/TabPanel.astro
export interface Props {
  id: string;
  active?: boolean;
}
---
<div
  role="tabpanel"
  id={`panel-${id}`}
  hidden={!active}
>
  <slot />
</div>
```

### 3. Render Props Pattern

For dynamic content rendering:

```astro
---
// List.astro
export interface Props {
  items: any[];
  renderItem: (item: any, index: number) => any;
}

const { items, renderItem } = Astro.props;
---
<ul>
  {items.map((item, index) => (
    <li>{renderItem(item, index)}</li>
  ))}
</ul>
```

### 4. Data Fetching Components

Encapsulate data fetching logic:

```astro
---
// FeaturedPosts.astro
import { getCollection } from 'astro:content';
import PostCard from './PostCard.astro';

const posts = await getCollection('blog', ({ data }) => 
  data.featured && !data.draft
);
---
<section>
  <h2>Featured Posts</h2>
  <div class="grid">
    {posts.map(post => (
      <PostCard post={post} />
    ))}
  </div>
</section>
```

### 5. Error Boundary Pattern

Graceful error handling:

```astro
---
// SafeComponent.astro
let content;
let error;

try {
  // Risky operation
  content = await riskyOperation();
} catch (e) {
  error = e;
  console.error('Component error:', e);
}
---
{error ? (
  <div class="error-fallback">
    <p>Unable to load content</p>
  </div>
) : (
  <div>{content}</div>
)}
```

## ClientRouter vs. Island Hydration: A Decision Guide

Astro offers powerful tools for creating dynamic user experiences: the `<ClientRouter />` component (imported from `astro:transitions`, mounted in `BaseLayout.astro` — [ADR-009](/adr/009-client-router-view-transitions/)) for seamless page navigation with view transitions, and Astro Islands for client-side interactivity. Choosing the right tool for the job is key to building performant and maintainable applications. This guide provides a decision matrix to help you select the best approach.

| Scenario / Goal                                       | Prefer ClientRouter          | Prefer Astro Island Hydration | Reasoning / Key Considerations                                                                                                |
| :---------------------------------------------------- | :--------------------------: | :---------------------------: | :---------------------------------------------------------------------------------------------------------------------------- |
| Full page navigation with smooth visual transitions   |              ✅              |                               | ClientRouter excels at animating between different page states, persisting shared elements, and providing an app-like feel.   |
| Animating specific elements across different pages    |              ✅              |                               | View transitions can identify and morph elements (e.g., images, headers) between old and new pages.                         |
| Client-side interactivity within a component          |                              |               ✅              | For components like counters, dropdowns, interactive forms, or data tables that need client-side JavaScript to function.        |
| Updating a small part of a page without full reload   |                              |               ✅              | Islands can re-render or fetch data on the client, ideal for dynamic sections within a mostly static page.                  |
| Maintaining complex client-side state within a page   |                              |               ✅              | If a component needs to manage its own state or interact with other client-side components without page navigation.           |
| Progressive enhancement for a static component        |                              |               ✅              | Start with static HTML, then hydrate an island to add richer JS-driven interactions (`client:idle`, `client:visible`).        |
| Morphing elements between states on the *same* page   |                              |        ✅ (sometimes)       | Often best handled by CSS transitions/animations. Use an Island if complex JS logic is required to manage these states. |
| Global, app-like navigation                           |              ✅              |                               | ClientRouter is designed for SPA-like navigation experiences across your entire Astro site or specific sections.            |
| Reducing JavaScript shipped for page transitions      |              ✅              |                               | ClientRouter can often achieve sophisticated transitions with minimal or no custom JavaScript.                              |
| Component needs to run JS immediately on page load    |                              |  ⚠️ (`client:load`)         | `client:load` is forbidden in this starter without ADR justification ([ADR-001](/adr/001-preact-island-usage-policy/)). Prefer `client:idle`; if immediate load is truly required, open an ADR. |

**Concluding Note:**
This matrix provides general guidelines. Always consider the specific requirements of your feature, the desired user experience, performance implications (especially JavaScript bundle sizes and Core Web Vitals), and accessibility. Sometimes, a combination of both might be appropriate, but strive to avoid mixing metaphors in a way that complicates the codebase or degrades performance. Refer to the [Astro view transitions documentation](https://docs.astro.build/en/guides/view-transitions/) and [Island architecture concepts](https://docs.astro.build/en/concepts/islands/) for more details.

## Responsive Patterns

### 1. Container Queries

Modern responsive design:

```astro
---
// ResponsiveCard.astro
---
<div class="card-container">
  <article class="card">
    <slot />
  </article>
</div>

<style>
  .card-container {
    container-type: inline-size;
  }
  
  .card {
    display: grid;
    gap: 1rem;
  }
  
  @container (min-width: 400px) {
    .card {
      grid-template-columns: 1fr 2fr;
    }
  }
</style>
```

### 2. Responsive Images

Optimal image loading:

```astro
---
// ResponsiveImage.astro
import { Image } from 'astro:assets';

export interface Props {
  src: ImageMetadata;
  alt: string;
  sizes?: string;
}

const { 
  src, 
  alt,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
} = Astro.props;
---
<Image 
  src={src}
  alt={alt}
  sizes={sizes}
  widths={[320, 640, 768, 1024, 1280]}
  formats={['avif', 'webp']}
  loading="lazy"
/>
```

## State Management Patterns

### 1. URL State

Using URL for component state:

```astro
---
// FilterableList.astro
const currentFilter = Astro.url.searchParams.get('filter') || 'all';
const items = await getFilteredItems(currentFilter);
---
<div>
  <nav>
    <a href="?filter=all" aria-current={currentFilter === 'all'}>All</a>
    <a href="?filter=active" aria-current={currentFilter === 'active'}>Active</a>
    <a href="?filter=archived" aria-current={currentFilter === 'archived'}>Archived</a>
  </nav>
  
  <ul>
    {items.map(item => <li>{item.name}</li>)}
  </ul>
</div>
```

### 2. Form Enhancement

Progressive form enhancement:

```astro
---
// EnhancedForm.astro
---
<form 
  method="POST" 
  action="/api/submit"
  class="enhanced-form"
>
  <slot />
  
  <noscript>
    <button type="submit">Submit</button>
  </noscript>
</form>

<script>
  // Only enhance if JS is available
  const forms = document.querySelectorAll('.enhanced-form');
  
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Show loading state
      form.classList.add('submitting');
      
      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: form.method,
          body: formData
        });
        
        if (response.ok) {
          // Handle success
        }
      } catch (error) {
        // Fall back to regular submission
        form.submit();
      }
    });
  });
</script>
```

## Animation Patterns

### 1. CSS-Only Animations

Prefer CSS over JavaScript:

```astro
---
// AnimatedCard.astro
---
<article class="animated-card">
  <slot />
</article>

<style>
  .animated-card {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease forwards;
  }
  
  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Respect motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .animated-card {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
</style>
```

### 2. Stagger Animations

For lists and grids:

```astro
---
// StaggeredList.astro
const items = Astro.props.items;
---
<ul class="staggered-list">
  {items.map((item, i) => (
    <li style={`--index: ${i}`}>
      {item}
    </li>
  ))}
</ul>

<style>
  .staggered-list li {
    opacity: 0;
    transform: translateX(-20px);
    animation: slideIn 0.3s ease forwards;
    animation-delay: calc(var(--index) * 0.05s);
  }
  
  @keyframes slideIn {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>
```

## Testing Component Patterns

### Visual Testing Setup

```typescript
// components/Button/Button.test.astro
---
import Button from './Button.astro';
---
<div class="test-grid">
  <h2>Button Variants</h2>
  
  <!-- Default States -->
  <section>
    <h3>Default State</h3>
    <Button>Default</Button>
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost">Ghost</Button>
  </section>
  
  <!-- Disabled States -->
  <section>
    <h3>Disabled State</h3>
    <Button disabled>Default</Button>
    <Button variant="primary" disabled>Primary</Button>
  </section>
  
  <!-- Sizes -->
  <section>
    <h3>Sizes</h3>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </section>
</div>

<style>
  .test-grid {
    display: grid;
    gap: 2rem;
    padding: 2rem;
  }
  
  section {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
</style>
```

### Accessibility Testing

```astro
---
// TestAccessibility.astro
// Component to verify a11y compliance
---
<div class="a11y-test">
  <h2>Accessibility Checklist</h2>
  
  <!-- Keyboard Navigation -->
  <section>
    <h3>Keyboard Navigation</h3>
    <p>Tab through all interactive elements:</p>
    <slot name="interactive" />
  </section>
  
  <!-- Screen Reader -->
  <section>
    <h3>Screen Reader Content</h3>
    <div class="sr-only">
      <slot name="screen-reader" />
    </div>
    <p>✓ Hidden content for screen readers included</p>
  </section>
  
  <!-- Color Contrast -->
  <section>
    <h3>Color Contrast</h3>
    <div class="contrast-grid">
      <slot name="contrast" />
    </div>
  </section>
</div>
```

## Performance Patterns

### 1. Lazy Loading Components

```astro
---
// LazySection.astro
export interface Props {
  threshold?: number;
  rootMargin?: string;
}

const { 
  threshold = 0.1,
  rootMargin = '50px'
} = Astro.props;

const id = `lazy-${Math.random().toString(36).slice(2)}`;
---
<div 
  id={id}
  class="lazy-section"
  data-threshold={threshold}
  data-margin={rootMargin}
>
  <slot />
</div>

<script>
  // Use Intersection Observer for lazy loading
  const lazyElements = document.querySelectorAll('.lazy-section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('loaded');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '50px'
  });
  
  lazyElements.forEach(el => observer.observe(el));
</script>

<style>
  .lazy-section {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .lazy-section.loaded {
    opacity: 1;
  }
</style>
```

### 2. Resource Hints

There is no generic `ResourceHints.astro` in the starter — the two hint mechanisms it ships are built into the layout and into Astro:

```astro
---
// src/pages/example.astro — external origins: `preconnectDomains` on BaseLayout,
// rendered by src/components/molecules/Head.astro as a dns-prefetch +
// preconnect pair per domain
import BaseLayout from '@/layouts/BaseLayout.astro';
---

<BaseLayout
  title="Example"
  description="…"
  preconnectDomains={["https://api.example.com"]}
>
  <!-- Internal navigation: opt links into Astro's built-in prefetch
       (`prefetch: true` in astro.config.mjs — ADR-028) -->
  <a href="/about/" data-astro-prefetch>About</a>
</BaseLayout>
```

Font preloads are emitted by the Fonts API (`<Font cssVariable="…" preload />` in `Head.astro`) and gated by `pnpm run fonts:gate`; see [Performance Patterns](/patterns/performance-patterns/) for the full picture.

## Common Anti-Patterns to Avoid

### 1. ❌ Premature Abstraction

```astro
<!-- Don't create generic components too early -->
<SuperFlexibleComponent
  config={{
    type: 'card',
    layout: 'vertical',
    showImage: true,
    // 20 more options...
  }}
/>
```

### 2. ❌ Prop Drilling

```astro
<!-- Avoid passing props through multiple levels -->
<Parent userTheme={theme}>
  <Child userTheme={theme}>
    <GrandChild userTheme={theme} />
  </Child>
</Parent>
```

### 3. ❌ Missing Loading States

```astro
<!-- Always handle loading/error states -->
{isLoading && <Skeleton />}
{error && <ErrorMessage />}
{data && <Content />}
```

### 4. ❌ Ignoring Edge Cases

```astro
<!-- Handle empty states, errors, and boundaries -->
{items.length === 0 ? (
  <EmptyState />
) : (
  <ItemList items={items} />
)}
```

### 5. ❌ User Data in Attribute-Name Positions

```astro
<!-- Never bind user-supplied strings into transition:name or spread them
     as attribute names — both render outside normal HTML escaping -->
<h3 transition:name={userProvidedTitle}>...</h3>
<div {...objectWithUserControlledKeys}>...</div>

<!-- Safe: derive from build-time data you control -->
<h3 transition:name={"post-title-" + post.id}>...</h3>
```

The template's own `transition:name` bindings and spread attributes are
content-collection- or config-derived, which is why this is safe as shipped.
The pattern only stays safe if that invariant holds: route params, query
strings, form input, and CMS-authored fields do not belong in `transition:*`
values or spread-attribute keys. (Earlier Astro releases had escaping gaps
here — patched in the release the starter now pins, see `versions.json` — but
defense in depth costs nothing.)

## Component Documentation Template

When documenting components, include:

```astro
---
// Component.astro
/**
 * @component ComponentName
 * @description Brief description of what this component does
 * 
 * @example
 * <ComponentName variant="primary" size="lg">
 *   Content goes here
 * </ComponentName>
 * 
 * @props
 * - variant: Visual style variant
 * - size: Component size
 * 
 * @slots
 * - default: Main content
 * - icon: Optional icon slot
 * 
 * @emits None
 * 
 * @a11y
 * - Keyboard navigable
 * - Screen reader friendly
 * - ARIA labels included
 */
export interface Props {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}
---
```

## Migration Guide

When adopting these patterns in existing projects:

1. **Start with new components** - Don't refactor everything at once
2. **Document as you go** - Add JSDoc comments to new components
3. **Test accessibility** - Use automated tools and manual testing
4. **Measure performance** - Ensure patterns don't degrade metrics
5. **Share learnings** - Document new patterns discovered

## References

- [Astro Component Documentation](https://docs.astro.build/en/core-concepts/astro-components/)
- [Inclusive Components](https://inclusive-components.design/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Every Layout](https://every-layout.dev/)
