---
title: Phase 7 - Code Examples
lastUpdated: true
description: >-
  Code examples for Phase 7
tableOfContents: true
pagefind: true
---

## Content Examples

The template has no `pages` content collection — static pages (home, about, privacy, terms)
are `.astro` files in `src/pages/`, and `src/content.config.ts` defines the `projects`, `blog`,
`navigation`, `bio`, `experience`, and `adr` collections. Use the page examples below as draft
copy for those `.astro` pages (or add your own collection if you prefer MDX-managed pages).

### Homepage Content

```mdx
---
# Draft copy for src/pages/index.astro
title: "Home"
description: "I create fast, accessible, and beautiful web experiences that users love"
---

# Crafting Digital Experiences That Matter

I'm a web developer specializing in **performance-focused** websites that don't compromise on design or accessibility. With expertise in modern frameworks and a passion for clean code, I help businesses create web experiences that engage users and drive results.

## What Sets My Work Apart

### ⚡ Lightning Fast
Every site I build scores 95+ on Lighthouse. Your users won't wait, and neither should you.

### ♿ Accessible First
WCAG AA compliance isn't an afterthought. Everyone deserves a great web experience.

### 📱 Truly Responsive
From phones to ultrawide monitors, your site adapts beautifully to every screen.

## Ready to Build Something Amazing?

Whether you need a portfolio site, business platform, or complex web application, I'm here to help bring your vision to life.

[View My Work](/projects/) [Get In Touch](/contact/)
```

### About Page Content

```mdx
---
# Draft copy for src/pages/about.astro
title: "About"
description: "Learn about my journey in web development and the values that drive my work"
image: "./images/profile.jpg"
---

# About Me

Hi, I'm **[Your Name]**, a web developer based in [Location] with a passion for creating exceptional digital experiences.

## My Journey

I discovered web development [X years ago] and immediately fell in love with the blend of creativity and logic it requires. What started as curiosity about how websites work evolved into a career focused on pushing the boundaries of what's possible on the web.

## What I Do

I specialize in:

- **Frontend Development**: Astro and Preact for modern web apps
- **Performance Optimization**: Making sites lightning fast
- **Accessibility**: Ensuring everyone can use what I build
- **UI/UX Design**: Creating interfaces that delight users

## My Approach

I believe great websites are:

1. **Fast** - Performance is a feature
2. **Accessible** - The web is for everyone
3. **Beautiful** - Good design matters
4. **Maintainable** - Clean code saves time

## Beyond Code

When I'm not coding, you'll find me [hobbies/interests]. I'm also passionate about [causes/interests], and I try to contribute to open source projects whenever possible.

## Let's Connect

I'm always interested in new projects and opportunities. Whether you need a website, want to collaborate, or just want to chat about web development, I'd love to hear from you.

[Email Me](mailto:your@email.com) [LinkedIn](https://linkedin.com/in/yourprofile) [GitHub](https://github.com/yourusername)
```

### Project Case Study

Project entries live in `src/content/projects/<slug>/index.mdx` with their images co-located
(the shipped demo entries follow this layout). The frontmatter below uses only fields the
`projects` schema in `src/content.config.ts` accepts. The MDX components (`Callout`, `Figure`,
`Grid`) ship in `src/components/mdx/`; `Card` is a molecule and is imported explicitly.

> Sample content only — the code snippets *inside* this case study describe the fictional
> client's stack (`zustand`, a custom analytics client) and are not part of the starter.

````mdx
---
# src/content/projects/ecommerce-redesign/index.mdx
title: "E-commerce Platform Redesign"
description: "Increased conversion rates by 40% through performance optimization and UX improvements"
date: 2024-06-15
client: "TechStyle Fashion"
duration: "3 months"
role: "Lead Frontend Developer"
cover: "./cover.jpg"
coverAlt: "Screenshot of the redesigned e-commerce platform showing the modern, clean interface"
featured: true
tags: ["E-commerce", "Performance", "Preact"]
technologies: ["Preact", "TypeScript", "Node.js", "PostgreSQL", "Redis", "Cloudflare"]
outcomes:
  - metric: "Page Load Time"
    value: "-65%"
    description: "Reduced from 4.2s to 1.5s"
  - metric: "Conversion Rate"
    value: "+40%"
    description: "Increased from 2.1% to 2.9%"
  - metric: "Mobile Traffic"
    value: "+85%"
    description: "Better mobile experience drove more users"
externalUrl: "https://example.com"
sortOrder: 1
---

import Callout from "@/components/mdx/Callout.astro";
import Figure from "@/components/mdx/Figure.astro";
import Grid from "@/components/mdx/Grid.astro";
import Card from "@/components/molecules/Card.astro";
import mobileCheckout from "./ecommerce-mobile.jpg";

## Project Overview

TechStyle Fashion came to me with a problem: their e-commerce platform was losing customers due to slow load times and a dated user interface. Mobile users were particularly affected, with conversion rates 60% lower than desktop.

## The Challenge

The existing platform faced several critical issues:

- **Performance**: 4.2 second average load time
- **Mobile Experience**: Not truly responsive, difficult navigation
- **Technical Debt**: jQuery spaghetti code, no build process
- **Accessibility**: Failed WCAG guidelines

<Callout type="info" title="Key stat">
  60% of mobile users abandoned their carts due to performance issues
</Callout>

## My Approach

### 1. Performance Audit

I began with a comprehensive performance audit using:

- Lighthouse CI for continuous monitoring
- WebPageTest for real-world performance data
- Chrome DevTools for bottleneck identification

Key findings:

- Render-blocking resources totaling 800KB
- Unoptimized images (average 500KB each)
- No caching strategy
- Third-party scripts blocking main thread

### 2. Technical Strategy

Based on the audit, I developed a phased approach:

```typescript
// Example: Implementing code splitting for route-based chunks
const routes = [
  {
    path: '/',
    component: lazy(() => import('./pages/Home'))
  },
  {
    path: '/products/:id',
    component: lazy(() => import('./pages/ProductDetail'))
  }
];
```

### 3. Implementation Highlights

#### Image Optimization Pipeline

- Implemented automatic WebP/AVIF generation
- Lazy loading with native loading attribute
- Responsive images with proper srcset

#### Performance Improvements

- Code splitting reduced initial bundle by 70%
- Service worker for offline functionality
- Edge caching with Cloudflare Workers

#### Mobile-First Redesign

- Touch-optimized interface elements
- Simplified checkout process (3 steps → 1 step)
- Bottom sheet navigation pattern

<Figure src={mobileCheckout.src} alt="Mobile interface showing the streamlined checkout process" caption="The new one-step checkout process increased mobile conversions by 125%" />

## Technical Deep Dive

### State Management

Moved from prop drilling to Zustand for cleaner state management:

```typescript
const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  }))
}));
```

### Performance Monitoring

Implemented RUM (Real User Monitoring) to track Core Web Vitals:

```typescript
// Tracking Core Web Vitals
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    analytics.track('web-vitals', {
      metric: entry.name,
      value: entry.value,
      rating: entry.rating
    });
  }
}).observe({ entryTypes: ['web-vital'] });
```

## Results & Impact

The redesign exceeded all target metrics:

<Grid cols={1} md={2} gap={6}>
  <Card class="p-6">
    ### Before

    - Load Time: 4.2s
    - Conversion: 2.1%
    - Bounce Rate: 68%
    - Mobile Revenue: 22%
  </Card>

  <Card class="p-6">
    ### After

    - Load Time: 1.5s (-65%)
    - Conversion: 2.9% (+40%)
    - Bounce Rate: 41% (-40%)
    - Mobile Revenue: 48% (+118%)
  </Card>
</Grid>

## Client Testimonial

> "The transformation was incredible. Not only did our conversion rates improve dramatically, but our customer satisfaction scores reached an all-time high. The attention to performance and user experience made all the difference."
>
> — Sarah Chen, CTO at TechStyle Fashion

## Key Takeaways

1. **Performance is a feature**: Every 100ms improvement in load time increased conversions by 1%
2. **Mobile-first pays off**: Designing for mobile constraints led to better desktop experience too
3. **Accessibility helps everyone**: Keyboard navigation improvements helped power users too
4. **Measure everything**: RUM data guided continuous improvements post-launch

## Technologies Used

- **Frontend**: Preact, TypeScript, Zustand
- **Styling**: Tailwind CSS, CSS animations
- **Backend**: Node.js, Express, PostgreSQL
- **Infrastructure**: Cloudflare Workers, Redis
- **Testing**: Playwright, Vitest, Lighthouse CI
- **Monitoring**: Datadog RUM, Sentry

[View Live Site](https://example.com)
````

### Blog Post Example

Blog entries live in `src/content/blog/<slug>/` with the cover image beside the `.mdx` file,
matching the shipped posts. Every frontmatter key below is defined by the `blog` schema.

> Sample content only — the monitoring snippet inside this post imports `web-vitals`, which is
> not part of the starter (`pnpm add web-vitals` if you adopt it on your own site).

````mdx
---
# src/content/blog/web-performance-2024/web-performance-2024.mdx
title: "Web Performance in 2024: What Really Matters"
description: "Core Web Vitals are just the beginning. Here's what you need to know about modern web performance."
date: 2024-11-20
updated: 2024-11-25
tags: ["Performance", "Web Development", "Core Web Vitals"]
author: "Your Name"
cover: "./web-performance-2024-hero.jpg"
coverAlt: "Dashboard showing performance metrics and Core Web Vitals scores"
canonicalUrl: "https://yourdomain.com/blog/web-performance-2024"
relatedPosts: ["optimizing-images-astro", "lazy-loading-patterns"]
---

import Callout from "@/components/mdx/Callout.astro";

Performance isn't just about speed—it's about creating experiences that feel instant and effortless. In 2024, with users expecting native-app-like performance from web apps, the stakes have never been higher.

## The State of Web Performance

Recent data from HTTP Archive shows that the median website now ships **2.2MB of JavaScript**, up from 1.8MB just two years ago. Yet, Core Web Vitals pass rates have actually improved. How? Developers are getting smarter about *when* and *how* we load resources.

<Callout type="info">
  75% of websites now pass Core Web Vitals thresholds, up from 40% in 2022
</Callout>

## What's Changed Since Last Year

### 1. INP Replaces FID

Interaction to Next Paint (INP) is now a Core Web Vital, replacing First Input Delay. This change reflects a shift toward measuring the *entire* interaction, not just the delay before processing begins.

```javascript
// Old way: Optimizing for FID
button.addEventListener('click', () => {
  // Quick acknowledgment
  requestAnimationFrame(() => {
    // Heavy work here
  });
});

// New way: Optimizing for INP
button.addEventListener('click', async () => {
  // Show immediate feedback
  button.classList.add('loading');

  // Break up work
  await scheduler.yield();
  await processData();
  await scheduler.yield();
  await updateUI();

  button.classList.remove('loading');
});
```

### 2. The Rise of Edge Computing

Edge functions have moved from "nice to have" to essential for performance:

- **Personalization** without client-side JS
- **A/B testing** at the edge
- **Geographic content** delivery
- **Authentication** closer to users

### 3. Framework Performance Wars

The battle between frameworks has shifted from bundle size to runtime performance:

| Framework | Bundle Size | Hydration Time | INP Score |
|-----------|------------|----------------|-----------|
| Astro | 0KB\* | N/A | Excellent |
| Qwik | 1KB | ~0ms | Excellent |
| React RSC | 64KB | 50ms | Good |
| Next.js | 82KB | 120ms | Fair |
| Angular | 130KB | 200ms | Poor |

\*With zero JavaScript by default

## Modern Performance Patterns

### Pattern 1: Speculation Rules API

Prefetch pages intelligently based on user behavior:

```html
<script type="speculationrules">
{
  "prerender": [
    {
      "source": "list",
      "urls": ["/products", "/about"]
    }
  ],
  "prefetch": [
    {
      "source": "document",
      "where": {
        "and": [
          { "href_matches": "/*" },
          { "not": { "href_matches": "/logout" }}
        ]
      }
    }
  ]
}
</script>
```

### Pattern 2: Islands of Interactivity

Ship HTML by default, enhance with JavaScript only where needed:

```astro
<!-- Static by default -->
<article class="product-card">
  <h2>{product.name}</h2>
  <p>{product.description}</p>

  <!-- Interactive island -->
  <AddToCart
    client:visible
    productId={product.id}
  />
</article>
```

### Pattern 3: Optimistic UI Updates

Make apps feel instant with optimistic updates:

```typescript
async function updateCart(item: CartItem) {
  // Update UI immediately
  setCart(prev => [...prev, item]);

  try {
    // Sync with server
    await api.addToCart(item);
  } catch (error) {
    // Revert on failure
    setCart(prev => prev.filter(i => i.id !== item.id));
    showError("Failed to add item");
  }
}
```

## Performance Budgets That Work

Instead of arbitrary limits, tie budgets to business metrics:

```javascript
// performance-budget.js
export const budgets = {
  'product-page': {
    lcp: 2000,    // 2s LCP = 15% higher conversion
    inp: 100,     // 100ms INP = 8% lower bounce rate
    cls: 0.05,    // 0.05 CLS = 12% longer sessions
    size: {
      js: 150_000,      // 150KB JavaScript
      css: 50_000,      // 50KB CSS
      images: 800_000,  // 800KB images
    }
  }
};
```

## Real-World Optimization Wins

### Case Study: E-commerce Category Pages

**Problem**: 4.5s LCP on category pages with 100+ products

**Solution**:

1. Implemented virtual scrolling
2. Lazy loaded images below fold
3. Used CSS containment for paint optimization
4. Moved filters to URL params (no JS required)

**Result**: 1.8s LCP, 35% increase in products viewed

```css
/* CSS Containment for product grid */
.product-grid {
  contain: layout style paint;
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}
```

## Tools & Monitoring in 2024

### Essential Tools

1. **[Unlighthouse](https://unlighthouse.dev/)** - Bulk Lighthouse testing
2. **[Speedlify](https://speedlify.netlify.app/)** - Competitive monitoring
3. **[Treo](https://treo.sh/)** - Real user monitoring
4. **[WebPageTest](https://webpagetest.org/)** - Detailed analysis

### Monitoring Stack

```typescript
// monitoring.ts
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics({name, value, rating}) {
  // Batch metrics for efficiency
  navigator.sendBeacon('/analytics', JSON.stringify({
    metric: name,
    value: Math.round(value),
    rating,
    url: location.href,
    connectionType: navigator.connection?.effectiveType
  }));
}

onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);
onFCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```
````

## Image Optimization

The starter already ships an image pipeline (ADR-030, ADR-052, ADR-057). Nothing here needs a
new script — use the pnpm names below; every script lives in `scripts/src/`.

### 1. Shipped Image Pipeline

Content images (anything under `src/`) are processed at build time by `astro:assets` through
the shipped `src/components/atoms/Image.astro` wrapper. Its real Props:

```astro
---
// src/components/atoms/Image.astro (shipped — Props excerpt)
interface Props {
  src: ImageMetadata | string | Promise<{ default: ImageMetadata }>;
  alt: string;
  class?: string;
  format?: "avif" | "webp" | "png" | "jpeg" | "jpg" | "svg" | "gif"; // default avif; SVG passes through
  quality?: number | "low" | "mid" | "high" | "max";                 // default "high" (75)
  width?: number;
  height?: number;
  sizes?: string;
  widths?: number[];     // default [320, 640, 1024] when no fixed width/height
  densities?: number[];  // default [1.5, 2] when width/height are fixed
  loading?: "lazy" | "eager";      // default lazy
  decoding?: "async" | "sync" | "auto";
  hasShadow?: boolean;
}
---
```

Usage — a hero image that is the LCP element:

```astro
---
// src/pages/index.astro (excerpt)
import Image from "@/components/atoms/Image.astro";
import hero from "@/assets/images/hero.jpg"; // src/assets/images/ is a folder you create
---

<Image
  src={hero}
  alt="Workspace with the redesigned storefront on a laptop"
  widths={[640, 1024, 1600]}
  sizes="(min-width: 1024px) 60vw, 100vw"
  loading="eager"
  decoding="sync"
/>
```

Files under `public/` are served as-is and must be pre-optimised. Three shipped scripts cover
that:

```bash
# scripts/src/optimize-images.ts — read-only inventory of every raster under public/ and src/:
# buckets each image by category (hero, content, thumbnail, avatar, icon, logo), flags
# oversized dimensions and poor bytes-per-pixel compression, and prints recommendations.
pnpm images:analyze

# scripts/src/optimize-images-interactive.ts — walks the same globs and, per flagged image,
# interactively resizes/recompresses it in place with sharp using the category ceilings
# (hero 1920x1080, content 1200x900, thumbnail 400x400, avatar 200x200, icon 512x512 ...).
pnpm images:optimize

# scripts/src/check-image-budget.ts (ADR-057) — hard gate: fails when any raster under
# public/ or src/ exceeds 200KB (override with IMAGE_BUDGET_KB=<kb>). ci.yml runs it against
# the source tree and again against dist/ after the build.
pnpm images:gate
```

See the [Image Optimization Guide](/implementation-guides/guides/image-optimization-guide/)
for the full workflow and the source-image guidelines.

### 2. Art Direction for Images

`Image.astro` (and Astro's built-in `<Picture>` from `astro:assets`) already handle the
multi-format AVIF/WebP + fallback case. A custom component is only warranted when you need
**art direction** — a different source image per breakpoint. If you build one, it is an atom:

```astro
---
// src/components/atoms/ArtDirectedPicture.astro (not shipped — build only if you need art direction)
import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets";

export interface Props {
  src: ImageMetadata;
  alt: string;
  sizes?: string;
  loading?: "eager" | "lazy";
  artDirection?: {
    media: string;
    src: ImageMetadata;
  }[];
}

const { src, alt, sizes = "100vw", loading = "lazy", artDirection = [] } = Astro.props;

// Generate optimized versions of the default source
const avif = await getImage({ src, format: "avif" });
const webp = await getImage({ src, format: "webp" });
const fallback = await getImage({ src, format: "jpeg" });

// Resolve art-directed sources up front — keeps the template synchronous
const artSources = await Promise.all(
  artDirection.map(async ({ media, src: artSrc }) => ({
    media,
    avif: await getImage({ src: artSrc, format: "avif" }),
    webp: await getImage({ src: artSrc, format: "webp" }),
  })),
);
---

<picture>
  {artSources.map(({ media, avif: artAvif, webp: artWebp }) => (
    <>
      <source media={media} type="image/avif" srcset={artAvif.src} />
      <source media={media} type="image/webp" srcset={artWebp.src} />
    </>
  ))}

  <!-- Default sources -->
  <source type="image/avif" srcset={avif.src} sizes={sizes} />
  <source type="image/webp" srcset={webp.src} sizes={sizes} />

  <!-- Fallback -->
  <img
    src={fallback.src}
    alt={alt}
    loading={loading}
    decoding="async"
    width={src.width}
    height={src.height}
  />
</picture>
```

### 3. Social Media (OG) Images

OG images are **not generated per page at runtime**. The shipped brand raster pipeline
(`scripts/src/build-og.ts`, ADR-047 / ADR-054) renders committed SVG artwork to PNG with
`sharp` so the rasters can never drift from the vectors:

| Source (committed) | Target (committed) | Size |
|---|---|---|
| `public/og-default.svg`, `og-blog.svg`, `og-about.svg` | `public/og-*.png` | 1200×630 |
| `src/assets/brand/app-icon-gradient.svg` | `public/apple-touch-icon.png` | 180×180 |
| `public/favicon.svg` | `public/favicon.ico` | 16/32/48 |

```bash
pnpm og:build   # regenerate every raster + write scripts/og-manifest.json (sha256 of each source SVG)
pnpm og:check   # re-hash the sources against the manifest; fails if an SVG changed but the
                # PNGs were not rebuilt. Runs inside quality:ci.
```

PNG is deliberate: Facebook, LinkedIn, Discord and Slack do not render SVG previews.

To add a page-specific OG image (for example for `/projects/`):

1. Draw `public/og-projects.svg` on a 1200×630 artboard (copy `og-default.svg` as a start).
2. Add `"projects"` to the `ogPages` array in `scripts/src/build-og.ts`.
3. Run `pnpm og:build` and commit `public/og-projects.png` **and** `scripts/og-manifest.json`.
4. Pass it to the layout — `Head.astro` resolves it to an absolute URL and warns in dev if the
   file is missing (`src/utils/validateOgImage.ts`):

```astro
---
// src/pages/projects/index.astro (excerpt)
import BaseLayout from "@/layouts/BaseLayout.astro";
---

<BaseLayout title="Projects" description="..." image="/og-projects.png">
  <!-- ... -->
</BaseLayout>
```

## Meta Descriptions & SEO

### SEO Head Component

All `<head>` metadata is owned by the shipped `src/components/molecules/Head.astro` (ADR-029).
`BaseLayout.astro` spreads its own props straight into `<Head {...Astro.props} />`, so pages
never render `<Head>` directly — they pass SEO props to the layout. Do not add a parallel
`SEO.astro`; extend `Head.astro` instead.

```astro
---
// src/components/molecules/Head.astro (shipped — Props excerpt)
export interface Props {
  /** Page title; the site title is appended unless the title already starts with it. */
  title: string;
  description: string;
  /** OG image — relative public/ path or absolute URL. @default "/og-default.png" */
  image?: string;
  /** @default new URL(Astro.url.pathname, Astro.site) */
  canonicalUrl?: URL;
  /** Adds <meta name="robots" content="noindex, nofollow">. @default false */
  noindex?: boolean;
  /** @default "website" */
  ogType?: "website" | "article";
  /** Only emitted when ogType is "article". */
  ogArticle?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
  };
  /** Emits dns-prefetch + preconnect for each domain. @default [] */
  preconnectDomains?: string[];
}
---
```

What it emits: charset/viewport/color-scheme, RSS `<link rel="alternate">`, favicons and the
web manifest, `<title>` + description + canonical, Open Graph and Twitter cards, `article:*`
tags for articles, a JSON-LD `@graph` (`WebSite` + `Organization` on every page, plus
`BlogPosting` on articles), the two self-hosted font faces via the Astro Fonts API (ADR-053),
and preconnect hints. Site-wide values come from `siteMetadata` in `src/config.ts`.

Usage on a static page:

```astro
---
// src/pages/about.astro (excerpt)
import BaseLayout from "@/layouts/BaseLayout.astro";
---

<BaseLayout
  title="About"
  description="Learn about my journey in web development and the values that drive my work"
  image="/og-about.png"
>
  <!-- ... -->
</BaseLayout>
```

Usage on an article — this is what the shipped `src/layouts/BlogLayout.astro` does with the
post's frontmatter:

```astro
---
// src/layouts/BlogLayout.astro (excerpt)
import BaseLayout from "@/layouts/BaseLayout.astro";
import { withBase } from "@/utils/url-utils";

const { title, description, date, updated, author, tags, cover } = Astro.props;
---

<BaseLayout
  title={title}
  description={description}
  image={cover ? cover.src : withBase("/og-blog.png")}
  ogType="article"
  ogArticle={{
    publishedTime: date.toISOString(),
    modifiedTime: updated?.toISOString(),
    author,
    tags,
  }}
>
  <slot />
</BaseLayout>
```

Legal pages that should stay out of search results pass `noindex={true}`.

### Meta Description Guidelines

```markdown
# Meta Description Best Practices

## Character Limits
- **Optimal**: 150-160 characters
- **Minimum**: 120 characters
- **Maximum**: 160 characters (truncated after — the `blog` and `projects` schemas enforce `.max(160)`)

## Writing Formula
1. **Start with action verb** (Discover, Learn, Create, Build)
2. **Include primary keyword** naturally
3. **Add unique value proposition**
4. **Include call-to-action** if space allows

## Examples by Page Type

### Homepage
"I create lightning-fast, accessible websites that delight users and drive results. Specializing in Astro, Preact, and modern web development. Let's build something amazing."

### Service Page
"Need a blazing-fast website? I build performance-focused web applications using Astro, Preact, and modern tools. 100% Lighthouse scores guaranteed. Get a free consultation."

### Blog Post
"Core Web Vitals got you down? Learn proven strategies to achieve Performance ≥ 95, Accessibility 100, Best-Practices 100, SEO 100, optimize INP, and create instant-feeling web experiences. Code examples included."

### Project Case Study
"See how I helped TechStyle Fashion increase conversions by 40% through performance optimization and UX improvements. Detailed case study with metrics and technical insights."

### About Page
"Hi, I'm [Name], a web developer passionate about performance and accessibility. Learn about my journey, skills, and approach to creating exceptional digital experiences."
```

## Navigation & Footer Content

### Navigation Data

Header navigation lives in the `navigation` collection as `src/content/navigation/header.json`.
The collection schema (`src/content.config.ts`) accepts a flat `items` array of
`{ label, href, isExternal?, icon?, order }` — nothing else validates — and the matching
TypeScript shape is `NavItem` in `src/types/navigation.ts`. `structural/Header.astro` reads the
collection, renders every non-external item as a text link, and renders the item with
`isExternal: true` + `icon: "github-logo"` as the icon button next to the theme toggle.

```json
// src/content/navigation/header.json (shipped)
{
  "items": [
    { "label": "Home", "href": "/", "order": 1 },
    { "label": "How It Works", "href": "/how-it-works/", "order": 2 },
    { "label": "Design System", "href": "/showcase/", "order": 3 },
    { "label": "Blog", "href": "/blog/", "order": 4 },
    { "label": "Projects", "href": "/projects/", "order": 5 },
    { "label": "About", "href": "/about/", "order": 6 },
    { "label": "Contact", "href": "/contact/", "order": 7 },
    {
      "label": "GitHub",
      "href": "https://github.com/clownware/astro-performance-starter",
      "isExternal": true,
      "icon": "github-logo",
      "order": 8
    }
  ]
}
```

Use trailing-slash `href`s — `Header.astro` normalises the current path to a trailing slash
before comparing it for `aria-current="page"`, and `withBase()` is applied at render time so
sub-path deploys (GitHub Pages) keep working.

### Footer Content

There is no `footer.json` — footer links are defined in code. Edit the `footerLinks` array in
`src/components/structural/Footer.astro`, and configure the docs/social columns via
`siteLinks` and `socialLinks` in `src/config.ts` (empty values auto-hide their sections):

```typescript
// src/components/structural/Footer.astro (frontmatter excerpt, shipped)
const footerLinks = [
  { label: "Home", href: withBase("/") },
  { label: "Blog", href: withBase("/blog/") },
  { label: "Projects", href: withBase("/projects/") },
  { label: "About", href: withBase("/about/") },
  { label: "Contact", href: withBase("/contact/") },
];

// Docs column renders only when siteLinks.docs is set; Connect column lists
// siteLinks.github + socialLinks.linkedin/twitter, skipping empty strings.
```

```typescript
// src/config.ts (excerpt, shipped) — update when you clone
export const siteLinks = {
  github: "https://github.com/clownware/astro-performance-starter",
  docs: "",      // "" hides the Docs column and the "View Documentation" CTAs
  demo: "",
  pagespeed: "", // "" renders the 95+ Lighthouse badge as static text
} as const;

export const socialLinks = {
  github: "",
  linkedin: "",
  twitter: "",
} as const;
```

If you want legal links (Privacy, Terms) in the footer, add them to `footerLinks` alongside
the pages you create in the next section.

## Legal Pages

### Privacy Policy

```mdx
---
# Draft copy for src/pages/privacy.astro (a page you create; pass noindex={true} to BaseLayout)
title: "Privacy Policy"
description: "How we collect, use, and protect your information"
noindex: true
---

# Privacy Policy

## Introduction

Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.

## Information We Collect

### Information You Provide
- **Contact Information**: Name, email address when you use our contact form
- **Project Details**: Information about your project needs when requesting a quote

### Automatically Collected Information
- **Analytics Data**: Page views, session duration, bounce rate (via privacy-focused analytics)
- **Technical Data**: Browser type, device type, screen resolution
- **No Cookies**: This site does not use tracking cookies

## How We Use Your Information

We use collected information to:
- Respond to your inquiries
- Send project proposals and quotes
- Improve our website and services
- Analyze website performance

## Data Security

We implement appropriate technical and organizational security measures to protect your personal information.

## Third-Party Services

We use the following third-party services:
- **Cloudflare**: Content delivery and DDoS protection
- **Plausible Analytics**: Privacy-focused website analytics (no cookies)

## Your Rights

You have the right to:
- Access your personal data
- Correct inaccurate data
- Request deletion of your data
- Opt-out of communications

## Contact

For privacy concerns, contact: privacy@yourdomain.com
```

### Terms of Service

```mdx
---
# Draft copy for src/pages/terms.astro (a page you create; pass noindex={true} to BaseLayout)
title: "Terms of Service"
description: "Terms and conditions for using this website"
noindex: true
---

# Terms of Service

## Acceptance of Terms

By accessing this website, you agree to be bound by these Terms of Service.

## Intellectual Property

All content on this website is protected by copyright and other intellectual property laws.

## Use License

You may:
- View and download materials for personal, non-commercial use
- Share links to our content

You may not:
- Modify or copy materials without permission
- Use materials for commercial purposes
- Remove any copyright notices

## Disclaimer

The information on this website is provided "as is" without warranties of any kind.

## Limitation of Liability

We shall not be liable for any damages arising from the use or inability to use materials on this website.

## Contact

For questions about these terms: legal@yourdomain.com
```

## 404 Error Page

The template ships a minimal `src/pages/404.astro` (heading, one line of copy, a "Go Home"
link). This is a richer version you can replace it with. `Section` and `Container` take only
`class` (plus `id`/`fullHeight`/`ariaLabel`/`ariaLabelledBy` on `Section`) — spacing and
width variants are Tailwind classes, and a narrower column is an inner `max-w-*` div, the same
pattern the shipped contact page uses.

```astro
---
// src/pages/404.astro (replacement for the shipped minimal page)
import Button from "@/components/atoms/Button.astro";
import Container from "@/components/structural/Container.astro";
import Section from "@/components/structural/Section.astro";
import BaseLayout from "@/layouts/BaseLayout.astro";
import { withBase } from "@/utils/url-utils";

const popularPages = [
  { title: "Homepage", href: withBase("/"), description: "Start from the beginning" },
  { title: "Projects", href: withBase("/projects/"), description: "View my recent work" },
  { title: "Blog", href: withBase("/blog/"), description: "Read my latest articles" },
  { title: "Contact", href: withBase("/contact/"), description: "Get in touch" },
];
---

<BaseLayout
  title="404 - Page Not Found"
  description="The page you're looking for doesn't exist"
  noindex={true}
>
  <Section ariaLabel="Page not found" class="py-24 sm:py-32">
    <Container>
      <div class="mx-auto max-w-2xl text-center">
        <div class="mb-8">
          <p class="text-8xl font-bold text-primary-600 dark:text-primary-400" aria-hidden="true">
            404
          </p>
          <h1 class="mt-4 text-3xl font-bold">Page Not Found</h1>
          <p class="mt-4 text-lg text-foreground/80">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
          </p>
        </div>

        <div class="mb-12">
          <Button href={withBase("/")} size="lg">
            Go Back Home
          </Button>
        </div>

        <div class="border-t border-border pt-12">
          <h2 class="mb-6 text-xl font-semibold">Popular Pages</h2>
          <div class="mx-auto grid max-w-md gap-4 text-left">
            {popularPages.map((page) => (
              <a
                href={page.href}
                class="block rounded-lg border border-border p-4 transition-colors hover:border-primary-600 dark:hover:border-primary-400"
              >
                <div class="font-medium">{page.title}</div>
                <div class="text-sm text-foreground/60">{page.description}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Container>
  </Section>

  <script>
    // Optional: report 404s to your analytics provider. The starter ships no
    // analytics client (see .env.example — PUBLIC_PLAUSIBLE_DOMAIN / PUBLIC_FATHOM_SITE_ID
    // are documented but not yet wired), so `window.analytics` is whatever you add.
    const analytics = (window as Window & { analytics?: { track: (e: string, p: object) => void } }).analytics;
    analytics?.track("404_error", {
      path: window.location.pathname,
      referrer: document.referrer || "direct",
      timestamp: new Date().toISOString(),
    });
  </script>
</BaseLayout>
```

## Microcopy Guidelines (Advanced)

### UI Text Patterns

```typescript
// src/data/microcopy.ts (not shipped — a folder you create; import as "@/data/microcopy")
export const microcopy = {
  // Buttons
  buttons: {
    primary: "Get Started",
    secondary: "Learn More",
    submit: "Send Message",
    loading: "Please Wait...",
    success: "Success!",
    error: "Try Again",
  },

  // Form labels
  forms: {
    name: {
      label: "Your Name",
      placeholder: "John Doe",
      error: "Please enter your name",
    },
    email: {
      label: "Email Address",
      placeholder: "john@example.com",
      error: "Please enter a valid email",
    },
    message: {
      label: "Your Message",
      placeholder: "Tell me about your project...",
      error: "Please enter a message",
    },
  },

  // Status messages
  status: {
    loading: "Loading content...",
    error: "Something went wrong. Please try again.",
    offline: "You appear to be offline. Check your connection.",
    success: "Thank you! I'll get back to you soon.",
  },

  // Empty states
  empty: {
    projects: "No projects found. Check back soon!",
    posts: "No posts match your search. Try different keywords.",
    comments: "Be the first to comment!",
  },
} as const;
```

---

## Real Page Implementations

Complete page examples showing how components, layouts, and content work together. Each one is
a trimmed excerpt of the page the starter actually ships — open the real file for the full
version.

### Homepage Implementation

Full-featured homepage with hero, metrics, features, tech stack, and CTA sections.

**File**: `src/pages/index.astro`

**Key Features:**

- Hero section with gradient background and scroll indicator
- Lighthouse metrics showcase
- Expandable feature cards
- Tech stack grid with category badges
- Implementation tier overview (Foundation / Build / Polish, ADR-033)
- Call-to-action section

**Pattern**: Section-based composition with reusable components

```astro
---
// src/pages/index.astro (excerpt — the shipped page has more sections)
import Badge from "@/components/atoms/Badge.astro";
import Button from "@/components/atoms/Button.astro";
import Icon from "@/components/atoms/Icon.astro";
import Card from "@/components/molecules/Card.astro";
import ExpandableFeatureCard from "@/components/molecules/ExpandableFeatureCard.astro";
import SectionSeparator from "@/components/molecules/SectionSeparator.astro";
import Container from "@/components/structural/Container.astro";
import Grid from "@/components/structural/Grid.astro";
import Section from "@/components/structural/Section.astro";
import { siteLinks } from "@/config";
import BaseLayout from "@/layouts/BaseLayout.astro";
import type { Feature, LighthouseMetric } from "@/types/content";

// Data structures — `icon` is an IconName from the Icon atom registry (ADR-055), not an emoji
const features: Feature[] = [
  {
    icon: "gauge",
    title: "Performance-First Architecture",
    description: "Zero-JS baseline with islands architecture...",
    metric: "95+ Lighthouse",
    expandedDetails: [/* ... */],
  },
  // ... more features
];

const metrics: LighthouseMetric[] = [
  { label: "Performance", score: "95+", icon: "gauge" },
  { label: "Accessibility", score: "100", icon: "accessibility" },
  // ... more metrics
];
---

<BaseLayout title="..." description="...">
  <!-- Hero Section -->
  <Section ariaLabel="Hero section" class="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center">
    <Container>
      <Badge>Production-Ready Template</Badge>
      <h1 class="mt-4 text-4xl font-extrabold tracking-tight lg:text-6xl">Astro Performance Starter</h1>
      <p class="mt-6 text-lg text-muted-foreground">Build blazing-fast websites...</p>
      <Button href={siteLinks.github} variant="primary" class="mt-6">Get Started</Button>
    </Container>
  </Section>

  <!-- Metrics Section -->
  <Section id="performance" ariaLabel="Performance metrics section" class="relative bg-surface">
    <SectionSeparator />
    <Container>
      <h2 class="text-center text-3xl font-bold">Lighthouse Performance Scores</h2>
      <ul class="mt-6 grid list-none grid-cols-2 gap-4 sm:grid-cols-4" role="list">
        {metrics.map((metric) => (
          <li>
            <Card class="h-full p-6 text-center">
              <div class="flex items-center justify-center gap-2 text-3xl font-bold text-link">
                <Icon name={metric.icon} class="size-6" decorative />
                {metric.score}
              </div>
              <div class="mt-1 text-sm text-muted-foreground">{metric.label}</div>
            </Card>
          </li>
        ))}
      </ul>
    </Container>
  </Section>

  <!-- Features Section -->
  <Section id="features" ariaLabel="Key features section" class="relative">
    <SectionSeparator />
    <Container>
      <h2 class="text-center text-3xl font-bold">Why Choose This Template?</h2>
      <!-- Grid = 1 / @md:2 / @lg:3 columns via container queries; extra classes append -->
      <Grid class="mt-8 gap-8">
        {features.map((feature) => (
          <ExpandableFeatureCard {...feature} />
        ))}
      </Grid>
    </Container>
  </Section>

  <!-- CTA Section -->
  <Section ariaLabel="Call to action section" class="relative bg-linear-to-br from-primary-600 to-secondary-600">
    <Container>
      <h2 class="text-center text-3xl font-bold text-primary-foreground">Ready to Build?</h2>
      <div class="mt-8 flex justify-center">
        <Button href={siteLinks.github} variant="primary" size="lg">Get Started</Button>
      </div>
    </Container>
  </Section>
</BaseLayout>
```

**Best Practices:**

- Separate data from presentation (types live in `src/types/content.ts`)
- Give every `Section` an `id` (anchor links) and an `ariaLabel`/`ariaLabelledBy`
- Implement scroll indicators for long pages
- Provide clear CTAs throughout
- Use gradient backgrounds sparingly

---

### Blog Index with Pagination

Blog listing page with featured posts, pagination, and empty-state handling.

**File**: `src/pages/blog/index.astro`

**Key Features:**

- Featured posts section (first page only, de-duplicated from the main grid)
- Paginated post grid built from `PostCard`
- Reading time and date metadata via `formatPostMetadata`
- "New" badge for recent posts (handled inside `PostCard`)
- Responsive card layouts
- Empty state handling

**Pattern**: Content Collections with Astro pagination (ADR-012)

```astro
---
// src/pages/blog/index.astro (excerpt)
import type { CollectionEntry } from "astro:content";
import type { GetStaticPaths, Page } from "astro";
import Button from "@/components/atoms/Button.astro";
import PostCard from "@/components/molecules/PostCard.astro";
import BaseLayout from "@/layouts/BaseLayout.astro";
import { getFeaturedPosts, getPublishedPosts } from "@/utils/blog";
import { formatPostMetadata } from "@/utils/formatDate";
import { withBase } from "@/utils/url-utils";

const postsPerPage = 6;

export const getStaticPaths: GetStaticPaths = async ({ paginate }) => {
  // Centralised blog utilities: filters drafts and sorts newest-first
  const sortedPosts = await getPublishedPosts();
  return paginate(sortedPosts, { pageSize: postsPerPage });
};

const { page } = Astro.props as { page: Page<CollectionEntry<"blog">> };

// Featured posts (limit 3) are shown on page 1 and excluded from the main grid there
const featuredPosts = await getFeaturedPosts(3);
const featuredIds = new Set(featuredPosts.map((p) => p.id));
const gridPosts = page.currentPage === 1
  ? page.data.filter((post) => !featuredIds.has(post.id))
  : page.data;

// PostCard expects `post.metadata` ({ publishedDate, readingTime, isRecent })
const withMetadata = (post: CollectionEntry<"blog">) => ({
  ...post,
  metadata: formatPostMetadata(post.data.date, post.body),
});
const featuredPostsWithMetadata = featuredPosts.map(withMetadata);
const postsWithMetadata = gridPosts.map(withMetadata);

const pageTitle = page.currentPage === 1 ? "Blog" : `Blog - Page ${page.currentPage}`;
---

<BaseLayout title={pageTitle} description="..." image="/og-blog.png">
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <h1 class="mb-12 text-center text-4xl font-bold">Blog</h1>

    <!-- Featured Posts (first page only) -->
    {page.currentPage === 1 && featuredPostsWithMetadata.length > 0 && (
      <section class="mb-16" aria-labelledby="featured-posts-heading">
        <h2 id="featured-posts-heading" class="mb-8 text-2xl font-bold">Featured</h2>
        <div class="flex flex-wrap justify-center gap-8">
          {featuredPostsWithMetadata.map((post) => (
            <PostCard post={post} featured={true} class="md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)]" />
          ))}
        </div>
      </section>
    )}

    <!-- All Posts Grid -->
    <section aria-labelledby="all-posts-heading">
      <h2 id="all-posts-heading" class="mb-8 text-2xl font-bold">
        {page.currentPage === 1 ? "All Posts" : `Posts - Page ${page.currentPage}`}
      </h2>

      {postsWithMetadata.length === 0 ? (
        <div class="py-16 text-center">
          <p class="text-lg text-muted-foreground">No blog posts found.</p>
          <Button href={withBase("/")} variant="secondary" class="mt-4">Back to Home</Button>
        </div>
      ) : (
        <div class="flex flex-wrap justify-center gap-8">
          {postsWithMetadata.map((post) => (
            <PostCard post={post} class="md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)]" />
          ))}
        </div>
      )}

      <!-- Pagination -->
      {page.lastPage > 1 && (
        <nav class="mt-12 flex justify-center" aria-label="Blog pagination">
          <div class="flex items-center space-x-2">
            {page.url.prev && (
              <Button href={page.url.prev} variant="secondary" size="sm" aria-label={`Go to page ${page.currentPage - 1}`}>
                Previous
              </Button>
            )}

            <div class="hidden items-center space-x-1 sm:flex">
              {Array.from({ length: page.lastPage }, (_, i) => i + 1).map((pageNum) => {
                const href = pageNum === 1 ? withBase("/blog/") : withBase(`/blog/${pageNum}/`);
                return pageNum === page.currentPage ? (
                  <span class="rounded-md border border-primary-300 bg-primary-100 px-3 py-2 text-sm font-medium text-primary-700" aria-current="page">
                    {pageNum}
                  </span>
                ) : (
                  <Button href={href} variant="ghost" size="sm" aria-label={`Go to page ${pageNum}`}>{pageNum}</Button>
                );
              })}
            </div>

            <!-- Mobile indicator -->
            <div class="px-3 py-2 text-sm text-muted-foreground sm:hidden">
              Page {page.currentPage} of {page.lastPage}
            </div>

            {page.url.next && (
              <Button href={page.url.next} variant="secondary" size="sm" aria-label={`Go to page ${page.currentPage + 1}`}>
                Next
              </Button>
            )}
          </div>
        </nav>
      )}
    </section>
  </div>
</BaseLayout>
```

**Best Practices:**

- Use Astro's built-in `paginate()` and the shared `getPublishedPosts` / `getFeaturedPosts` helpers
- Show featured content on the first page only, and keep it out of the main grid there
- Implement empty states
- Provide clear pagination controls with `aria-label`s and `aria-current="page"`
- Add mobile-friendly page indicators
- Let `PostCard` own the card markup (it already uses `Image.astro`, `Badge` and `Card`)

---

### Projects Index with Filtering

Projects portfolio page with client-side filtering by technology and a "Load More" button for
anything past the first six entries (hybrid SSR + client pagination, ADR-015).

**File**: `src/pages/projects/index.astro`

**Key Features:**

- Client-side technology filtering
- Dynamic filter buttons generated from the collection
- Empty state with reset button
- Project cards with metadata
- Responsive grid layout

**Pattern**: Static generation with progressive enhancement

```astro
---
// src/pages/projects/index.astro (excerpt — the shipped page also implements Load More)
import { type CollectionEntry, getCollection } from "astro:content";
import Button from "@/components/atoms/Button.astro";
import Icon from "@/components/atoms/Icon.astro";
import ProjectCard from "@/components/molecules/ProjectCard.astro";
import BaseLayout from "@/layouts/BaseLayout.astro";
import { withBase } from "@/utils/url-utils";

const entries = await getCollection("projects", ({ data }: CollectionEntry<"projects">) => !data.draft);

// Content-layer entries are addressed by `id` (the folder name), not `slug`
const projects = entries
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .map((entry) => ({
    title: entry.data.title,
    description: entry.data.description,
    image: entry.data.cardImage ?? entry.data.cover,
    techStack: entry.data.technologies,
    demoUrl: entry.data.externalUrl,
    href: withBase(`/projects/${entry.id}/`),
    date: entry.data.date,
    tags: entry.data.tags,
  }));

// Extract unique technologies for filters
const allTechStack = [...new Set(projects.flatMap((p) => p.techStack))].sort();
---

<BaseLayout title="Projects" description="..." image="/og-default.png">
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <h1 class="mb-12 text-center text-4xl font-bold">Projects</h1>

    <!-- Filter Controls (native buttons with aria-pressed, not Badge/Button atoms) -->
    <section class="mb-12" aria-labelledby="filter-heading">
      <h2 id="filter-heading" class="mb-4 text-center text-xl font-bold">Filter by Technology</h2>
      <div class="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          class="filter-btn active inline-flex items-center rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium"
          data-filter="all"
          aria-pressed="true"
        >
          All Projects
        </button>
        {allTechStack.map((tech) => (
          <button
            type="button"
            class="filter-badge inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-200"
            data-filter={tech.toLowerCase()}
            aria-pressed="false"
          >
            {tech}
          </button>
        ))}
      </div>
    </section>

    <!-- Projects Grid -->
    <section aria-labelledby="projects-heading">
      <h2 id="projects-heading" class="mb-8 text-center text-2xl font-bold">All Projects</h2>
      <div id="projects-grid" class="flex flex-wrap justify-center gap-8" aria-live="polite">
        {projects.map((project) => (
          <ProjectCard
            {...project}
            class="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)]"
            data-tech-stack={project.techStack.map((t) => t.toLowerCase()).join(" ")}
          />
        ))}
      </div>
    </section>

    <!-- Empty State -->
    <div id="empty-state" class="hidden py-12 text-center">
      <Icon name="search" class="mx-auto mb-4 size-12 text-muted-foreground" decorative />
      <h3 class="mb-2 text-xl font-semibold">No projects found</h3>
      <p class="mb-6 text-muted-foreground">Try selecting a different technology filter.</p>
      <Button variant="primary" class="reset-filter-btn">Show All Projects</Button>
    </div>
  </div>
</BaseLayout>

<script>
  // Named so it can re-run after every view-transition swap: ClientRouter does
  // not re-fire DOMContentLoaded, so a bare listener would leave the filter inert
  // after a soft navigation.
  function setupProjectsFilter() {
    const controls = document.querySelectorAll<HTMLElement>(".filter-btn, .filter-badge");
    if (controls.length === 0) return; // not on the projects page
    const cards = document.querySelectorAll<HTMLElement>("[data-tech-stack]");
    const emptyState = document.getElementById("empty-state");
    const resetButton = document.querySelector<HTMLElement>(".reset-filter-btn");

    const filterProjects = (filterValue: string) => {
      let visibleCount = 0;
      cards.forEach((card) => {
        const techStack = card.getAttribute("data-tech-stack") ?? "";
        const shouldShow = filterValue === "all" || techStack.includes(filterValue);
        card.style.display = shouldShow ? "block" : "none";
        if (shouldShow) visibleCount++;
      });
      emptyState?.classList.toggle("hidden", visibleCount !== 0);
      controls.forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      });
    };

    controls.forEach((button) => {
      button.addEventListener("click", () => {
        filterProjects(button.getAttribute("data-filter") ?? "all");
        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");
      });
    });

    resetButton?.addEventListener("click", () => {
      filterProjects("all");
      document.querySelector<HTMLElement>('[data-filter="all"]')?.classList.add("active");
      document.querySelector<HTMLElement>('[data-filter="all"]')?.setAttribute("aria-pressed", "true");
    });
  }

  setupProjectsFilter();
  document.addEventListener("astro:after-swap", setupProjectsFilter);
</script>

<style>
  /* Tailwind v4: @apply inside a scoped <style> needs the @reference */
  @reference "../../styles/global.css";

  .filter-btn.active,
  .filter-badge.active {
    @apply bg-primary-600 text-primary-foreground;
  }

  [data-tech-stack] {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  [data-tech-stack][style*="display: none"] {
    opacity: 0;
    transform: scale(0.95);
  }
</style>
```

**Best Practices:**

- Generate filters from actual data
- Use `data-*` attributes for filtering and `aria-pressed` on the toggles
- Re-attach listeners on `astro:after-swap` (view transitions are on via `ClientRouter`)
- Show empty states
- Provide reset functionality
- Keep JavaScript minimal and progressive — vanilla script, not an island (ADR-001)

---

### Contact Page with Form

Contact page with the shipped `ContactForm` molecule (ADR-018, ADR-021).

**File**: `src/pages/contact.astro`

```astro
---
// src/pages/contact.astro (simplified — the shipped page adds contact methods, socials and expectations)
import ContactForm from "@/components/molecules/ContactForm.astro";
import Container from "@/components/structural/Container.astro";
import Section from "@/components/structural/Section.astro";
import BaseLayout from "@/layouts/BaseLayout.astro";
import { withBase } from "@/utils/url-utils";
---

<BaseLayout
  title="Contact"
  description="Get in touch with us"
>
  <Section ariaLabel="Contact form section">
    <Container>
      <div class="mx-auto max-w-3xl">
        <div class="mb-12 text-center">
          <h1 class="mb-4 text-4xl font-bold">Get In Touch</h1>
          <p class="text-lg text-muted-foreground">
            Have a question or want to work together? Send us a message.
          </p>
        </div>

        <!--
          `action` defaults to "/contact"; wrap it in withBase() so sub-path deploys work.
          Static hosts (GitHub Pages, Cloudflare Pages without Functions) have nothing
          listening there — point `action` at Formspree/Netlify Forms/etc. or it POSTs to a 404.
        -->
        <ContactForm action={withBase("/contact")} />

        <div class="mt-12 text-center text-sm text-muted-foreground">
          <p>Or email us directly at: <a href="mailto:hello@example.com" class="text-link hover:underline">hello@example.com</a></p>
        </div>
      </div>
    </Container>
  </Section>
</BaseLayout>
```

The shipped page reads the address, phone and social handles from `astro:env/client`
(`PUBLIC_CONTACT_*`, `PUBLIC_SOCIAL_*` — see `.env.example`, ADR-050) instead of hardcoding
them.

---

## Page Patterns Summary

### 1. Section-Based Composition

```astro
<BaseLayout title="..." description="...">
  <Section id="hero" ariaLabel="Hero">...</Section>
  <Section id="features" ariaLabel="Features" class="bg-surface">...</Section>
  <Section id="cta" ariaLabel="Call to action">...</Section>
</BaseLayout>
```

### 2. Content Collections Integration

```astro
---
import { getCollection } from "astro:content";

const posts = await getCollection("blog", ({ data }) => !data.draft);
const sortedPosts = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
// For blog specifically, prefer the shipped helpers: getPublishedPosts() / getFeaturedPosts()
---
```

### 3. Progressive Enhancement

```astro
<!-- Works without JavaScript -->
<div class="grid">
  {items.map((item) => <Card {...item} />)}
</div>

<!-- Enhanced with JavaScript -->
<script>
  // Add filtering, sorting, etc.
</script>
```

### 4. Responsive Layouts

```astro
<!-- structural/Grid: 1 / @md:2 / @lg:3 columns by default; extend via class -->
<Grid class="gap-6 @lg:grid-cols-4">
  {items.map((item) => <Card {...item} />)}
</Grid>
```

### 5. Empty States

```astro
{items.length === 0 ? (
  <div class="py-16 text-center">
    <p>No items found.</p>
    <Button href={withBase("/")}>Go Home</Button>
  </div>
) : (
  <div class="grid">{/* items */}</div>
)}
```

---

## Related Documentation

- [Phase 7: Content](/implementation-guides/active-phases/phase-7-content/) - The phase guide these examples support
- [Layout Components](/implementation-guides/code-examples/phase-6-code-examples/#layout-components) - Layout examples
- [Component Patterns](/patterns/component-patterns/) - Component design patterns
- [Content Collections](/patterns/content-collections/) - Content management
- [Content Model Guide](/implementation-guides/guides/content-model-guide/) - Collection schemas
- [Image Optimization Guide](/implementation-guides/guides/image-optimization-guide/) - The shipped image workflow
- [Performance Patterns](/patterns/performance-patterns/) - Optimization strategies
- [ADR-029: SEO and Metadata Architecture](/adr/029-seo-metadata-architecture/) - Why `Head.astro` owns the `<head>`
- [ADR-030: Image Optimisation Defaults](/adr/030-image-optimisation-defaults/) - `astro:assets` configuration
- [ADR-052: Script Taxonomy](/adr/052-script-taxonomy/) - Where scripts live and how they are named
