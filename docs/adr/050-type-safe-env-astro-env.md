---
title: 'ADR-050: Type-Safe Environment via astro:env'
lastUpdated: 2026-06-07T00:00:00.000Z
description: >-
  Adopts astro:env (env.schema in astro.config) for the PUBLIC_* surface and
  reduces the hand-rolled validate-env.ts to the one check astro:env can't make.
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

Environment access was hand-rolled. `scripts/src/validate-env.ts` validated only
`SITE_URL` (presence, placeholder content, URL shape), and the `PUBLIC_*` surface
(contact details, social links) was read in components via untyped
`import.meta.env.PUBLIC_* || "fallback"` literals scattered across
`src/pages/contact.astro`.

Astro ships `astro:env` (stable since Astro 5.0): a schema declared in
`astro.config` gives type-safe, validated access to env vars via
`astro:env/client` and `astro:env/server`. It replaces both the untyped reads and
most of the custom validator — but **not** the placeholder-content heuristic.

## Decision

Adopt `astro:env` for the `PUBLIC_*` surface; keep a slim placeholder guard.

### 1. Schema in `astro.config`

`env.schema` declares the eight consumed `PUBLIC_*` vars (five contact, three
social) as `envField.string({ context: "client", access: "public", optional: true,
default: … })`. The **defaults are the demo values**, so consumers import the
value directly — the scattered `|| "fallback"` literals are gone, and the demo
fallbacks now live in exactly one place. *(Amended 2026-07-05: originally nine —
`PUBLIC_CONTACT_CHAT_HOURS` was removed along with the contact page's fake
"Live Chat — Online now" card, which advertised a chat integration the template
does not ship.)*

### 2. Typed consumption

`src/pages/contact.astro` imports the vars from `astro:env/client` instead of
reading `import.meta.env`. Types and defaults flow from the schema.

### 3. What stays on `process.env` (deliberately)

`SITE_URL` / `PUBLIC_SITE_URL` and `DEPLOY_TARGET` are read at **config-load
time** in `astro.config.mjs` (to compute `site` and `base`) — before `astro:env`
exists. They cannot use `astro:env` and are intentionally **not** in the schema.
`import.meta.env.PROD` and `import.meta.env.BASE_URL` are Astro built-ins, not
custom env, and are left as-is.

### 4. Slim placeholder guard retained

`astro:env` validates presence and type, **not** whether a real value replaced a
template placeholder. `scripts/src/validate-env.ts` is reduced from a full
validator to a single exported, unit-tested `isPlaceholderUrl()` plus a thin CLI
that rejects `example.com` / `your-username` / `your-domain` / `localhost` in
`SITE_URL`. It stays wired as the `env:validate` prebuild step. This is the one
cloner safety net `astro:env` can't provide. (Considered and rejected: dropping
it entirely — a directory submission will have a real URL, but the guard is ~10
lines and protects every cloner, not just the demo.)

## Consequences

- **Positive:** compile-time safety on the `PUBLIC_*` surface; demo defaults
  centralised in the schema; the custom validator shrinks to its irreducible
  core (now unit-tested); no untyped `import.meta.env` reads remain in app code.
- **Negative:** the `site`/`base` plumbing still reads `process.env` in the
  config file — an unavoidable split, documented above so it doesn't read as an
  oversight.
- **For cloners:** set the `PUBLIC_*` vars in `.env`; missing ones fall back to
  the schema defaults. A placeholder `SITE_URL` fails the build early.

## References

- [ADR-035: Template Scope Boundary](035-template-scope-boundary.md)
- `astro.config.mjs` (`env.schema`), `src/pages/contact.astro`, `scripts/src/validate-env.ts`
- [Astro environment variables / astro:env](https://docs.astro.build/en/guides/environment-variables/)

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-064). The original record above is unmodified. -->

- **Testable consequences:**
  - TC-1: no `import.meta.env.PUBLIC_` reads exist in `src/` — typed access goes through `astro:env/client`.
  - TC-2: `astro.config.mjs` declares the `PUBLIC_*` surface in `env.schema`.
  - TC-3: the placeholder guard validates env at build.
- **Checks:**
  - TC-1, TC-2 → check `env-via-schema` (status: **warn**)
  - TC-3 → `env:validate` in the build chain (status: **block**, pre-existing gate)
- **Not machine-checkable:** which variables belong in the schema versus deliberate `process.env` reads (config-load-time values are exempt per this ADR).
- **Graduation log:** *(empty at creation; entries added when a check changes status)*

---
**Date**: 2026-06-07\
**Participants**: Template maintainers\
**Outcome**: Accepted — astro:env adopted for PUBLIC_*; validate-env.ts slimmed to the placeholder guard
