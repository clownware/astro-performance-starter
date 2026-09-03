---
title: Phase 10 - Code Examples
lastUpdated: true
description: >-
  Code examples for Phase 10
tableOfContents: true
pagefind: true
---

Companion to [Phase 10 — Deployment](/implementation-guides/active-phases/phase-10-deployment/). Every
example below is checked against the starter's actual files; anything the starter does **not** ship is
labelled as such in the leading comment. Scope labels follow
[ADR-033](/adr/033-track-consolidation/): Essential / Recommended / Advanced.

## Deployment Platforms

### 1. GitHub Pages (shipped — Essential)

The starter ships exactly one deploy pipeline: `.github/workflows/deploy.yml`, "Deploy to GitHub Pages".
It runs on every push to `master` (and on manual `workflow_dispatch`), builds with the pinned Node
(`.nvmrc`) and pnpm (`packageManager` in `package.json`), then publishes `dist/` through the official
`actions/configure-pages` → `actions/upload-pages-artifact` → `actions/deploy-pages` chain.

The one non-obvious step is **SITE_URL resolution**, because canonical/OG URLs and the sitemap bake the
origin into the build ([ADR-050](/adr/050-type-safe-env-astro-env/)) — it cannot be a post-deploy setting:

- **Repository variable `SITE_URL` unset (stock behaviour):** `SITE_URL=https://<owner>.github.io` and
  `DEPLOY_TARGET=gh-pages`, so `astro.config.mjs` derives the base path `/<repo-name>` from `package.json`.
- **Repository variable `SITE_URL` set to a custom Pages domain:** the build uses that origin and the base
  path is `/` — a custom domain serves the project site from the domain root, so any other base path
  404s every asset.

```yaml
# .github/workflows/deploy.yml (shipped)
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Setup Node.js
        uses: actions/setup-node@v7
        with:
          node-version-file: '.nvmrc'

      - name: Setup PNPM
        uses: pnpm/action-setup@v6
        with:
          run_install: false

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      # Default: the repo's project-Pages origin (https://<owner>.github.io)
      # with the /<repo-name> base path (DEPLOY_TARGET=gh-pages). Set the
      # repository variable SITE_URL (Settings → Secrets and variables →
      # Actions → Variables) to a custom Pages domain and both flip together:
      # a custom domain serves the project site from the domain root, so the
      # base path must be "/" or every asset URL 404s. Canonical/OG URLs and
      # the sitemap bake SITE_URL into the build (ADR-050), so this cannot be a
      # post-deploy setting. Leave the variable unset for the stock behaviour.
      - name: Resolve SITE_URL
        shell: bash
        run: |
          if [ -n "${SITE_URL_OVERRIDE}" ]; then
            echo "SITE_URL=${SITE_URL_OVERRIDE}" >> "$GITHUB_ENV"
            echo "Using custom SITE_URL=${SITE_URL_OVERRIDE} (base path /)"
          else
            echo "SITE_URL=https://${{ github.repository_owner }}.github.io" >> "$GITHUB_ENV"
            echo "DEPLOY_TARGET=gh-pages" >> "$GITHUB_ENV"
            echo "Using default project-Pages SITE_URL (base path /${{ github.event.repository.name }})"
          fi
        env:
          SITE_URL_OVERRIDE: ${{ vars.SITE_URL }}

      - name: Build site
        run: pnpm run build

      - name: Setup Pages
        uses: actions/configure-pages@v6

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v5
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    timeout-minutes: 15
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

One-time setup: in the repository's **Settings → Pages**, set the source to **GitHub Actions**. The
step-by-step walkthrough is in the shipped [deploy.yml](https://github.com/clownware/astro-performance-starter/blob/master/.github/workflows/deploy.yml) and the [Phase 10 guide](/implementation-guides/active-phases/phase-10-deployment/).

**GitHub Pages limitations to plan around:**

- **No custom response headers.** `public/_headers` (HSTS, CSP, cache-control — see
  [Security & Caching Headers](#security--caching-headers-shipped) below) is a no-op on GitHub Pages
  ([ADR-051](/adr/051-content-security-policy-strategy/)). The security posture it describes is what a
  header-capable host gets automatically; the demo URL itself does not carry it.
- **No redirects file.** GitHub Pages has no `_redirects`/rewrite mechanism at all. If you rename a
  published URL you have two options: leave a static page at the old path containing a
  `<meta http-equiv="refresh" content="0; url=/new-path/">` (plus a canonical link to the new URL), or
  move to a header-capable host (Cloudflare Pages, Netlify) that supports real 301s.
- **Project-site base path.** Without a custom domain the site lives under `/<repo-name>/`; every
  internal link in the starter already goes through `withBase` (`src/utils/url-utils.ts`) so this works
  out of the box — keep using it for any link you add.

### 2. Cloudflare Pages (alternative — Recommended)

Cloudflare Pages is the recommended alternative when you want real response headers (CSP, HSTS,
immutable caching) or server-side redirects, neither of which GitHub Pages can serve.

**Key advantages:**

- **Headers honoured natively.** Pages reads `public/_headers` as-is, so the shipped CSP and cache
  policy take effect with no extra configuration.
- **Performance.** Global edge CDN with free, privacy-focused analytics built in.
- **Room to grow.** Pages Functions / Workers can add API routes or SSR later without changing host.

**Watch-outs:**

- **Static deploys need no `wrangler.toml`.** The starter builds `output: "static"`; there is nothing to
  configure beyond the build command (`pnpm run build`) and output directory (`dist`).
- **Environment variables live in the Pages dashboard.** Set `SITE_URL` to your production origin and
  leave `DEPLOY_TARGET` unset (the base path must be `/` — see `.env.example`).
- **Redirects** go in a `public/_redirects` file (`/old-path /new-path 301`). The starter does not ship
  one; add it only when you need it.
- **If you later add Pages Functions or SSR**, budget for cold starts on the dynamic paths — they are
  outside the static performance model this starter is measured against.

The simplest route is the Cloudflare Git integration (Quick Deploy, Option A) — no workflow needed. If
you would rather deploy from GitHub Actions (for example to reuse the CI build), this is the workflow:

```yaml
# .github/workflows/deploy-cloudflare.yml (not shipped — optional replacement for deploy.yml)
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  deployments: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Setup Node.js
        uses: actions/setup-node@v7
        with:
          node-version-file: '.nvmrc'

      # No `version` input: pnpm/action-setup reads the pinned version from the
      # `packageManager` field in package.json (and errors if both are set).
      - name: Setup PNPM
        uses: pnpm/action-setup@v6
        with:
          run_install: false

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build site
        run: pnpm run build
        env:
          # Root deploy: no DEPLOY_TARGET, so base is "/".
          SITE_URL: ${{ vars.SITE_URL }}

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=your-project-name
```

`cloudflare/pages-action@v1` is deprecated — `wrangler-action@v3` with `pages deploy` is the supported
path. If you adopt this workflow, delete `deploy.yml` (or change its trigger) so two deploys do not race.

### 3. Vercel (alternative)

Vercel does not read `public/_headers`, so the header set has to be restated in `vercel.json`. The
block below mirrors the shipped `_headers` file exactly — keep the two in sync if you edit either.

```json
// vercel.json (not shipped)
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "framework": "astro",
  "trailingSlash": true,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "geolocation=(), microphone=()" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
        },
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
      ]
    },
    {
      "source": "/_astro/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

Set `SITE_URL` in the Vercel project's environment variables; leave `DEPLOY_TARGET` unset.
`trailingSlash: true` matches the starter's `trailingSlash: "always"` so canonical URLs and the
sitemap agree with what Vercel serves.

### 4. Netlify (alternative)

Netlify reads `public/_headers` natively (and `.nvmrc` for the Node version), so the config is minimal.
Redirects can live either in `netlify.toml` (below) or in a `public/_redirects` file — pick one.

```toml
# netlify.toml (not shipped)
[build]
  command = "pnpm run build"
  publish = "dist"

# Node version comes from .nvmrc automatically; pnpm from package.json "packageManager".
# Set SITE_URL in the Netlify UI (Site configuration → Environment variables), not here:
# a committed placeholder such as "your-domain" fails env:validate. Leave DEPLOY_TARGET
# unset so the base path is "/".

# Optional — only if you rename a published URL. Headers are NOT needed here:
# Netlify applies public/_headers as-is.
[[redirects]]
  from = "/old-path/"
  to = "/new-path/"
  status = 301
```

### Security & Caching Headers (shipped)

All hosts that honour a `_headers` file (Cloudflare Pages, Netlify) get this policy verbatim from
`public/_headers`. The `'unsafe-inline'` allowances are a deliberate, documented trade-off — Astro
island scripts and Tailwind utility styles need them, and the hash-only built-in CSP is incompatible
with `<ClientRouter />` and Shiki ([ADR-051](/adr/051-content-security-policy-strategy/)).

```text
# public/_headers (shipped)
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

Two consequences worth internalising before the Monitoring section:

- `connect-src 'self'` and `script-src 'self'` mean **any third-party analytics, error-tracking or RUM
  endpoint must be added to the CSP** (`script-src` for its loader, `connect-src` for its ingest
  origin) or the browser silently blocks it.
- HTML is `must-revalidate` and `/_astro/*` is fingerprinted and `immutable` — this is why a redeploy is
  instantly visible without a cache purge and why old assets never go stale.

## Environment Configuration

### 1. Environment Variables (Essential)

The starter's real `.env.example`. `SITE_URL` is **required for production builds**: `pnpm run build`
starts with `pnpm env:validate` (`scripts/src/validate-env.ts`), which fails the build if the value is
missing or still contains a placeholder (`example.com`, `your-username`, `your-domain`, `localhost`).
Analytics is opt-in — the two analytics keys are commented out and nothing in the starter reads them
yet; the recipes are in [Optional Analytics](/implementation-guides/reference/optional-analytics/).

```bash
# .env.example (shipped)
# Environment Variables Template
# Copy this file to .env and fill in your values
# DO NOT commit .env to version control

# Site Configuration
#
# SITE_URL (required for production builds)
# The canonical origin URL where your site will be hosted. No trailing slash.
# The build will fail if this is not set or contains placeholder values.
# For GitHub Pages: https://<your-github-username>.github.io
# For custom domains: https://your-domain.com
# SITE_URL=https://your-username.github.io
#
# Alternatively, use PUBLIC_SITE_URL (exposed to client-side code via Astro):
PUBLIC_SITE_URL=http://localhost:4321

# Deployment Target
# Set to "gh-pages" when deploying to GitHub Pages.
# This derives the base path from the package.json "name" field automatically.
# Leave unset for root deployments (Cloudflare Pages, Netlify, Vercel, etc.)
# DEPLOY_TARGET=gh-pages

# Analytics (optional) - See docs/implementation-guides/06-optional-features/01-analytics.md
# Not yet implemented — uncomment and set when adding analytics support.
# PUBLIC_PLAUSIBLE_DOMAIN="your-domain.com"
# PUBLIC_FATHOM_SITE_ID="YOUR_FATHOM_SITE_ID"

# Contact Information
PUBLIC_CONTACT_EMAIL=hello@example.com
PUBLIC_CONTACT_PHONE=+1234567890
PUBLIC_CONTACT_PHONE_DISPLAY="+1 (234) 567-890"
PUBLIC_CONTACT_LOCATION="San Francisco, CA"
PUBLIC_CONTACT_TIMEZONE="Mon-Fri, 9AM-6PM PST"

# Social Media Links
PUBLIC_SOCIAL_GITHUB=https://github.com/example
PUBLIC_SOCIAL_LINKEDIN=https://linkedin.com/company/example
PUBLIC_SOCIAL_TWITTER=https://twitter.com/example
```

There is no `src/config/env.ts` — type-safe environment handling is split across three places:

- **`astro.config.mjs`** — the `env.schema` block declares every `PUBLIC_CONTACT_*` / `PUBLIC_SOCIAL_*`
  variable via `envField` (astro:env, [ADR-050](/adr/050-type-safe-env-astro-env/)) with the demo values
  as defaults. Components import typed values directly, e.g. `src/pages/contact.astro` does
  `import { PUBLIC_CONTACT_EMAIL } from "astro:env/client";` — no scattered `|| "fallback"` literals.
- **`scripts/src/validate-env.ts`** (`pnpm env:validate`) — the prebuild step described above. `SITE_URL`
  and `DEPLOY_TARGET` are deliberately *not* in `env.schema`: they are read at config-load time, before
  astro:env exists, and the placeholder heuristic is the one check astro:env cannot express.
- **`src/config.ts`** — hand-edited site metadata (`siteMetadata`, `siteLinks`, `socialLinks`) that you
  update when cloning; not environment-driven.

When you add a new `PUBLIC_*` variable (for example an analytics key), declare it in `env.schema` rather
than reaching for `import.meta.env` — that is the ADR-050 contract.

### 2. Build Configuration (Essential)

The deployment-relevant excerpt of the starter's real `astro.config.mjs`. Three things it does *not* do
that older guides assume: there is no `build.sitemap` option (the sitemap comes from the
`@astrojs/sitemap` integration), no `manualChunks` vendor splitting (the starter has no React/date-fns
vendor bundle to split), and no `server.port` override (the dev server is Astro's default `4321`, which
`lighthouserc.json` and Playwright rely on). Fonts, the `env.schema` block and the remark pipeline are
elided below — see [ADR-053](/adr/053-fonts-via-astro-fonts-api/), ADR-050 and
[ADR-062](/adr/062-astro-7-upgrade-remark-retained/).

```javascript
// astro.config.mjs (shipped — excerpt)
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField, fontProviders } from "astro/config";
import astroExpressiveCode from "astro-expressive-code";
import { remarkSnippetIncludes } from "./scripts/src/remark-snippet-includes.mjs";
import { remarkValidateLinks } from "./scripts/src/remark-validate-links.mjs";
import { components as mdxComponents } from "./src/components/mdx/index.ts";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

// Read package name to derive the GitHub Pages base path automatically.
const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf-8"));
const isGhPages = process.env.DEPLOY_TARGET === "gh-pages";

// Site URL: require explicit configuration for builds, default to localhost for dev.
// The validate-env.ts prebuild script catches misconfiguration before we get here.
const envSite = process.env.SITE_URL || process.env.PUBLIC_SITE_URL;
const isDev = process.argv.slice(2).includes("dev");
const site = envSite || (isDev ? "http://localhost:4321" : undefined);
if (!site) {
  throw new Error(
    "SITE_URL is required for production builds. " +
      "Set SITE_URL or PUBLIC_SITE_URL in your environment or .env file.",
  );
}

// Base path: derive from package.json name for GH Pages, root for all others.
const base = isGhPages ? `/${pkg.name}` : "/";

export default defineConfig({
  site,
  base,
  trailingSlash: "always",

  // Top-level option (under `build:` it is silently ignored). The default for
  // the current Astro release; stated explicitly because it changes shipped bytes.
  compressHTML: "jsx",

  prefetch: true,

  // fonts: [...] — self-hosted Geist/Inter via fontProviders.local() (ADR-053)
  // env: { schema: { ... } } — typed PUBLIC_* variables via envField (ADR-050)

  integrations: [
    // Options live in ec.config.mjs so the <Code> component can be used in
    // .astro pages — inline non-serializable config breaks the prerender worker.
    astroExpressiveCode(),
    mdx({ components: mdxComponents }),
    sitemap(),
    preact(),
  ],

  markdown: {
    // Keep the unified/remark processor (ADR-062): the two custom plugins —
    // link validation and snippet includes — depend on it.
    processor: unified({
      remarkPlugins: [
        [remarkValidateLinks, { rootDir, basePaths: ["/docs", "/adr"], routeMap: { "/adr/": "docs/adr/" }, excludePaths: ["docs"] }],
        [remarkSnippetIncludes, { rootDir: process.cwd(), snippetsDir: "docs/snippets", strict: true }],
      ],
    }),
    syntaxHighlight: "shiki",
    shikiConfig: { theme: "dark-plus" },
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: "lightningcss",
    },
  },

  output: "static",

  build: {
    inlineStylesheets: "auto",
  },

  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: { limitInputPixels: 268402689 }, // ~16K x 16K pixels max
    },
    responsive: { globalStyles: true, layout: "constrained" },
    domains: [],
    remotePatterns: [],
  },
});
```

`pnpm run build` is `env:validate && tokens:build && astro build` — the design tokens
(`scripts/src/build-tokens.ts`) are generated before Astro runs, which is why a fresh clone must not
skip the pnpm script and call `astro build` directly.

## Monitoring Setup

### 1. Uptime Monitoring (Essential)

The starter is `output: "static"` with no SSR adapter, so there is no `/api/health` endpoint to poll —
and it does not need one. Point an external uptime monitor (UptimeRobot, Better Stack, Cloudflare
Health Checks, or a cron in your own infrastructure) at real page URLs and treat a non-200 as an alert:

```bash
# Manual smoke check after a deploy (replace the origin; keep the trailing slashes —
# trailingSlash: "always" means /about redirects, /about/ is the canonical 200).
for path in / /about/ /blog/ /projects/ /contact/ /sitemap-index.xml; do
  curl -fsS -o /dev/null -w "%{http_code} %{time_total}s  ${path}\n" "https://your-domain.com${path}" \
    || echo "FAIL ${path}"
done
```

Monitor `/sitemap-index.xml` alongside the homepage — a build that ran but shipped a wrong `SITE_URL`
still serves a 200 on `/`, but the sitemap will point at the wrong origin, which this check surfaces
when you also assert on the body.

### 2. Error Tracking (Recommended)

> Not part of the starter — install it (`pnpm add @sentry/browser`) if you adopt this example.

Client-side error tracking is the one monitoring layer that meaningfully changes the shipped bundle:
the Sentry browser SDK is large enough to trip the raw JS budgets (`budgets.json`: ≤ 64KB per file,
≤ 160KB total in `_astro`, enforced by `pnpm perf:budgets` in CI). Load it in its own `<script>` so it
lands in a separate chunk, keep tracing off unless you need it, and re-run `pnpm perf:budgets` before
merging. You must also add the ingest origin to `connect-src` in `public/_headers`.

```astro
---
// src/components/atoms/ErrorTracking.astro (not shipped — add to BaseLayout <head> if adopted)
// Renders nothing unless PUBLIC_SENTRY_DSN is set; declare it in env.schema (ADR-050).
import { PUBLIC_SENTRY_DSN } from "astro:env/client";
---

{PUBLIC_SENTRY_DSN && import.meta.env.PROD && (
  <script>
    import * as Sentry from "@sentry/browser";
    import { PUBLIC_SENTRY_DSN } from "astro:env/client";

    Sentry.init({
      dsn: PUBLIC_SENTRY_DSN,
      environment: "production",
      // Errors only — browserTracingIntegration() adds a second large chunk; opt in deliberately.
      tracesSampleRate: 0,
      beforeSend(event) {
        // Drop noise from network failures and strip anything cookie-shaped.
        if (event.exception?.values?.[0]?.type === "NetworkError") return null;
        if (event.request?.cookies) event.request.cookies = undefined;
        return event;
      },
    });
  </script>
)}
```

For a static site this is the whole integration — there is no server side to instrument. If you later
add an SSR adapter, switch to the `@sentry/astro` integration instead of hand-wiring both halves.

### 3. Analytics (Essential, opt-in)

Analytics is deliberately not wired in: the starter ships zero third-party scripts, and the CSP blocks
any that are added without a matching `script-src` / `connect-src` entry. `.env.example` reserves
`PUBLIC_PLAUSIBLE_DOMAIN` / `PUBLIC_FATHOM_SITE_ID` for when you opt in. The full Plausible and Fathom
recipes are in [Optional Analytics](/implementation-guides/reference/optional-analytics/); this is the
Plausible version placed in the atomic layout ([ADR-003](/adr/003-unified-component-structure/)) and
extended with Core Web Vitals events.

> Not part of the starter — install it (`pnpm add web-vitals`) if you adopt this example.

```astro
---
// src/components/atoms/Analytics.astro (not shipped — add to BaseLayout <head> if adopted)
// Declare PUBLIC_PLAUSIBLE_DOMAIN in astro.config.mjs env.schema (ADR-050):
//   PUBLIC_PLAUSIBLE_DOMAIN: envField.string({ context: "client", access: "public", optional: true })
import { PUBLIC_PLAUSIBLE_DOMAIN } from "astro:env/client";
---

{PUBLIC_PLAUSIBLE_DOMAIN && import.meta.env.PROD && (
  <>
    <!-- Plausible: cookie-free, ~1KB. CSP: add https://plausible.io to script-src AND connect-src. -->
    <script defer data-domain={PUBLIC_PLAUSIBLE_DOMAIN} src="https://plausible.io/js/script.js"></script>

    <!-- Core Web Vitals as custom events (LCP < 2.5s, INP ≤ 200ms, CLS < 0.1 are the targets) -->
    <script>
      import { onCLS, onINP, onLCP, type Metric } from "web-vitals";

      declare global {
        interface Window {
          plausible?: (event: string, options?: { props: Record<string, string | number> }) => void;
        }
      }

      function sendToAnalytics(metric: Metric) {
        window.plausible?.("Web Vitals", {
          props: { metric: metric.name, value: Math.round(metric.value) },
        });
      }

      onCLS(sendToAnalytics);
      onINP(sendToAnalytics);
      onLCP(sendToAnalytics);
    </script>
  </>
)}
```

Google Tag Manager is intentionally absent from this example: it is the single largest avoidable hit to
the JS budget and to the privacy-first positioning the starter documents. If a client requires it, load
it the same way (own `<script is:inline>`, CSP entries for `googletagmanager.com`) and re-run
`pnpm perf:budgets` and `pnpm perf:lhci` to see the cost before committing to it.

### 4. Performance Monitoring (Advanced)

**Lab monitoring is already shipped** — use it before reaching for RUM:

| Command | What it does |
| --- | --- |
| `pnpm perf:lhci` | `lhci autorun` against `lighthouserc.json` — the same floors CI gates PRs on (`lighthouse.yml` runs desktop *and* `lighthouserc.mobile.json`): performance ≥ 0.90, accessibility ≥ 0.95, best-practices ≥ 0.95, SEO ≥ 0.90. The **95+** figure is the measured headline, not the gate. |
| `pnpm perf:baseline` | `scripts/src/baseline-performance.ts` — runs Lighthouse for one URL (`--url=`, `--device=desktop\|mobile`, `--out=`) and writes `performance-baseline.json` for before/after comparisons. |
| `pnpm perf:budgets` | `scripts/src/track-performance-budgets.ts` — enforces `budgets.json` raw-size budgets (with `budget-overrides.json`) on `dist/`; runs in `ci.yml`. |
| `pnpm bundle:analyze` | Builds, then `scripts/src/analyze-bundle.ts` reports what is in `_astro`. |
| `pnpm perf:lighthouse` | One-off HTML Lighthouse report against `localhost:4321` (run `pnpm preview` first). |

Budgets and how to relax them are documented in
[Budgets & Guardrails](/implementation-guides/reference/budgets-guardrails/).

**Real-user monitoring (RUM)** is what lab tools cannot give you: field LCP/INP/CLS across real devices
and networks. There is no `/api/rum` in a static site, so the beacon has to go to an external collector
(Plausible/Fathom custom events as in the Analytics example, or your own Worker/endpoint). Keep it
tiny — this runs on every page view.

> Not part of the starter — install it (`pnpm add web-vitals`) if you adopt this example.

```astro
---
// src/components/atoms/Rum.astro (not shipped — Advanced; add to BaseLayout <head> if adopted)
// Declare PUBLIC_RUM_ENDPOINT in env.schema (ADR-050) and add its origin to connect-src in public/_headers.
import { PUBLIC_RUM_ENDPOINT } from "astro:env/client";
---

{PUBLIC_RUM_ENDPOINT && import.meta.env.PROD && (
  <script>
    import { onCLS, onINP, onLCP, onTTFB, type Metric } from "web-vitals";
    import { PUBLIC_RUM_ENDPOINT } from "astro:env/client";

    const queue: Array<Record<string, unknown>> = [];

    function enqueue(metric: Metric) {
      queue.push({
        name: metric.name,
        value: Math.round(metric.value),
        rating: metric.rating,
        id: metric.id,
        url: location.pathname,
        connection: (navigator as Navigator & { connection?: { effectiveType?: string } }).connection?.effectiveType,
      });
    }

    function flush() {
      if (queue.length === 0) return;
      // sendBeacon survives page unload; the body is one JSON array per page view.
      navigator.sendBeacon(PUBLIC_RUM_ENDPOINT, JSON.stringify(queue.splice(0)));
    }

    onCLS(enqueue);
    onINP(enqueue);
    onLCP(enqueue);
    onTTFB(enqueue);

    // visibilitychange fires reliably on mobile where beforeunload does not.
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flush();
    });
  </script>
)}
```

`web-vitals` reports each metric once, at the moment it is final, so the queue is a handful of entries
per page view — no batching threshold is needed. Long-task observation (`PerformanceObserver` with
`entryTypes: ["longtask"]`) is what INP already summarises; add it only when you are debugging a specific
INP regression.

## Backup & Recovery

### 1. Source of Truth Is Git (Essential)

The starter has **no database**: every page, post, project and design token is a file under `src/`,
`tokens/` and `docs/`, and the deployed site is a pure function of one commit plus `SITE_URL`. That
makes backup and recovery mostly a git discipline:

- **Backup** = the repository on GitHub (plus any second remote you mirror to). Tag releases; the shipped
  `release.yml` publishes a GitHub Release for every `v*` tag from the matching `CHANGELOG.md` section.
- **Recovery** = redeploy a known-good commit. On GitHub Pages, `git revert` the bad commit and push
  (deploy.yml redeploys), or re-run the "Deploy to GitHub Pages" workflow via `workflow_dispatch` from
  the tag/branch you want. Cloudflare Pages and Netlify keep every previous deploy and let you roll back
  from the dashboard in one click.
- **Uploaded assets** (`src/assets/`, `public/`) are committed, so they are covered by the same
  mechanism — there is no separate media store to back up.

Phase-by-phase rollback procedures are in the
[Rollback Strategies guide](/implementation-guides/guides/rollback-strategies-guide/).

### 2. Scheduled Repository Archive (optional — not shipped)

If policy requires an off-GitHub copy, a `git bundle` is the right artefact: it carries the full history
and restores with a plain `git clone backup.bundle`. Nothing in the shipped CI does this, and for most
clones a second remote is simpler.

```yaml
# .github/workflows/backup.yml (not shipped — optional, add only if you need an off-GitHub copy)
name: Repository Backup

on:
  schedule:
    - cron: '0 2 * * 0' # Weekly, Sunday 02:00 UTC
  workflow_dispatch:

permissions:
  contents: read

jobs:
  backup:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - name: Checkout (full history)
        uses: actions/checkout@v7
        with:
          fetch-depth: 0

      - name: Create git bundle
        run: git bundle create "repo-$(date -u +%Y%m%d).bundle" --all

      - name: Upload bundle
        uses: actions/upload-artifact@v7
        with:
          name: repo-backup-${{ github.run_id }}
          path: '*.bundle'
          retention-days: 90
```

To push the bundle to external storage (S3, R2, a NAS), add one step after the upload that uses the
provider's CLI with credentials from repository secrets — there is no starter-specific requirement here.

### 3. Database Backup

Not applicable: the starter ships no database or CMS. If you add one later (a headless CMS, D1, a
comments service), back it up with that system's own tooling and treat its export as a separate
artefact from the git bundle above.
