---
title: Performance Patterns
lastUpdated: true
description: >-
  Proven techniques for achieving and maintaining high Lighthouse scores (95+
  baseline) in Astro projects
tableOfContents: true
pagefind: true
---
> ⚡ **Purpose**: Proven techniques for achieving and maintaining the starter's 95+ Lighthouse baseline (`lighthouse.yml` gates at ≥90 performance / ≥95 accessibility and best-practices / ≥90 SEO, desktop and mobile)

## Core Performance Principles

### 1. Ship Less JavaScript

- Default to static HTML/CSS
- Use Islands Architecture sparingly
- Lazy load non-critical features
- Tree-shake unused code

### 2. Optimize Critical Path

- Inline critical CSS
- Preload key resources
- Defer non-critical scripts
- Minimize render-blocking resources

### 3. Efficient Asset Loading

- Modern image formats (AVIF, WebP)
- Responsive images with srcset
- Font subsetting and preloading
- Resource hints (preconnect, prefetch)

## Image Optimization Patterns

### 1. Responsive Image Component

The shipped wrapper is `src/components/atoms/Image.astro` ([ADR-030](/adr/030-image-optimisation-defaults/)). It wraps `astro:assets`' `<Image>` and:

- emits **one** output format, AVIF by default, chosen by `resolveImageFormat()` in `src/utils/resolveImageFormat.ts` (SVG sources pass through untouched; `jpg` normalises to `jpeg`; `svg`/`gif` requests fall back to `png` because Sharp cannot output them);
- generates a widths-based `srcset` (`[320, 640, 1024]`, `sizes="100vw"`) when no fixed dimensions are given, and a densities-based one (`[1.5, 2]`) when `width`/`height` are set;
- maps `quality` presets (`low`/`mid`/`high`/`max` → 40/60/75/90; default `high`);
- defaults to `loading="lazy"` and `decoding="async"`;
- falls back to a native `<img>` when `src` is a string path instead of `ImageMetadata`.

```astro
---
import Image from '@/components/atoms/Image.astro';
import cover from '@/assets/images/cover.jpg';
---

<!-- Responsive, AVIF, lazy — the defaults do the work -->
<Image src={cover} alt="Descriptive alt text" />

<!-- Above the fold: eager + sync, custom breakpoints -->
<Image
  src={cover}
  alt="Descriptive alt text"
  widths={[640, 1024, 1600]}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
  loading="eager"
  decoding="sync"
/>
```

`<Image>` has no `formats` prop — if you need an AVIF → WebP → JPEG `<picture>` chain, use `<Picture formats={['avif', 'webp']}>` from `astro:assets` directly.

### 2. Progressive Image Loading

```astro
---
// ProgressiveImage.astro (illustrative — not shipped)
import { getImage, Image } from 'astro:assets';

export interface Props {
  src: ImageMetadata;
  alt: string;
  placeholder?: 'blur' | 'dominant-color';
}

const { src, alt, placeholder = 'blur' } = Astro.props;

// Generate a low-quality placeholder. It is applied as a blurred
// background image, so no raw <img> tag is needed — the real asset
// is rendered by the Astro Image component.
const placeholderSrc = await getImage({
  src,
  width: 40,
  quality: 10,
  format: 'webp'
});
---

<div
  class="progressive-image"
  style={`background-image: url('${placeholderSrc.src}');`}
>
  <Image
    src={src}
    alt={alt}
    class="full-image"
    loading="lazy"
    onload="this.classList.add('loaded')"
  />
</div>

<style>
  .progressive-image {
    position: relative;
    overflow: hidden;
    background-size: cover;
    background-position: center;
  }

  .full-image {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .full-image.loaded {
    opacity: 1;
  }
</style>
```

## CSS Performance Patterns

### 1. Critical CSS Extraction

```astro
---
// CriticalStyles.astro
// Inline critical CSS for above-the-fold content
---
<style is:inline>
  /* Reset and base styles */
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; }
  
  /* Critical layout styles */
  .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
  .hero { min-height: 60vh; display: flex; align-items: center; }
  
  /* Critical typography */
  h1 { font-size: clamp(2rem, 5vw, 3rem); margin: 0; }
  
  /* Critical colors come from the generated design tokens
     (tokens/dist/tokens.css, built by `pnpm tokens:build`). They are
     HSL channel triplets, so wrap them in hsl(). Reference the custom
     properties — never hardcode literals. */
  body {
    color: hsl(var(--color-foreground));
    background: hsl(var(--color-background));
  }

  .hero h1 {
    color: hsl(var(--color-primary-600));
  }
</style>
```

### 2. CSS Loading Strategy

```astro
---
// OptimizedStyles.astro
---
<!-- Critical CSS (inline) -->
<style is:inline>
  /* Minimal styles for initial paint */
</style>

<!-- Non-critical CSS (deferred) -->
<link 
  rel="preload" 
  href="./styles/main.css" 
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
>
<noscript>
  <link rel="stylesheet" href="./styles/main.css">
</noscript>
```

### 3. Scoped Animation Styles

```astro
---
// AnimationStyles.astro
// Only load animation CSS when needed
---
<style>
  /* Check for motion preference first */
  @media (prefers-reduced-motion: no-preference) {
    .animate-fade-in {
      animation: fadeIn 0.3s ease;
    }
    
    .animate-slide-up {
      animation: slideUp 0.3s ease;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  }
</style>
```

## JavaScript Performance Patterns

### 1. Conditional Client Directives

```astro
---
// ConditionalIsland.astro
import InteractiveComponent from './InteractiveComponent.astro';

export interface Props {
  loadWhen: 'visible' | 'idle' | 'media';
  mediaQuery?: string;
}

const { loadWhen, mediaQuery = '(min-width: 768px)' } = Astro.props;
---
<section>
  <h2>Conditionally Loaded Island</h2>
  
  {loadWhen === 'visible' && (
    <InteractiveComponent client:visible />
  )}
  
  {loadWhen === 'idle' && (
    <InteractiveComponent client:idle />
  )}
  
  {loadWhen === 'media' && (
    <InteractiveComponent client:media={mediaQuery} />
  )}
</section>
```

### 2. Debounced Event Handlers

```astro
---
// DebouncedSearch.astro
---
<input 
  type="search" 
  id="search-input"
  placeholder="Search..."
  class="search-input"
/>

<script>
  // Debounce function to limit API calls
  function debounce(func: Function, wait: number) {
    let timeout: number;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const input = document.getElementById('search-input');
  const performSearch = debounce((query: string) => {
    console.log(`Searching for: ${query}`);
    // Fetch API call would go here
  }, 300);

  input.addEventListener('input', ({ target }) => {
    performSearch((target as HTMLInputElement).value);
  });
</script>
```

### 3. Intersection Observer for Lazy Loading

```astro
---
// LazyLoadContainer.astro
---
<div class="lazy-container" data-src="/api/content">
  <div class="skeleton">Loading...</div>
</div>

<script>
  // Set up intersection observer for all lazy containers
  const lazyContainers = document.querySelectorAll('.lazy-container');
  
  const loadContent = async (container: Element) => {
    const src = container.getAttribute('data-src');
    if (!src) return;
    
    const response = await fetch(src);
    const content = await response.text();
    container.innerHTML = content;
  };

  const observer = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        loadContent(entry.target);
        obs.unobserve(entry.target);
      }
    }
  }, { rootMargin: '200px' });

  lazyContainers.forEach(container => {
    observer.observe(container);
  });
</script>
```

## Font & Resource Loading

### 1. Modern Font Loading

The starter uses the Astro Fonts API ([ADR-053](/adr/053-fonts-via-astro-fonts-api/)): both families (Geist for headlines, Inter for body) are declared once in `astro.config.mjs` with `fontProviders.local()`, and the latin variable woff2 files are vendored in `src/assets/fonts/` so builds stay fully offline. Astro emits the `@font-face` rules, fingerprints the files, preloads them, and generates metric-adjusted fallback faces to cut CLS. No Google Fonts preconnect and no hand-written `@font-face` are needed. The number of font preloads is gated by `pnpm run fonts:gate` ([ADR-058](/adr/058-font-preload-budget/)).

```js
// astro.config.mjs (shipped excerpt — the Geist entry is identical in shape)
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-inter',
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      optimizedFallbacks: true,
      options: {
        variants: [
          {
            weight: '100 900',
            style: 'normal',
            src: ['./src/assets/fonts/inter-latin-variable.woff2'],
          },
        ],
      },
    },
  ],
});
```

```astro
---
// src/components/molecules/Head.astro (shipped excerpt)
import { Font } from 'astro:assets';
---

<Font cssVariable="--font-geist" preload />
<Font cssVariable="--font-inter" preload />
```

```css
/* Consume via the generated CSS variables (wired to --font-display/--font-text in global.css) */
body {
  font-family: var(--font-inter);
}
```

### 2. Resource Hints

The template includes built-in support for DNS prefetch and preconnect via the `preconnectDomains` prop on `BaseLayout.astro`, which forwards it to `src/components/molecules/Head.astro`:

```astro
<!-- In your page (e.g., index.astro) -->
<BaseLayout
  title="Page Title"
  description="Page description"
  preconnectDomains={["https://github.com", "https://api.example.com"]}
>
  <!-- Page content -->
</BaseLayout>
```

This generates optimized resource hints in the `<head>`:

```html
<!-- DNS prefetch for faster domain resolution -->
<link rel="dns-prefetch" href="https://github.com" />
<link rel="preconnect" href="https://github.com" crossorigin />
<link rel="dns-prefetch" href="https://api.example.com" />
<link rel="preconnect" href="https://api.example.com" crossorigin />
```

For internal navigation, use `data-astro-prefetch` — `prefetch: true` is set in `astro.config.mjs` ([ADR-028](/adr/028-prefetch-strategy/)), so the attribute opts a link into Astro's built-in prefetching (hover by default):

```astro
<!-- Prefetches page on hover or viewport visibility -->
<a href="/about" data-astro-prefetch>About</a>

<!-- Or with Button component -->
<Button href="/docs" data-astro-prefetch>
  View Docs
</Button>
```

## Bundle Size Optimization

### 1. Dynamic Imports

```typescript
// utils/heavy-library-wrapper.ts
// Lazy load heavy libraries only when needed

let heavyLibrary: any = null;

export async function processWithHeavyLibrary(data: any) {
  // Only import when function is called
  if (!heavyLibrary) {
    heavyLibrary = await import('heavy-library');
  }
  
  return heavyLibrary.process(data);
}
```

### 2. Tree Shaking Helpers

```typescript
// utils/imports.ts
// Import only what you need

// ❌ Bad: Imports entire library
import _ from 'lodash';

// ✅ Good: Imports only specific functions
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

// ✅ Better: Use native alternatives when possible
export const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};
```

## Caching Strategies

### 1. Static Asset Caching

```text
# public/_headers
# Aggressive caching for static assets

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=31536000, immutable

/js/*.js
  Cache-Control: public, max-age=31536000, immutable

/css/*.css
  Cache-Control: public, max-age=31536000, immutable

# Moderate caching for HTML
/*.html
  Cache-Control: public, max-age=3600, must-revalidate
```

### 2. Service Worker Caching

```javascript
// public/sw.js
// Basic service worker for offline support

const CACHE_NAME = 'v1';
const urlsToCache = [
  '/',
  '/styles/critical.css',
  '/fonts/inter-var-latin.woff2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

## Monitoring Performance

### 1. Performance Observer

```astro
---
// PerformanceMonitor.astro
---
<script>
  // Monitor Core Web Vitals
  if ('PerformanceObserver' in window) {
    // Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
    
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    
    // Interaction to Next Paint (INP) — FID is retired.
    // For an accurate INP value use the web-vitals library's onINP();
    // raw event timing entries approximate it:
    const inpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('Interaction duration:', entry.name, entry.duration);
      }
    });
    inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 40 });
  }
</script>
```

## Common Performance Pitfalls

1. **Unoptimized Images**: Always use Astro's Image component
2. **Render-Blocking Resources**: Defer or async all non-critical scripts
3. **Excessive JavaScript**: Question every client-side dependency
4. **Missing Resource Hints**: Add preload/prefetch for critical resources
5. **Poor Caching Strategy**: Set appropriate cache headers
6. **Layout Shifts**: Reserve space for dynamic content
7. **Uncompressed Assets**: Enable Gzip/Brotli compression

## Performance Checklist

Before deploying, ensure:

- [ ] All images use modern formats (WebP/AVIF)
- [ ] Critical CSS is inlined
- [ ] Fonts are subsetted and preloaded
- [ ] JavaScript budget is under 160KB raw (CI-enforced — see [budgets & guardrails](/implementation-guides/reference/budgets-guardrails/))
- [ ] No render-blocking scripts
- [ ] Resource hints are configured
- [ ] Caching headers are set
- [ ] Lighthouse score meets the 95+ baseline (CI gates at ≥90)
- [ ] Core Web Vitals pass
- [ ] Works without JavaScript
