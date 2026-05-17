---
title: 'ADR-044: Coupling Map'
description: >-
  Reserves an ADR slot for a static "framework coupling map" enumerating
  which files import from astro:* virtual modules (load-bearing on the
  framework) versus which are framework-free (utilities, schemas, types).
  Deferred until the next major Astro upgrade.
lastUpdated: 2026-05-16T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Proposed (deferred — revisit at next Astro major upgrade)

## Context

The testing+agentic-discipline plan reserved this slot for a static document enumerating:

- **Framework-coupled files** — anything importing from `astro:*`, `astro/runtime/*`, or Astro-specific virtual modules. These are load-bearing on the framework and would require migration work on a major upgrade.
- **Framework-free files** — utilities, schemas, scripts, types. These can be refactored independently and are safe to extract or share.

Purpose: tell future contributors (and Claude sessions) which files are safe to refactor in isolation and which require coordinated migration. Useful before any major framework migration; mostly redundant overhead otherwise.

## Decision

**Deferred until the next major Astro upgrade.** At template scale (under 50 production source files), the coupling pattern is small enough to discover by `grep -r "from \"astro" src/`. Building a maintained document for that size is overhead without payoff.

When Astro 7 or another major version is on the horizon, reopen this ADR and:

1. Run the grep + categorise into framework-coupled / framework-free
2. Document migration cost per coupled file
3. Use the map to scope the upgrade PR

Until then, the implicit rule applies: framework-free files (utilities, fixtures, build scripts) can be modified independently; framework-coupled files (`.astro` components, content collection consumers, anything importing `astro:content` / `astro:assets` / Astro container API) need coordinated migration thinking.

## Revisit triggers

- A major Astro version (7+) is announced
- The codebase grows past ~50 production source files and the implicit rule becomes hard to apply mentally
- A migration to a different framework is being seriously considered

## References

- [ADR-001: Preact Island Usage Policy](001-preact-island-usage-policy.md) — partial coupling-map analogue for hydration
- [ADR-040: Container API for Component Microtests](040-container-api-for-component-microtests.md) — concentrates the `astro/container` coupling to one file as a model for future coupling concentration

---

**Date**: 2026-05-16\
**Participants**: Chris Pezza, Claude\
**Outcome**: Deferred
