---
title: 'ADR-060: Showcase Interactive Demo Islands'
description: >-
  Sanctions the two Preact islands hydrated on the showcase page (MotionLab and
  SignalsCounter) as labelled, demo-scoped exceptions to the zero-JS showcase
  rule, and reconciles ADR-048's description of the cursor spotlight with its
  actual implementation as a deferred module script rather than an island.
lastUpdated: 2026-07-05T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Accepted (records decisions shipped 2026-06-07/09 in PRs #245/#250; written retroactively 2026-07-05)

## Context

Two Accepted ADRs constrain JavaScript on the showcase page:

- [ADR-048](./048-css-native-motion-system.md) (motion system) states the cursor
  spotlight is "a ~0.4KB `client:idle` island" and that "no other component
  hydrates for motion".
- [ADR-049](./049-showcase-living-style-guide.md) (living style guide) validates
  that "the built page adds no new `client:` island" and rules out live toggles
  in favour of static comparisons.

The code has since moved past both records without an amendment:

1. **MotionLab** (`src/components/islands/MotionLab.tsx`, added 2026-06-09,
   PR #250) hydrates `client:idle` on `/showcase` to control a CSS animation's
   play/pause and speed via a Preact Signal — a live motion toggle.
2. **SignalsCounter** (`src/components/islands/SignalsCounter.tsx`) hydrates
   `client:visible` on `/showcase` as the Preact Signals reactivity demo. It
   predates ADR-049 but is not mentioned by it.
3. **CursorSpotlight** (`src/components/atoms/CursorSpotlight.astro`) is not an
   island at all: it is a plain Astro atom whose deferred module `<script>`
   feeds two custom properties, rAF-throttled; CSS does all rendering. ADR-048's
   "island" description never matched the shipped mechanism.

An audit (2026-07-05) flagged all three as undocumented drift. The islands are
deliberate — MotionLab's own source comment calls it "the showcase's deliberate
Preact island (#250, ADR-048)" — but no record actually sanctions them.

## Decision Drivers

- **Honest architecture demos**: a template that sells islands architecture
  should demonstrate a real hydrated island somewhere, clearly labelled
- **Zero-JS baseline integrity**: exceptions must be enumerated and bounded, or
  the "zero-JS by default" claim decays one convenient island at a time
- **ADR trustworthiness**: halt-on-violation enforcement (ADR-039) only works if
  Accepted ADRs describe reality
- **Performance budgets**: every hydrated island adds to the JS budget
  (`.claude/stack.md`)

## Considered Options

### Option 1: Remove the islands to restore ADR-048/049 as written

**Description**: Delete MotionLab and SignalsCounter from the showcase; keep the
page fully static.

**Pros**:

- ADR-048/049 stay true without amendment
- Smallest possible JS footprint

**Cons**:

- The template demonstrates islands architecture (ADR-001, ADR-031) without ever
  shipping a working island — adopters get no reference implementation
- Reverts shipped, deliberate, labelled work that serves the template's teaching
  goal

### Option 2: Sanction the demo islands with explicit boundaries (chosen)

**Description**: Record MotionLab and SignalsCounter as the showcase's two
sanctioned interactive demos, define the rules any future demo island must
follow, and amend ADR-048/049 to point here.

**Pros**:

- Record matches reality; the exception list is closed, not open-ended
- Preserves the reference implementations adopters copy from
- Keeps the zero-JS rule meaningful: everything else on the page stays static

**Cons**:

- The showcase is no longer strictly zero-JS; the claim needs qualifying
  wherever it appears

### Option 3: Move the demos to a separate playground page

**Description**: Keep `/showcase` zero-JS; hydrate demos on a new page.

**Pros**:

- ADR-049's zero-JS validation stays literally true for `/showcase`

**Cons**:

- Splits the living style guide in two; the components section already
  documents the islands alongside their static siblings
- A second page adds navigation surface for no adopter benefit

## Decision

We will go with **Option 2** because the islands exist to teach the
architecture the template sells, and a closed, labelled exception list keeps
the zero-JS baseline auditable.

The sanctioned showcase islands are exactly:

| Island | Directive | Purpose |
| --- | --- | --- |
| `MotionLab` | `client:idle` | CSS-owned motion, Signal-owned controls (play/pause/speed) |
| `SignalsCounter` | `client:visible` | Preact Signals fine-grained reactivity demo |

Rules for these and any future demo island:

1. Lives in `src/components/islands/`, hydrated only on `/showcase`
2. Labelled in the page copy as a deliberate exception, with its directive shown
   in the accompanying code snippet
3. Uses `client:idle` or `client:visible` — never `client:load` (ADR-001)
4. Motion inside an island remains CSS-driven and gated behind
   `prefers-reduced-motion` (ADR-048); JS owns controls, not animation
5. Adding a third island requires amending this ADR

**CursorSpotlight reconciliation**: the cursor spotlight is an Astro atom with a
deferred module script, not a `client:idle` island. This mechanism is *better*
than what ADR-048 specified (no hydration runtime, same deferral, same no-JS
fallback), so the implementation stands and ADR-048's description is amended to
match it.

## Consequences

### Positive

- ADR-048/049 violations are resolved by record, not by deleting shipped work
- Adopters have a bounded, documented pattern for "one labelled demo island"
- The audit trail for `src/components/islands/` finally exists

### Negative

- `/showcase` carries two hydrated islands' worth of JS (within budget; both
  are lazy directives)
- "Zero-JS" claims about the showcase must be phrased as "zero-JS baseline with
  two labelled island demos"

### Neutral

- ADR-048 and ADR-049 gain amendment notes pointing here
- No code changes; this record documents and bounds what already ships

## Validation

- **Metric 1**: `grep -r "client:" src/pages/showcase.astro` returns exactly the
  two sanctioned directives (`client:idle` on MotionLab, `client:visible` on
  SignalsCounter)
- **Metric 2**: `pnpm perf:budgets` stays green with both islands hydrated
- **Metric 3**: no `client:load` anywhere in `src/` (ADR-001 holds)

## References

- [ADR-001](./001-preact-island-usage-policy.md) — island usage policy
- [ADR-048](./048-css-native-motion-system.md) — CSS-native motion system (amended by this record)
- [ADR-049](./049-showcase-living-style-guide.md) — showcase as living style guide (amended by this record)
- PRs #245, #250 — component coverage + labelled island
- Audit finding, 2026-07-05

## Notes

SignalsCounter predates ADR-049 and was arguably grandfathered; it is listed
here so the exception set is closed rather than partially implicit.

---
**Date**: 2026-07-05\
**Participants**: Chris Pezza, Claude (audit follow-up)\
**Outcome**: Accepted
