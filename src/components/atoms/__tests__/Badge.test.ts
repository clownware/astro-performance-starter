// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import Badge from "../Badge.astro";

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

const render = (props: Record<string, unknown> = {}, slot = "Beta") =>
  container.renderToString(Badge, { props, slots: { default: slot } });

describe("Badge (atom)", () => {
  it("renders a <span> with the slot content", async () => {
    const html = await render({}, "New");
    expect(html).toMatch(/<span/);
    expect(html).toContain("New");
  });

  it("applies primary variant + sm size by default", async () => {
    const html = await render();
    expect(html).toContain("bg-primary-100");
    expect(html).toContain("text-primary-800");
    expect(html).toContain("text-sm");
  });

  it.each([
    ["primary", ["bg-primary-100", "text-primary-800"]],
    ["secondary", ["bg-secondary-100", "text-secondary-800"]],
    ["neutral", ["bg-background-secondary", "text-foreground-primary"]],
  ])("applies %s variant classes", async (variant, expected) => {
    const html = await render({ variant });
    for (const cls of expected) {
      expect(html).toContain(cls);
    }
  });

  it.each([
    ["xs", "text-xs"],
    ["sm", "text-sm"],
    ["md", "text-base"],
  ])("applies %s size class", async (size, expected) => {
    const html = await render({ size });
    expect(html).toContain(expected);
  });

  it("forwards role attribute when provided", async () => {
    const html = await render({ role: "status" });
    expect(html).toContain('role="status"');
  });

  it("merges custom class with variant classes", async () => {
    const html = await render({ class: "ml-2" });
    expect(html).toContain("ml-2");
    expect(html).toContain("bg-primary-100");
  });
});
