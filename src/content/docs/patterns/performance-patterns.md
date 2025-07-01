---
title: Performance Patterns
version: 1.0.0
lastUpdated: 2025-06-10T00:00:00.000Z
description: >-
  Proven techniques for achieving and maintaining high Lighthouse scores (97+)
  in Astro projects.
last_reviewed_on: '2025-07-01'
---
> ⚡ **Purpose**: Proven techniques for achieving and maintaining 97+ Lighthouse scores

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
  placeholder?: 'blur' | 'dominant-color';
}

const { src, alt, placeholder = 'blur' } = Astro.props;

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
      from { transform: translateY(10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  }
</style>
```

## JavaScript Performance Patterns

### 1. Code Splitting with Islands

```astro
---
// InteractiveSection.astro
export interface Props {
  loadWhen: 'visible' | 'idle' | 'media';
  mediaQuery?: string;
}

const { loadWhen, mediaQuery } = Astro.props;

// Choose loading strategy based on importance
const clientDirective = loadWhen === 'media' 
  ? `client:media="${mediaQuery}"`
  : `client:${loadWhen}`;
---

<section class="interactive-section">
  <!-- Static content always loads -->
  <div class="static-content">
    <h2>Always Visible Content</h2>
    <p>This loads immediately with zero JavaScript.</p>
  </div>
  
  <!-- Interactive content loads based on strategy -->
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
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  const searchInput = document.getElementById('search-input');
  
  const performSearch = debounce((value: string) => {
    // Actual search logic here
    console.log('Searching for:', value);
  }, 300);
  
  searchInput?.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    performSearch(target.value);
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
    
    try {
      const response = await fetch(src);
      const html = await response.text();
      container.innerHTML = html;
      container.classList.add('loaded');
    } catch (error) {
      container.innerHTML = '<p>Failed to load content</p>';
    }
  };
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadContent(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '50px',
      threshold: 0.01
    }
  );
  
  lazyContainers.forEach(container => observer.observe(container));
</script>
```

## Font Loading Patterns

### 1. Optimal Font Loading

```astro
---
// FontLoader.astro
---

<!-- Preconnect to font origins -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

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
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
</style>
```

### 2. Font Subsetting Strategy

```bash
# scripts/subset-fonts.sh
# Subset fonts to only include used characters

# Latin subset for most Western languages
pyftsubset input-font.ttf \
  --output-file=output-font-latin.woff2 \
  --flavor=woff2 \
  --layout-features=* \
  --unicodes=U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD
```

## Resource Hints

### 1. Strategic Preloading

```astro
---
// ResourceHints.astro
// Add resource hints based on route
const currentPath = Astro.url.pathname;

const routeHints = {
  '/': {
    preload: ['/images/hero.webp'],
    prefetch: ['/about', '/projects']
  },
  '/blog': {
    preload: ['/styles/blog.css'],
    prefetch: ['/blog/recent-post']
  }
};

const hints = routeHints[currentPath] || { preload: [], prefetch: [] };
---

<!-- Preload critical resources for this route -->
{hints.preload.map(resource => (
  <link rel="preload" href={resource} as="image" />
))}

<!-- Prefetch likely next navigations -->
{hints.prefetch.map(url => (
  <link rel="prefetch" href={url} />
))}

<!-- DNS prefetch for external resources -->
<link rel="dns-prefetch" href="https://cdn.example.com" />
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
- [ ] Lighthouse score is 97+
- [ ] Core Web Vitals pass
- [ ] Works without JavaScript
