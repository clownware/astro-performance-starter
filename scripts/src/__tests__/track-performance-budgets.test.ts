/**
 * Unit tests for the budget-override application in track-performance-budgets.
 *
 * The override mechanism (budget-overrides.json, validated by
 * `budgets:validate`) was decorative until 2026-08-13: entries were
 * schema-checked and expiry-checked but never applied to any gate. These
 * tests pin the now-real semantics: an unexpired override whose `metric`
 * matches a budget's `name` lifts that budget's limit to `temporary` (bytes);
 * expired or unmatched overrides change nothing.
 */
import { describe, expect, it } from "vitest";
import { applyOverrides, type Budget } from "../track-performance-budgets";

const budgets: Budget[] = [
  { name: "JavaScript (raw, bundled)", path: "_astro", maxSizeKb: 100, maxTotalSizeKb: 160 },
  { name: "Fonts (raw, self-hosted)", path: "_astro/fonts", maxSizeKb: 50 },
];

const override = {
  metric: "JavaScript (raw, bundled)",
  original: 163840,
  temporary: 180000,
  reason: "test",
  adr: "docs/adr/000-starter-decisions.md",
  expires: "2099-01-01",
  ticket: "T-1",
  approved_by: "tech-lead",
  created: "2026-08-13",
};

describe("applyOverrides", () => {
  it("lifts the total limit for an unexpired override matching a budget name", () => {
    const effective = applyOverrides(budgets, { overrides: [override] }, "2026-08-13");
    expect(effective[0].maxTotalSizeKb).toBeCloseTo(180000 / 1024, 2);
    expect(effective[0].maxSizeKb).toBe(100);
  });

  it("lifts maxSizeKb instead when the budget has no total limit", () => {
    const fontsOverride = { ...override, metric: "Fonts (raw, self-hosted)" };
    const effective = applyOverrides(budgets, { overrides: [fontsOverride] }, "2026-08-13");
    expect(effective[1].maxSizeKb).toBeCloseTo(180000 / 1024, 2);
  });

  it("ignores an expired override", () => {
    const expired = { ...override, expires: "2026-01-01" };
    const effective = applyOverrides(budgets, { overrides: [expired] }, "2026-08-13");
    expect(effective[0].maxTotalSizeKb).toBe(160);
  });

  it("ignores overrides whose metric matches no budget", () => {
    const stray = { ...override, metric: "no-such-budget" };
    const effective = applyOverrides(budgets, { overrides: [stray] }, "2026-08-13");
    expect(effective).toEqual(budgets);
  });

  it("returns the budgets untouched when there are no overrides", () => {
    expect(applyOverrides(budgets, { overrides: [] }, "2026-08-13")).toEqual(budgets);
  });
});
