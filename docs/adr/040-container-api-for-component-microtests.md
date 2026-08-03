---
title: 'ADR-040: Container API for Component Microtests'
description: >-
  Ratifies the choice of Astro's experimental_AstroContainer for unit-testing
  .astro components, extracts a shared helper at
  src/components/__tests__/_helpers/container.ts to confine the experimental
  API surface to one file, and defines the contract for extending to molecules.
lastUpdated: 2026-05-16T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

[PR #213](https://github.com/clownware/astro-performance-starter/pull/213) introduced unit tests for three atom components (`Badge`, `Button`, `Icon`) using `experimental_AstroContainer` from `astro/container`. That PR made the _implementation_ choice but did not produce a decision record, and the three test files each duplicate the same setup boilerplate verbatim:

```typescript
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

const render = (props, slot = "...") =>
  container.renderToString(Component, { props, slots: { default: slot } });
```

Three problems compound:

1. **No decision record.** The next agent scaffolding a molecule test (Card, PostCard, Tabs) has no documented "why Container, not happy-dom or `@testing-library/preact`" reference. They might pick a different tool and call it a refactor.
2. **API surface duplication.** The `experimental_` prefix is a stability warning — the API can change without a major version bump. With three import sites, an upstream change requires editing three files. With fifty (after Phase 2's molecule expansion), it requires editing fifty.
3. **Boilerplate erosion.** The next test author copies the pattern from one of the existing files. By PR #15 the patterns diverge subtly (different default slot text, different `beforeAll` semantics, different render signatures). The diverged patterns are individually fine and collectively make the test suite harder to read.

This ADR ratifies the Container API choice, extracts a shared helper, and documents the contract before more tests adopt the duplicated pattern.

## Decision Drivers

- **Stability surface**: `experimental_AstroContainer` could change; one import site beats many
- **Pattern consistency**: a shared helper enforces a single rendering pattern across test files
- **Composability with ADR-038**: the Architect pass scaffolds component tests; a stable helper API is part of the scaffold contract
- **Cost**: extraction must not break the existing 31 atom tests
- **Coverage for molecules**: ADR-040 needs to define the slot-handling contract before Phase 2 adds Card/PostCard/ProjectCard/Tabs tests

## Considered Options

### Option 1: Drop ADR-040; treat the decision as implicit

**Description**: PR #213 already established the pattern. Let it stand without an ADR.

**Pros**:

- Less documentation churn

**Cons**:

- The next contributor has no reference for "why Container" — invites pattern drift
- Three import sites of `experimental_AstroContainer` become 50+ as molecule tests grow
- Boilerplate duplication compounds over time
- Doesn't satisfy ADR-038's Architect pass requirement that test scaffolds reference a documented helper

### Option 2: Reframe broadly as "Component Testing Strategy"

**Description**: Open a larger ADR covering microtest vs E2E split, what belongs in each layer, how to choose, plus the Container helper.

**Pros**:

- Single document for the full topic
- Could supersede parts of ADR-023

**Cons**:

- Conflates the tooling decision (Container API) with the strategic split (already covered by ADR-023)
- Dilutes the ADR — broader scope makes it harder to actually merge
- The broader strategy belongs in ADR-023 or `docs/implementation-guides/guides/testing-strategy-guide.md`

### Option 3: Retroactive ratification + helper extraction (this ADR)

**Description**: Ratify `experimental_AstroContainer` as the chosen approach, citing PR #213 as the implementation. Extract `src/components/__tests__/_helpers/container.ts` exporting `render()` and `getContainer()`. Migrate the three atom tests to use the helper. Document the slot-handling contract for multi-slot components (Card, Tabs) so Phase 2 has a runway.

**Pros**:

- Confines the experimental API to one file
- Removes the existing 3-way boilerplate duplication
- Provides a stable contract for Phase 2 molecule tests
- Small, contained PR (1 new helper, 3 small test migrations, 1 ADR)
- Composes with ADR-038 — the Architect pass references the helper, not the raw API

**Cons**:

- Adds one indirection layer between test code and the underlying API
- The helper's API has to be chosen carefully (params, locals, slots all accept different shapes)

## Decision

We will go with **Option 3 (Retroactive ratification + helper extraction)** because the decision is already made implicitly (PR #213); the gap is the missing helper and the missing decision record. Closing both costs less than 200 lines of diff.

### What lands

**New file: `src/components/__tests__/_helpers/container.ts`**

Exports:

- `getContainer(): Promise<AstroContainer>` — memoised, single instance per Node process
- `render(Component, props?, slots?, extra?): Promise<string>` — primary entry point
- `resetContainer()` — escape valve for tests that need a fresh container

The `experimental_AstroContainer` import is intentionally confined to this file.

**Migrated tests:**

- `src/components/atoms/__tests__/Badge.test.ts` — uses `render(Badge, ...)` from helper
- `src/components/atoms/__tests__/Button.test.ts` — same
- `src/components/atoms/__tests__/Icon.test.ts` — same

Each migration removes ~6 lines of boilerplate while keeping every existing assertion intact. Test counts unchanged (Badge 12, Button 13, Icon 10).

**Slot-handling contract for molecules (documented for Phase 2):**

```typescript
// Default slot only (atoms typically)
render(Badge, { variant: "primary" }, { default: "New" });

// Named slots (Card with header / body / footer)
render(Card, {}, {
  default: "<p>Body</p>",
  header: "<h2>Title</h2>",
  footer: "<a href='#'>More</a>",
});

// No slots (Icon)
render(Icon, { name: "github" });
```

The helper's `slots` parameter is `Record<string, string>`. Astro itself accepts richer slot shapes (functions, async iterables), but the string form is sufficient for assertion-based microtests and forces simpler test data. If a future component genuinely needs the richer form, use `getContainer()` directly in that one test file rather than expanding the helper API.

### Upgrade discipline

`experimental_AstroContainer` may change in any Astro release. Pin discipline:

1. The helper file (`container.ts`) is the only file that imports from `astro/container`
2. When upgrading Astro, run `pnpm test:unit` to verify component tests still pass
3. If the API changes, edit the helper to adapt; no other test files need to change
4. The helper's exported API (`getContainer`, `render`, `resetContainer`) is stable; its implementation isn't

## Consequences

### Positive

- One file to update if the experimental API changes
- Boilerplate duplication eliminated; new tests are 4 lines of imports + assertions
- Pattern consistency enforced by import, not by review discipline
- Phase 2 molecule tests have a clear runway (slot contract documented)
- ADR-038 Architect pass can reference a documented helper rather than the raw API
- Mutation testing (Phase 3 / ADR-042) benefits from tighter assertions on cleaner test shape

### Negative

- One indirection layer between tests and the API (mitigated: helper signature mirrors the API)
- The helper file is now part of the test infrastructure surface; changing it is a breaking change for tests
- A test that genuinely needs `renderToResponse()` or other rare APIs must escape via `getContainer()` directly (documented escape valve)

### Neutral

- 31 atom tests continue to pass with the same assertions
- No production code changes
- ADR-023's coverage targets unaffected (the helper file itself is excluded from coverage via the `__tests__` pattern in `vitest.config.ts`)

## Validation

- `pnpm test:unit` passes (202 tests, including the 31 migrated atom tests)
- No atom test file imports `astro/container` directly (only the helper does)
- `grep -r "experimental_AstroContainer" src/components/atoms/__tests__/` returns zero matches after migration
- A new molecule test scaffolded for Phase 2 imports `render` from the helper, not from `astro/container`

## References

- [PR #213](https://github.com/clownware/astro-performance-starter/pull/213) — original Container API adoption that this ADR ratifies
- [ADR-023: Testing Strategy and Coverage Targets](023-testing-strategy.md) — the strategic split this implements at the tooling level
- [ADR-037: Testing Philosophy](037-testing-philosophy.md) — the discipline the helper enables in component tests
- [ADR-038: Agent Roles and Handoff Patterns](038-agent-roles.md) — the Architect pass uses this helper for component test scaffolds
- [Astro Container API docs](https://docs.astro.build/en/reference/container-reference/) — upstream reference

## Notes

The choice to keep slot values as `Record<string, string>` rather than the full Astro slot type is deliberate. Microtests assert on serialised HTML; the string form is sufficient and forces simpler test data. The day a component requires a richer slot shape for legitimate testing reasons, that's a signal to ask whether the component or the test is overcomplicated.

Molecule-tier microtests (Card, PostCard, ProjectCard, Tabs) build on this helper. Mutation testing via Stryker ([ADR-042](042-mutation-testing-with-stryker.md)) leverages the assertion improvements that helper consistency enables.

---

**Date**: 2026-05-16\
**Participants**: Chris Pezza, Claude\
**Outcome**: Accepted

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-062). The original record above is unmodified. -->

- **Testable consequences:**
  - TC-1: `experimental_AstroContainer` is imported in exactly one place — the shared test helper (`src/components/__tests__/_helpers/container.ts`).
- **Checks:**
  - TC-1 → check `container-single-import` (status: **warn**)
- **Not machine-checkable:** whether new component tests actually use the helper idiomatically is a review concern.
- **Graduation log:** _(empty at creation; entries added when a check changes status)_
