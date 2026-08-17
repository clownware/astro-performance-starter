---
title: Phase 4 - Code Examples  
lastUpdated: true
description: >-
  Code examples for Phase 4
tableOfContents: true
pagefind: true
---

## Code Examples

### Base Layout Component

```astro
---
// src/layouts/BaseLayout.astro
import { ClientRouter } from 'astro:transitions';
import { Font } from 'astro:assets';
import Header from '@/components/structural/Header.astro';
import Footer from '@/components/structural/Footer.astro';
import SkipLink from '@/components/a11y/SkipLink.astro';
import ThemeSetup from '@/components/ThemeSetup.astro'; // ADDED: Import for theme setup component
import '@/styles/global.css';
// Fonts use the Astro Fonts API (<Font> below), not a CSS import — see ADR-053.

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
    
    <!-- Fonts (Astro Fonts API, ADR-053): emits @font-face + preload automatically -->
    <Font cssVariable="--font-geist" preload />
    <Font cssVariable="--font-inter" preload />
    
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
    <ThemeSetup /> {/* Astro component with an early inline <script>; runs before paint, no hydration directive needed (client:load is forbidden — ADR-001) */}
    
    <ClientRouter />
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
// src/components/structural/Header.astro
import { getCollection } from 'astro:content';
import ThemeToggle from '@/components/ThemeToggle.astro';
import MobileMenu from '@/components/MobileMenu.astro';

const navigation = await getCollection('navigation');
const navItems = navigation[0]?.data.items || [];
---
<header class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
  <div class="container flex h-16 items-center justify-between">
    <a href="./" class="flex items-center space-x-2" aria-label="Home">
      <svg
        class="h-8 w-8 text-primary-600"
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
// src/components/structural/Footer.astro
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

### Base Layout

```bash
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

# Font preloading is handled by the Astro Fonts API (<Font preload /> in Head.astro,
# ADR-053), which emits the correct hashed-filename preload links — no manual _headers
# entries needed.
// src/components/a11y/SkipLink.astro
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
// src/pages/404.astro
import BaseLayout from '@/layouts/BaseLayout.astro';

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
      class="rounded-lg bg-primary-600 px-6 py-3 text-primary-foreground hover:bg-primary-700 focus-visible-ring"
    >
      Go Home
    </a>
  </div>
</BaseLayout>
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
