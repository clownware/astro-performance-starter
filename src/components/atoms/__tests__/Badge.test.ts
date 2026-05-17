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
    expect(html).toContain("bg-primary-100");
    expect(html).toContain("text-primary-800");
    expect(html).toContain("text-sm");
  });

  it.each([
    ["primary", ["bg-primary-100", "text-primary-800"]],
    ["secondary", ["bg-secondary-100", "text-secondary-800"]],
    ["neutral", ["bg-background-secondary", "text-foreground-primary"]],
  ])("applies %s variant classes", async (variant, expected) => {
    const html = await renderBadge({ variant });
    for (const cls of expected) {
      expect(html).toContain(cls);
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
    expect(html).toContain("bg-primary-100");
  });
});
