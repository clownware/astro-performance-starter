---
title: Performance Patterns
lastUpdated: 2025-06-10T00:00:00.000Z
description: >-
  Proven techniques for achieving and maintaining high Lighthouse scores (95+)
  in Astro projects
tableOfContents: true
pagefind: true
---
> ⚡ **Purpose**: Proven techniques for achieving and maintaining 95+ Lighthouse scores

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

```astro
---
// OptimizedImage.astro
import { Image } from 'astro:assets';

export interface Props {
  src: ImageMetadata;
  alt: string;
  priority?: boolean;
  sizes?: string;
}

const {
  src,
  alt,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
} = Astro.props;

// Generate widths for different screen sizes
const widths = [320, 640, 800, 1024, 1280, 1600];
---
<Image
  src={src}
  alt={alt}
  widths={widths}
  sizes={sizes}
  formats={['avif', 'webp']}
  loading={priority ? 'eager' : 'lazy'}
  decoding={priority ? 'sync' : 'async'}
  class="optimized-image"
/>

<style>
  .optimized-image {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
</style>
```

### 2. Progressive Image Loading

```astro
---
// ProgressiveImage.astro
import { Image } from 'astro:assets';

export interface Props {
  src: ImageMetadata;
  alt: string;
  placeholder?: 'blur-sm' | 'dominant-color';
}

const { src, alt, placeholder = 'blur-sm' } = Astro.props;

// Generate a low-quality placeholder
const placeholderSrc = await getImage({
  src,
  width: 40,
  quality: 10,
  format: 'webp'
});
---
<div class="progressive-image">
  <img 
    class="placeholder"
    src={placeholderSrc.src}
    alt=""
    aria-hidden="true"
  />
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
  }
  
  .placeholder {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(20px);
    transform: scale(1.1);
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
  
  /* Critical colors from tokens */
  :root {
    --color-primary: 210 100% 48%;
    --color-background: 210 40% 98%;
    --color-foreground: 218 39% 11%;
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

```astro
---
// FontLoader.astro
---
<!-- Preconnect to Google Fonts (if used) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Preload critical fonts -->
<link 
  rel="preload" 
  href="./fonts/inter-var-latin.woff2" 
  as="font" 
  type="font/woff2" 
  crossorigin
/>

<!-- Font face declarations with swap -->
<style>
  @font-face {
    font-family: 'Inter';
    src: url('/fonts/inter-var-latin.woff2') format('woff2');
    font-weight: 100 900;
    font-display: swap;
    font-style: normal;
  }
  
  /* Fallback font stack */
  body {
    font-family: 'Inter', system-ui, sans-serif;
  }
</style>
```

### 2. Resource Hints

The template includes built-in support for DNS prefetch and preconnect via the `preconnectDomains` prop:

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

For internal navigation, use `data-astro-prefetch` (via Astro's built-in prefetch):

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
    
    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const delay = entry.processingStart - entry.startTime;
        console.log('FID:', delay);
      }
    });
    fidObserver.observe({ type: 'first-input', buffered: true });
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
- [ ] JavaScript budget is under 160KB
- [ ] No render-blocking scripts
- [ ] Resource hints are configured
- [ ] Caching headers are set
- [ ] Lighthouse score is 95+
- [ ] Core Web Vitals pass
- [ ] Works without JavaScript
