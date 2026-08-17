---
title: 'ADR-062: Astro 7 Upgrade Retains the unified/remark Markdown Processor'
description: >-
  Upgrade to Astro 7 (with @astrojs/mdx 7 and @astrojs/preact 6) to clear the
  remaining security advisories, but keep the unified/remark Markdown pipeline
  via @astrojs/markdown-remark instead of adopting the new Satteri default
  processor; porting the custom remark plugins to Satteri is deferred to its
  own decision
lastUpdated: 2026-07-27T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

Astro 6.4.8 carried three XSS advisories (two moderate, one low) whose patches ship only in the
7.x line: reflected XSS via unescaped View Transition params, XSS via unescaped spread attribute
names, and XSS via unescaped `transition:*` values on hydrated islands. As shipped, the template
is not exploitable — all `transition:name` bindings and spread attributes are content-collection-
or config-derived — but the template's job is to be a safe baseline, and every cloned project
inherits these patterns with user data one binding away. A fourth advisory (esbuild, low) also
cleared only via Astro 7's move to Vite 8.

Astro 7 replaces the default Markdown processor: Sätteri supersedes the unified/remark pipeline,
and `@astrojs/markdown-remark` is no longer installed by default. This repository wires two
custom remark plugins through the Markdown config:

- `remarkValidateLinks` — fails the build on broken internal `/docs` and `/adr` links
- `remarkSnippetIncludes` — expands `{% snippet "name" %}` shortcodes from `docs/snippets/`

Both are build-time correctness gates, not decoration. The upgrade therefore forced a choice
between porting them to Sätteri and retaining the unified pipeline explicitly.

## Decision Drivers

- **Security**: the astro advisories are the last remaining `pnpm audit --production` findings
- **Correctness gates must survive**: losing link validation or snippet expansion silently would
  be worse than any processor benefit
- **Blast radius**: the upgrade already spans three majors (astro 7, @astrojs/mdx 7,
  @astrojs/preact 6) plus the new Rust compiler's strict HTML enforcement
- **Reversibility**: a processor port is easy to do later; doing it mid-upgrade couples two
  risky changes in one PR

## Considered Options

### Option 1: Upgrade and retain unified/remark via @astrojs/markdown-remark

**Description**: Install `@astrojs/markdown-remark` explicitly and pass the existing plugins to
`unified({ remarkPlugins })` as `markdown.processor`.

**Pros**:

- Both custom plugins run unchanged — zero porting risk
- The security upgrade lands without coupling to a processor migration
- The unified toolchain (remark, unist-util-visit, to-vfile) already ships in devDependencies
  for maintainer scripts, so no new dependency weight

**Cons**:

- Foregoes Sätteri's build-speed benefit for Markdown processing, for now
- One more explicit dependency to track (`@astrojs/markdown-remark`)

### Option 2: Port both plugins to Sätteri during the upgrade

**Description**: Rewrite `remarkValidateLinks` and `remarkSnippetIncludes` against Sätteri's
plugin API as part of the Astro 7 PR.

**Pros**:

- Lands on the new default processor immediately; no legacy pipeline to carry

**Cons**:

- Couples a security-motivated upgrade to a rewrite of two build-correctness gates
- A subtle porting bug (e.g. link validation silently not running) passes CI green while
  removing the protection — the failure mode is invisible
- Sätteri's plugin API is new; patterns and pitfalls are not yet well established

### Option 3: Stay on Astro 6

**Description**: Defer the upgrade; accept or allowlist the advisories.

**Pros**:

- Zero migration work

**Cons**:

- The XSS advisories never clear — no 6.x backports were published
- Advisory noise ships to every cloned project, undercutting the template's purpose

## Decision

We will go with **Option 1** because it separates two independently risky changes. The security
upgrade is urgent-ish and mechanical; the processor port is optional and subtle. The plugins'
liveness under the retained pipeline was verified by negative probe: a deliberately broken
`/adr/` link in a rendered blog post fails the Astro 7 build (exit 1), proving
`remarkValidateLinks` executes.

### Implementation Details

```js
// astro.config.mjs
import { unified } from "@astrojs/markdown-remark";

export default defineConfig({
  markdown: {
    processor: unified({
      remarkPlugins: [
        [remarkValidateLinks, { /* ... */ }],
        [remarkSnippetIncludes, { /* ... */ }],
      ],
    }),
  },
});
```

`@astrojs/markdown-satteri` is installed solely to satisfy `@astrojs/mdx@7`'s peer dependency;
the MDX integration routes plugin execution through the configured unified processor.

## Consequences

### Positive

- `pnpm audit --production` reports zero advisories
- Both build-correctness gates verified live under Astro 7
- The new Rust compiler's strict HTML validation passed with zero source changes, and warm
  build time dropped (~4.8s to ~2.7s for the build step)
- Cloned projects inherit a clean audit baseline

### Negative

- The template carries the legacy Markdown pipeline until a Sätteri port happens; the port is
  deferred work with a real (if modest) build-speed upside
- `markdown.processor` is now explicit config that upgrades must preserve — a future removal of
  `@astrojs/markdown-remark` support would force the port

## Revisit Trigger

Port the plugins to Sätteri (superseding the processor choice here, not this upgrade) when
either: Astro deprecates `@astrojs/markdown-remark`, or Markdown build time becomes a measured
bottleneck in the perf baselines.

## Enforcement

<!-- Added 2026-08-13 under the enforcement architecture ADR (ADR-064). The original record above is unmodified. -->

- **Testable consequences:**
  - TC-1: `astro` stays on the 7.x major with `markdown.processor` explicitly configured for the unified/remark pipeline.
  - TC-2: the snippet-include plugin survives a cold rebuild (the failure this upgrade surfaced).
- **Checks:**
  - TC-1 → `version-check` in `quality:ci` (status: **block**, pre-existing gate)
  - TC-2 → `scripts/src/__tests__/remark-snippet-includes.test.ts` via `test:unit` (status: **block**, pre-existing gate)
- **Not machine-checkable:** whether a future Astro major warrants re-evaluating the Sätteri port is the Revisit Trigger above.
- **Graduation log:** *(empty at creation; entries added when a check changes status)*
