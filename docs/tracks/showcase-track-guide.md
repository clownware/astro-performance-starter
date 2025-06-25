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

### Phase 4: Skeleton (3 days)

**Showcase Layout System:**
```astro
---
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
---

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
  <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
  
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
---
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
---

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
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </span>
  )}
</Tag>

<style>
  .btn {
    @apply relative inline-flex items-center justify-center;
    @apply px-4 py-2 rounded-lg font-medium;
    @apply transition-all duration-200;
    @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
  }
  
  .btn-primary {
    @apply bg-blue-600 text-white;
    @apply hover:bg-blue-700 active:bg-blue-800;
    @apply focus:ring-blue-500;
  }
  
  .btn-loading {
    @apply cursor-wait opacity-75;
  }
  
  .btn-spinner {
    @apply absolute inset-0 flex items-center justify-center;
  }
  
  .btn-loading .btn-content {
    @apply invisible;
  }
</style>
```

2. **Advanced Card with Islands**
```astro
---
// src/components/ui/Card.astro
import { Image } from 'astro:assets';

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
      {date && (
        <time class="card-date" datetime={date.toISOString()}>
          {date.toLocaleDateString()}
        </time>
      )}
      <p class="card-description">{description}</p>
      {tags.length > 0 && (
        <div class="card-tags">
          {tags.map(tag => (
            <span class="tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  </>
);
---

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
    
    // Add hover effect
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-4px)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });
</script>
```

### Phase 6: Sections (3 days)

**Showcase Section Components:**

1. **Animated Hero Section**
```astro
---
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
---

<section class="hero">
  <div class="hero-background">
    <ParticleField pattern={pattern} client:idle />
  </div>
  
  <div class="hero-content">
    <h1 class="hero-title">
      {title.split(' ').map((word, i) => (
        <span 
          class="hero-word"
          style={`animation-delay: ${i * 0.1}s`}
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
    @apply max-w-4xl mx-auto;
  }
  
  .hero-title {
    @apply text-5xl md:text-7xl font-bold mb-6;
    @apply text-transparent bg-clip-text;
    @apply bg-gradient-to-r from-blue-600 to-purple-600;
  }
  
  .hero-word {
    @apply inline-block opacity-0;
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
    from {
      opacity: 0;
      transform: translateY(20px);
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    .hero-word {
      animation: none;
      opacity: 1;
    }
  }
</style>
```

2. **Interactive Project Showcase**
```astro
---
// src/components/sections/ProjectShowcase.astro
import ProjectCard from '@/components/ui/ProjectCard.astro';
import FilterBar from '@/components/islands/FilterBar';

const projects = await getCollection('projects');
const technologies = [...new Set(projects.flatMap(p => p.data.technologies))];
---

<section class="project-showcase">
  <div class="container">
    <h2 class="section-title">Featured Projects</h2>
    
    <FilterBar 
      filters={technologies} 
      client:load
    />
    
    <div class="projects-grid" data-projects>
      {projects.map(project => (
        <ProjectCard 
          {...project.data}
          slug={project.slug}
          data-technologies={project.data.technologies.join(',')}
        />
      ))}
    </div>
  </div>
</section>

<script>
  // Filter functionality
  window.addEventListener('filter-change', (e) => {
    const activeFilters = e.detail.filters;
    const projects = document.querySelectorAll('[data-technologies]');
    
    projects.forEach(project => {
      const techs = project.dataset.technologies.split(',');
      const show = activeFilters.length === 0 || 
        activeFilters.some(filter => techs.includes(filter));
      
      project.style.display = show ? 'block' : 'none';
      project.classList.toggle('filtered', !show);
    });
  });
</script>
```

### Phase 7: Content (5 days)

**Showcase Content Strategy:**

1. **Rich Media Content**
```markdown
---
title: Building a Design System
description: How we created a scalable design system
date: 2024-01-15
cover: ./images/design-system-hero.jpg
gallery:
  - ./images/tokens-structure.png
  - ./images/component-library.png
  - ./images/documentation-site.png
---

import Figure from '@/components/mdx/Figure.astro';
import Callout from '@/components/mdx/Callout.astro';
import CodeDemo from '@/components/mdx/CodeDemo.astro';

# Building a Design System

<Callout type="info">
This case study explores our journey creating a design system that scales across multiple products and teams.
</Callout>

## The Challenge

<Figure
  src={frontmatter.gallery[0]}
  alt="Token structure diagram"
  caption="Our token architecture"
/>

<CodeDemo
  title="Token Implementation"
  files={{
    'tokens.css': `
:root {
  --color-primary: #0066cc;
  --space-unit: 0.25rem;
}
    `
  }}
  client:visible
/>
```

2. **Interactive Demos**
```astro
---
// src/components/mdx/CodeDemo.astro
import CodeEditor from '@/components/islands/CodeEditor';

export interface Props {
  title: string;
  files: Record<string, string>;
  height?: number;
}

const { title, files, height = 400 } = Astro.props;
---

<div class="code-demo">
  <h4 class="code-demo-title">{title}</h4>
  <CodeEditor 
    files={files} 
    height={height}
    client:visible
  />
</div>
```

### Phase 8: QA (3 days)

**Showcase Testing Implementation:**

1. **E2E Test Suite**
```typescript
// tests/e2e/critical-paths.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Critical User Paths', () => {
  test('portfolio journey', async ({ page }) => {
    // User lands on homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/Portfolio/);
    
    // Views projects
    await page.click('text=View Projects');
    await expect(page).toHaveURL('/projects');
    
    // Filters by technology
    await page.click('button:has-text("React")');
    await expect(page.locator('.project-card')).toHaveCount(3);
    
    // Opens project detail
    await page.click('.project-card:first-of-type');
    await expect(page.locator('h1')).toContainText('Project Title');
    
    // Navigates to contact
    await page.click('text=Get in touch');
    await expect(page).toHaveURL('/contact');
  });
});
```

2. **Visual Regression Tests**
```typescript
// tests/visual/components.spec.ts
import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Component Visual Tests', () => {
  test('button variations', async ({ page }) => {
    await page.goto('/components/button');
    await percySnapshot(page, 'Button - All Variants');
  });
  
  test('dark mode', async ({ page }) => {
    await page.goto('/');
    await page.click('[aria-label="Toggle theme"]');
    await page.waitForTimeout(300); // Animation
    await percySnapshot(page, 'Homepage - Dark Mode');
  });
});
```

### Phase 9: Performance (2 days)

**Showcase Performance Optimization:**

1. **Advanced Image Pipeline**
```typescript
// scripts/optimize-images.ts
import sharp from 'sharp';
import { globby } from 'globby';
import pLimit from 'p-limit';

const limit = pLimit(4); // Process 4 images concurrently

async function optimizeImages() {
  const images = await globby('src/assets/images/**/*.{jpg,png}');
  
  const tasks = images.map(image => 
    limit(async () => {
      const sharpInstance = sharp(image);
      const metadata = await sharpInstance.metadata();
      
      // Generate formats
      await Promise.all([
        // AVIF
        sharpInstance
          .avif({ quality: 80, effort: 6 })
          .toFile(image.replace(/\.(jpg|png)$/, '.avif')),
        
        // WebP
        sharpInstance
          .webp({ quality: 85 })
          .toFile(image.replace(/\.(jpg|png)$/, '.webp')),
        
        // Responsive sizes
        ...[480, 768, 1200, 1920].map(width =>
          sharpInstance
            .resize(width, null, { withoutEnlargement: true })
            .jpeg({ quality: 85, progressive: true })
            .toFile(image.replace(/\.(jpg|png)$/, `-${width}w.jpg`))
        )
      ]);
      
      console.log(`✅ Optimized ${image}`);
    })
  );
  
  await Promise.all(tasks);
}
```

2. **Performance Monitoring**
```astro
---
// src/components/PerformanceMonitor.astro
---

<script>
  // Core Web Vitals monitoring
  import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';
  
  function sendToAnalytics(metric) {
    // Send to your analytics service
    if (window.gtag) {
      gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        metric_id: metric.id,
        metric_value: metric.value,
        metric_delta: metric.delta,
      });
    }
  }
  
  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onLCP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
  
  // Custom performance marks
  performance.mark('app-interactive');
  
  // Resource timing
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource' && entry.initiatorType === 'img') {
          console.log(`Image ${entry.name} took ${entry.duration}ms to load`);
        }
      }
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }
</script>
```

### Phase 10: Deployment (1 day)

**Showcase Deployment Pipeline:**

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [master]
  pull_request:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Run tests
        run: pnpm test
        
      - name: Build
        run: pnpm build
        env:
          PUBLIC_SITE_URL: ${{ secrets.SITE_URL }}
          
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          projectName: showcase-portfolio
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            ${{ secrets.SITE_URL }}
            ${{ secrets.SITE_URL }}/projects
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### Phase 11: Documentation (2 days)

**Showcase Documentation:**

1. **Component Documentation with Astrobook**
```astro
---
// src/pages/components/button.story.astro
import { Story, Canvas, Meta } from '@astrobook/components';
import Button from '@/components/ui/Button.astro';

export const meta = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};
---

<Meta {...meta} />

# Button Component

Buttons trigger actions throughout the application.

## Variants

<Canvas>
  <Story name="Primary">
    <Button variant="primary">Primary Button</Button>
  </Story>
  
  <Story name="Secondary">
    <Button variant="secondary">Secondary Button</Button>
  </Story>
  
  <Story name="Ghost">
    <Button variant="ghost">Ghost Button</Button>
  </Story>
  
  <Story name="Danger">
    <Button variant="danger">Danger Button</Button>
  </Story>
</Canvas>

## Usage Guidelines

- Use **Primary** for main actions
- Use **Secondary** for alternative actions
- Use **Ghost** for tertiary actions
- Use **Danger** for destructive actions

## Accessibility

- All buttons have focus indicators
- Loading state announces to screen readers
- Disabled state prevents interaction
```

2. **Architecture Documentation**
```markdown
# Architecture Overview

## Technology Stack

### Core
- **Astro {{versions.astro}}**: Static site generator with islands architecture
- **TypeScript**: Type safety throughout
- **Tailwind CSS {{versions.tailwindcss}}**: Utility-first styling with design tokens

### Interactivity
- **View Transitions**: Native page transitions
- **Preact**: Lightweight React alternative for islands
- **Alpine.js**: Declarative DOM manipulation

### Quality
- **Playwright**: E2E testing
- **Vitest**: Unit testing
- **Percy**: Visual regression
- **Lighthouse CI**: Performance monitoring

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
---
// Enhance forms progressively
---

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

## Conclusion

The Showcase track demonstrates your ability to build production-grade applications with modern best practices. It's an investment in quality that pays dividends through easier maintenance, better performance, and a portfolio piece that stands out.

Remember: The goal isn't to use every feature, but to thoughtfully apply advanced patterns where they add value. Show restraint in your technical choices while demonstrating depth in your implementation.