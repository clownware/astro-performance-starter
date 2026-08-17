---
title: 'ADR-051: Content Security Policy Strategy'
lastUpdated: 2026-06-07T00:00:00.000Z
description: >-
  Rejects Astro 6's built-in security.csp for this stack and records the
  header-based CSP in public/_headers as the deliberate production default.
tableOfContents: true
pagefind: true
---

## Status

Accepted (header-based CSP via `public/_headers`; the evaluated alternative — Astro's built-in `security.csp` — was rejected, see Decision)

## Context

Astro 6.0 shipped a stable built-in Content Security Policy feature
(`security.csp`) that emits hashes for the framework's own inline scripts and
styles. CSP is a strong production security control and a credible thing for a
performance/security-conscious starter to demonstrate, so we evaluated adopting
it.

The evaluation found `security.csp` to be **incompatible with this template's
architecture** on four independent axes — any one of which is disqualifying.

## Decision Drivers

- **Stability over novelty.** A clone-and-ship starter must build and render
  correctly out of the box; a partially-working CSP is worse than none.
- **Preserve the existing experience.** View transitions (ADR-009) and syntax
  highlighting are core to the template and must not regress.
- **Honest framing.** CSP is a _production security default_, not an "Astro 6
  showcase" feature — it should be presented as the former.

## Considered Options

### Option 1: Enable Astro's built-in `security.csp`

Rejected. Four blockers, each independently fatal on this stack:

1. **ClientRouter incompatibility.** `<ClientRouter />` view transitions are
   live ([ADR-009](009-client-router-view-transitions.md),
   `src/layouts/BaseLayout.astro`). Astro's docs state view transitions are not
   supported under built-in CSP — the runtime DOM swaps inject content the
   build-time hashes cannot cover.
2. **Syntax highlighting.** Code blocks render via
   `astro-expressive-code` (Shiki). Astro's docs state Shiki is not currently
   supported by built-in CSP because it emits inline `style` attributes that
   cannot be hashed.
3. **No nonce support.** Built-in CSP is **hash-only**. The template relies on
   `is:inline` and `set:html` blocks (theme bootstrap, the inline `@font-face`
   block in `Head.astro`, dynamic component CSS) that a hash-only strategy
   cannot reliably cover as they evolve.
4. **Static host delivery.** The reference demo deploys to **GitHub Pages**,
   which serves no custom response headers and does not honour the directives
   that only work as a real header (e.g. `frame-ancestors`). Meta-tag CSP is a
   partial, weaker substitute.

### Option 2: Keep the header-based CSP in `public/_headers` (chosen)

`public/_headers` already ships a real CSP plus HSTS, `X-Frame-Options`,
`X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`. It uses
`'unsafe-inline'` for `script-src`/`style-src` — a **deliberate, documented
trade-off**, not a pending fix: it is required for Astro island scripts and
Tailwind utility styles, and the hash/nonce alternative is foreclosed by the
blockers above.

## Decision

**Do not enable Astro's built-in `security.csp`.** Keep the header-based CSP in
`public/_headers` as the production security default.

Scope note on delivery: `_headers` is honoured by header-capable hosts
(Cloudflare Pages, Netlify) and is a **no-op on the GitHub Pages demo**, which
cannot serve custom headers. Cloners deploying to a header-capable host get the
CSP automatically; the demo's security posture is therefore representative of a
real deployment, not the demo URL itself.

Revisit if Astro's built-in CSP gains nonce support and ClientRouter/Shiki
compatibility, or if the template drops view transitions and Shiki.

## Consequences

- **Positive:** Build and render stay stable; view transitions and code
  highlighting keep working; a real CSP still ships for production hosts; the
  `'unsafe-inline'` choice is now documented intent rather than a stale TODO.
- **Negative:** `'unsafe-inline'` is weaker than hash/nonce CSP; the GitHub
  Pages demo enforces no CSP. Both are accepted given the constraints.
- **For cloners:** when adding third-party embeds (analytics, video, fonts),
  extend the relevant `*-src` directives in `public/_headers`.

## References

- [ADR-009: ClientRouter and View Transitions](009-client-router-view-transitions.md)
- [ADR-046: Security Scanning Pipeline](046-security-scanning-pipeline.md)
- `public/_headers`
- [Astro CSP documentation](https://docs.astro.build/en/reference/configuration-reference/#security)

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-064). The original record above is unmodified. -->

- **Testable consequences:**
  - TC-1: `public/_headers` sets a `Content-Security-Policy` header.
  - TC-2: Astro's built-in `security.csp` is not enabled in `astro.config.mjs`.
- **Checks:**
  - TC-1, TC-2 → check `csp-shape` (status: **warn**)
- **Not machine-checkable:** policy strength and directive appropriateness for a given deployment.
- **Graduation log:** _(empty at creation; entries added when a check changes status)_

---
**Date**: 2026-06-07\
**Participants**: Template maintainers\
**Outcome**: Built-in `security.csp` rejected; header-based CSP retained as the production default
