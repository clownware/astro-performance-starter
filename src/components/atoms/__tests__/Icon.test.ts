// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import Icon from "../Icon.astro";

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

const render = (props: Record<string, unknown>, slot?: string) =>
  container.renderToString(Icon, {
    props,
    slots: slot ? { default: slot } : {},
  });

describe("Icon (atom)", () => {
  describe("rendering", () => {
    it("renders an <svg> element", async () => {
      const html = await render({ name: "github" });
      expect(html).toMatch(/<svg[^>]*viewBox="0 0 24 24"/);
    });

    it("applies the default sizing class when none is provided", async () => {
      const html = await render({ name: "github" });
      expect(html).toContain("w-5 h-5");
    });

    it("applies a custom class instead of the default", async () => {
      const html = await render({ name: "github", class: "w-8 h-8 text-primary-600" });
      expect(html).toContain("w-8 h-8");
      expect(html).toContain("text-primary-600");
    });
  });

  describe("fill/stroke selection", () => {
    it("uses fill=currentColor for solid icons like github", async () => {
      const html = await render({ name: "github" });
      expect(html).toContain('fill="currentColor"');
      expect(html).not.toMatch(/stroke="currentColor"/);
    });

    it.each([
      "arrow-down",
      "arrow-right",
      "external-link",
    ] as const)("uses stroke=currentColor for stroke-path icon %s", async (name) => {
      const html = await render({ name });
      expect(html).toContain('fill="none"');
      expect(html).toContain('stroke="currentColor"');
      expect(html).toContain('stroke-linecap="round"');
    });
  });

  describe("accessibility", () => {
    it("is hidden from AT by default (decorative=false but no label)", async () => {
      const html = await render({ name: "github" });
      // role only set when both label present and not decorative
      expect(html).not.toMatch(/role="img"/);
    });

    it("exposes an accessible name via aria-label + role=img", async () => {
      const html = await render({ name: "github", ariaLabel: "GitHub" });
      expect(html).toContain('aria-label="GitHub"');
      expect(html).toContain('role="img"');
    });

    it("hides from AT when decorative=true even if a label is provided", async () => {
      const html = await render({ name: "github", ariaLabel: "ignored", decorative: true });
      expect(html).toContain('aria-hidden="true"');
      expect(html).not.toMatch(/role="img"/);
    });
  });

  describe("custom slot", () => {
    it("renders slot content when name=custom", async () => {
      const html = await render({ name: "custom" }, '<path d="M0 0h24v24H0z" />');
      expect(html).toContain('<path d="M0 0h24v24H0z" />');
    });
  });
});
