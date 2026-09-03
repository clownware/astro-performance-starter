---
title: Phase 4 - Code Examples
description: >-
  Code examples for Phase 4
lastUpdated: true
tableOfContents: true
pagefind: true
---

## Code Examples

Companion to [Phase 4 - Skeleton Layout & Routing](/implementation-guides/completed/phase-4-skeleton/). Blocks marked *condensed* or *trimmed* are cut-down copies of the starter's real files; blocks marked *illustrative* are examples for your own project.

### Base Layout Component

The layout itself is deliberately thin: all head metadata (title, description, canonical, Open Graph, Twitter, favicons, JSON-LD, and fonts) is delegated to the `Head` molecule at `src/components/molecules/Head.astro`, which renders `<Font cssVariable="--font-geist" preload />` and `<Font cssVariable="--font-inter" preload />` via the Astro Fonts API ([ADR-053](/adr/053-fonts-via-astro-fonts-api/)). Font preloads are capped at 2 files per page by CI ([ADR-058](/adr/058-font-preload-budget/)).

```astro
---
// src/layouts/BaseLayout.astro
import { ClientRouter } from "astro:transitions";
import SkipLink from "@/components/a11y/SkipLink.astro";
import Head from "@/components/molecules/Head.astro";
import Footer from "@/components/structural/Footer.astro";
import Header from "@/components/structural/Header.astro";
import ThemeSetup from "@/components/ThemeSetup.astro";

import "@/styles/global.css";

export interface Props {
  /**
   * Page title. Will be combined with site title unless it already includes it.
   */
  title: string;
  /**
   * Page description for meta tags and social sharing.
   */
  description: string;
  /**
   * Open Graph image for social media previews.
   * Can be a relative path (e.g., "/og-default.png") or absolute URL.
   * Relative paths are automatically converted to absolute URLs using Astro.site.
   * @default "/og-default.png"
   */
  image?: string;
  /**
   * Canonical URL for this page. Defaults to current page URL.
   */
  canonicalUrl?: URL;
  /**
   * If true, adds noindex/nofollow meta tags to prevent search engine indexing.
   * @default false
   */
  noindex?: boolean;
  /**
   * Open Graph type. Use "article" for blog posts, "website" for other pages.
   * @default "website"
   */
  ogType?: "website" | "article";
  /**
   * Additional Open Graph metadata for articles (blog posts).
   * Only used when ogType is "article".
   */
  ogArticle?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
  };
  /**
   * External domains to preconnect for performance optimization.
   * @default []
   */
  preconnectDomains?: string[];
}
---

<!doctype html>
<html lang="en">
  <head>
    <Head {...Astro.props} />
    <ThemeSetup />
    <ClientRouter />
  </head>
  <body class="flex min-h-screen flex-col bg-background text-foreground antialiased">
    <SkipLink />
    <Header />
    <main
      id="main-content"
      class="flex-1"
      aria-label="Main content"
      role="main"
      tabindex="-1"
    >
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

> **Note**: `ThemeSetup` is a plain Astro component whose `<script is:inline>` applies the saved theme before first paint (dark-first, [ADR-032](/adr/032-dark-mode-strategy/)). Don't give it a `client:*` hydration directive — Astro components don't render on the client, so Astro ignores the directive and logs a console warning. The slot strategy is recorded in [ADR-013](/adr/013-baselayout-slot-strategy/).

Full files: [`src/layouts/BaseLayout.astro`](https://github.com/clownware/astro-performance-starter/blob/master/src/layouts/BaseLayout.astro) and [`src/components/molecules/Head.astro`](https://github.com/clownware/astro-performance-starter/blob/master/src/components/molecules/Head.astro).

### Header Component

The header lives at `src/components/structural/Header.astro` (the component tree is `a11y/atoms/molecules/structural/islands/mdx` — there is no `components/layout/` directory), and `ThemeToggle` is an atom. Trimmed to the essentials — the real file also renders a GitHub icon link for the navigation entry whose `icon` is `github-logo`:

```astro
---
// src/components/structural/Header.astro (trimmed — see the starter for the full file)
import { getCollection } from 'astro:content';
import ThemeToggle from '@/components/atoms/ThemeToggle.astro';
import type { NavItem } from '@/types/navigation';
import { withBase } from '@/utils/url-utils';

const navigation = await getCollection('navigation');
const navItems: NavItem[] = navigation[0]?.data.items || [];
const textNavItems = navItems.filter((item: NavItem) => !item.isExternal);

const normalizePath = (p: string) => (p.endsWith('/') ? p : `${p}/`);
const currentPath = normalizePath(Astro.url.pathname);
---

<header transition:persist class="sticky top-0 z-50 w-full">
  <div class="border-b border-border bg-background/95 supports-backdrop-filter:backdrop-blur-sm supports-backdrop-filter:bg-background/60">
    <div class="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
      <a href={withBase('/')} class="flex items-center" aria-label="Homepage">
        <img
          src={withBase('/logo.svg')}
          alt="Astro Performance Starter"
          class="h-8 w-auto"
          width="220"
          height="60"
          fetchpriority="high"
          transition:name="site-logo"
        />
      </a>

      <nav class="hidden lg:flex items-center gap-8" aria-label="Main navigation">
        {textNavItems.map((item: NavItem) => {
          const resolvedHref = withBase(item.href);
          return (
            <a
              href={resolvedHref}
              class="no-underline text-base font-medium text-muted-foreground transition-all hover:text-foreground hover:scale-105 focus-visible-ring px-3 py-2 rounded-md hover:bg-surface"
              aria-current={normalizePath(resolvedHref) === currentPath ? 'page' : undefined}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      <div class="flex items-center gap-2">
        <ThemeToggle />
        {/* CSS-only mobile menu toggle: label + hidden checkbox — see Mobile Navigation below */}
        <label
          for="mobile-menu-toggle"
          tabindex="0"
          role="button"
          aria-label="Toggle menu"
          aria-controls="mobile-menu"
          aria-expanded="false"
          data-mobile-menu-button
          class="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border lg:hidden"
        >
          <!-- hamburger icon SVG -->
        </label>
      </div>
    </div>
  </div>

  <!-- The #mobile-menu-toggle checkbox, the aria-expanded sync script, and the
       #mobile-menu <nav> all live in this same file. -->
</header>
```

Full file: [`src/components/structural/Header.astro`](https://github.com/clownware/astro-performance-starter/blob/master/src/components/structural/Header.astro).

### Mobile Navigation

There is no separate `MobileMenu.astro` component and no Preact island for the menu — `src/components/islands/` contains only the demo islands (`MotionLab.tsx`, `SignalsCounter.tsx`; [ADR-060](/adr/060-showcase-interactive-demo-islands/)). The mobile menu is a CSS-only pattern inside `src/components/structural/Header.astro`, in line with the zero-JS-by-default island policy ([ADR-001](/adr/001-preact-island-usage-policy/)):

- A hidden checkbox (`#mobile-menu-toggle`, `class="peer sr-only"`) holds the open/closed state.
- The hamburger `<label for="mobile-menu-toggle">` toggles it, and the full-screen `#mobile-menu` nav is revealed via Tailwind `peer-checked:` classes — no JavaScript needed for the core behavior.
- A small progressive-enhancement `<script>` keeps `aria-expanded` in sync with the checkbox, adds Enter/Space activation for the label, closes the menu on Escape and on link click, and re-syncs after ClientRouter view transitions (`astro:after-swap`).

```astro
<!-- Inside src/components/structural/Header.astro -->
<input
  id="mobile-menu-toggle"
  type="checkbox"
  class="peer sr-only"
  aria-controls="mobile-menu"
  aria-label="Toggle main menu"
/>

<nav
  id="mobile-menu"
  class="fixed inset-0 top-16 z-40 hidden flex-col gap-6 bg-surface border-t border-border shadow-xl p-6 opacity-0 pointer-events-none lg:hidden motion-safe:transition-opacity motion-reduce:transition-none duration-200 peer-checked:flex peer-checked:opacity-100 peer-checked:pointer-events-auto"
  aria-label="Mobile navigation"
  aria-live="polite"
>
  {textNavItems.map((item: NavItem) => (
    <a href={withBase(item.href)} class="no-underline text-lg font-medium text-foreground focus-visible-ring">
      {item.label}
    </a>
  ))}
</nav>
```

### Footer Component

The footer reads its external URLs from `src/config.ts` (`siteLinks.github`, `siteLinks.docs`, `socialLinks.*`) — update those values when you clone; empty strings hide the corresponding link so sections auto-collapse. Internal links go through `withBase()`, and the `Container` structural component provides the width constraint:

```astro
---
// src/components/structural/Footer.astro (condensed — see the starter for the full file)
import Container from "@/components/structural/Container.astro";
import { siteLinks, socialLinks } from "@/config";
import { withBase } from "@/utils/url-utils";

const currentYear = new Date().getFullYear();

const footerLinks = [
  { label: "Home", href: withBase("/") },
  { label: "Blog", href: withBase("/blog/") },
  { label: "Projects", href: withBase("/projects/") },
  { label: "About", href: withBase("/about/") },
  { label: "Contact", href: withBase("/contact/") },
];

// Docs links only render when siteLinks.docs is configured
const docsLinks = siteLinks.docs
  ? [
      { label: "Getting Started", href: `${siteLinks.docs}/getting-started/` },
      { label: "Implementation Guides", href: `${siteLinks.docs}/implementation-guides/` },
      { label: "Architecture Decisions", href: `${siteLinks.docs}/adr/` },
    ]
  : [];

// Project repo first, then social profiles; empty values are filtered out
const externalLinks = [
  ...(siteLinks.github ? [{ label: "GitHub", href: siteLinks.github }] : []),
  ...(socialLinks.linkedin ? [{ label: "LinkedIn", href: socialLinks.linkedin }] : []),
  ...(socialLinks.twitter ? [{ label: "Twitter", href: socialLinks.twitter }] : []),
];
---

<footer class="bg-background-default">
  <Container class="py-16 sm:py-20 lg:py-24">
    <div class="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-4 lg:gap-12">
      <!-- Brand: raw <img> for the public/ SVG logo (ADR-030 exemption) + tagline -->

      <div class="lg:col-span-1">
        <h2 class="text-sm font-semibold text-foreground mb-6 uppercase tracking-wide">Navigation</h2>
        <ul class="space-y-4">
          {footerLinks.map((link) => (
            <li>
              <a href={link.href} class="no-underline text-sm text-muted-foreground hover:text-link">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {docsLinks.length > 0 && (
        <div class="lg:col-span-1">
          <h2 class="text-sm font-semibold text-foreground mb-6 uppercase tracking-wide">Docs</h2>
          <!-- external links: target="_blank" rel="noopener noreferrer" -->
        </div>
      )}

      {externalLinks.length > 0 && (
        <div class="lg:col-span-1">
          <h2 class="text-sm font-semibold text-foreground mb-6 uppercase tracking-wide">Connect</h2>
          <ul class="space-y-4">
            {externalLinks.map((link) => (
              <li>
                <a href={link.href} target="_blank" rel="noopener noreferrer" class="no-underline text-sm text-muted-foreground hover:text-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

    <div class="border-t border-border mt-16 pt-8">
      <p class="text-sm text-muted-foreground">
        &copy; {currentYear} <!-- your name / organisation -->. MIT Licensed starter template.
      </p>
      <!-- status badges; the "95+ Lighthouse" badge links to siteLinks.pagespeed when set -->
    </div>
  </Container>
</footer>
```

Full file: [`src/components/structural/Footer.astro`](https://github.com/clownware/astro-performance-starter/blob/master/src/components/structural/Footer.astro).

### Base Layout Usage

Illustrative — the starter's real `src/pages/projects/index.astro` renders `ProjectCard` molecules with `ScrollReveal` and resolves `cardImage`/`cover` for the image pipeline, but the shape is the same: filter drafts at query time, build hrefs with `withBase()`, and key routes by entry `id`.

```astro
---
// Illustrative — e.g. src/pages/projects/index.astro (directory route)
import BaseLayout from '@/layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';
import { withBase } from '@/utils/url-utils';

const projects = await getCollection('projects', ({ data }) => !data.draft);
---

<BaseLayout
  title="Projects"
  description="A selection of my recent work and side projects."
>
  <div class="container py-12">
    <h1 class="mb-8 text-4xl font-bold">Projects</h1>
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <article class="group">
          <a href={withBase(`/projects/${project.id}/`)} class="block">
            <h2 class="text-xl font-semibold group-hover:text-primary-600">
              {project.data.title}
            </h2>
            <p class="mt-2 text-muted-foreground">{project.data.description}</p>
          </a>
        </article>
      ))}
    </div>
  </div>
</BaseLayout>
```

### Security Headers

> **Delivery note**: `public/_headers` is honoured by header-capable hosts — Cloudflare Pages and Netlify read the Netlify-style file natively — and is a **no-op on GitHub Pages**, which cannot serve custom headers ([ADR-051](/adr/051-content-security-policy-strategy/)). Cloners deploying to a header-capable host get the CSP automatically.
>
> **CSP note**: A `nonce-` based CSP cannot work on a static host — nonces must be unique per response, and static files are served unchanged. The starter ships a header-based CSP with `'unsafe-inline'` for script and style as a deliberate, documented trade-off (ADR-051): Astro's built-in `security.csp` (hash-only) was evaluated and **rejected** because it is incompatible with ClientRouter + Shiki + the starter's island scripts.

```text
# public/_headers
/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=()
  # 'unsafe-inline' is a deliberate, documented choice — see ADR-051. Astro 6's
  # built-in CSP is hash-only and incompatible with ClientRouter + Shiki, so this
  # header-based CSP (required for island scripts + Tailwind utility styles) stays.
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
  Cache-Control: public, max-age=0, must-revalidate

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```

Font preloading is handled by the Astro Fonts API's `<Font preload />` component in `Head.astro` (the hashed `/_astro/*.woff2` URLs are generated at build time, so hardcoded `Link:` preload headers would break on every build). Keep font preloads to a maximum of 2 files — `pnpm run fonts:gate` enforces this cap in CI ([ADR-058](/adr/058-font-preload-budget/)).

### Skip Link Component

The skip link uses the `sr-only` / `focus:not-sr-only` utilities rather than a scoped style block, takes a `targetId` prop, and validates its target (re-validating after ClientRouter view transitions):

```astro
---
// src/components/a11y/SkipLink.astro
// An accessible skip link component that becomes visible on focus.
// It uses the sr-only class from Tailwind CSS for the base styles.
interface Props {
  /** The id of the element to skip to (without the #). Defaults to 'main-content'. */
  targetId?: string;
  /** Optional extra classes to merge */
  class?: string;
}
const { targetId = "main-content", class: className = "" } = Astro.props as Props;
---

<a
  href={`#${targetId}`}
  aria-controls={targetId}
  data-skiplink
  class={`sr-only fixed left-4 top-4 z-[999] rounded-md bg-background px-[1rem] py-[0.5rem] text-foreground motion-safe:transition-colors motion-reduce:transition-none focus:not-sr-only focus:outline-hidden focus:ring-2 focus:ring-primary-500 hover:bg-surface ${className}`}
>
  <slot>Skip to content</slot>
</a>

<script is:inline>
  // Minimal progressive enhancement: validate target from the link's href.
  // Deferred to after DOM is ready because SkipLink renders before <main>.
  (() => {
    function validate() {
      try {
        const skip = document.querySelector('[data-skiplink]');
        if (!(skip instanceof HTMLAnchorElement)) return;
        const hash = skip.getAttribute('href') || '';
        const id = hash.startsWith('#') ? hash.slice(1) : '';
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) {
          console.warn(`SkipLink target element with id "${id}" not found.`);
          skip.setAttribute('aria-disabled', 'true');
          skip.setAttribute('tabindex', '-1');
          skip.href = '#';
        }
      } catch {
        // no-op: ensure skip link doesn't break rendering
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', validate);
    } else {
      validate();
    }

    // Re-validate after Astro ClientRouter view transitions
    document.addEventListener('astro:page-load', validate);
  })();
</script>
```

### 404 Page

```astro
---
// src/pages/404.astro
import BaseLayout from "@/layouts/BaseLayout.astro";
import { withBase } from "@/utils/url-utils";
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
      href={withBase("/")}
      class="rounded-lg bg-primary-600 px-6 py-3 text-primary-foreground hover:bg-primary-700 focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      Go Home
    </a>
  </div>
</BaseLayout>
```

A matching `src/pages/500.astro` covers server errors ([ADR-011](/adr/011-dynamic-route-error-handling/)).

### Performance Baseline Script

The baseline script does not build the site or start a server — it points the Lighthouse CLI at an already-running URL (default `http://localhost:4321`; run `pnpm run build && pnpm run preview` first, or pass `--url=`) and writes `performance-baseline.json` in the repo root (override with `--out=`; `--device=desktop|mobile` selects the Lighthouse preset). Run it with `pnpm run perf:baseline`.

```typescript
// scripts/src/baseline-performance.ts (run via `pnpm run perf:baseline`)
#!/usr/bin/env node
import { spawn } from "node:child_process";
/**
 * baseline-performance.ts
 *
 * Measures Lighthouse scores for a given URL and stores a JSON baseline that can
 * be used by CI to fail builds when future regressions occur.
 *
 * Usage:
 *   pnpm tsx scripts/src/baseline-performance.ts --url=http://localhost:4321/
 *
 * The output file defaults to performance-baseline.json in the repo root.
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const defaultUrl = "http://localhost:4321";

interface Args {
  url: string;
  out: string;
  device: "desktop" | "mobile";
}

function parseArgs(): Args {
  const urlArg = process.argv.find((a) => a.startsWith("--url="));
  const outArg = process.argv.find((a) => a.startsWith("--out="));
  const deviceArg = process.argv.find((a) => a.startsWith("--device="));
  return {
    url: urlArg ? urlArg.split("=")[1] : defaultUrl,
    out: outArg ? outArg.split("=")[1] : "performance-baseline.json",
    device: (deviceArg ? deviceArg.split("=")[1] : "desktop") as "desktop" | "mobile",
  };
}

async function run() {
  const { url, out, device } = parseArgs();
  console.log(`Running Lighthouse for ${url} (${device})…`);

  // Use lighthouse CLI via child_process to avoid heavy API import and keep ts-node startup fast
  const flags = [
    url,
    "--output=json",
    "--output-path=stdout",
    `--preset=${device}`,
    "--quiet",
    "--chrome-flags=--headless=new",
  ];

  const lh = spawn("lighthouse", flags, { stdio: ["ignore", "pipe", "inherit"] });

  let json = "";
  lh.stdout.on("data", (chunk) => {
    json += chunk.toString();
  });

  lh.on("close", (code) => {
    if (code !== 0) {
      console.error("Lighthouse run failed.");
      process.exit(code ?? 1);
    }
    try {
      const report = JSON.parse(json);
      const { categories } = report;
      const scores = Object.fromEntries(
        Object.entries(categories).map(([k, v]: [string, any]) => [k, v.score]),
      );
      const baseline = {
        generatedAt: new Date().toISOString(),
        url,
        device,
        scores,
      };
      const outPath = resolve(out);
      writeFileSync(outPath, JSON.stringify(baseline, null, 2));
      console.log(`Baseline written to ${outPath}`);
    } catch (err) {
      console.error("Failed to parse Lighthouse JSON output", err);
      process.exit(1);
    }
  });
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

Full file: [`scripts/src/baseline-performance.ts`](https://github.com/clownware/astro-performance-starter/blob/master/scripts/src/baseline-performance.ts). CI does not consume this baseline; the enforced floors live in `lighthouserc.json` / `lighthouserc.mobile.json` and run in `lighthouse.yml`.
