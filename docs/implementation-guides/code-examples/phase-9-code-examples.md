---
title: Phase 9 - Code Examples  
lastUpdated: true
description: >-
  Code examples for Phase 9
tableOfContents: true
pagefind: true
---

Companion to the [Phase 9 performance guide](/implementation-guides/active-phases/phase-9-performance/).
Most of what Phase 9 asks for already ships with the starter — the examples below point at the
real files and scripts first, then show how to extend them. Scope labels follow the
[progressive tier model](/adr/033-track-consolidation/): **Essential** applies to every project,
**Recommended** to most, **Advanced** to portfolio/enterprise builds. Every script lives in
`scripts/src/` and is run through a pnpm name ([ADR-052](/adr/052-script-taxonomy/)); anything
marked *not shipped* is an example you would add yourself. The full script list is in
[Custom Scripts](/development/custom-scripts/).

## Performance Optimization

### 1. Performance Audit Script (Essential)

The starter ships three ways to run Lighthouse against a local build. All of them expect
`pnpm build && pnpm preview` (or `pnpm dev`) to be serving `http://localhost:4321`:

```bash
# One-off HTML report you open in a browser
pnpm perf:lighthouse

# Headless JSON report for scripting (writes lighthouse-report.json)
pnpm perf:lighthouse:ci

# Record a category-score baseline (performance-baseline.json by default)
pnpm perf:baseline
pnpm exec tsx scripts/src/baseline-performance.ts --url=http://localhost:4321/blog/ --device=mobile --out=baseline-blog-mobile.json

# The CI gate: lhci autorun with lighthouserc.json (desktop). Pass
# --config=lighthouserc.mobile.json for the mobile floors.
pnpm perf:lhci
```

`scripts/src/baseline-performance.ts` (`pnpm perf:baseline`) shells out to the Lighthouse CLI
rather than importing the Lighthouse API — it keeps startup fast and needs no `chrome-launcher`
dependency. It accepts `--url=`, `--out=` and `--device=desktop|mobile` and writes the four
category scores plus a timestamp:

```typescript
// scripts/src/baseline-performance.ts (shipped — trimmed to the essentials)
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const { url, out, device } = parseArgs(); // --url= --out= --device=

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
  if (code !== 0) process.exit(code ?? 1);
  const { categories } = JSON.parse(json);
  const scores = Object.fromEntries(
    Object.entries(categories).map(([k, v]: [string, any]) => [k, v.score]),
  );
  writeFileSync(
    resolve(out),
    JSON.stringify({ generatedAt: new Date().toISOString(), url, device, scores }, null, 2),
  );
});
```

The pass/fail floors live in `lighthouserc.json` and `lighthouserc.mobile.json`, not in a script:
performance ≥ 0.90, accessibility ≥ 0.95, best-practices ≥ 0.95, SEO ≥ 0.90. The **95+**
Lighthouse figure quoted across the docs is the measured headline, not the gate — do not tighten
the floors to chase it. Mobile asserts the median of three runs per URL because single mobile runs
on shared CI runners swing TBT and Speed Index enough to fail no-op changes.

A regression check against the recorded baseline is a small addition (**Recommended**, not
shipped). It reuses `perf:baseline` for the fresh run, so nothing new is installed:

```typescript
// scripts/src/compare-baseline.ts (not shipped — run with `pnpm exec tsx scripts/src/compare-baseline.ts`)
import { readFileSync } from "node:fs";

interface Baseline {
  url: string;
  device: string;
  scores: Record<string, number>;
}

// Regenerate `current` first: pnpm perf:baseline --out=performance-current.json
const baseline: Baseline = JSON.parse(readFileSync("performance-baseline.json", "utf8"));
const current: Baseline = JSON.parse(readFileSync("performance-current.json", "utf8"));

// Same floors as lighthouserc.json — the baseline compare must never be looser than CI.
const floors: Record<string, number> = {
  performance: 0.9,
  accessibility: 0.95,
  "best-practices": 0.95,
  seo: 0.9,
};
const maxDrop = 0.03; // tolerate run variance; flag anything larger

let failed = false;
for (const [category, floor] of Object.entries(floors)) {
  const before = baseline.scores[category] ?? 0;
  const after = current.scores[category] ?? 0;
  if (after < floor) {
    console.error(`❌ ${category}: ${after} is below the ${floor} floor`);
    failed = true;
  } else if (before - after > maxDrop) {
    console.error(`❌ ${category}: dropped ${(before - after).toFixed(2)} (${before} → ${after})`);
    failed = true;
  } else {
    console.log(`✅ ${category}: ${after} (baseline ${before})`);
  }
}

process.exit(failed ? 1 : 0);
```

### 2. Critical CSS Extraction (Advanced)

You almost certainly do not need this. The shipped `astro.config.mjs` already sets
`build.inlineStylesheets: "auto"` (small stylesheets are inlined into the page) and minifies CSS
with Lightning CSS, and Tailwind v4 only emits the utilities you actually use — so a PurgeCSS pass
has nothing to remove. CSS has **no enforced budget** in the starter; the 50KB figure in the docs
is advisory. Reach for critical-path extraction only if `pnpm bundle:analyze` shows a stylesheet
large enough to block first paint on a page that matters.

> Not part of the starter — install it (`pnpm add -D critical`) if you adopt this example.

```typescript
// scripts/src/extract-critical-css.ts (not shipped — run with `pnpm exec tsx scripts/src/extract-critical-css.ts`)
import { mkdirSync, writeFileSync } from "node:fs";
import critical from "critical";

// Paths use the starter's trailingSlash: "always" convention.
const pages = [
  { url: "http://localhost:4321/", output: "home-critical.css" },
  { url: "http://localhost:4321/projects/", output: "projects-critical.css" },
  { url: "http://localhost:4321/blog/", output: "blog-critical.css" },
];

mkdirSync("dist/critical", { recursive: true });

for (const page of pages) {
  const { css } = await critical.generate({
    src: page.url,
    width: 1300,
    height: 900,
    penthouse: { blockJSRequests: true },
  });
  writeFileSync(`dist/critical/${page.output}`, css);
  console.log(`✅ Extracted critical CSS for ${page.url}`);
}
```

### 3. Resource Optimization (Essential)

The relevant knobs are already set in the shipped `astro.config.mjs`. These are the real values —
change them deliberately, and re-run the gates afterwards:

```javascript
// astro.config.mjs (shipped — excerpt of the performance-relevant options)
export default defineConfig({
  site,                 // resolved from SITE_URL / PUBLIC_SITE_URL (ADR-050)
  base,                 // "/<package-name>" for DEPLOY_TARGET=gh-pages, "/" otherwise
  trailingSlash: "always",

  // Top-level option: under `build:` it is silently ignored. Measured ~31KB
  // less raw HTML site-wide than the old `true` mode.
  compressHTML: "jsx",

  // Built-in prefetch (ADR-028): links are prefetched on hover by default.
  prefetch: true,

  output: "static",

  build: {
    inlineStylesheets: "auto",
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: "lightningcss",
    },
  },

  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: { limitInputPixels: 268402689 },
    },
    responsive: {
      globalStyles: true,
      layout: "constrained",
    },
  },
});
```

Images go through `src/components/atoms/Image.astro`, a thin wrapper over `astro:assets` that
defaults to modern formats ([ADR-030](/adr/030-image-optimisation-defaults/)); see the
[image optimization guide](/implementation-guides/guides/image-optimization-guide/). The image
scripts are:

```bash
pnpm images:analyze    # scripts/src/optimize-images.ts — report sizes, dimensions, insights
pnpm images:optimize   # scripts/src/optimize-images-interactive.ts — resize/compress with sharp
pnpm images:gate       # scripts/src/check-image-budget.ts — fail if any raster > 200KB (ADR-057)
pnpm bundle:analyze    # build, then scripts/src/analyze-bundle.ts — raw + gzip size per file/type
```

> **Note:** `astro-critters`, `astro-purgecss`, and `astro-compress` are optional third-party
> integrations — they are **not** part of the starter. Tailwind v4 already tree-shakes utilities,
> `compressHTML` already minifies HTML, and Vite minifies JS/CSS, so each of these adds build time
> for little or no shipped-byte gain. Evaluate them against `pnpm bundle:analyze` before adopting
> any of them.

There is no `manualChunks` configuration and none is needed: the only islands are
`MotionLab.tsx` and `SignalsCounter.tsx` under `src/components/islands/`, and the raw JS budget is
160KB total. If you add enough islands that `pnpm bundle:analyze` shows a shared Preact chunk worth
splitting, configure it under `vite.build.rollupOptions.output.manualChunks` (not the non-existent
`build.rollupOptions`) with `preact` — never `react`, which the starter does not use
([ADR-031](/adr/031-preact-over-react/)).

### 4. Font Optimization (Essential)

Fonts are already subset, self-hosted and preload-gated — do not add a subsetting pipeline, a
`public/fonts/` directory, or a `FontLoader` component. The shipped setup
([ADR-053](/adr/053-fonts-via-astro-fonts-api/)) is:

- `src/assets/fonts/geist-latin-variable.woff2` and `inter-latin-variable.woff2` (latin subset,
  variable weight 100–900, OFL licence files alongside).
- Registered in `astro.config.mjs` through the Astro Fonts API. Astro fingerprints the files into
  `/_astro/fonts/`, emits the `@font-face` rules, and generates metric-adjusted fallback faces
  (`size-adjust` / `ascent-override`) so the swap does not shift layout.
- Consumed in `src/styles/global.css` as `--font-display: var(--font-geist)` and
  `--font-text: var(--font-inter)`; there is no hand-written `@font-face` anywhere.
- Preloaded once per family from `src/components/molecules/Head.astro`; `pnpm fonts:gate`
  ([ADR-058](/adr/058-font-preload-budget/)) fails the build when any page preloads more than two
  font files, and `budgets.json` caps fonts at 64KB per file / 150KB total.

```javascript
// astro.config.mjs (shipped — fonts excerpt)
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Geist",
      cssVariable: "--font-geist",
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
      optimizedFallbacks: true,
      options: {
        variants: [
          {
            weight: "100 900",
            style: "normal",
            src: ["./src/assets/fonts/geist-latin-variable.woff2"],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Inter",
      cssVariable: "--font-inter",
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
      optimizedFallbacks: true,
      options: {
        variants: [
          {
            weight: "100 900",
            style: "normal",
            src: ["./src/assets/fonts/inter-latin-variable.woff2"],
          },
        ],
      },
    },
  ],
});
```

```css
/* src/styles/global.css (shipped — excerpt) */
:root {
  --font-display: var(--font-geist);
  --font-text: var(--font-inter);
  --default-font-family: var(--font-text);
}
```

```astro
---
// src/components/molecules/Head.astro (shipped — fonts excerpt)
import { Font } from "astro:assets";
---
<!-- Emits the @font-face + fallback faces and preloads one file per family.
     Geist drives headlines (the LCP element on most pages); Inter is the body face. -->
<Font cssVariable="--font-geist" preload />
<Font cssVariable="--font-inter" preload />
```

**Swapping a font** is a four-file change:

1. Drop the new variable `.woff2` (use the vendor's latin-subset build — Geist and Inter both ship
   one) into `src/assets/fonts/` with its licence file. Keep it under the 64KB per-file budget.
2. Replace or add a `fonts[]` entry in `astro.config.mjs` with a new `cssVariable`
   (e.g. `--font-brand`).
3. Point `--font-display` or `--font-text` at the new variable in `src/styles/global.css` — the
   components never reference a family name directly.
4. Update the `<Font ... preload />` lines in `Head.astro`. Preload only the faces that render
   above the fold; the gate allows two per page (override with `MAX_FONT_PRELOADS=<n>` only after
   measuring LCP with and without the extra preload).

Then run `pnpm build && pnpm fonts:gate && pnpm perf:budgets` — those are the same commands CI
runs.

### 5. Caching Strategy (Essential)

Cache and security headers live in `public/_headers`. Two things about hosting matter more than
the values: the file is honoured by header-capable hosts (Cloudflare Pages, Netlify) and is a
**no-op on GitHub Pages**, the shipped deploy target — GitHub Pages sets its own short cache
headers and offers no header configuration
([ADR-051](/adr/051-content-security-policy-strategy/)). The security stanza, including the CSP
and its deliberate `'unsafe-inline'`, is explained in that ADR.

This is the real file, verbatim. HTML is revalidated on every request (`max-age=0,
must-revalidate`), and only fingerprinted `/_astro/*` assets — which include the vendored fonts
emitted by the Fonts API and every image processed by `astro:assets` — get the immutable year-long
cache. There are no `/fonts/*` or `/images/*` paths to configure, and no `*.css` / `*.js` globs:
every built stylesheet and script already lives under `/_astro/`.

```text
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

Files in `public/` that are *not* fingerprinted (`favicon.svg`, `og-default.png`,
`site.webmanifest`) fall under the `/*` stanza and revalidate on every request. That is
intentional: they are referenced by stable URLs, so a long cache would make replacing them a
multi-day rollout.

### 6. Service Worker (Advanced)

**Not shipped.** The starter deliberately has no service worker: a static site whose assets are
already immutable under `/_astro/*` gains little from a second cache layer, and a stale worker is
one of the hardest deploy bugs to diagnose. Add one only for a real offline requirement, and keep
in mind two starter-specific constraints: the worker's scope must include the deploy `base`
(`/<package-name>/` on GitHub Pages — build the paths with `import.meta.env.BASE_URL` in the
registration script), and the CSP's `script-src 'self'` already permits a same-origin worker.

```javascript
// public/sw.js (not shipped — optional offline support)
const STATIC_CACHE = "static-v1";
const DYNAMIC_CACHE = "dynamic-v1";

// Only stable, non-fingerprinted URLs belong here; /_astro/* is cached on first fetch below.
// `/offline.html` is not shipped either — add a src/pages/offline.astro if you use this.
const STATIC_ASSETS = ["/", "/offline.html", "/site.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => caches.delete(name)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // HTML: network first, cache fallback, offline page as last resort
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((hit) => hit || caches.match("/offline.html"))),
    );
    return;
  }

  // Fingerprinted assets: cache first — they never change under the same URL
  if (url.pathname.includes("/_astro/")) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((response) =>
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, response.clone());
              return response;
            }),
          ),
      ),
    );
  }
});
```

If you go this route, `workbox` generates the same logic with precache manifests and versioning
handled for you.

> Not part of the starter — install it (`pnpm add -D workbox-build`) if you adopt this example.

## SEO Implementation

### 1. Technical SEO Checklist (Essential)

The technical baseline ships and is exercised on every page
([ADR-029](/adr/029-seo-metadata-architecture/)):

- `src/components/molecules/Head.astro` renders the title (suffixed with the site name unless the
  title already starts with it), meta description, canonical URL, Open Graph and Twitter cards,
  optional `noindex`, the RSS `<link rel="alternate">`, and JSON-LD structured data. Every page
  passes through it via `BaseLayout`.
- `src/pages/robots.txt.ts` allows all crawlers and points at `sitemap-index.xml`, resolved
  against the deploy `base` so sub-path deploys advertise the right absolute URL.
- `src/pages/rss.xml.ts` publishes the published blog posts through `@astrojs/rss`.
- `@astrojs/sitemap` writes `sitemap-index.xml` plus `sitemap-0.xml` at build time.

The Head props you set per page:

```typescript
// src/components/molecules/Head.astro (shipped — Props)
export interface Props {
  title: string;
  description: string;
  image?: string;                     // default "/og-default.png"; prefer PNG over SVG
  canonicalUrl?: URL;                 // default: current page URL on Astro.site
  noindex?: boolean;                  // adds <meta name="robots" content="noindex, nofollow">
  ogType?: "website" | "article";     // "article" switches on BlogPosting JSON-LD
  ogArticle?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
  };
  preconnectDomains?: string[];       // dns-prefetch + preconnect hints
}
```

The audit below checks those outputs against a running preview. It uses Node's built-in `fetch`
and plain regexes so it installs nothing; paths carry trailing slashes because the site is built
with `trailingSlash: "always"`. If you want it enforced in CI, port the assertions into a
Playwright spec under `e2e/` — that suite already runs in `ci.yml`.

```typescript
// scripts/src/seo-audit.ts (not shipped — run with `pnpm exec tsx scripts/src/seo-audit.ts`)
interface SeoIssue {
  type: "error" | "warning";
  message: string;
  page?: string;
}

const siteUrl = process.env.SITE_URL ?? "http://localhost:4321";
const pages = ["/", "/projects/", "/blog/", "/about/", "/contact/"];
const issues: SeoIssue[] = [];

// robots.txt — must exist and advertise the sitemap
const robots = await fetch(`${siteUrl}/robots.txt`);
const robotsText = robots.ok ? await robots.text() : "";
if (!robots.ok) issues.push({ type: "error", message: "robots.txt not found" });
if (!robotsText.includes("Sitemap:")) {
  issues.push({ type: "warning", message: "No Sitemap: line in robots.txt" });
}

// sitemap-index.xml → child sitemaps → every <loc> must resolve
const locs = (xml: string) => [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
const index = await fetch(`${siteUrl}/sitemap-index.xml`);
if (!index.ok) {
  issues.push({ type: "error", message: "sitemap-index.xml not found" });
} else {
  for (const sitemapUrl of locs(await index.text())) {
    const sitemap = await fetch(sitemapUrl);
    for (const loc of locs(await sitemap.text())) {
      const res = await fetch(loc, { method: "HEAD" });
      if (!res.ok) {
        issues.push({ type: "error", message: `Sitemap URL returned ${res.status}`, page: loc });
      }
    }
  }
}

// Per-page head checks
for (const page of pages) {
  const html = await (await fetch(`${siteUrl}${page}`)).text();

  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  if (!title) issues.push({ type: "error", message: "Missing <title>", page });
  else if (title.length > 60) {
    issues.push({ type: "warning", message: `Title is ${title.length} chars (>60)`, page });
  }

  const description = html.match(/<meta name="description" content="(.*?)"/)?.[1];
  if (!description) issues.push({ type: "error", message: "Missing meta description", page });
  else if (description.length > 160) {
    issues.push({ type: "warning", message: `Description is ${description.length} chars (>160)`, page });
  }

  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1Count === 0) issues.push({ type: "error", message: "Missing <h1>", page });
  else if (h1Count > 1) issues.push({ type: "warning", message: `${h1Count} <h1> elements`, page });

  if (!/<link rel="canonical" href="/.test(html)) {
    issues.push({ type: "warning", message: "Missing canonical link", page });
  }
  if (!/<script[^>]+type="application\/ld\+json"/.test(html)) {
    issues.push({ type: "warning", message: "Missing JSON-LD", page });
  }
}

for (const issue of issues) {
  console.log(`${issue.type === "error" ? "❌" : "⚠️"} ${issue.message}${issue.page ? ` (${issue.page})` : ""}`);
}
if (issues.length === 0) console.log("✅ No SEO issues found");
process.exit(issues.some((i) => i.type === "error") ? 1 : 0);
```

### 2. Schema Markup Implementation (Essential)

Structured data is emitted by `Head.astro` — there is no separate `SchemaOrg` component, and you
should not add one. Every page gets a `WebSite` and an `Organization` node linked through a single
`@graph`; article pages add a `BlogPosting`. The graph stays deliberately small: Google's guidance
prefers a few correct, validated nodes over kitchen-sink schemas.

```astro
---
// src/components/molecules/Head.astro (shipped — JSON-LD excerpt)
const ogImageUrl = new URL(withBase(image), Astro.site).href;
const siteOrigin = new URL(withBase("/"), Astro.site).href;

type JsonLdNode = Record<string, unknown>;
const jsonLdGraph: JsonLdNode[] = [
  {
    "@type": "WebSite",
    "@id": `${siteOrigin}#website`,
    url: siteOrigin,
    name: siteTitle,
    description: siteMetadata.description,
    inLanguage: "en",
    publisher: { "@id": `${siteOrigin}#organization` },
  },
  {
    "@type": "Organization",
    "@id": `${siteOrigin}#organization`,
    name: siteMetadata.author || siteTitle,
    url: siteOrigin,
    logo: new URL(withBase("/logo.svg"), Astro.site).href,
  },
];

if (ogType === "article" && ogArticle) {
  jsonLdGraph.push({
    "@type": "BlogPosting",
    "@id": `${canonicalUrl.href}#blogposting`,
    headline: title,
    description,
    image: ogImageUrl,
    url: canonicalUrl.href,
    datePublished: ogArticle.publishedTime,
    dateModified: ogArticle.modifiedTime ?? ogArticle.publishedTime,
    author: ogArticle.author
      ? { "@type": "Person", name: ogArticle.author }
      : { "@id": `${siteOrigin}#organization` },
    publisher: { "@id": `${siteOrigin}#organization` },
    keywords: ogArticle.tags,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl.href },
    inLanguage: "en",
  });
}

const jsonLd = JSON.stringify({ "@context": "https://schema.org", "@graph": jsonLdGraph });
---
<script is:inline type="application/ld+json" set:html={jsonLd} />
```

Blog posts opt in by passing `ogType="article"` through `BaseLayout` — this is exactly what the
shipped `BlogLayout.astro` does:

```astro
---
// src/layouts/BlogLayout.astro (shipped — excerpt)
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
```

To add another node type (a `Person` on the About page, say — **Recommended** for portfolio
sites), extend `Head.astro` rather than injecting a second `<script type="application/ld+json">`
from the page: `BaseLayout` has no head slot, and a second script block would create a second,
unlinked graph. Add an optional prop and spread it into the graph:

```astro
---
// src/components/molecules/Head.astro (extension — not shipped)
export interface Props {
  // ...shipped props unchanged...
  /** Extra JSON-LD nodes merged into the page's @graph. */
  jsonLdNodes?: Record<string, unknown>[];
}

const { jsonLdNodes = [] } = Astro.props;
// after the shipped WebSite / Organization / BlogPosting nodes:
jsonLdGraph.push(...jsonLdNodes);
---
```

```astro
---
// src/pages/about.astro (usage — forward the prop through BaseLayout's Props too)
import { siteMetadata, socialLinks } from "@/config";
---
<BaseLayout
  title="About"
  description="..."
  jsonLdNodes={[
    {
      "@type": "Person",
      name: siteMetadata.author,
      url: new URL(Astro.url.pathname, Astro.site).href,
      sameAs: Object.values(socialLinks).filter(Boolean),
    },
  ]}
>
```

Validate the output with Google's Rich Results Test against the preview URL before shipping; the
`seo-audit.ts` example above only checks that a JSON-LD block exists.

### 3. Sitemap Generation (Essential)

The shipped configuration is the integration with defaults — `sitemap()` in the `integrations`
array of `astro.config.mjs`. That is enough for a static site: `site` comes from `SITE_URL`, every
prerendered route is included, and `robots.txt.ts` advertises the index. Nothing is hardcoded to a
domain.

```javascript
// astro.config.mjs (shipped — excerpt)
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site, // from SITE_URL / PUBLIC_SITE_URL — validated by `pnpm env:validate` before every build
  integrations: [
    astroExpressiveCode(),
    mdx({ components: mdxComponents }),
    sitemap(),
    preact(),
  ],
});
```

Customising it (**Recommended** once you have pages that should not be indexed, or a large blog)
uses the same `site` value — build URL comparisons from it rather than pasting a domain, or the
GitHub Pages sub-path deploy will silently stop matching:

```javascript
// astro.config.mjs (customised sitemap — not shipped)
sitemap({
  // Keep 404/500 and anything marked noindex out of the index.
  filter: (page) => !/\/(404|500)\/?$/.test(page) && !page.includes("/drafts/"),
  serialize(item) {
    const path = new URL(item.url).pathname;
    if (path === `${base}` || path === `${base}/`) {
      item.priority = 1.0;
      item.changefreq = "daily";
    } else if (path.includes("/blog/")) {
      item.priority = 0.8;
      item.changefreq = "weekly";
    } else if (path.includes("/projects/")) {
      item.priority = 0.9;
      item.changefreq = "monthly";
    }
    return item;
  },
}),
```

`changefreq` and `priority` are hints that Google documents as ignored; `lastmod` is the one field
crawlers act on. The integration's top-level `lastmod` option stamps a single date on every page,
so `lastmod: new Date()` marks the whole site as changed on every build — leave it unset, or set
`item.lastmod` per page inside `serialize` from your content's `updated` dates.

## Performance Monitoring

### 1. Core Web Vitals Monitoring (Recommended)

Lab scores from Lighthouse do not tell you what visitors on real devices experience. Field data
(RUM) does — the targets are **LCP < 2.5s, INP ≤ 200ms, CLS < 0.1**. The starter ships no
analytics at all (see [Optional Analytics](/implementation-guides/reference/optional-analytics/)),
so this is opt-in. Two starter-specific constraints:

- The site is `output: "static"`, so there is no `/api/analytics` route to post to. Send beacons
  to your analytics provider or a separate Worker, and add that origin to `connect-src` in
  `public/_headers` — the shipped CSP is `connect-src 'self'` and will block the request
  otherwise ([ADR-051](/adr/051-content-security-policy-strategy/)).
- Render the component once from `BaseLayout` (or the `Head` component) so it runs on every page;
  with `ClientRouter` view transitions the module stays alive across navigations and `web-vitals`
  handles the soft-navigation lifecycle for you.

> Not part of the starter — install it (`pnpm add web-vitals`) if you adopt this example.

```astro
---
// src/components/atoms/WebVitals.astro (not shipped)
---
<script>
  import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from "web-vitals";

  // Must also be allowed by connect-src in public/_headers.
  const endpoint = import.meta.env.PUBLIC_VITALS_ENDPOINT;

  function sendToAnalytics(metric: Metric) {
    if (!endpoint) return;

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

    // sendBeacon survives page unload; keepalive fetch is the fallback
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, body);
    } else {
      fetch(endpoint, {
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      });
    }
  }

  onCLS(sendToAnalytics);
  onINP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
</script>
```

Add `PUBLIC_VITALS_ENDPOINT` to the `astro:env` schema in `astro.config.mjs` (context `client`,
access `public`, `optional: true`) so it is typed and documented like the other `PUBLIC_*` values
([ADR-050](/adr/050-type-safe-env-astro-env/)).

### 2. Performance Budget Enforcement (Essential)

Budgets are already enforced on every pull request — do not add a `performance-budget.yml`. The
shipped gates, in the order CI runs them:

| Gate | Where | What fails the build |
| :--- | :--- | :--- |
| `pnpm budgets:validate` | `ci.yml` | An entry in `budget-overrides.json` past its `expires` date |
| JS bundle size | `ci.yml` (shell step) | Raw JS under `dist/_astro/` over 160KB total |
| `pnpm perf:budgets` | `ci.yml` | Any `budgets.json` limit exceeded, after unexpired overrides are applied |
| `pnpm images:gate` (source and `IMAGE_GATE_ROOTS=dist`) | `ci.yml` | Any raster file over 200KB ([ADR-057](/adr/057-image-budget-gate/)) |
| `pnpm fonts:gate` | `ci.yml` | Any built page with more than two font preloads ([ADR-058](/adr/058-font-preload-budget/)) |
| `lhci autorun` desktop + mobile | `lighthouse.yml` | Any category below the 0.90 / 0.95 / 0.95 / 0.90 floors (mobile: median of 3 runs) |

The size budgets are declared once, in `budgets.json` at the repo root. Sizes are raw
(uncompressed) bytes measured over `dist/`. Note what is *not* here: CSS has no enforced budget.

```json
{
  "$comment": "Raw-size performance budgets enforced by `pnpm perf:budgets` (scripts/src/track-performance-budgets.ts), which runs as a CI gate after the build and applies any unexpired entries from budget-overrides.json. Sizes are uncompressed. CSS has no enforced size budget; the 50KB figure in .claude/stack.md is advisory.",
  "budgets": [
    {
      "name": "JavaScript (raw, bundled)",
      "path": "_astro",
      "ignore": ["**/*.css", "**/*.woff", "**/*.woff2", "**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.gif", "**/*.svg", "**/*.webp", "**/*.avif", "**/*.map"],
      "maxSizeKb": 64,
      "maxTotalSizeKb": 160
    },
    {
      "name": "Fonts (raw, self-hosted)",
      "path": "_astro/fonts",
      "maxSizeKb": 64,
      "maxTotalSizeKb": 150
    },
    {
      "name": "Images (raw, per-file)",
      "path": "",
      "ignore": ["**/*.js", "**/*.css", "**/*.woff", "**/*.woff2", "**/*.html", "**/*.json", "**/*.xml", "**/*.txt", "**/*.map"],
      "maxSizeKb": 200
    }
  ]
}
```

When a feature legitimately needs more headroom for a while, do not edit `budgets.json` — add a
dated override. `metric` matches a budget's `name`, `temporary` is the new limit in **bytes**, and
`pnpm budgets:validate` fails CI the day after `expires` until the entry is fixed or moved to
`expired_overrides`. Requiring an ADR reference keeps the reason on record
([ADR-039](/adr/039-halt-on-violation-enforcement/)).

```json
{
  "overrides": [
    {
      "metric": "JavaScript (raw, bundled)",
      "original": 163840,
      "temporary": 180000,
      "reason": "Interactive dashboard island — splitting tracked in PROJ-123",
      "adr": "docs/adr/0xx-dashboard-interactivity.md",
      "expires": "2026-10-15",
      "ticket": "PROJ-123",
      "approved_by": "tech-lead",
      "created": "2026-09-01"
    }
  ],
  "expired_overrides": []
}
```

The Lighthouse floors are asserted by Lighthouse CI, not by a hand-rolled workflow. The desktop
config is below (its explanatory `$comment` trimmed); `lighthouserc.mobile.json` holds identical
floors with `numberOfRuns: 3` and `aggregationMethod: "median"`. Do not loosen the floors to make a heavier page pass — fix the page.

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "pnpm preview",
      "startServerReadyPattern": "Local",
      "url": [
        "http://localhost:4321/",
        "http://localhost:4321/how-it-works/",
        "http://localhost:4321/showcase/",
        "http://localhost:4321/blog/",
        "http://localhost:4321/blog/why-astro-in-2026/",
        "http://localhost:4321/projects/",
        "http://localhost:4321/projects/patisserie-storefront/",
        "http://localhost:4321/about/",
        "http://localhost:4321/contact/",
        "http://localhost:4321/adr/"
      ],
      "numberOfRuns": 1,
      "settings": {
        "preset": "desktop",
        "chromeFlags": "--headless=new --no-sandbox"
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    },
    "upload": {
      "target": "filesystem",
      "outputDir": "lighthouse-ci-reports"
    }
  }
}
```

Adding a page to the gate is a one-line change to the `url` arrays in both `lighthouserc*.json`
files. Running the same gates locally before a PR is the same four commands CI uses:

```bash
pnpm build
pnpm perf:budgets && pnpm images:gate && IMAGE_GATE_ROOTS=dist pnpm images:gate && pnpm fonts:gate
pnpm perf:lhci                                    # desktop floors
pnpm exec lhci autorun --config=lighthouserc.mobile.json   # mobile floors
```

The full budget rationale, including the advisory CSS figure and the Core Web Vitals targets, is
in [Budgets & Guardrails](/implementation-guides/reference/budgets-guardrails/).
