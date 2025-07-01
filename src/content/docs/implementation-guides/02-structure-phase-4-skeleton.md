---
title: 'Phase 4: Skeleton Layout & Routing'
version: 1.0.0
lastUpdated: 2025-06-10T00:00:00.000Z
description: >-
  Covers base layout, routing structure, navigation, and metadata system for
  both tracks.
last_reviewed_on: '2025-07-01'
---
## Overview
- **Track**: Both (MVP & Showcase)
- **Effort**: Moderate, depends on project complexity
- **Dependencies**: Phase 0-3 completed
- **Deliverables**: Base layout, routing structure, navigation, metadata system

## Entry Criteria
- [ ] Design system configured
- [ ] Content architecture defined
- [ ] Tooling and CI functional
- [ ] Initial performance baseline planned

## Implementation Steps

| Step | Task | MVP | Showcase | Notes |
|------|------|-----|----------|-------|
| 4.01 | Create base layout | ✅ | ✅ | HTML structure, metadata |
| 4.02 | Build header component | ✅ | ✅ | Logo, nav, theme toggle |
| 4.03 | Build footer component | ✅ | ✅ | Links, copyright |
| 4.04 | Design mobile navigation | ✅ | ✅ | Responsive pattern |
| 4.05 | Create page routes | ✅ | ✅ | All main pages |
| 4.06 | Set up metadata system | ✅ | ✅ | SEO, OpenGraph |
| 4.07 | Configure font loading | ✅ | ✅ | Preload, swap |
| 4.08 | Add security headers | ✅ | ✅ | CSP, HSTS |
| 4.09 | Set up skip links | ✅ | ✅ | Accessibility |
| 4.10 | Create error pages | ✅ | ✅ | 404, 500 |
| 4.11 | Add analytics setup | ✅ | ✅ | Privacy-first |
| 4.12 | Baseline performance | ✅ | ✅ | Initial metrics |

## Code Examples

### Base Layout Component

```astro
---
// src/layouts/BaseLayout.astro
import { ViewTransitions } from 'astro:transitions';
import Header from '@/components/layout/Header.astro';
import Footer from '@/components/layout/Footer.astro';
import SkipLink from '@/components/a11y/SkipLink.astro';
import ThemeSetup from '@/components/ThemeSetup.astro'; // ADDED: Import for theme setup component
import '@fontsource-variable/inter';
import '@/styles/global.css';

export interface Props {
  title: string;
  description: string;
  image?: string;
  canonicalURL?: URL;
  noindex?: boolean;
}

const {
  title,
  description,
  image = '/og-default.jpg',
  canonicalURL = new URL(Astro.url.pathname, Astro.site),
  noindex = false,
} = Astro.props;

const siteTitle = 'Your Site Name';
const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
---

<!doctype html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="generator" content={Astro.generator} />
    
    <!-- Favicons -->
    <link rel="icon" type="image/svg+xml" href="./favicon.svg" />
    <link rel="icon" type="image/x-icon" href="./favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon.png" />
    
    <!-- Primary Meta Tags -->
    <title>{fullTitle}</title>
    <meta name="title" content={fullTitle} />
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />
    
    {noindex && <meta name="robots" content="noindex, nofollow" />}
    
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={new URL(image, Astro.site)} />
    <meta property="og:site_name" content={siteTitle} />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content={canonicalURL} />
    <meta property="twitter:title" content={fullTitle} />
    <meta property="twitter:description" content={description} />
    <meta property="twitter:image" content={new URL(image, Astro.site)} />
    
    <!-- Font Preloading -->
    <link
      rel="preload"
      href="./_astro/inter-latin-400-normal.woff2"
      as="font"
      type="font/woff2"
      crossorigin="anonymous"
    />
    <link
      rel="preload"
      href="./_astro/inter-latin-700-normal.woff2"
      as="font"
      type="font/woff2"
      crossorigin="anonymous"
    />
    
    {/* Theme Detection & Setup - REPLACED inline script with a component */}
    {/* 
      The theme detection script, previously an inline script, is now encapsulated 
      within the 'ThemeSetup.astro' component. This component's script runs on the client 
      to apply the theme early in the rendering process.
      Astro processes this script, allowing for CSP compliance.

      Example for src/components/ThemeSetup.astro:
      ---
      // No server-side logic needed for this simple script.
      // Astro will extract and bundle the script tag below.
      ---
      <script>
        const theme = (() => {
          if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
            return localStorage.getItem('theme');
          }
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
          }
          return 'light';
        })();
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      </script>
    */}
    <ThemeSetup client:load /> {/* client:load ensures it runs ASAP */}
    
    <ViewTransitions />
  </head>
  <body class="flex min-h-screen flex-col bg-background text-foreground antialiased">
    <SkipLink />
    <Header />
    <main id="main-content" class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

### Header Component

```astro
---
// src/components/layout/Header.astro
import { getCollection } from 'astro:content';
import ThemeToggle from '@/components/ThemeToggle.astro';
import MobileMenu from '@/components/MobileMenu.astro';

const navigation = await getCollection('navigation');
const navItems = navigation[0]?.data.items || [];
---

<header class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div class="container flex h-16 items-center justify-between">
    <a href="./" class="flex items-center space-x-2" aria-label="Home">
      <svg
        class="h-8 w-8 text-primary-600 dark:text-primary-400"
        viewBox="0 0 32 32"
        fill="currentColor"
        aria-hidden="true"
      >
        <!-- Your logo SVG -->
        <rect x="4" y="4" width="24" height="24" rx="4" />
      </svg>
      <span class="font-bold text-xl">Your Name</span>
    </a>
    
    <nav class="hidden md:flex items-center space-x-6" aria-label="Main navigation">
      {navItems.map((item) => (
        <a
          href={item.href}
          class="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground focus-visible-ring"
          aria-current={Astro.url.pathname === item.href ? 'page' : undefined}
        >
          {item.label}
        </a>
      ))}
    </nav>
    
    <div class="flex items-center space-x-4">
      <ThemeToggle />
      <MobileMenu items={navItems} />
    </div>
  </div>
</header>
```

### Mobile Navigation Component

```astro
---
// src/components/MobileMenu.astro
// This Astro component now delegates its interactive parts to a client-side island.
import MobileMenuIsland from '@/components/islands/MobileMenuIsland.tsx'; // Or .jsx, .vue, .svelte

export interface Props {
  items: Array<{
    label: string;
    href: string;
    isExternal?: boolean;
  }>;
}

const { items } = Astro.props;
---
{/* 
  The visual structure and interactive logic for the mobile menu are now handled by 
  the 'MobileMenuIsland' client component. This approach adheres to the 'inline_scripts: 0' 
  budget rule by moving JavaScript into Astro-processed client components.

  The island (e.g., src/components/islands/MobileMenuIsland.tsx) would receive 'items' as props 
  and internally manage its state, event listeners (for button clicks, escape key, etc.), 
  ARIA attributes, and rendering of the menu button and panel.

  The <script> tag and detailed HTML previously described here for direct implementation
  have been removed in favor of this island-based approach for better CSP compliance and componentization.
*/}
<MobileMenuIsland items={items} client:visible /> 
{/* client:visible or client:idle is appropriate for a menu not critical at load time */}
```

### Footer Component

```astro
---
// src/components/layout/Footer.astro
const currentYear = new Date().getFullYear();

const footerLinks = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'RSS', href: '/rss.xml' },
];

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/yourusername', icon: 'github' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/yourusername', icon: 'linkedin' },
  { label: 'Twitter', href: 'https://twitter.com/yourusername', icon: 'twitter' },
];
---

<footer class="border-t border-border bg-background">
  <div class="container py-8">
    <div class="grid gap-8 md:grid-cols-3">
      <!-- About -->
      <div>
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground/60">
          About
        </h2>
        <p class="text-sm text-foreground/60">
          Creating beautiful, performant web experiences with modern technologies.
        </p>
      </div>
      
      <!-- Quick Links -->
      <div>
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground/60">
          Links
        </h2>
        <ul class="space-y-2">
          {footerLinks.map((link) => (
            <li>
              <a
                href={link.href}
                class="text-sm text-foreground/60 hover:text-foreground focus-visible-ring inline-block"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      
      <!-- Social -->
      <div>
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground/60">
          Connect
        </h2>
        <div class="flex space-x-4">
          {socialLinks.map((link) => (
            <a
              href={link.href}
              class="text-foreground/60 hover:text-foreground focus-visible-ring"
              aria-label={link.label}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="sr-only">{link.label}</span>
              <!-- Icon SVGs here -->
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
    
    <div class="mt-8 border-t border-border pt-8 text-center">
      <p class="text-xs text-foreground/60">
        &copy; {currentYear} Your Name. All rights reserved.
      </p>
    </div>
  </div>
</footer>
```

### Page Routes

```astro
---
// src/pages/index.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import Hero from '@/components/home/Hero.astro';
import FeaturedProjects from '@/components/home/FeaturedProjects.astro';
import RecentPosts from '@/components/home/RecentPosts.astro';
---

<BaseLayout
  title="Your Name - Web Developer"
  description="Creating beautiful, performant web experiences with modern technologies."
>
  <Hero />
  <FeaturedProjects />
  <RecentPosts />
</BaseLayout>
```

```astro
---
// src/pages/projects.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

const projects = await getCollection('projects', ({ data }) => !data.draft);
---

<BaseLayout
  title="Projects"
  description="A showcase of my recent work and side projects."
>
  <div class="container py-12">
    <h1 class="mb-8 text-4xl font-bold">Projects</h1>
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <article class="group">
          <a href={`/projects/${project.slug}`} class="block">
            <h2 class="text-xl font-semibold group-hover:text-primary-600">
              {project.data.title}
            </h2>
            <p class="mt-2 text-foreground/60">{project.data.description}</p>
          </a>
        </article>
      ))}
    </div>
  </div>
</BaseLayout>
```

### Security Headers

> **Cloudflare Pages note**: Static deployments of Cloudflare Pages do **not** read Netlify-style `_headers` by default. Configure headers in the **Headers Rules UI** or inject them via `_worker.js`. The example below keeps Netlify syntax for portability, but add equivalent rules in Cloudflare’s dashboard if you deploy there.

```text
# public/_headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'strict-dynamic' https:; style-src 'self' 'nonce-<ASTRO_NONCE>'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://vitals.vercel-insights.com; frame-ancestors 'none';

/
  Link: </_astro/inter-latin-400-normal.woff2>; rel=preload; as=font; type=font/woff2; crossorigin=anonymous
  Link: </_astro/inter-latin-700-normal.woff2>; rel=preload; as=font; type=font/woff2; crossorigin=anonymous
```

### Skip Link Component

```astro
---
// src/components/a11y/SkipLink.astro
---

<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<style>
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--color-primary-600);
    color: white;
    padding: 8px 16px;
    text-decoration: none;
    border-radius: 0 0 4px 0;
    z-index: 100;
    transition: top 0.2s;
  }
  
  .skip-link:focus {
    top: 0;
  }
</style>
```

### 404 Page

```astro
---
// src/pages/404.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
---

<BaseLayout
  title="404 - Page Not Found"
  description="The page you're looking for doesn't exist."
  noindex={true}
>
  <div class="container flex min-h-[60vh] flex-col items-center justify-center text-center">
    <h1 class="mb-4 text-6xl font-bold">404</h1>
    <p class="mb-8 text-xl text-foreground/60">
      Oops! The page you're looking for doesn't exist.
    </p>
    <a
      href="./"
      class="rounded-lg bg-primary-600 px-6 py-3 text-white hover:bg-primary-700 focus-visible-ring"
    >
      Go Home
    </a>
  </div>
</BaseLayout>
```

### Analytics Setup

```astro
---
// src/components/Analytics.astro
const { analyticsId } = import.meta.env;
---

{analyticsId && (
  <!-- Plausible Analytics -->
  <script
    defer
    data-domain="yourdomain.com"
    src="https://plausible.io/js/script.js"
  ></script>
  
  <!-- OR Cloudflare Web Analytics -->
  <script
    defer
    src="https://static.cloudflareinsights.com/beacon.min.js"
    data-cf-beacon={`{"token": "${analyticsId}"}`}
  ></script>
)}
```

### Performance Baseline Script

```typescript
// scripts/baseline-performance.ts
import { exec } from 'child_process';
import { writeFileSync } from 'fs';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function measureBaseline() {
  console.log('📊 Measuring performance baseline...');
  
  // Build the site first
  await execAsync('pnpm run build');
  
  // Start preview server
  const preview = exec('pnpm run preview');
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Run Lighthouse
  const { stdout } = await execAsync(
    'npx lighthouse http://localhost:4321 --output=json --output-path=./perf-baseline/baseline.json --only-categories=performance,accessibility,best-practices,seo'
  );
  
  // Parse results
  const results = JSON.parse(stdout);
  const scores = {
    performance: results.categories.performance.score * 100,
    accessibility: results.categories.accessibility.score * 100,
    bestPractices: results.categories['best-practices'].score * 100,
    seo: results.categories.seo.score * 100,
  };
  
  // Save baseline
  writeFileSync(
    './perf-baseline/scores.json',
    JSON.stringify(scores, null, 2)
  );
  
  console.log('✅ Baseline saved:', scores);
  
  // Cleanup
  preview.kill();
}

measureBaseline().catch(console.error);
```

## Common Pitfalls

1. **Missing Font Attributes**: Forgetting crossorigin on preload
   - **Solution**: Always include all required attributes

2. **Blocking Resources**: Scripts/styles blocking render
   - **Solution**: Use defer/async, critical CSS inline

3. **Poor Mobile UX**: Desktop-first navigation
   - **Solution**: Design mobile-first, test on devices

4. **Missing Meta Tags**: Incomplete SEO/social setup
   - **Solution**: Use layout component for consistency

## Exit Criteria

- [ ] Base layout component complete
- [ ] Header with navigation functional
- [ ] Footer with links and social
- [ ] Mobile navigation working smoothly
- [ ] All main routes created
- [ ] Metadata system implemented
- [ ] Fonts loading optimally
- [ ] Security headers configured
- [ ] Skip links for accessibility
- [ ] Error pages created
- [ ] Analytics ready (privacy-first)
- [ ] Performance baseline recorded

## Rollback Strategy

If skeleton needs major changes:

1. **Layout Issues**:
   - Keep old layout as BaseLayoutV1
   - Migrate pages gradually
   - Test each migration

2. **Route Changes**:
   - Set up redirects in config
   - Update sitemap
   - Check internal links

3. **Performance Regression**:
   - Compare with baseline
   - Check resource loading
   - Review recent changes

## AI Assistant Notes

### Key Files to Reference
- `src/layouts/BaseLayout.astro` - Main layout
- `src/components/layout/*` - Header/Footer
- `public/_headers` - Security headers
- `perf-baseline/scores.json` - Performance targets

### Common Prompts for This Phase
- "Create Astro layout with SEO metadata"
- "Build accessible mobile navigation"
- "Set up security headers for Astro"
- "Configure font preloading strategy"

### Context Requirements
- Site structure and pages
- Brand/logo assets
- Navigation hierarchy
- Performance targets
