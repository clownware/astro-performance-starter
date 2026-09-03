---
title: Phase 8 - Code Examples
lastUpdated: true
description: >-
  Code examples for Phase 8
tableOfContents: true
pagefind: true
---

## Code Examples

Companion to [Phase 8 - Quality Assurance](/implementation-guides/active-phases/phase-8-qa/). Section 1 (the manual test checklist) lives in that guide, which is why the numbering here starts at 2. Blocks marked *condensed* are trimmed copies of the starter's real files; blocks whose leading comment says *not shipped* are examples for your own project and do not exist in the starter.

Where the tests live (verified against `playwright.config.ts` and `vitest.config.ts`):

- **E2E:** `e2e/` at the repo root (`testDir: "./e2e"`, `baseURL: http://localhost:4321`, projects `chromium` / `firefox` / `webkit`, `webServer` runs `pnpm run preview`). The starter ships `a11y-axe.spec.ts`, `about.spec.ts`, `blog.spec.ts`, `contact.spec.ts`, `docs-adr.spec.ts`, `header.spec.ts`, `how-it-works.spec.ts`, `index.spec.ts`, `showcase.spec.ts` and `theme.spec.ts`. Put new specs in `e2e/` — never `tests/e2e/` — so Playwright picks them up.
- **Unit / component:** colocated `__tests__/` directories under `src/` (vitest + jsdom; `.astro` components render through the Container API helper at `src/components/__tests__/_helpers/container.ts`, ADR-040). Shared fixtures live in `tests/fixtures/`.
- **Scripts:** `pnpm test:e2e`, `pnpm test:e2e:ui`, `pnpm test:a11y` (everything tagged `@a11y`), `pnpm test:unit`, `pnpm test:coverage`, `pnpm test:mutate`.

House rules for every example below come from [ADR-037](/adr/037-testing-philosophy/) and [Testing Conventions](/development/testing-conventions/): Arrange / Act / Assert, one logical assertion per test, no conditional assertions, names describe behaviour. The tiers and scope labels follow [ADR-033](/adr/033-track-consolidation/) (Essential / Recommended / Advanced).

## 2. Automated E2E Tests (Recommended)

The shipped `e2e/header.spec.ts` pins the mobile menu's solid panel and `e2e/contact.spec.ts` covers the contact page's structure, labels and external-link attributes. The two specs below extend them with the navigation flow and the form's validation behaviour. Selectors are the real ones from `src/components/structural/Header.astro`, `src/content/navigation/header.json` and `src/components/molecules/ContactForm.astro`.

```typescript
// e2e/navigation.spec.ts (not shipped — extends the shipped e2e/header.spec.ts)
import { expect, test } from "@playwright/test";

// Labels come from src/content/navigation/header.json. The external GitHub item
// renders as an icon link outside <nav aria-label="Main navigation">, so it is
// not part of this list.
const NAV_ITEMS = ["Home", "How It Works", "Design System", "Blog", "Projects", "About", "Contact"];

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("desktop nav lists every header.json item", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    await expect(nav).toBeVisible();

    for (const label of NAV_ITEMS) {
      await expect(nav.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
  });

  test("desktop nav link navigates to the target page", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Main navigation" });

    await nav.getByRole("link", { name: "Projects", exact: true }).click();

    // Astro's default build.format is "directory", so routes end with a slash.
    await expect(page).toHaveURL("/projects/");
  });

  test("keyboard tab order starts at the skip link, then the logo, then the nav", async ({ page }) => {
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Homepage" })).toBeFocused();

    await page.keyboard.press("Tab");
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    await expect(nav.getByRole("link", { name: "Home", exact: true })).toBeFocused();
  });

  test.describe("mobile", () => {
    // Same viewport the shipped header.spec.ts uses.
    test.use({ viewport: { width: 390, height: 844 } });

    test("mobile menu opens, reports aria-expanded, and navigates", async ({ page }) => {
      // The desktop nav is `hidden lg:flex`, so it is absent below the lg breakpoint.
      await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeHidden();

      // CSS-only toggle: a <label role="button"> wired to a hidden checkbox.
      const menuButton = page.locator("[data-mobile-menu-button]");
      await expect(menuButton).toHaveAttribute("aria-expanded", "false");
      await menuButton.click();

      const mobileMenu = page.locator("#mobile-menu");
      await expect(mobileMenu).toBeVisible();
      await expect(menuButton).toHaveAttribute("aria-expanded", "true");

      await mobileMenu.getByRole("link", { name: "About", exact: true }).click();
      await expect(page).toHaveURL("/about/");
    });
  });
});
```

```typescript
// e2e/contact-form.spec.ts (not shipped — extends the shipped e2e/contact.spec.ts)
import { expect, test } from "@playwright/test";

// ContactForm.astro posts to `action` (the contact page passes withBase("/contact")).
// The starter is static and ships no handler (ADR-021), so every submit test
// must stub the endpoint — otherwise the fetch fails and the error branch runs.
const FORM_ACTION = "**/contact";

test.describe("Contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact/");
  });

  test("shows a required-field error for every empty required field on submit", async ({ page }) => {
    // ContactFormScript.ts sets `novalidate` once it attaches, so the custom
    // messages (not the browser bubbles) are what appears.
    await page.getByRole("button", { name: "Send Message" }).click();

    // Error slots are `<div id="<field>-error" role="alert">`; the message is
    // "<Label> is required" (ContactFormScript.ts, validateField).
    await expect(page.locator("#name-error")).toHaveText("Name is required");
    await expect(page.locator("#email-error")).toHaveText("Email is required");
    await expect(page.locator("#message-error")).toHaveText("Message is required");
  });

  test("moves focus to the first invalid field on submit", async ({ page }) => {
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.locator("#contact-name")).toBeFocused();
  });

  test("rejects a malformed email on blur", async ({ page }) => {
    await page.locator("#contact-email").fill("not-an-email");
    await page.locator("#contact-email").blur();

    await expect(page.locator("#email-error")).toHaveText("Please enter a valid email address");
  });

  test("enforces the message minimum length", async ({ page }) => {
    // <textarea name="message" minlength="10">
    await page.locator("#contact-message").fill("too short");
    await page.locator("#contact-message").blur();

    await expect(page.locator("#message-error")).toHaveText("Minimum 10 characters required");
  });

  test("posts the form data to the action endpoint and resets the form", async ({ page }) => {
    let postedBody: string | null = null;
    await page.route(FORM_ACTION, async (route) => {
      if (route.request().method() !== "POST") return route.fallback();
      postedBody = route.request().postData();
      await route.fulfill({ status: 200, body: "ok" });
    });

    await page.locator("#contact-name").fill("Test User");
    await page.locator("#contact-email").fill("test@example.com");
    await page.locator("#contact-message").fill("This is a long enough test message.");
    await page.getByRole("button", { name: "Send Message" }).click();

    // The enhanced handler calls form.reset() after a 2xx response. The body is
    // multipart/form-data (fetch + FormData), so the raw value is present.
    await expect(page.locator("#contact-name")).toHaveValue("");
    expect(postedBody).toContain("test@example.com");
  });

  test("ships a honeypot that users and assistive tech cannot reach", async ({ page }) => {
    // <input name="bot-field" tabindex="-1"> inside an aria-hidden, off-screen <p>.
    // Filtering on it is the form handler's job (ADR-021) — the client never blocks.
    const honeypot = page.locator('input[name="bot-field"]');

    await expect(honeypot).toBeAttached();
    await expect(honeypot).toBeHidden();
    await expect(honeypot).toHaveAttribute("tabindex", "-1");
  });
});
```

## 3. Accessibility Testing (Recommended)

The starter already ships the automated sweep — do not add a second `AxeBuilder` spec. `e2e/a11y-axe.spec.ts` runs `@axe-core/playwright` (a devDependency) over every key page with the WCAG 2.1 A/AA rulesets and fails on any *serious* or *critical* violation (ADR-018 / [ADR-019](/adr/019-accessibility-patterns-standards/)). Every test title carries the `@a11y` tag, so `pnpm test:a11y` runs it alongside the hand-written `@a11y` tests in the sibling specs; `pnpm test:e2e` and CI's Chromium run include it too.

```typescript
// e2e/a11y-axe.spec.ts (condensed — the real file, shipped with the starter)
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = ["/", "/about/", "/blog/", "/projects/", "/contact/", "/how-it-works/", "/showcase/"];

test.describe("axe-core accessibility scan", () => {
  for (const path of PAGES) {
    test(`@a11y ${path} has no serious or critical axe violations`, async ({ page }) => {
      // Reduced motion settles ADR-048's scroll-reveal animations, so axe
      // measures the real text colours instead of mid-animation opacity blends.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);

      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      const blocking = results.violations.filter((v) =>
        ["serious", "critical"].includes(v.impact ?? ""),
      );

      expect(
        blocking,
        blocking.map((v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} node(s)`).join("\n"),
      ).toEqual([]);
    });
  }
});
```

**Adding a page to the sweep** is a one-line change to `PAGES` — every new top-level route you build in Phases 6–7 belongs there:

```typescript
// e2e/a11y-axe.spec.ts — extend the shipped list
const PAGES = [
  "/",
  "/about/",
  "/blog/",
  "/projects/",
  "/contact/",
  "/how-it-works/",
  "/showcase/",
  "/services/", // your new page
];
```

axe already covers `image-alt`, `color-contrast`, `label`, `landmark-*`, `heading-order` and the other rule-based checks, so hand-written `@a11y` tests should cover *behaviour* axe cannot see — focus management, keyboard interaction, live regions. Tag the title with `@a11y` so `pnpm test:a11y` picks it up:

```typescript
// e2e/skip-link.spec.ts (not shipped — a hand-written @a11y test in a sibling spec)
import { expect, test } from "@playwright/test";

test.describe("Skip link", () => {
  test("@a11y activating the skip link moves focus to the main landmark", async ({ page }) => {
    await page.goto("/");

    // SkipLink.astro is the first element in <body>; BaseLayout renders
    // <main id="main-content" tabindex="-1"> so it can receive focus.
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });
});
```

For the manual side of the audit (screen-reader pass, zoom, colour-independence) use the [Accessibility Guide](/implementation-guides/guides/accessibility-guide/).

## 4. Visual Regression Testing (Advanced)

Playwright's built-in `toHaveScreenshot()` needs no extra package. Three things keep the snapshots stable on this starter: emulate reduced motion so the CSS-native scroll animations ([ADR-048](/adr/048-css-native-motion-system/)) settle, remember that dark is the *default* theme ([ADR-032](/adr/032-dark-mode-strategy/)) and light is the opt-in, and use `/showcase/` — the living style guide ([ADR-049](/adr/049-showcase-living-style-guide/)) — for component states.

```typescript
// e2e/visual.spec.ts (not shipped)
import { expect, test } from "@playwright/test";

test.describe("Visual regression", () => {
  test.beforeEach(async ({ page }) => {
    // Freeze ADR-048's animation-timeline: view() reveals and hover transitions.
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("homepage — dark (default) theme", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveScreenshot("homepage-dark.png", { fullPage: true, animations: "disabled" });
  });

  test("homepage — light theme", async ({ page }) => {
    // Same mechanism the shipped e2e/theme.spec.ts uses: an explicit stored
    // preference wins over the dark-first default.
    await page.addInitScript(() => localStorage.setItem("theme", "light"));
    await page.goto("/");

    await expect(page).toHaveScreenshot("homepage-light.png", { fullPage: true, animations: "disabled" });
  });

  test("homepage — mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(page).toHaveScreenshot("homepage-mobile.png", { fullPage: true, animations: "disabled" });
  });

  test("showcase button states", async ({ page }) => {
    await page.goto("/showcase/");
    const button = page.getByRole("button").first();

    await expect(button).toHaveScreenshot("button-normal.png");

    await button.hover();
    await expect(button).toHaveScreenshot("button-hover.png");

    await button.focus();
    await expect(button).toHaveScreenshot("button-focus.png");
  });
});
```

Operational notes:

- Baselines are written to `e2e/visual.spec.ts-snapshots/` and are keyed by project *and* platform (`homepage-dark-chromium-linux.png`). Commit them. `playwright-report/` and `test-results/` are already gitignored.
- Generate or refresh baselines with `pnpm exec playwright test e2e/visual.spec.ts --update-snapshots`. CI runs Chromium on Linux, so generate the Linux baselines in CI (or a Linux container) rather than committing macOS renders — font rasterisation differs.
- Hosted services (Percy, Chromatic) add cross-browser review UIs; neither is part of the starter.

## 5. Performance Testing (Essential)

Performance is gated by the starter's own tooling, not by an ad-hoc Playwright spec. Run the same commands CI runs ([ADR-052](/adr/052-script-taxonomy/): every script lives in `scripts/src/` behind a pnpm name):

| Command | What it checks | Source |
|---|---|---|
| `pnpm perf:lhci` | `lhci autorun` against the preview server; asserts the Lighthouse floors | `lighthouserc.json` (desktop) |
| `pnpm exec lhci autorun --config=lighthouserc.mobile.json` | Same floors on Lighthouse's default mobile profile, median of 3 runs | `lighthouserc.mobile.json` |
| `pnpm perf:budgets` | Raw-size budgets over `dist/` (with unexpired `budget-overrides.json` entries applied) | `scripts/src/track-performance-budgets.ts` + `budgets.json` |
| `pnpm perf:baseline` | Records a performance baseline to compare later runs against | `scripts/src/baseline-performance.ts` |
| `pnpm bundle:analyze` | Builds and reports what is in `dist/_astro` | `scripts/src/analyze-bundle.ts` |
| `pnpm perf:lighthouse` | One-off HTML Lighthouse report of a running preview (`lighthouse-report.html`, gitignored) | lighthouse CLI |

The floors both Lighthouse configs assert are **performance ≥ 0.90, accessibility ≥ 0.95, best-practices ≥ 0.95, SEO ≥ 0.90**. The **95+** figure quoted on the homepage is the *measured* headline, not the gate — CI catches drops below the floor and leaves headroom for run variance (ADR-039).

```json
// lighthouserc.json (condensed — the shipped desktop gate; lighthouserc.mobile.json asserts the same floors on the median of 3 runs)
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
        "http://localhost:4321/projects/",
        "http://localhost:4321/about/",
        "http://localhost:4321/contact/",
        "http://localhost:4321/adr/"
      ],
      "numberOfRuns": 1,
      "settings": { "preset": "desktop", "chromeFlags": "--headless=new --no-sandbox" }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

When you add a page, add its URL to the `url` list in **both** `lighthouserc.json` and `lighthouserc.mobile.json` — the lists are duplicated deliberately so the two form factors can diverge in run count without sharing state.

`budgets.json` (raw, uncompressed sizes, enforced by `pnpm perf:budgets`): JavaScript ≤ 64 KB per file and ≤ 160 KB total in `_astro`; fonts ≤ 64 KB per file and ≤ 150 KB total; images ≤ 200 KB per file. CSS has **no enforced budget** — the 50 KB figure in `.claude/stack.md` is advisory and tracked, not gated. Core Web Vitals targets are LCP < 2.5 s, INP ≤ 200 ms, CLS < 0.1; see [Performance Budgets & Quality Guardrails](/implementation-guides/reference/budgets-guardrails/) for the full table.

If you still want a field-style smoke test inside the Playwright run — useful while iterating on a page, but *not* a gate — read the browser's own entries rather than pulling in a Lighthouse wrapper:

```typescript
// e2e/web-vitals.spec.ts (not shipped — lab numbers from a local preview; the CI gate is lighthouse.yml)
import { expect, test } from "@playwright/test";

test.describe("Web Vitals smoke", () => {
  // largest-contentful-paint and layout-shift entries are Chromium-only.
  test.skip(({ browserName }) => browserName !== "chromium", "PerformanceObserver LCP/CLS entries are Chromium-only");

  test("homepage LCP is under the 2.5 s target", async ({ page }) => {
    await page.goto("/");

    const lcp = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            resolve(entries[entries.length - 1].startTime);
          }).observe({ type: "largest-contentful-paint", buffered: true });
        }),
    );

    expect(lcp).toBeLessThan(2500);
  });

  test("homepage CLS is under the 0.1 target", async ({ page }) => {
    await page.goto("/");

    const cls = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let value = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as PerformanceEntry[]) {
              const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
              if (!shift.hadRecentInput) value += shift.value;
            }
          }).observe({ type: "layout-shift", buffered: true });
          // Let late-loading images and fonts settle before reporting.
          setTimeout(() => resolve(value), 3000);
        }),
    );

    expect(cls).toBeLessThan(0.1);
  });
});
```

## 6. Security Testing (Recommended)

The security headers ship in `public/_headers` (CSP per [ADR-051](/adr/051-content-security-policy-strategy/)). Header-capable hosts (Cloudflare Pages, Netlify) apply the file; it is a **no-op on GitHub Pages**, the starter's default deploy target, and `astro preview` does not serve it either. A header assertion therefore has to run against a deployed URL, not the Playwright `webServer`.

```text
# public/_headers (condensed — shipped with the starter)
/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=()
  # 'unsafe-inline' is a deliberate, documented choice — see ADR-051.
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
  Cache-Control: public, max-age=0, must-revalidate

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```

```typescript
// e2e/security-headers.spec.ts (not shipped — run against a deployed origin:
//   SECURITY_HEADERS_URL=https://your-site.pages.dev pnpm exec playwright test e2e/security-headers.spec.ts --project=chromium)
import { expect, test } from "@playwright/test";

const ORIGIN = process.env.SECURITY_HEADERS_URL;

test.describe("Security headers (public/_headers)", () => {
  test.skip(!ORIGIN, "Set SECURITY_HEADERS_URL to a deployed origin that honours public/_headers");

  test("the document response carries the ADR-051 header set", async ({ request }) => {
    const response = await request.get(`${ORIGIN}/`);
    const headers = response.headers();

    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toContain("geolocation=()");
    expect(headers["strict-transport-security"]).toContain("max-age=63072000");

    const csp = headers["content-security-policy"] ?? "";
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("form-action 'self'");
  });

  test("hashed assets are immutable and HTML revalidates", async ({ request }) => {
    const html = await request.get(`${ORIGIN}/`);
    expect(html.headers()["cache-control"]).toBe("public, max-age=0, must-revalidate");

    // Any file under /_astro/ — pull one from the document rather than guessing a hash.
    const assetPath = (await html.text()).match(/\/_astro\/[^"']+\.css/)?.[0];
    expect(assetPath, "expected at least one /_astro/*.css reference in the HTML").toBeTruthy();

    const asset = await request.get(`${ORIGIN}${assetPath}`);
    expect(asset.headers()["cache-control"]).toBe("public, max-age=31536000, immutable");
  });
});
```

Dependency, code and secret scanning are already CI gates ([ADR-046](/adr/046-security-scanning-pipeline/)); run the local half before opening a PR:

```yaml
# .github/workflows/ci.yml (condensed — the shipped security steps)
      - name: Security audit (high severity)
        run: pnpm run audit:ci            # scripts/src/audit-filter.ts

      - name: Trivy SBOM scan
        uses: aquasecurity/trivy-action@v0.36.0
        with:
          scan-type: 'fs'
          format: 'sarif'
          output: 'trivy-results.sarif'

  semgrep:
    container:
      image: semgrep/semgrep
    steps:
      - run: semgrep scan --config p/javascript --config p/typescript --config p/secrets --error

  gitleaks:
    container:
      image: ghcr.io/gitleaks/gitleaks:v8.30.1
    steps:
      - run: gitleaks dir . --config .gitleaks.toml --exit-code 1 --verbose
```

Two checks from older versions of this page were dropped on purpose: a *CSRF token* assertion (the form is static and posts to an external handler — anti-forgery is that handler's responsibility, and the shipped defence is the `bot-field` honeypot, [ADR-021](/adr/021-contact-form-progressive-enhancement/)) and a *"no secrets in the HTML"* grep (Gitleaks and Semgrep's `p/secrets` ruleset scan the repository; the rendered pages legitimately contain `mailto:` addresses and the GitHub URL).

## Testing Utilities

### Shipped fixtures (`tests/fixtures/`)

There is no `tests/utils/` directory and no faker-style generator — fixtures are deterministic on purpose (ADR-037 rule 3: fix the fixture, never the assertion). Two modules ship:

| Module | Exports | Used by |
|---|---|---|
| `tests/fixtures/posts.ts` | `makePost(overrides)`, `draftPost`, `publishedPosts`, `featuredPosts`, `makePostCardPost(overrides)` | `src/utils/__tests__/blog.test.ts`, `src/components/molecules/__tests__/PostCard.test.ts` |
| `tests/fixtures/tokens.ts` | `mockColorTokens`, `mockContrastPair`, `lowContrastPair` | contrast / token tests |

```typescript
// tests/fixtures/posts.ts (condensed — shipped with the starter)
interface BlogPostFixture {
  id: string;
  data: {
    title: string;
    description: string;
    date: Date;
    tags: string[];
    draft: boolean;
    featured?: boolean;
    author?: string;
  };
}

export const makePost = (overrides: Partial<BlogPostFixture> = {}): BlogPostFixture => ({
  id: overrides.id ?? "test-post",
  data: {
    title: "Test Post",
    description: "A test fixture",
    date: new Date("2025-01-01T00:00:00Z"),
    tags: ["test"],
    draft: false,
    ...overrides.data,
  },
});

export const draftPost = makePost({ id: "draft-post", data: { /* … */ draft: true } });
export const publishedPosts: BlogPostFixture[] = [/* older-published, newer-published, featured-newest */];
export const featuredPosts = publishedPosts.filter((post) => post.data.featured === true);

// PostCard needs the `metadata` block PostCard.astro expects (publishedDate /
// readingTime / isRecent) on top of the collection entry.
export const makePostCardPost = (overrides = {}) => ({ /* … */ });
```

Use them from colocated unit tests with a relative import (the starter does not alias `tests/`):

```typescript
// src/utils/__tests__/blog.test.ts (condensed — shipped with the starter)
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { draftPost, publishedPosts } from "../../../tests/fixtures/posts";

// astro:content is a virtual module aliased to src/__mocks__/astro-content.ts in
// vitest.config.ts; the stub exposes setMockCollection / resetMockCollection.
const stub = (await import("astro:content")) as any;
const { getPublishedPosts } = await import("@utils/blog");

describe("getPublishedPosts", () => {
  beforeEach(() => {
    stub.setMockCollection([...publishedPosts, draftPost]);
  });
  afterEach(() => {
    stub.resetMockCollection();
  });

  it("excludes drafts and sorts newest-first", async () => {
    const posts = await getPublishedPosts();

    expect(posts.map((p) => p.id)).toEqual(["featured-newest", "newer-published", "older-published"]);
  });
});
```

```typescript
// @vitest-environment node
// src/components/molecules/__tests__/PostCard.test.ts (condensed — shipped; Container API per ADR-040)
import { describe, expect, it } from "vitest";
import { makePostCardPost } from "../../../../tests/fixtures/posts";
import { render } from "../../__tests__/_helpers/container";
import PostCard from "../PostCard.astro";

describe("PostCard (molecule)", () => {
  it("renders the post title in an <h3>", async () => {
    const post = makePostCardPost({ data: { title: "Hello World" } as never });

    const html = await render(PostCard, { post });

    expect(html).toMatch(/<h3[^>]*>[\s\S]*Hello World[\s\S]*<\/h3>/);
  });
});
```

Add a fixture module per collection you introduce (`tests/fixtures/projects.ts` with a `makeProject(overrides)` factory, for example) rather than reaching for a random-data library — random input makes a failing test unreproducible.

### Browser helpers (not shipped)

Small Playwright helpers belong next to the specs. Name the file without `.spec.` so Playwright's default `testMatch` ignores it.

```typescript
// e2e/helpers.ts (not shipped)
import type { Page } from "@playwright/test";

/** Pin the theme the same way e2e/theme.spec.ts does (ADR-032: stored preference wins). */
export async function setTheme(page: Page, theme: "light" | "dark") {
  await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
}

/** Stub the static contact form's POST target (ADR-021 — the starter ships no handler). */
export async function mockFormEndpoint(page: Page, pattern = "**/contact", status = 200) {
  await page.route(pattern, (route) =>
    route.request().method() === "POST" ? route.fulfill({ status, body: "ok" }) : route.fallback(),
  );
}

/** Collect console errors during a test; call the returned function in an assertion. */
export function collectConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return () => errors;
}
```

```typescript
// e2e/console.spec.ts (not shipped — uses the helper above)
import { expect, test } from "@playwright/test";
import { collectConsoleErrors } from "./helpers";

test("homepage logs no console errors", async ({ page }) => {
  const errors = collectConsoleErrors(page);

  await page.goto("/");

  expect(errors()).toEqual([]);
});
```

## Progressive Enhancement Testing (Recommended)

The starter is built to work with JavaScript off: the mobile menu is a CSS-only checkbox toggle, the contact form submits natively with browser constraint validation ([ADR-021](/adr/021-contact-form-progressive-enhancement/)), and the motion system is pure CSS with `prefers-reduced-motion` and `@supports` fallbacks ([ADR-048](/adr/048-css-native-motion-system/)). Test those guarantees directly.

```typescript
// e2e/progressive-enhancement.spec.ts (not shipped)
import { expect, test } from "@playwright/test";

test.describe("Without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("links navigate", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Projects", exact: true }).click();

    await expect(page).toHaveURL("/projects/");
  });

  test("the mobile menu opens through the CSS-only checkbox", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    // The <label for="mobile-menu-toggle"> flips the hidden checkbox natively.
    // aria-expanded is synced by a script, so it is NOT asserted here.
    await page.locator("[data-mobile-menu-button]").click();

    await expect(page.locator("#mobile-menu")).toBeVisible();
  });

  test("the contact form is natively submittable", async ({ page }) => {
    await page.goto("/contact/");
    const form = page.locator("form.contact-form");

    // No script ran, so `novalidate` was never added: the browser's own
    // required / minlength / type=email checks apply on submit.
    await expect(form).toHaveAttribute("method", "POST");
    await expect(form).toHaveAttribute("action", /\/contact$/);
    await expect(form).not.toHaveAttribute("novalidate", "");
    await expect(form.locator("#contact-message")).toHaveAttribute("required", "");
  });
});

test.describe("Reduced motion", () => {
  test("scroll-reveal content is fully visible without animating", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // ScrollReveal.astro only animates inside @media (prefers-reduced-motion: no-preference).
    const reveal = page.locator(".scroll-reveal").first();
    await expect(reveal).toBeVisible();
    await expect(reveal).toHaveCSS("opacity", "1");
  });
});
```

## CI Integration

No new workflow is needed for the Recommended tier — the shipped gates already cover it:

- **`.github/workflows/ci.yml`** runs `quality:ci` (format, lint, `lint:md`, `astro check`, unit tests, `agents:check`, `version:check`, `og:check`, `docs:count`), the ADR enforcement suite (`pnpm enforce`), `test:coverage`, `budgets:validate`, `design:validate`, the build, the JS bundle-size gate, `perf:budgets`, `images:gate` (source and `dist`), `fonts:gate`, **Playwright on Chromium** (`pnpm exec playwright test --project=chromium` — which includes `a11y-axe.spec.ts` and every spec you add to `e2e/`), `audit:ci`, Trivy, Semgrep and Gitleaks.
- **`.github/workflows/lighthouse.yml`** runs `lhci autorun` with `lighthouserc.json` (desktop) *and* `lighthouserc.mobile.json` (mobile) on every PR and uploads both report sets.

So a separate accessibility job is redundant (axe runs inside the Chromium step), and a separate Lighthouse job is redundant (lighthouse.yml). The only thing CI does not exercise is Firefox and WebKit — `playwright.config.ts` defines the projects, but ci.yml installs Chromium alone to keep runs fast. If the Advanced tier of your project justifies the extra minutes, add a scheduled cross-browser run:

> Not shipped with the starter — this deliberately duplicates the Playwright step in `ci.yml` for the two browsers CI skips. Do not copy the other `qa.yml` jobs from older versions of this page: `ci.yml` already runs unit tests with coverage, Chromium E2E, `perf:budgets`, `images:gate`, `fonts:gate` and the security scans, and `lighthouse.yml` gates desktop + mobile Lighthouse.

```yaml
# .github/workflows/e2e-cross-browser.yml (not shipped — Firefox + WebKit only; Chromium already runs in ci.yml)
name: E2E (Firefox + WebKit)

on:
  schedule:
    - cron: '0 6 * * 1' # weekly; PRs stay on the Chromium gate in ci.yml
  workflow_dispatch:

permissions:
  contents: read

jobs:
  e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    strategy:
      fail-fast: false
      matrix:
        browser: [firefox, webkit]
    env:
      # astro.config.mjs validates SITE_URL at load time (ADR-050) — same value ci.yml uses.
      SITE_URL: https://${{ github.repository_owner }}.github.io

    steps:
      - uses: actions/checkout@v7

      - uses: actions/setup-node@v7
        with:
          node-version-file: '.nvmrc'

      - uses: pnpm/action-setup@v6
        with:
          run_install: false

      - run: pnpm install --frozen-lockfile

      - run: pnpm exec playwright install --with-deps ${{ matrix.browser }}

      - run: pnpm run build

      - run: pnpm exec playwright test --project=${{ matrix.browser }}

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v7
        with:
          name: playwright-report-${{ matrix.browser }}
          path: playwright-report/
          retention-days: 14
          if-no-files-found: ignore
```

For the proposed `package.json` aliases behind the Advanced tier (visual, cross-browser) and the wider strategy, see the [Testing Strategy Guide](/implementation-guides/guides/testing-strategy-guide/); the decision record is [ADR-023](/adr/023-testing-strategy/).
