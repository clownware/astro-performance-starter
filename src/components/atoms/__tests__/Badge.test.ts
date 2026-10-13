// @vitest-environment node
import { describe, expect, it } from "vitest";
import { render } from "../../__tests__/_helpers/container";
import Badge from "../Badge.astro";

const renderBadge = (props: Record<string, unknown> = {}, slot = "Beta") =>
  render(Badge, props, { default: slot });

describe("Badge (atom)", () => {
  it("renders a <span> with the slot content", async () => {
    const html = await renderBadge({}, "New");
    expect(html).toMatch(/<span/);
    expect(html).toContain("New");
  });

  it("applies primary variant + sm size by default", async () => {
    const html = await renderBadge();
    expect(html).toContain("bg-tint");
    expect(html).toContain("text-tint-foreground");
    expect(html).toContain("text-sm");
  });

  it.each([
    ["primary", ["bg-tint", "text-tint-foreground"]],
    ["secondary", ["bg-tint-secondary", "text-tint-secondary-foreground"]],
    ["neutral", ["bg-surface", "text-muted-foreground"]],
    ["solid", ["bg-secondary-600", "text-primary-foreground"]],
  ])("applies %s variant classes", async (variant, expected) => {
    const html = await renderBadge({ variant });
    for (const cls of expected) {
      expect(html).toContain(cls);
    }
  });

  it("does not carry a second variant's background when solid is chosen", async () => {
    // A solid badge used to be a primary badge with bg-secondary-600 passed
    // through `class`, leaving two background utilities to race on source order.
    const html = await renderBadge({ variant: "solid" });
    expect(html).not.toContain("bg-tint");
  });

  it("uses role tokens, with no manual dark: utility in any variant", async () => {
    for (const variant of ["primary", "secondary", "neutral", "solid"]) {
      expect(await renderBadge({ variant })).not.toContain("dark:");
    }
  });

  it.each([
    ["xs", "text-xs"],
    ["sm", "text-sm"],
    ["md", "text-base"],
  ])("applies %s size class", async (size, expected) => {
    const html = await renderBadge({ size });
    expect(html).toContain(expected);
  });

  it("forwards role attribute when provided", async () => {
    const html = await renderBadge({ role: "status" });
    expect(html).toContain('role="status"');
  });

  it("merges custom class with variant classes", async () => {
    const html = await renderBadge({ class: "ml-2" });
    expect(html).toContain("ml-2");
    expect(html).toContain("bg-tint");
  });
});
