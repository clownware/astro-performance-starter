---
title: 'Phase 9: Performance & SEO'
version: 1.0.0
lastUpdated: 2025-06-10T00:00:00.000Z
description: >-
  Covers site optimization, performance reports, SEO implementation, and
  monitoring setup for both tracks.
---

# Phase 9: Performance & SEO

## Overview
- **Track**: Both (MVP & Showcase)
- **Duration**: 1-2 days
- **Dependencies**: Phase 0-8 completed
- **Deliverables**: Optimized site, performance reports, SEO implementation, monitoring setup

## Entry Criteria
- [ ] QA testing complete
- [ ] All bugs fixed
- [ ] Content finalized
- [ ] Images already optimized (Phase 7)

## Implementation Steps

| Step | Task | MVP | Showcase | Notes |
|------|------|-----|----------|-------|
| 9.01 | Audit current performance | ✅ | ✅ | Baseline metrics |
| 9.02 | Optimize critical path | ✅ | ✅ | CSS, fonts, scripts |
| 9.03 | Implement caching strategy | ✅ | ✅ | Headers, service worker |
| 9.04 | Minify and compress | ✅ | ✅ | HTML, CSS, JS |
| 9.05 | Set up CDN | ✅ | ✅ | Static assets |
| 9.06 | Optimize web fonts | ✅ | ✅ | Subset, preload |
| 9.07 | Technical SEO audit | ✅ | ✅ | Crawlability, indexing |
| 9.08 | Schema markup | ✅ | ✅ | Structured data |
| 9.09 | Generate sitemap | ✅ | ✅ | XML sitemap |
| 9.10 | Submit to search engines | ✅ | ✅ | Google, Bing |
| 9.11 | Performance monitoring | ❌ | ✅ | RUM setup |
| 9.12 | Create performance budget CI | ❌ | ✅ | Automated checks |

## Performance Optimization

### 1. Performance Audit Script

```typescript
// scripts/performance-audit.ts
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { writeFileSync } from 'fs';
import { format } from 'date-fns';

interface AuditConfig {
  url: string;
  runs: number;
  device: 'mobile' | 'desktop';
}

async function runAudit({ url, runs, device }: AuditConfig) {
  const results = [];
  
  for (let i = 0; i < runs; i++) {
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    
    const options = {
      logLevel: 'error',
      output: 'json',
      port: chrome.port,
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor: device,
      throttling: {
        rttMs: device === 'mobile' ? 150 : 40,
        throughputKbps: device === 'mobile' ? 1638.4 : 10240,
        cpuSlowdownMultiplier: device === 'mobile' ? 4 : 1,
      },
    };
    
    const runnerResult = await lighthouse(url, options);
    const report = JSON.parse(runnerResult.report);
    
    results.push({
      performance: report.categories.performance.score * 100,
      accessibility: report.categories.accessibility.score * 100,
      bestPractices: report.categories['best-practices'].score * 100,
      seo: report.categories.seo.score * 100,
      metrics: {
        FCP: report.audits['first-contentful-paint'].numericValue,
        LCP: report.audits['largest-contentful-paint'].numericValue,
        TTI: report.audits['interactive'].numericValue,
        TBT: report.audits['total-blocking-time'].numericValue,
        CLS: report.audits['cumulative-layout-shift'].numericValue,
        SI: report.audits['speed-index'].numericValue,
      },
    });
    
    await chrome.kill();
  }
  
  // Calculate averages
  const avgScores = {
    performance: average(results.map(r => r.performance)),
    accessibility: average(results.map(r => r.accessibility)),
    bestPractices: average(results.map(r => r.bestPractices)),
    seo: average(results.map(r => r.seo)),
    metrics: {
      FCP: average(results.map(r => r.metrics.FCP)),
      LCP: average(results.map(r => r.metrics.LCP)),
      TTI: average(results.map(r => r.metrics.TTI)),
      TBT: average(results.map(r => r.metrics.TBT)),
      CLS: average(results.map(r => r.metrics.CLS)),
      SI: average(results.map(r => r.metrics.SI)),
    },
  };
  
  return { results, averages: avgScores };
}

function average(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

// Run audits
async function performFullAudit() {
  const pages = [
    { url: 'https://localhost:3000/', name: 'home' },
    { url: 'https://localhost:3000/projects', name: 'projects' },
    { url: 'https://localhost:3000/blog', name: 'blog' },
  ];
  
  const timestamp = format(new Date(), 'yyyy-MM-dd-HHmm');
  const report: any = {
    timestamp,
    pages: {},
  };
  
  for (const page of pages) {
    console.log(`Auditing ${page.name}...`);
    
    // Mobile audit
    const mobileResults = await runAudit({
      url: page.url,
      runs: 3,
      device: 'mobile',
    });
    
    // Desktop audit
    const desktopResults = await runAudit({
      url: page.url,
      runs: 3,
      device: 'desktop',
    });
    
    report.pages[page.name] = {
      mobile: mobileResults.averages,
      desktop: desktopResults.averages,
    };
  }
  
  // Save report
  writeFileSync(
    `performance-reports/audit-${timestamp}.json`,
    JSON.stringify(report, null, 2)
  );
  
  // Check against budgets
  const budgets = {
    performance: 95,
    accessibility: 98,
    bestPractices: 95,
    seo: 95,
    metrics: {
      LCP: 2500,
      FID: 100,
      CLS: 0.1,
    },
  };
  
  let budgetsPassed = true;
  
  for (const [pageName, pageData] of Object.entries(report.pages)) {
    const mobileScores = (pageData as any).mobile;
    
    if (mobileScores.performance < budgets.performance) {
      console.error(`❌ ${pageName}: Performance score ${mobileScores.performance} below budget ${budgets.performance}`);
      budgetsPassed = false;
    }
    
    if (mobileScores.metrics.LCP > budgets.metrics.LCP) {
      console.error(`❌ ${pageName}: LCP ${mobileScores.metrics.LCP}ms exceeds budget ${budgets.metrics.LCP}ms`);
      budgetsPassed = false;
    }
  }
  
  if (!budgetsPassed) {
    process.exit(1);
  }
  
  console.log('✅ All performance budgets passed!');
}

performFullAudit().catch(console.error);
```

### 2. Critical CSS Extraction

```typescript
// scripts/extract-critical-css.ts
import { readFileSync, writeFileSync } from 'fs';
import { PurgeCSS } from 'purgecss';
import critical from 'critical';

async function extractCriticalCSS() {
  const pages = [
    { url: 'http://localhost:3000/', output: 'home-critical.css' },
    { url: 'http://localhost:3000/projects', output: 'projects-critical.css' },
    { url: 'http://localhost:3000/blog', output: 'blog-critical.css' },
  ];
  
  for (const page of pages) {
    // Extract critical CSS
    const { css } = await critical.generate({
      src: page.url,
      width: 1300,
      height: 900,
      penthouse: {
        blockJSRequests: true,
      },
    });
    
    // Further purge unused styles
    const purged = await new PurgeCSS().purge({
      content: [
        {
          raw: readFileSync(`dist${page.url.replace('http://localhost:3000', '')}/index.html`, 'utf8'),
          extension: 'html',
        },
      ],
      css: [{ raw: css }],
      safelist: {
        standard: [/^dark/, /^hover:/, /^focus:/],
        deep: [/^astro-/],
      },
    });
    
    // Minify and save
    const minified = purged[0].css
      .replace(/\s+/g, ' ')
      .replace(/:\s+/g, ':')
      .replace(/;\s+/g, ';')
      .trim();
    
    writeFileSync(`dist/critical/${page.output}`, minified);
    console.log(`✅ Extracted critical CSS for ${page.url}`);
  }
}
```

### 3. Resource Optimization

```typescript
// astro.config.mjs - Performance optimizations
import { defineConfig } from 'astro/config';
import compress from 'astro-compress';
import critters from 'astro-critters';
import purgecss from 'astro-purgecss';

export default defineConfig({
  build: {
    // Inline small assets
    inlineStylesheets: 'auto',
    
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'utils': ['lodash', 'date-fns'],
        },
      },
    },
  },
  
  integrations: [
    // Inline critical CSS
    critters({
      preload: 'swap',
      noscriptFallback: true,
    }),
    
    // Remove unused CSS
    purgecss({
      safelist: {
        standard: [/^astro-/, /^dark/, /data-theme$/],
        deep: [/^hljs/],
      },
    }),
    
    // Compress HTML/CSS/JS
    compress({
      css: true,
      html: {
        removeAttributeQuotes: false,
      },
      img: false, // Already optimized in Phase 7
      js: true,
      svg: true,
    }),
  ],
  
  // Prefetch configuration
  prefetch: {
    defaultStrategy: 'viewport',
    prefetchAll: false,
  },
});
```

### 4. Font Optimization

```typescript
// scripts/optimize-fonts.ts
import { readFileSync, writeFileSync } from 'fs';
import fontkit from 'fontkit';
import wawoff2 from 'wawoff2';

async function subsetFont(inputPath: string, outputPath: string, unicodeRange: string) {
  const font = fontkit.openSync(inputPath);
  
  // Parse unicode range
  const ranges = unicodeRange.split(',').map(range => {
    const [start, end] = range.trim().split('-').map(hex => parseInt(hex, 16));
    return { start, end: end || start };
  });
  
  // Get all codepoints
  const codepoints = new Set<number>();
  ranges.forEach(({ start, end }) => {
    for (let i = start; i <= end; i++) {
      codepoints.add(i);
    }
  });
  
  // Create subset
  const subset = font.createSubset();
  for (const codepoint of codepoints) {
    const glyph = font.glyphForCodePoint(codepoint);
    if (glyph) {
      subset.includeGlyph(glyph);
    }
  }
  
  // Convert to WOFF2
  const ttfBuffer = subset.encode();
  const woff2Buffer = await wawoff2.compress(ttfBuffer);
  
  writeFileSync(outputPath, woff2Buffer);
  console.log(`✅ Created font subset: ${outputPath}`);
}

// Subset fonts for different language ranges
async function optimizeFonts() {
  const subsets = [
    {
      name: 'latin',
      range: '0000-00FF,0131,0152-0153,02BB-02BC,02C6,02DA,02DC,2000-206F,2074,20AC,2122,2191,2193,2212,2215,FEFF,FFFD',
    },
    {
      name: 'latin-ext',
      range: '0100-024F,0259,1E00-1EFF,2020,20A0-20AB,20AD-20CF,2113,2C60-2C7F,A720-A7FF',
    },
  ];
  
  for (const subset of subsets) {
    await subsetFont(
      'src/fonts/inter-var.ttf',
      `public/fonts/inter-var-${subset.name}.woff2`,
      subset.range
    );
  }
}

// Font loading strategy
```

```astro
---
// src/components/FontLoader.astro
---

<style is:inline>
  /* Critical font loading */
  @font-face {
    font-family: 'Inter';
    src: url('/fonts/inter-var-latin.woff2') format('woff2');
    font-weight: 100 900;
    font-display: swap;
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  
  /* Prevent layout shift */
  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
  }
</style>

<!-- Preload critical font -->
<link
  rel="preload"
  href="/fonts/inter-var-latin.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>

<!-- Preconnect to font CDN if using external fonts -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<script>
  // Font loading API for non-critical fonts
  if ('fonts' in document) {
    const fontLatinExt = new FontFace(
      'Inter',
      'url(/fonts/inter-var-latin-ext.woff2) format("woff2")',
      {
        weight: '100 900',
        unicodeRange: 'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF',
      }
    );
    
    fontLatinExt.load().then(font => {
      document.fonts.add(font);
    });
  }
</script>
```

### 5. Caching Strategy

```text
# public/_headers
# Cache control headers for optimal performance

# HTML - Short cache, must revalidate
/*
  Cache-Control: public, max-age=3600, must-revalidate
  
# Static assets - Long cache with immutable
/_astro/*
  Cache-Control: public, max-age=31536000, immutable
  
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
  
/images/*
  Cache-Control: public, max-age=31536000, immutable
  
# CSS and JS - Long cache
*.css
  Cache-Control: public, max-age=31536000, immutable
  
*.js
  Cache-Control: public, max-age=31536000, immutable
  
# Security headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### 6. Service Worker (Showcase)

```javascript
// public/sw.js
const CACHE_NAME = 'v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/fonts/inter-var-latin.woff2',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // HTML requests - Network first, cache fallback
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clonedResponse = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request).then(response => {
            return response || caches.match('/offline.html');
          });
        })
    );
    return;
  }
  
  // Static assets - Cache first, network fallback
  if (url.pathname.match(/\.(js|css|woff2|png|jpg|jpeg|webp|avif)$/)) {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(fetchResponse => {
          return caches.open(STATIC_CACHE).then(cache => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
    return;
  }
});
```

## SEO Implementation

### 1. Technical SEO Checklist

```typescript
// scripts/seo-audit.ts
import { XMLParser } from 'fast-xml-parser';
import robotsParser from 'robots-parser';
import fetch from 'node-fetch';

interface SEOIssue {
  type: 'error' | 'warning';
  message: string;
  page?: string;
}

async function auditSEO(siteUrl: string): Promise<SEOIssue[]> {
  const issues: SEOIssue[] = [];
  
  // Check robots.txt
  try {
    const robotsResponse = await fetch(`${siteUrl}/robots.txt`);
    const robotsText = await robotsResponse.text();
    const robots = robotsParser(`${siteUrl}/robots.txt`, robotsText);
    
    if (!robots.isAllowed(`${siteUrl}/`, 'Googlebot')) {
      issues.push({
        type: 'error',
        message: 'Site is blocking Googlebot in robots.txt',
      });
    }
    
    if (!robotsText.includes('Sitemap:')) {
      issues.push({
        type: 'warning',
        message: 'No sitemap reference in robots.txt',
      });
    }
  } catch (error) {
    issues.push({
      type: 'error',
      message: 'robots.txt not found or inaccessible',
    });
  }
  
  // Check sitemap
  try {
    const sitemapResponse = await fetch(`${siteUrl}/sitemap.xml`);
    const sitemapXML = await sitemapResponse.text();
    const parser = new XMLParser();
    const sitemap = parser.parse(sitemapXML);
    
    const urls = sitemap.urlset?.url || [];
    if (!Array.isArray(urls)) {
      issues.push({
        type: 'error',
        message: 'Invalid sitemap format',
      });
    }
    
    // Check each URL in sitemap
    for (const url of urls) {
      const response = await fetch(url.loc);
      if (response.status !== 200) {
        issues.push({
          type: 'error',
          message: `Broken link in sitemap: ${url.loc} (${response.status})`,
          page: url.loc,
        });
      }
    }
  } catch (error) {
    issues.push({
      type: 'error',
      message: 'sitemap.xml not found or invalid',
    });
  }
  
  // Check common pages
  const pagesToCheck = ['/', '/projects', '/blog', '/about', '/contact'];
  
  for (const page of pagesToCheck) {
    try {
      const response = await fetch(`${siteUrl}${page}`);
      const html = await response.text();
      
      // Check title
      const titleMatch = html.match(/<title>(.*?)<\/title>/);
      if (!titleMatch) {
        issues.push({
          type: 'error',
          message: 'Missing <title> tag',
          page,
        });
      } else if (titleMatch[1].length > 60) {
        issues.push({
          type: 'warning',
          message: `Title too long (${titleMatch[1].length} chars)`,
          page,
        });
      }
      
      // Check meta description
      const descMatch = html.match(/<meta\s+name="description"\s+content="(.*?)"/);
      if (!descMatch) {
        issues.push({
          type: 'error',
          message: 'Missing meta description',
          page,
        });
      } else if (descMatch[1].length > 160) {
        issues.push({
          type: 'warning',
          message: `Meta description too long (${descMatch[1].length} chars)`,
          page,
        });
      }
      
      // Check h1
      const h1Matches = html.match(/<h1[^>]*>/g);
      if (!h1Matches) {
        issues.push({
          type: 'error',
          message: 'Missing H1 tag',
          page,
        });
      } else if (h1Matches.length > 1) {
        issues.push({
          type: 'warning',
          message: `Multiple H1 tags found (${h1Matches.length})`,
          page,
        });
      }
      
      // Check canonical
      const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="(.*?)"/);
      if (!canonicalMatch) {
        issues.push({
          type: 'warning',
          message: 'Missing canonical URL',
          page,
        });
      }
    } catch (error) {
      issues.push({
        type: 'error',
        message: `Failed to check page: ${page}`,
        page,
      });
    }
  }
  
  return issues;
}

// Run audit
auditSEO('https://localhost:3000').then(issues => {
  if (issues.length === 0) {
    console.log('✅ No SEO issues found!');
  } else {
    console.log(`Found ${issues.length} SEO issues:\n`);
    issues.forEach(issue => {
      const icon = issue.type === 'error' ? '❌' : '⚠️';
      console.log(`${icon} ${issue.message}${issue.page ? ` (${issue.page})` : ''}`);
    });
  }
});
```

### 2. Schema Markup Implementation

```astro
---
// src/components/SchemaOrg.astro
export interface Props {
  type: 'WebSite' | 'Person' | 'BlogPosting' | 'Article';
  data: Record<string, any>;
}

const { type, data } = Astro.props;

// Website schema
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: data.name,
  url: data.url,
  description: data.description,
  author: {
    '@type': 'Person',
    name: data.author,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${data.url}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

// Person schema
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: data.name,
  url: data.url,
  image: data.image,
  sameAs: data.socialProfiles || [],
  jobTitle: data.jobTitle,
  worksFor: data.company && {
    '@type': 'Organization',
    name: data.company,
  },
};

// Article schema
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': type,
  headline: data.title,
  description: data.description,
  image: data.image,
  datePublished: data.publishedDate,
  dateModified: data.modifiedDate || data.publishedDate,
  author: {
    '@type': 'Person',
    name: data.author,
  },
  publisher: {
    '@type': 'Organization',
    name: data.publisherName || data.author,
    logo: {
      '@type': 'ImageObject',
      url: data.publisherLogo || data.siteUrl + '/logo.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': data.url,
  },
};

const schemas = {
  WebSite: websiteSchema,
  Person: personSchema,
  BlogPosting: articleSchema,
  Article: articleSchema,
};

const schema = schemas[type];
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

### 3. Sitemap Generation

```typescript
// astro.config.mjs - Sitemap configuration
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://yourdomain.com',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/draft/'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      customPages: [
        'https://yourdomain.com/api/feed.xml',
      ],
      serialize(item) {
        // Customize priority based on page
        if (item.url === 'https://yourdomain.com/') {
          item.priority = 1.0;
          item.changefreq = 'daily';
        } else if (item.url.includes('/blog/')) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/projects/')) {
          item.priority = 0.9;
          item.changefreq = 'monthly';
        }
        return item;
      },
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
        },
      },
    }),
  ],
});
```

## Performance Monitoring

### 1. Core Web Vitals Monitoring

```astro
---
// src/components/WebVitals.astro
---

<script>
  import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';
  
  function sendToAnalytics(metric: any) {
    // Replace with your analytics endpoint
    const endpoint = '/api/analytics';
    
    const body = JSON.stringify({
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    });
    
    // Use sendBeacon for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, body);
    } else {
      fetch(endpoint, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      });
    }
  }
  
  // Measure all Core Web Vitals
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getLCP(sendToAnalytics);
  getFCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
  
  // Additional custom metrics
  // First input delay for all inputs
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'first-input') {
        sendToAnalytics({
          name: 'FID-All',
          value: entry.processingStart - entry.startTime,
          rating: entry.processingStart - entry.startTime < 100 ? 'good' : 'poor',
        });
      }
    }
  }).observe({ type: 'first-input', buffered: true });
</script>
```

### 2. Performance Budget Enforcement

```yaml
# .github/workflows/performance-budget.yml
name: Performance Budget Check

on:
  pull_request:
    branches: [master]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Build site
        run: pnpm run build
        
      - name: Run Lighthouse CI {{versions.lighthouse-ci}}
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:3000/
            http://localhost:3000/projects
            http://localhost:3000/blog
          uploadArtifacts: true
          temporaryPublicStorage: true
          budgetPath: ./lighthouse-budget.json
          
      - name: Check bundle sizes
        run: |
          # Check JavaScript bundle size
          JS_SIZE=$(find dist -name "*.js" -type f -exec stat -f%z {} + | awk '{s+=$1} END {print s}')
          if [ "$JS_SIZE" -gt 163840 ]; then
            echo "❌ JavaScript bundle exceeds 160KB limit: ${JS_SIZE} bytes"
            exit 1
          fi
          
          # Check CSS bundle size
          CSS_SIZE=$(find dist -name "*.css" -type f -exec stat -f%z {} + | awk '{s+=$1} END {print s}')
          if [ "$CSS_SIZE" -gt 51200 ]; then
            echo "❌ CSS bundle exceeds 50KB limit: ${CSS_SIZE} bytes"
            exit 1
          fi
          
          echo "✅ Bundle sizes within budget"
          echo "JS: ${JS_SIZE} bytes"
          echo "CSS: ${CSS_SIZE} bytes"
```

```json
// lighthouse-budget.json
{
  "path": "/*",
  "resourceSizes": [
    {
      "resourceType": "script",
      "budget": 160
    },
    {
      "resourceType": "stylesheet",
      "budget": 50
    },
    {
      "resourceType": "image",
      "budget": 800
    },
    {
      "resourceType": "total",
      "budget": 1024
    }
  ],
  "resourceCounts": [
    {
      "resourceType": "script",
      "budget": 10
    },
    {
      "resourceType": "stylesheet",
      "budget": 5
    }
  ],
  "timings": [
    {
      "metric": "interactive",
      "budget": 3000
    },
    {
      "metric": "first-contentful-paint",
      "budget": 1000
    },
    {
      "metric": "largest-contentful-paint",
      "budget": 2500
    }
  ]
}
```

## Common Pitfalls

1. **Ignoring Third-Party Scripts**: External scripts killing performance
   - **Solution**: Lazy load, use facades, or self-host

2. **Unoptimized Fonts**: Loading entire font families
   - **Solution**: Subset fonts, use variable fonts, preload critical

3. **Missing Caching Headers**: Not leveraging browser cache
   - **Solution**: Set appropriate cache-control headers

4. **Blocking Resources**: CSS/JS blocking render
   - **Solution**: Inline critical CSS, defer non-critical JS

5. **Poor Image Strategy**: Wrong formats or sizes
   - **Solution**: Use modern formats, responsive images

## Exit Criteria

- [ ] Lighthouse scores meet targets (97+ performance)
- [ ] Core Web Vitals pass (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] All images optimized with modern formats
- [ ] Critical CSS inlined, non-critical deferred
- [ ] Fonts subsetted and preloaded
- [ ] Caching strategy implemented
- [ ] Service worker active (Showcase)
- [ ] SEO audit passes
- [ ] Schema markup implemented
- [ ] Sitemap generated and submitted
- [ ] Performance monitoring active (Showcase)
- [ ] Bundle sizes within budget

## Rollback Strategy

If performance degrades:

1. **Script Issues**:
   - Remove problematic third-party scripts
   - Revert to previous bundle configuration
   - Check for unintended dependencies

2. **Style Regression**:
   - Verify critical CSS extraction
   - Check for CSS-in-JS issues
   - Revert style changes

3. **Image Problems**:
   - Re-run optimization pipeline
   - Check CDN configuration
   - Verify responsive images

## AI Assistant Notes

### Key Files to Reference
- `astro.config.mjs` - Build optimizations
- `public/_headers` - Caching strategy
- Performance audit scripts
- Lighthouse configuration

### Common Prompts for This Phase
- "Optimize bundle size for production"
- "Implement Core Web Vitals monitoring"
- "Set up caching headers for static assets"
- "Create performance budget CI workflow"

### Context Requirements
- Current performance metrics
- Target audience geography
- CDN preferences
- Analytics platform
