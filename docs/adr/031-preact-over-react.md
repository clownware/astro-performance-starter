---
title: 'ADR-031: Preact Over React for Islands'
lastUpdated: 2026-02-18T00:00:00.000Z
description: >-
  Documents the decision to use Preact rather than React as the islands
  framework, covering bundle size rationale, React compat layer, and when
  users should consider switching.
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

Astro supports multiple UI frameworks for islands. The starter ships with `@astrojs/preact` as the default. This is not self-evident — React is far more widely known. This ADR documents why Preact was chosen and how users can still access the React ecosystem without switching.

## Bundle Size: The Primary Reason

| Framework | Runtime (gzipped) |
|-----------|------------------|
| **Preact** | ~3KB |
| **Preact + compat** | ~5KB |
| React + ReactDOM | ~45KB |
| Vue 3 | ~22KB |
| SolidJS | ~7KB |

With a 160KB total JS budget and a zero-JS baseline, React would consume ~28% of the entire budget before any application code. Preact costs ~2% of the same budget. For a performance-first starter this difference is the entire value proposition.

## React Compatibility via `preact/compat`

The most important thing to understand: **Preact ships a full React compatibility layer.**

`preact/compat` implements the complete React API. To use React component libraries with Preact, add these aliases to `astro.config.mjs`:

```js
vite: {
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      'react-dom/server': 'preact/compat/server',
    },
  },
},
```

With these aliases in place:

- React hooks (`useState`, `useEffect`, `useContext`, `useRef`, etc.) work identically
- JSX syntax is unchanged
- `forwardRef`, `createContext`, `memo`, `lazy`, `Suspense` all work
- Most React component libraries (Radix UI, Headless UI, React Hook Form, etc.) work without modification
- The bundle cost increases from ~3KB to ~5KB — still 9x smaller than React

## Considered Options

### Option 1: React (standard)

**Pros**: Largest ecosystem, most familiar to developers, best IDE tooling, most third-party components

**Cons**: ~45KB runtime gzipped — incompatible with performance budget goals for a starter that defaults to zero JS

### Option 2: Preact with compat (chosen)

**Pros**: ~3-5KB runtime, full React API compatibility, access to React ecosystem via aliases, identical JSX syntax

**Cons**: Less familiar name, occasional edge-case incompatibilities with React libraries that use internal React APIs

### Option 3: Svelte

**Pros**: Smallest compiled output, no shared runtime

**Cons**: Different syntax (not JSX), no React ecosystem compatibility, steeper learning curve for React developers

### Option 4: No islands framework (CSS-only)

**Pros**: True zero JS

**Cons**: Eliminates all interactive island capability — too restrictive for a general-purpose starter

## When to Switch to React

Users should consider switching from Preact to React if:

1. A required library uses React internal APIs not covered by `preact/compat` (rare but possible with some animation libraries)
2. The project's JS budget is not a concern (e.g. a full SPA built on top of the starter)
3. The team has strong React expertise and the compat aliases cause confusion

To switch, replace `@astrojs/preact` with `@astrojs/react` in `astro.config.mjs` and `package.json`, and remove the compat aliases.

## Decision

**Use Preact as the default islands framework.** Document `preact/compat` aliases prominently so users understand they have full React ecosystem access. This is not a limitation — it is a deliberate performance optimisation that costs nothing in API compatibility.

## Consequences

### Positive

- ~3KB islands runtime vs ~45KB for React — 15x smaller
- Full React API available via `preact/compat`
- Most React component libraries work without modification
- Consistent with zero-JS philosophy — JS additions are minimal and justified

### Negative

- Developers unfamiliar with Preact may not realise React libraries work
- Rare incompatibilities with libraries using React internals (e.g. some versions of React Spring, Framer Motion)
- IDE error messages may reference Preact types rather than React types

### Neutral

- JSX syntax is identical — no learning curve for React developers
- `preact/compat` aliases are opt-in, not configured by default in the starter (to avoid confusion for users who don't need them)

## Planned Work

Add a guide to `docs/patterns/` documenting how to configure `preact/compat` aliases and which popular React libraries have been tested. See [Planned Work in docs/README.md](../README.md#planned-work).

## References

- [Preact Documentation](https://preactjs.com/)
- [preact/compat Guide](https://preactjs.com/guide/v10/switching-to-preact/)
- [ADR-001: Preact Island Usage Policy](./001-preact-island-usage-policy.md)
- [Performance Budgets](../implementation-guides/reference/budgets-guardrails.md)

---
**Date**: 2026-02-18\
**Participants**: Template maintainers\
**Outcome**: Accepted
