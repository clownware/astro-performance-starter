---
title: Phase 12 - Code Examples  
lastUpdated: true
description: >-
  Code examples for Phase 12
tableOfContents: true
pagefind: true
---

Companion examples for [Phase 12 - Post-Launch](/implementation-guides/active-phases/phase-12-post-launch/) (Polish tier). Almost everything in this phase is operational rather than shipped code: the starter gives you the measurement tooling (`pnpm perf:baseline`, `pnpm perf:lhci`, the CI gates) and a contact form; the dashboards, feedback widget, A/B harness and reporting scripts below are things you add. Every example that is not part of the starter says so in its leading comment.

Scope labels follow [ADR-033](/adr/033-track-consolidation/): Essential / Recommended / Advanced.

## Monitoring Setup

### 1. Performance Baseline (Recommended)

The starter already ships the Lighthouse tooling this step needs — do not add a second runner.

- `pnpm perf:baseline` runs `scripts/src/baseline-performance.ts`: it spawns the Lighthouse CLI (a devDependency) against a URL and writes a JSON baseline you can diff later. Flags: `--url=` (default `http://localhost:4321`), `--device=desktop|mobile` (default desktop), `--out=` (default `performance-baseline.json` in the repo root).
- `pnpm perf:lhci` runs `lhci autorun` with `lighthouserc.json` (desktop). The floors it asserts — performance >= 0.90, accessibility >= 0.95, best-practices >= 0.95, SEO >= 0.90 — are the same ones `.github/workflows/lighthouse.yml` gates on every PR, for desktop *and* mobile (`lighthouserc.mobile.json`). The 95+ figure quoted in the phase guide is the measured headline, not the gate.

Record a post-launch baseline against the deployed site for both form factors:

```bash
# Run against production once the DNS/CDN has settled, then commit the files
pnpm perf:baseline --url=https://your-domain.com/ --device=desktop --out=perf/baseline-desktop.json
pnpm perf:baseline --url=https://your-domain.com/ --device=mobile  --out=perf/baseline-mobile.json
```

The output is deliberately small so it can live in git:

```json
{
  "generatedAt": "2026-09-02T09:00:00.000Z",
  "url": "https://your-domain.com/",
  "device": "mobile",
  "scores": {
    "performance": 0.98,
    "accessibility": 1,
    "best-practices": 1,
    "seo": 1
  }
}
```

To turn baselines into a trend, append each run to a history file and fail when a category drops below the CI floor. This script is not shipped with the starter; it only uses Node built-ins.

```typescript
// scripts/src/perf-trend.ts (not shipped — you add this in Phase 12)
// Appends a perf:baseline result to perf/history.json and compares it with the
// previous entry for the same device. Run after pnpm perf:baseline:
//   pnpm exec tsx scripts/src/perf-trend.ts --in=perf/baseline-mobile.json
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

interface Baseline {
  generatedAt: string;
  url: string;
  device: "desktop" | "mobile";
  scores: Record<string, number>;
}

// Mirrors lighthouserc.json / lighthouserc.mobile.json — keep in sync
const floors: Record<string, number> = {
  performance: 0.9,
  accessibility: 0.95,
  "best-practices": 0.95,
  seo: 0.9,
};

const inArg = process.argv.find((a) => a.startsWith("--in="));
const inputPath = resolve(inArg ? inArg.split("=")[1] : "performance-baseline.json");
const historyPath = resolve("perf/history.json");

const current = JSON.parse(readFileSync(inputPath, "utf8")) as Baseline;
const history: Baseline[] = existsSync(historyPath)
  ? JSON.parse(readFileSync(historyPath, "utf8"))
  : [];

const previous = [...history].reverse().find((b) => b.device === current.device);

let hasRegression = false;
for (const [category, score] of Object.entries(current.scores)) {
  const delta = previous ? score - (previous.scores[category] ?? score) : 0;
  const belowFloor = score < (floors[category] ?? 0);
  hasRegression ||= belowFloor;
  console.log(
    `${current.device.padEnd(8)} ${category.padEnd(15)} ${score.toFixed(2)}` +
      `  Δ ${delta >= 0 ? "+" : ""}${delta.toFixed(2)}${belowFloor ? "  BELOW FLOOR" : ""}`,
  );
}

history.push(current);
mkdirSync(dirname(historyPath), { recursive: true });
writeFileSync(historyPath, JSON.stringify(history, null, 2));

if (hasRegression) {
  process.exit(1);
}
```

Real-user Core Web Vitals (field data, not lab) are covered by the Chrome UX Report inside Search Console and PageSpeed Insights once the site has enough traffic — that is the Essential path. Building your own field-data pipeline is the Advanced option below.

### 2. Performance Dashboard (Advanced)

If you want your own Core Web Vitals warehouse, the shape is: a small beacon on the page, a table in Postgres, and a Grafana dashboard reading a summary view. The starter ships none of this (it has no server-side code — output is static), so the beacon needs an ingestion endpoint you host elsewhere (a Cloudflare Worker or Supabase Edge Function is enough).

> Not part of the starter — install it (`pnpm add web-vitals`) if you adopt this example.

```typescript
// src/utils/vitals-beacon.ts (not shipped — you add this in Phase 12)
// Import once from BaseLayout in a <script> tag; sends each metric as a beacon.
import { PUBLIC_VITALS_ENDPOINT as endpoint } from "astro:env/client";
import { onCLS, onINP, onLCP } from "web-vitals";

function send(metric: { name: string; value: number; rating: string }) {
  if (!endpoint) return;
  const body = JSON.stringify({
    metric: metric.name,
    value: metric.value,
    rating: metric.rating,
    page: window.location.pathname,
    connectionType: (navigator as { connection?: { effectiveType?: string } }).connection
      ?.effectiveType,
  });
  navigator.sendBeacon(endpoint, body);
}

onCLS(send);
onINP(send);
onLCP(send);
```

`PUBLIC_VITALS_ENDPOINT` is not in the starter's env schema — register it in `astro.config.mjs` under `env.schema` as an optional client string (ADR-050) before importing it, and add the endpoint's origin to `connect-src` in `public/_headers` if you ship the CSP (ADR-051).

The storage side is plain Postgres; run it in the Supabase SQL editor or with `psql`. (`INP` replaced FID as a Core Web Vital — do not carry FID thresholds forward.)

```sql
-- perf/web_vitals.sql (not shipped)
CREATE TABLE IF NOT EXISTS web_vitals (
  id BIGSERIAL PRIMARY KEY,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metric VARCHAR(10) NOT NULL,
  value NUMERIC NOT NULL,
  rating VARCHAR(20),
  page VARCHAR(255) NOT NULL,
  connection_type VARCHAR(20)
);

CREATE INDEX IF NOT EXISTS idx_web_vitals_received_at ON web_vitals (received_at);
CREATE INDEX IF NOT EXISTS idx_web_vitals_metric_page ON web_vitals (metric, page);

CREATE OR REPLACE VIEW performance_summary AS
SELECT
  DATE_TRUNC('hour', received_at) AS hour,
  metric,
  page,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY value) AS p75,
  PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY value) AS p90,
  COUNT(*) AS sample_count
FROM web_vitals
WHERE received_at > NOW() - INTERVAL '7 days'
GROUP BY hour, metric, page;

-- Share of samples inside the "good" CWV thresholds over the last 24h
CREATE OR REPLACE VIEW cwv_pass_rate AS
SELECT
  AVG(CASE
    WHEN metric = 'LCP' AND value < 2500 THEN 1
    WHEN metric = 'INP' AND value <= 200 THEN 1
    WHEN metric = 'CLS' AND value < 0.1 THEN 1
    ELSE 0
  END) * 100 AS pass_rate
FROM web_vitals
WHERE received_at > NOW() - INTERVAL '24 hours';
```

Provisioning the Grafana dashboard is a one-off script; it needs nothing beyond `fetch`.

```typescript
// scripts/src/create-dashboard.ts (not shipped — you add this in Phase 12)
// Pushes a Grafana dashboard that reads the views above.
//   GRAFANA_URL=https://grafana.your-domain.com GRAFANA_API_KEY=... \
//     pnpm exec tsx scripts/src/create-dashboard.ts
const grafanaUrl = process.env.GRAFANA_URL;
const apiKey = process.env.GRAFANA_API_KEY;

if (!grafanaUrl || !apiKey) {
  console.error("GRAFANA_URL and GRAFANA_API_KEY are required");
  process.exit(1);
}

const dashboard = {
  overwrite: true,
  dashboard: {
    title: "Web Performance Monitoring",
    panels: [
      {
        title: "LCP p75 — homepage",
        type: "timeseries",
        targets: [
          {
            rawSql: `
              SELECT hour AS time, p75 AS "LCP"
              FROM performance_summary
              WHERE metric = 'LCP' AND page = '/'
              ORDER BY hour
            `,
          },
        ],
      },
      {
        title: "CWV pass rate (24h)",
        type: "stat",
        targets: [{ rawSql: "SELECT pass_rate FROM cwv_pass_rate" }],
      },
    ],
  },
};

const response = await fetch(`${grafanaUrl}/api/dashboards/db`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(dashboard),
});

if (!response.ok) {
  console.error(`Grafana responded ${response.status}: ${await response.text()}`);
  process.exit(1);
}
console.log("Dashboard created");
```

### 3. Analytics Reporting (Essential)

The starter ships static output with no adapter, no `Astro.locals`, and no authentication, so an `/admin/analytics` page would be built into `dist/`, listed in `sitemap-index.xml`, and readable by anyone. Do not build in-site admin dashboards on this template. Use your analytics provider's own dashboard — the starter's recipes for Plausible and Fathom are in [Optional Feature: Adding Web Analytics](/implementation-guides/reference/optional-analytics/) — and, when you want numbers in the terminal or in a weekly-review issue, pull them with a local script.

The script below uses Plausible's Stats API (check their docs for the current API version) and prints the four headline numbers plus the top pages from the last 30 days. Only `fetch` is needed.

```typescript
// scripts/src/analytics-report.ts (not shipped — you add this in Phase 12)
//   PLAUSIBLE_SITE_ID=your-domain.com PLAUSIBLE_API_KEY=... \
//     pnpm exec tsx scripts/src/analytics-report.ts
const siteId = process.env.PLAUSIBLE_SITE_ID;
const apiKey = process.env.PLAUSIBLE_API_KEY;
const apiBase = process.env.PLAUSIBLE_API_BASE ?? "https://plausible.io/api/v1/stats";

if (!siteId || !apiKey) {
  console.error("PLAUSIBLE_SITE_ID and PLAUSIBLE_API_KEY are required");
  process.exit(1);
}

async function stats<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${apiBase}/${path}`);
  url.search = new URLSearchParams({ site_id: siteId, period: "30d", ...params }).toString();
  const response = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
  if (!response.ok) {
    throw new Error(`${path} responded ${response.status}`);
  }
  return (await response.json()) as T;
}

interface Aggregate {
  results: Record<string, { value: number }>;
}

interface Breakdown {
  results: { page: string; visitors: number; pageviews: number }[];
}

const aggregate = await stats<Aggregate>("aggregate", {
  metrics: "visitors,pageviews,bounce_rate,visit_duration",
});
const topPages = await stats<Breakdown>("breakdown", {
  property: "event:page",
  metrics: "visitors,pageviews",
  limit: "10",
});

const r = aggregate.results;
console.log(`Visitors       ${r.visitors.value.toLocaleString()}`);
console.log(`Pageviews      ${r.pageviews.value.toLocaleString()}`);
console.log(`Bounce rate    ${r.bounce_rate.value}%`);
console.log(`Visit duration ${Math.round(r.visit_duration.value)}s`);
console.log("\nTop pages");
for (const row of topPages.results) {
  console.log(`  ${row.page.padEnd(40)} ${row.pageviews.toLocaleString().padStart(8)}`);
}
```

If you must render charts in-site (a public "open stats" page, say), keep the charting library confined to that one page and budget for it: `pnpm perf:budgets` enforces JS <= 64KB per file and <= 160KB total in `_astro`, and a charting bundle alone can exceed the per-file limit. Prefer the provider's embeddable shared dashboard instead — it costs zero first-party JavaScript.

## Feedback Systems

### 1. Basic Feedback Form (Essential)

Step 12.06 ("basic feedback form") is already met by the shipped contact form: `src/components/molecules/ContactForm.astro` with `src/components/molecules/ContactFormScript.ts`. It works without JavaScript (native constraint validation, native `POST`), and the script layers on blur validation, a loading state and an inline status region ([ADR-021](/adr/021-contact-form-progressive-enhancement/)). It posts `FormData` to its `action` (default `/contact`) and carries `data-static-form-name="contact"` plus a `bot-field` honeypot, which is the convention static-form hosts such as Netlify Forms and Cloudflare Pages look for. On GitHub Pages there is no form backend — point `action` at a form endpoint you host, and add that origin to both `form-action` (the no-JS native submit) and `connect-src` (the enhanced `fetch`) in the CSP in `public/_headers`, which ships with both set to `'self'` (ADR-051).

```astro
---
// src/pages/feedback.astro (not shipped — the shipped page is src/pages/contact.astro)
import ContactForm from "@/components/molecules/ContactForm.astro";
import Container from "@/components/structural/Container.astro";
import Section from "@/components/structural/Section.astro";
import BaseLayout from "@/layouts/BaseLayout.astro";
---

<BaseLayout title="Feedback" description="Tell us what is working and what is not.">
  <Section ariaLabel="Feedback">
    <Container class="max-w-3xl">
      <h1 class="text-3xl font-bold mb-8">Send feedback</h1>
      <ContactForm action="https://forms.your-domain.com/feedback" />
    </Container>
  </Section>
</BaseLayout>
```

### 2. Feedback Widget Island (Recommended)

A floating "Send feedback" control needs client-side state (open/closed, selected rating, submit status), which is the case [ADR-001](/adr/001-preact-island-usage-policy/) reserves for a Preact island. Put it under `src/components/islands/` next to the shipped `MotionLab.tsx` and `SignalsCounter.tsx`, hydrate with `client:idle`, and post to the same form endpoint the contact form uses. Classes use the design tokens (`bg-surface`, `border-border`, `text-primary-foreground`), so it follows the theme without `dark:` variants.

```tsx
// src/components/islands/FeedbackWidget.tsx (not shipped — you add this in Phase 12)
import { useState } from "preact/hooks";

interface Props {
  endpoint: string;
}

const ratings = [
  { value: 1, label: "Frustrating", glyph: "😞" },
  { value: 2, label: "Okay", glyph: "😐" },
  { value: 3, label: "Good", glyph: "😊" },
  { value: 4, label: "Great", glyph: "😍" },
];

export default function FeedbackWidget({ endpoint }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const body = new FormData(form);
    body.set("rating", String(rating));
    body.set("page", window.location.pathname);

    setStatus("sending");
    try {
      const response = await fetch(endpoint, { method: "POST", body });
      if (!response.ok) throw new Error(String(response.status));
      setStatus("sent");
      form.reset();
      setRating(0);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div class="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3">
      {isOpen && (
        <form
          onSubmit={handleSubmit}
          class="w-80 rounded-lg border border-border bg-surface p-4 shadow-lg"
          aria-label="Send feedback"
        >
          <fieldset class="mb-4">
            <legend class="mb-2 text-sm font-medium text-foreground">How is your experience?</legend>
            <div class="flex gap-2">
              {ratings.map((r) => (
                <button
                  type="button"
                  key={r.value}
                  aria-label={r.label}
                  aria-pressed={rating === r.value}
                  onClick={() => setRating(r.value)}
                  class="rounded p-2 text-2xl hover:bg-background aria-pressed:ring-2 aria-pressed:ring-primary-500"
                >
                  {r.glyph}
                </button>
              ))}
            </div>
          </fieldset>

          <label for="feedback-message" class="mb-2 block text-sm font-medium text-foreground">
            Your feedback (optional)
          </label>
          <textarea
            id="feedback-message"
            name="message"
            rows={3}
            maxlength={2000}
            class="mb-4 w-full rounded-md border border-border bg-background px-3 py-2"
          />

          <div class="flex gap-3">
            <button
              type="submit"
              disabled={status === "sending" || rating === 0}
              class="flex-1 rounded-md bg-primary-600 py-2 text-primary-foreground hover:bg-primary-700 disabled:opacity-50"
            >
              {status === "sending" ? "Sending…" : "Send"}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              class="flex-1 rounded-md border border-border py-2 hover:bg-background"
            >
              Cancel
            </button>
          </div>

          <p role="status" aria-live="polite" class="mt-3 min-h-5 text-sm">
            {status === "sent" && "Thank you for your feedback."}
            {status === "error" && "Could not send — please try again."}
          </p>
        </form>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label="Send feedback"
        class="rounded-full bg-primary-600 p-3 text-primary-foreground shadow-lg hover:bg-primary-700"
      >
        <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>
    </div>
  );
}
```

Mount it once in `src/layouts/BaseLayout.astro` (or only on the pages you want feedback from):

```astro
---
import FeedbackWidget from "@/components/islands/FeedbackWidget.tsx";
---

<FeedbackWidget client:idle endpoint="https://forms.your-domain.com/feedback" />
```

### 3. A/B Testing Framework (Advanced)

Client-side assignment stored in `localStorage`, with goals reported to whatever analytics you installed in Phase 12 (the example calls Plausible's custom-event function; swap the `track` implementation for Fathom or another provider). The module must never run at import time — Astro evaluates imports during the static build where `window` does not exist — so everything is behind functions.

```typescript
// src/utils/ab-testing.ts (not shipped — you add this in Phase 12)
interface Variant {
  id: string;
  weight: number; // weights per experiment must sum to 1
}

interface Experiment {
  id: string;
  name: string;
  variants: Variant[];
  goals: string[];
}

type TrackFn = (event: string, props: Record<string, string | number | undefined>) => void;

const storageKey = "ab-assignments";

const experiments: Record<string, Experiment> = {
  "homepage-cta": {
    id: "homepage-cta",
    name: "Homepage CTA Test",
    variants: [
      { id: "control", weight: 0.5 },
      { id: "variant-a", weight: 0.25 },
      { id: "variant-b", weight: 0.25 },
    ],
    goals: ["click-cta", "signup"],
  },
};

const defaultTrack: TrackFn = (event, props) => {
  const plausible = (window as { plausible?: (e: string, o: { props: unknown }) => void }).plausible;
  plausible?.(event, { props });
};

function loadAssignments(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(storageKey) ?? "{}");
  } catch {
    return {};
  }
}

function saveAssignments(assignments: Record<string, string>) {
  localStorage.setItem(storageKey, JSON.stringify(assignments));
}

export function getVariant(experimentId: string, track: TrackFn = defaultTrack): string {
  if (typeof window === "undefined") return "control";

  const assignments = loadAssignments();
  if (assignments[experimentId]) return assignments[experimentId];

  const experiment = experiments[experimentId];
  if (!experiment) return "control";

  const roll = Math.random();
  let cumulative = 0;
  for (const variant of experiment.variants) {
    cumulative += variant.weight;
    if (roll <= cumulative) {
      assignments[experimentId] = variant.id;
      saveAssignments(assignments);
      track("experiment-assignment", { experiment: experimentId, variant: variant.id });
      return variant.id;
    }
  }
  return "control";
}

export function trackGoal(goal: string, value?: number, track: TrackFn = defaultTrack) {
  if (typeof window === "undefined") return;

  const assignments = loadAssignments();
  for (const experiment of Object.values(experiments)) {
    const variant = assignments[experiment.id];
    if (variant && experiment.goals.includes(goal)) {
      track("experiment-goal", { experiment: experiment.id, variant, goal, value });
    }
  }
}
```

Use it from a page-level `<script>` — never from component frontmatter, which runs at build time:

```astro
<script>
  import { getVariant, trackGoal } from "@/utils/ab-testing";

  const variant = getVariant("homepage-cta");
  document.querySelector<HTMLElement>("[data-cta]")?.setAttribute("data-variant", variant);
  document.querySelector("[data-cta]")?.addEventListener("click", () => trackGoal("click-cta"));
</script>
```

Because assignment happens after hydration, render the control variant in HTML and only vary copy or styling that can switch without a layout shift, or CLS will pay for the experiment. Server-side assignment is not available on static output.

## Growth & Optimization

### 1. SEO Monitoring (Advanced)

Pulls the last 28 days of Search Console data and writes a JSON report with the top queries and the pages that earn impressions but not clicks (the usual title/description rewrite candidates). Persisting history in a database is optional — a dated file under `reports/` in git is enough for a monthly review.

> Not part of the starter — install it (`pnpm add -D googleapis`) if you adopt this example.

```typescript
// scripts/src/seo-monitor.ts (not shipped — you add this in Phase 12)
//   SITE_URL=https://your-domain.com GOOGLE_APPLICATION_CREDENTIALS=./service-account.json \
//     pnpm exec tsx scripts/src/seo-monitor.ts
// The service account must be added as a user of the Search Console property.
// Keep service-account.json out of git (add it to .gitignore; Gitleaks in ci.yml
// will flag it if it lands in a commit).
import { mkdirSync, writeFileSync } from "node:fs";
import { google } from "googleapis";

const siteUrl = process.env.SITE_URL;
if (!siteUrl) {
  console.error("SITE_URL is required (the Search Console property URL)");
  process.exit(1);
}

const auth = new google.auth.GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
});
const searchConsole = google.searchconsole({ version: "v1", auth });

const toIsoDate = (d: Date) => d.toISOString().slice(0, 10);
const endDate = new Date();
const startDate = new Date(endDate.getTime() - 28 * 24 * 60 * 60 * 1000);

const { data } = await searchConsole.searchanalytics.query({
  siteUrl,
  requestBody: {
    startDate: toIsoDate(startDate),
    endDate: toIsoDate(endDate),
    dimensions: ["query", "page"],
    rowLimit: 1000,
  },
});

interface Row {
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

const rows: Row[] = (data.rows ?? []).map((row) => ({
  query: row.keys?.[0] ?? "",
  page: row.keys?.[1] ?? "",
  clicks: row.clicks ?? 0,
  impressions: row.impressions ?? 0,
  ctr: row.ctr ?? 0,
  position: row.position ?? 0,
}));

const clicksByQuery = new Map<string, number>();
for (const row of rows) {
  clicksByQuery.set(row.query, (clicksByQuery.get(row.query) ?? 0) + row.clicks);
}

const report = {
  generatedAt: new Date().toISOString(),
  range: { startDate: toIsoDate(startDate), endDate: toIsoDate(endDate) },
  topQueries: [...clicksByQuery.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([query, clicks]) => ({ query, clicks })),
  // High impressions, low CTR: rewrite the title/description first
  optimizationTargets: rows
    .filter((row) => row.impressions > 100 && row.ctr < 0.02)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 20),
};

mkdirSync("reports", { recursive: true });
const outPath = `reports/seo-${toIsoDate(endDate)}.json`;
writeFileSync(outPath, JSON.stringify(report, null, 2));
console.log(`Wrote ${outPath}: ${rows.length} rows, ${report.optimizationTargets.length} optimisation targets`);
```

### 2. Content Performance Tracking (Recommended)

Joins the blog collection with pageview data so the weekly review can see which posts earn traffic. Blog posts are the `blog` content collection — one directory per post, `src/content/blog/<slug>/<slug>.mdx` next to its hero image — and publish at `/blog/<slug>/`, the entry `id` `src/pages/blog/[slug].astro` uses as the route param. The script reads frontmatter with `gray-matter` and `glob`, both already devDependencies, and reuses the Plausible breakdown call from the analytics report above — no admin page, no chart library.

```typescript
// scripts/src/content-report.ts (not shipped — you add this in Phase 12)
//   PLAUSIBLE_SITE_ID=your-domain.com PLAUSIBLE_API_KEY=... \
//     pnpm exec tsx scripts/src/content-report.ts
import { readFileSync } from "node:fs";
import { basename, dirname } from "node:path";
import { glob } from "glob";
import matter from "gray-matter";

const siteId = process.env.PLAUSIBLE_SITE_ID;
const apiKey = process.env.PLAUSIBLE_API_KEY;
const apiBase = process.env.PLAUSIBLE_API_BASE ?? "https://plausible.io/api/v1/stats";

if (!siteId || !apiKey) {
  console.error("PLAUSIBLE_SITE_ID and PLAUSIBLE_API_KEY are required");
  process.exit(1);
}

interface PostRow {
  slug: string;
  title: string;
  date: string;
  pageviews: number;
  visitors: number;
}

// Frontmatter title/date come from the blog collection schema (src/content.config.ts)
const entries = await glob("src/content/blog/*/[^_]*.{md,mdx}");
const posts = new Map<string, PostRow>();
for (const file of entries) {
  const { data } = matter(readFileSync(file, "utf8"));
  if (data.draft) continue;
  const slug = basename(dirname(file));
  posts.set(`/blog/${slug}/`, {
    slug,
    title: String(data.title),
    date: new Date(data.date).toISOString().slice(0, 10),
    pageviews: 0,
    visitors: 0,
  });
}

const url = new URL(`${apiBase}/breakdown`);
url.search = new URLSearchParams({
  site_id: siteId,
  period: "30d",
  property: "event:page",
  metrics: "visitors,pageviews",
  limit: "500",
}).toString();
const response = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
if (!response.ok) {
  console.error(`Plausible responded ${response.status}`);
  process.exit(1);
}
const { results } = (await response.json()) as {
  results: { page: string; visitors: number; pageviews: number }[];
};

for (const row of results) {
  const post = posts.get(row.page);
  if (post) {
    post.pageviews = row.pageviews;
    post.visitors = row.visitors;
  }
}

const ranked = [...posts.values()].sort((a, b) => b.pageviews - a.pageviews);
console.log("Post".padEnd(48) + "Published".padEnd(12) + "Views".padStart(8) + "Visitors".padStart(10));
for (const post of ranked) {
  console.log(
    post.title.slice(0, 46).padEnd(48) +
      post.date.padEnd(12) +
      post.pageviews.toLocaleString().padStart(8) +
      post.visitors.toLocaleString().padStart(10),
  );
}

const unread = ranked.filter((post) => post.pageviews === 0);
if (unread.length > 0) {
  console.log(`\n${unread.length} post(s) with no views in 30 days — candidates for internal links or a refresh.`);
}
```

If you flatten the collection to `src/content/blog/<slug>.md`, derive the slug from the file name instead of the directory.

## Maintenance Schedule

### What the shipped workflows already cover

Before adding a maintenance workflow, look at `.github/workflows/` — most of the "daily tasks" lists you will find online are already run on every push and PR here, and duplicating them costs CI minutes for no new signal.

| Workflow | Trigger | Covers |
|----------|---------|--------|
| `ci.yml` | push and PR to `master` | `quality:ci`, `pnpm enforce`, coverage, `budgets:validate`, `design:validate`, build, JS bundle-size gate, `perf:budgets`, `images:gate`, `fonts:gate`, Playwright e2e, `audit:ci`, Trivy, Semgrep, Gitleaks |
| `lighthouse.yml` | PR to `master` | `lhci autorun` desktop and mobile against the floors in `lighthouserc*.json`, reports uploaded as artifacts |
| `link-check.yml` | weekly (Mondays 06:00 UTC) and PRs touching `docs/**` | external-link rot in `docs/` (internal links are a build-time gate, ADR-005) |
| `mutation.yml` | weekly (Mondays 07:00 UTC) | Stryker mutation run; files a tracking issue when a scheduled run fails |
| `versions-sync.yml` | Dependabot PRs touching `package.json` | keeps `versions.json` in step with dependency bumps (ADR-061) |
| `deploy.yml` | push to `master` | GitHub Pages deploy |

Step 12.12 (security scanning) is therefore done on every push; step 12.11 (performance baseline) is gated on every PR. The weekly review template in the phase guide is the human half of that loop.

### Production Health Check (Recommended)

What the repo workflows cannot see is the *deployed* site: whether it is up, whether the certificate is about to lapse, and whether the live Lighthouse score (CDN, real DNS, third-party scripts you added in Phase 12) still clears the floor. That is the only job worth scheduling. This workflow is not shipped with the starter.

```yaml
# .github/workflows/site-health.yml (not shipped — you add this in Phase 12)
# Checks the deployed site, not the repo: ci.yml and lighthouse.yml already
# gate quality, security scanning and Lighthouse on every push/PR.
name: Site Health

on:
  schedule:
    - cron: '0 9 * * *' # 09:00 UTC daily
  workflow_dispatch:

permissions:
  contents: read

env:
  # Same repository variable deploy.yml reads for custom Pages domains
  SITE_URL: ${{ vars.SITE_URL }}

jobs:
  health:
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Site responds
        run: |
          # Static output has no /api/health — request a real page.
          status=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/")
          if [ "$status" != "200" ]; then
            echo "Site health check failed with status $status"
            exit 1
          fi

      - name: Certificate not expiring within 30 days
        run: |
          host=$(echo "$SITE_URL" | sed -E 's#https?://##; s#/.*##')
          expiry=$(echo | openssl s_client -servername "$host" -connect "$host:443" 2>/dev/null \
            | openssl x509 -noout -enddate | cut -d= -f2)
          days_left=$(( ($(date -d "$expiry" +%s) - $(date +%s)) / 86400 ))
          echo "Certificate expires in $days_left days"
          if [ "$days_left" -lt 30 ]; then
            exit 1
          fi

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

      - name: Live Lighthouse (mobile) clears the CI floor
        run: |
          pnpm perf:baseline --url="$SITE_URL/" --device=mobile --out=live-baseline.json
          score=$(jq '.scores.performance' live-baseline.json)
          echo "Live mobile performance score: $score"
          # 0.90 is the enforced floor (lighthouserc.mobile.json); 95+ is the headline, not the gate
          if (( $(echo "$score < 0.90" | bc -l) )); then
            echo "Live performance score dropped below the floor"
            exit 1
          fi

      - name: Upload live baseline
        if: always()
        uses: actions/upload-artifact@v7
        with:
          name: live-baseline
          path: live-baseline.json
          retention-days: 30
```

The Lighthouse step reuses `pnpm perf:baseline` rather than a second `npx lighthouse` invocation, so the local baseline files and the scheduled run produce the same JSON shape and can be diffed with the `perf-trend.ts` script above. Set the `SITE_URL` repository variable (Settings → Variables) once; `deploy.yml` reads the same one.

### Weekly and Quarterly

Everything else on the maintenance list is a human routine, not automation: the weekly review template and the quarterly review plan live in [Phase 12 - Post-Launch](/implementation-guides/active-phases/phase-12-post-launch/). Feed it with `pnpm exec tsx scripts/src/analytics-report.ts` and `scripts/src/content-report.ts` output, the latest `reports/seo-*.json`, and the Dependabot queue.
