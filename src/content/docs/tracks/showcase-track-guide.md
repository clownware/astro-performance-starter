---
title: Showcase Track Guide
description: >-
  A comprehensive guide to building a high-performance showcase project with the
  Astro Starter Template, focusing on advanced patterns and best practices
lastUpdated: true
tableOfContents: true
pagefind: true
---
### Phase 3: Tooling

**Showcase CI/CD Pipeline:**

```yaml
# .github/workflows/ci.yml
name: Astro CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm run build

      - name: Run tests
        run: pnpm run test

      - name: Visual Tests
        run: pnpm run test:visual
        env:
          PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}

      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          uploadArtifacts: true

      - name: Bundle Analysis
        run: pnpm run analyze
```

### Phase 4: Skeleton

**Showcase Layout System:**

```astro


***


// src/layouts/BaseLayout.astro
import { ViewTransitions } from 'astro:transitions';
import { SEO } from 'astro-seo';
import Header from '@/components/layout/Header.astro';
import Footer from '@/components/layout/Footer.astro';
import SkipLinks from '@/components/a11y/SkipLinks.astro';
import Analytics from '@/components/Analytics.astro';

export interface Props {
  title: string;
  description: string;
  image?: string;
  article?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noindex?: boolean;
}

const {
  title,
  description,
  image = '/og-default.jpg',
  article = false,
  publishedTime,
  modifiedTime,
  author,
  noindex = false,
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);


***



<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="generator" content={Astro.generator}>
  
  <SEO
    title={title}
    description={description}
    canonical={canonicalURL.toString()}
    openGraph={{
      basic: {
        title,
        type: article ? 'article' : 'website',
        image,
        url: canonicalURL.toString(),
      },
      optional: {
        description,
        siteName: 'Your Site Name',
      },
      article: article ? {
        publishedTime,
        modifiedTime,
        author,
      } : undefined,
    }}
    twitter={{
      card: 'summary_large_image',
      site: '@yourhandle',
      creator: '@yourhandle',
    }}
    extend={{
      meta: [
        { name: 'robots', content: noindex ? 'noindex, nofollow' : 'index, follow' },
        { name: 'theme-color', content: '#0066cc' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.json' },
      ],
    }}
  />
  
  <ViewTransitions />
  
  <!-- Preload critical fonts -->
  <link rel="preload" href="./fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
  
  <!-- Critical CSS -->
  <style is:inline>
    /* Prevent FOUC */
    .astro-route-announcer { position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden; }
  </style>
</head>
<body>
  <SkipLinks />
  
  <Header />
  
  <main id="main" tabindex="-1">
    <slot />
  </main>
  
  <Footer />
  
  <Analytics />
  
  <!-- Development helpers -->
  {import.meta.env.DEV && (
    <script>
      // Grid overlay with Shift+G
      document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key === 'G') {
          document.body.classList.toggle('grid-overlay');
        }
      });
    </script>
  )}
</body>
</html>
```

### Phase 5: Components (4 days)

**Showcase Component Library:**

1. **Interactive Button with Loading State**

    ```astro
    // src/components/ui/Button.astro
    export interface Props {
      variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
      size?: 'sm' | 'md' | 'lg';
      loading?: boolean;
      disabled?: boolean;
      href?: string;
      type?: 'button' | 'submit' | 'reset';
      id?: string;
    }

    const {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      href,
      type = 'button',
      id,
      ...attrs
    } = Astro.props;

    const Tag = href ? 'a' : 'button';
    
    <Tag
      {...attrs}
      href={href}
      type={!href ? type : undefined}
      disabled={disabled || loading}
      data-loading={loading}
      id={id}
      class:list={[
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        { 'btn-loading': loading }
      ]}
    >
      <span class="btn-content">
        <slot />
      </span>
      {loading && (
        <span class="btn-spinner">
          <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24">
            {/* spinner icon */}
          </svg>
        </span>
      )}
    </Tag>
    ```

2. **Interactive Card Component**

    ```astro
    // src/components/ui/Card.astro
    import { Image } from 'astro:assets';
    import type { ImageMetadata } from 'astro:assets';

    export interface Props {
      title: string;
      description: string;
      image?: ImageMetadata;
      href?: string;
      tags?: string[];
      date?: Date;
      interactive?: boolean;
    }

    const {
      title,
      description,
      image,
      href,
      tags = [],
      date,
      interactive = false,
    } = Astro.props;

    const CardContent = () => (
      <>
        {image && (
          <div class="card-image">
            <Image
              src={image}
              alt=""
              widths={[400, 800]}
              sizes="(max-width: 768px) 100vw, 400px"
              loading="lazy"
            />
          </div>
        )}
        <div class="card-body">
          <h3 class="card-title">{title}</h3>
          <p class="card-description">{description}</p>
          {date && <time class="card-date">{date.toLocaleDateString()}</time>}
          <div class="card-tags">
            {tags.map(tag => <span class="card-tag">{tag}</span>)}
          </div>
        </div>
      </>
    );

    {interactive ? (
      <article
        class="card interactive-card"
        data-href={href}
        client:visible
      >
        <CardContent />
      </article>
    ) : href ? (
      <a href={href} class="card card-link">
        <CardContent />
      </a>
    ) : (
      <article class="card">
        <CardContent />
      </article>
    )}

    <script>
      // Progressive enhancement for interactive cards
      document.querySelectorAll('.interactive-card').forEach(card => {
        card.addEventListener('click', (e) => {
          const href = card.dataset.href;
          if (href && !e.target.closest('a')) {
            window.location.href = href;
          }
        });
      });
    </script>
    ```

3. **Hero Section with Particle Animation**

```astro


***


// src/components/sections/Hero.astro
import Button from '@/components/ui/Button.astro';
import ParticleField from '@/components/islands/ParticleField';

export interface Props {
  title: string;
  subtitle?: string;
  cta?: {
    text: string;
    href: string;
  };
  pattern?: 'dots' | 'grid' | 'waves';
}

const { title, subtitle, cta, pattern = 'dots' } = Astro.props;


***



<section class="hero">
  <div class="hero-background">
    <ParticleField pattern={pattern} client:idle />
  </div>
  
  <div class="hero-content">
    <h1 class="hero-title">
      {title.split(' ').map((word, i) => (
        <span 
          style={{ animationDelay: `${i * 100}ms` }}
          class="animate-fade-in-up"
        >
          {word}
        </span>
      ))}
    </h1>
    
    {subtitle && (
      <p class="hero-subtitle">{subtitle}</p>
    )}
    
    {cta && (
      <div class="hero-cta">
        <Button href={cta.href} size="lg">
          {cta.text}
        </Button>
      </div>
    )}
  </div>
</section>

<style>
  .hero {
    @apply relative min-h-screen flex items-center justify-center;
    @apply overflow-hidden;
  }
  
  .hero-background {
    @apply absolute inset-0 -z-10;
  }
  
  .hero-content {
    @apply relative z-10 text-center px-4;
  }
  
  .hero-title {
    @apply text-5xl md:text-7xl font-bold mb-4;
    @apply bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500;
  }
  
  .hero-subtitle {
    @apply text-lg md:text-xl text-foreground-muted max-w-2xl mx-auto mb-8;
  }
  
  .hero-cta {
    @apply mt-8;
  }
</style>
```

### Phase 6: Sections (2 days)

**Showcase Content Sections:**

1. **Project Showcase with Filtering**

```astro


***


// src/components/sections/ProjectShowcase.astro
import { getCollection } from 'astro:content';
import ProjectCard from '@/components/ui/ProjectCard.astro';
import FilterBar from '@/components/islands/FilterBar';

const projects = await getCollection('projects');
const technologies = [...new Set(projects.flatMap(p => p.data.technologies))];


***



<section class="project-showcase">
  <div class="container">
    <h2 class="section-title">Featured Projects</h2>
    
    <FilterBar 
      filters={technologies} 
      client:load
    />
    
    <div class="projects-grid" data-projects>
      {projects.map(project => (
        <div data-tags={project.data.technologies.join(',')}>
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  </div>
</section>
```

### Phase 7: Content (5 days)

**Showcase Content Collections:**

```mdx
// src/content/projects/project-one.mdx


***


title: "Interactive Design System"
technologies: ['Astro', 'Preact', 'Tailwind', 'Style-Dictionary']
date: 2024-01-15
cover: ./images/design-system-hero.jpg
gallery:
  - ./images/tokens-structure.png
  - ./images/component-library.png
  - ./images/documentation-site.png


***



import Figure from '@/components/mdx/Figure.astro';
import Callout from '@/components/mdx/Callout.astro';
import CodeDemo from '@/components/mdx/CodeDemo.astro';

# Building a Design System

<Callout type="info">
  This project demonstrates a full-featured design system with token automation, component library, and documentation site.
</Callout>

Our goal was to create a single source of truth for design that could be consumed by multiple web applications.

<Figure 
  src="./images/tokens-structure.png"
  caption="Token structure using Style Dictionary"
/>

## Key Features

- Automated token pipeline
- WCAG AA compliant color palettes
- Interactive component examples

<CodeDemo client:visible>
  <div slot="preview">
    <Button>Click Me</Button>
  </div>
  <div slot="code">
    ```html
    <button class="btn btn-primary">Click Me</button>
    ```
  </div>
</CodeDemo>
```

### Phase 8: QA (3 days)

**Showcase Testing Implementation:**

1. **E2E Test Suite**

    ```typescript
    // tests/e2e/critical-paths.spec.ts
    import { test, expect } from '@playwright/test';

    test.describe('Critical Paths', () => {
      test('Homepage loads and has correct title', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Your Site Name/);
      });

      test('Can navigate to projects and filter', async ({ page }) => {
        await page.goto('/projects');
        await page.click('button[data-filter="Astro"]');
        await expect(page.locator('[data-tags*="Astro"]')).toBeVisible();
        await expect(page.locator('[data-tags*="React"]')).not.toBeVisible();
      });
    });
    ```

2. **Visual Regression Testing**

    ```typescript
    // tests/visual/components.spec.ts
    import { test, expect } from '@playwright/test';
    import percySnapshot from '@percy/playwright';

    test('Button component variants', async ({ page }) => {
      await page.goto('/components/button');
      await percySnapshot(page, 'Button Variants');
    });
    ```

3. **Unit Tests for Utilities**

    ```typescript
    // src/utils/formatDate.test.ts
    import { expect, test } from 'vitest';
    import { formatDate } from './formatDate';

    test('formats date correctly', () => {
      const date = new Date('2024-01-15T00:00:00Z');
      expect(formatDate(date)).toBe('January 15, 2024');
    });
    ```

### Phase 9: Performance (2 days)

**Showcase Performance Optimization:**

1. **Image Optimization Strategy**

    ```astro
    // src/components/ui/OptimizedImage.astro
    import { Image } from 'astro:assets';
    import type { ImageMetadata } from 'astro:assets';

    interface Props {
      src: ImageMetadata;
      alt: string;
      lazy?: boolean;
      widths?: number[];
      sizes?: string;
    }

    const {
      src,
      alt,
      lazy = true,
      widths = [400, 800, 1200],
      sizes = '(max-width: 800px) 100vw, 800px'
    } = Astro.props;

    <Image
      src={src}
      alt={alt}
      widths={widths}
      sizes={sizes}
      loading={lazy ? 'lazy' : 'eager'}
      format="avif"
      fallbackFormat="webp"
    />
    ```

2. **Font Loading Strategy**

    ```astro
    // src/layouts/BaseLayout.astro
    <head>
      <link
        rel="preload"
        href="/fonts/inter-variable.woff2"
        as="font"
        type="font/woff2"
        crossorigin
      >
      <style>
        @font-face {
          font-family: 'Inter';
          src: url('/fonts/inter-variable.woff2') format('woff2');
          font-weight: 100 900;
          font-display: swap;
        }
      </style>
    </head>
    ```

### Phase 10: Deployment (1 day)

**Showcase Deployment & Headers:**

```bash
# public/_headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Permissions-Policy: interest-cohort=()
  Content-Security-Policy: ...
*/
```

### Phase 11: Documentation (2 days)

**Showcase Documentation Examples:**

1. **Interactive Code Demos**

    ```astro
    // src/components/mdx/CodeDemo.astro
    // ... logic to handle slots

    <div class="code-demo">
      <div class="preview">
        <slot name="preview" />
      </div>
      <div class="code">
        <slot name="code" />
      </div>
    </div>
    ```

2. **Video Embed Component**

    ```astro
    // src/components/mdx/Video.astro
    interface Props {
      src: string;
      title: string;
      width?: number;
      height?: number;
    }
    const { src, title, width = 16, height = 9 } = Astro.props;

    <div style={`aspect-ratio: ${width}/${height}`}>
      <iframe
        src={src}
        title={title}
        frameborder="0"
        allowfullscreen
        loading="lazy"
        client:visible
      />
    </div>
    ```

### Phase 12: Post-Launch (1 day)

**Showcase Monitoring & Analytics:**

```typescript
// src/pages/api/analytics.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  
  // Process analytics data
  const metrics = {
    ...data,
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get('user-agent'),
  };
  
  // Send to analytics service
  await sendToAnalytics(metrics);
  
  // Store for internal dashboard
  await storeMetrics(metrics);
  
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
```

## Advanced Patterns

### 1. Progressive Enhancement

```astro


***


// Enhance forms progressively


***



<form 
  method="POST" 
  action="/api/contact"
  data-enhance
>
  <!-- Form works without JS -->
</form>

<script>
  // Enhance if JS available
  document.querySelectorAll('[data-enhance]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
      });
      
      // Handle response with better UX
    });
  });
</script>
```

### 2. Performance Budgets

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import bundleAnalyzer from '@bundle-analyzer/astro';

export default defineConfig({
  integrations: [
    bundleAnalyzer({
      analyzeMode: 'static',
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: 'bundle-stats.json',
    }),
  ],
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'preact': ['preact'],
            'utils': ['./src/utils/index.ts'],
          },
        },
      },
    },
  },
});
```

## Showcase vs MVP

### When to Choose Showcase

✅ **Choose Showcase when:**

- Building a technical portfolio
- Demonstrating skills to employers
- Creating a team reference
- Have 4-6 weeks available
- Want comprehensive testing
- Need selective interactivity

❌ **Avoid Showcase when:**

- Timeline is critical
- Content is the only focus
- Working solo with limited time
- Building a simple site
- Learning Astro basics

### Migration Path

**From MVP to Showcase:**

1. Add testing infrastructure
2. Enhance components gradually
3. Introduce islands selectively
4. Improve documentation
5. Add monitoring

## Success Metrics

### Technical Excellence

- Lighthouse: 98+ all categories
- Bundle size: <160KB JS
- Test coverage: 80%+
- Zero accessibility violations
- Sub-second load times

### Developer Experience

- Type safety throughout
- Comprehensive documentation
- Automated testing
- Visual regression prevention
- Easy onboarding

### Business Impact

- Improved conversions
- Better engagement metrics
- Lower bounce rates
- Higher satisfaction scores
- Reduced maintenance costs

## Design Decisions

### Islands Architecture

We use interactive islands sparingly:

- Filter controls
- Search functionality
- Complex forms
- Data visualizations

### Performance Strategy

- AVIF/WebP images with fallbacks
- Critical CSS inlined
- Fonts preloaded
- JS lazy loaded

### Deployment

- Cloudflare Pages for hosting
- GitHub Actions for CI/CD
- Automated rollbacks on regression

## Conclusion

The Showcase track demonstrates your ability to build production-grade applications with modern best practices. It's an investment in quality that pays dividends through easier maintenance, better performance, and a portfolio piece that stands out.

Remember: The goal isn't to use every feature, but to thoughtfully apply advanced patterns where they add value. Show restraint in your technical choices while demonstrating depth in your implementation.
