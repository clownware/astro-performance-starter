---
title: Testing Conventions
description: >-
  How to write a good test in this repo: AAA structure, one logical assertion,
  no conditional assertions, behaviour naming, and mock-or-not decisions
lastUpdated: true
tableOfContents: true
pagefind: true
---
# Testing Conventions

Practical companion to [ADR-037](/adr/037-testing-philosophy/). The ADR is the decision record; this doc is the "how to write a good test in this repo" reference.

## The five rules (recap)

From `.claude/engineering.md`:

1. Before implementing, write or update the failing test. Show the failure output before writing production code.
2. Use Arrange / Act / Assert with one logical assertion per test.
3. No conditional assertions. If the assertion depends on configuration, fix the fixture so the configuration is deterministic.
4. Test names describe behaviour, not implementation.
5. Never lower a coverage threshold to make CI pass. Add the missing test or open an ADR documenting the exception.

The rest of this doc shows what each rule looks like in practice.

## AAA structure

The exemplar in this repo is [`src/utils/__tests__/formatDate.test.ts`](https://github.com/clownware/astro-performance-starter/blob/master/src/utils/__tests__/formatDate.test.ts). Each test follows three labelled sections (sometimes implicit, sometimes explicit):

```typescript
import { describe, expect, it } from "vitest";
import { formatDate } from "../formatDate";

describe("formatDate", () => {
  it("formats ISO date as 'Jan 1, 2026' in short mode", () => {
    // Arrange
    const input = new Date("2026-01-01T00:00:00Z");

    // Act
    const result = formatDate(input, "short");

    // Assert
    expect(result).toBe("Jan 1, 2026");
  });
});
```

The labels can be omitted when the structure is obvious, but the **order** is not optional. If your test mixes Arrange and Act (e.g. asserting on an intermediate value to "prove" the act got far enough), split into two tests.

### One logical assertion per test

"Logical" is the operative word — `expect(result.foo).toBe(1); expect(result.bar).toBe(2)` is one logical assertion (the shape of `result`). What's forbidden:

```typescript
// Bad: three unrelated assertions in one test
it("renders the navigation", async () => {
  const html = await render(Nav);
  expect(html).toContain("Home");
  expect(html).toContain("Blog");
  expect(html).toContain("About");
});
```

When the assertions are unrelated facts about the same render, split:

```typescript
// Good: one fact per test, behaviour-named
it("includes the Home link", async () => {
  const html = await render(Nav);
  expect(html).toContain("Home");
});

it("includes the Blog link", async () => {
  const html = await render(Nav);
  expect(html).toContain("Blog");
});
```

Vitest's `it.each` is the right tool when the assertions are genuinely parameterised:

```typescript
it.each(["Home", "Blog", "About"])("includes the %s link", async (label) => {
  const html = await render(Nav);
  expect(html).toContain(label);
});
```

## No conditional assertions

This is the anti-pattern that motivated Rule 3:

```typescript
// Bad — silent pass when the link is hidden
test("GitHub link points to the right URL", async ({ page }) => {
  const link = page.getByRole("link", { name: "GitHub" });
  if (await link.isVisible()) {
    await expect(link).toHaveAttribute("href", /github\.com/);
  }
});
```

When `siteLinks.github` is empty, the link is hidden and the test passes silently — it asserts nothing. The CI signal is green; the bug is not caught.

The remedy is a deterministic fixture, not a conditional. Set the value via a test env var and make the assertion unconditional:

```typescript
// playwright.config.ts
process.env.PUBLIC_SITE_LINK_GITHUB ??= "https://github.com/example/test-fixture";

// e2e/index.spec.ts
test("GitHub link points to the configured URL", async ({ page }) => {
  const link = page.getByRole("link", { name: "GitHub" });
  await expect(link).toHaveAttribute("href", /github\.com/);
});
```

If the configuration genuinely _can_ be absent in production, that's a behaviour worth testing explicitly:

```typescript
test("GitHub link is hidden when siteLinks.github is empty", async ({ page }) => {
  // arrange via env var that disables the link
  // assert the link is NOT in the DOM
  await expect(page.getByRole("link", { name: "GitHub" })).toHaveCount(0);
});
```

Two unconditional tests beat one conditional one.

## Behaviour-naming convention

Names describing implementation rot when implementation changes; names describing behaviour survive refactors.

| Bad (implementation) | Good (behaviour) |
|---|---|
| `it("calls formatDateRelative with diffDays")` | `it("returns 'tomorrow' for a date 24h in the future")` |
| `it("uses Math.floor for negative diffMs")` | `it("rounds down toward the past for sub-day differences")` |
| `it("sets isLoading to true then false")` | `it("shows a spinner while the request is in flight")` |

A test name is a sentence the user (or future reader) can verify from the outside. If the name only makes sense after reading the implementation, rename it.

## Mock or not?

Decision flow:

1. **Is the dependency a virtual module (e.g. `astro:content`)?** → Use the stub at `src/__mocks__/astro-content.ts`. The vitest alias makes this transparent.
2. **Is the dependency a side-effecting infrastructure (real fs, real network, real time)?** → Use a controlled fixture. For node:fs, `validateOgImage.test.ts` shows the pattern with real test files in `public/`. For network, use `msw` or `nock`.
3. **Is the dependency a pure function from the same codebase?** → Don't mock it. Test the integration.
4. **Is the dependency a third-party SDK (e.g. an analytics client)?** → Wrap it behind an interface and mock the interface, not the SDK.

The general rule: mock at the seam, not at the implementation. If you find yourself mocking deep internals, the seam is wrong.

## F.I.R.S.T. as a self-review checklist

Before submitting a test, ask:

- **Fast**: does it run in < 100ms? (E2E exempt; unit tests must.)
- **Independent**: does it pass when run alone? Does it pass in any order with other tests?
- **Repeatable**: does it pass on the second run without manual cleanup? Does it depend on the current date, network, or timezone?
- **Self-validating**: does it produce a clear pass/fail without manual inspection of logs?
- **Timely**: was it written _before_ the code it tests? (Or, if backfilling: would the production code change to make it pass?)

A failure on any axis is a smell to address, not a rule to ignore.

## When backfilling tests for legacy code

ADR-037 Rule 1 says "before implementing, write the failing test." For _legacy_ code that has no tests, the rule adapts: write a test that captures current behaviour, run it, confirm pass. Then change the production code; if the test fails, you've found a regression. This is called characterisation testing and is the legitimate exception to the "test must fail first" rule — the test pinned current behaviour before any change.

Mark such tests with a comment so future readers know they're characterisation, not specification:

```typescript
// Characterisation test for legacy formatDate behaviour.
// Pins observed output as of 2026-05-16; behaviour can be revisited
// without test-first discipline if a refactor proposes intentional change.
```

## Coverage thresholds

ADR-037 Rule 5: never lower a threshold to make CI pass.

The escape valve is an ADR documenting why the threshold drops (e.g. "we deleted an entire utility module and its tests; new threshold reflects remaining surface honestly"). The ADR is cheap to write but real to require, which is the point.

The current thresholds are in [`vitest.config.ts`](https://github.com/clownware/astro-performance-starter/blob/master/vitest.config.ts); `pnpm run test:coverage` enforces them.

## Related ADRs

- [ADR-023](/adr/023-testing-strategy/) — testing strategy and coverage targets
- [ADR-037](/adr/037-testing-philosophy/) — the rules this doc operationalises
- [ADR-038](/adr/038-agent-roles/) — the Architect pass produces the failing test
