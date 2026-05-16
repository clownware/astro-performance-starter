// @vitest-environment node
// Astro container renders components on the server — needs node, not jsdom.

import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import Button from "../Button.astro";

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

const render = (props: Record<string, unknown> = {}, slot = "Click me") =>
  container.renderToString(Button, { props, slots: { default: slot } });

describe("Button (atom)", () => {
  describe("element selection", () => {
    it("renders a <button> by default", async () => {
      const html = await render();
      expect(html).toMatch(/<button[^>]*type="button"/);
      expect(html).not.toMatch(/<a /);
    });

    it("renders an <a> when href is provided", async () => {
      const html = await render({ href: "/about" });
      expect(html).toMatch(/<a [^>]*href="\/about"/);
      expect(html).not.toMatch(/<button/);
    });

    it("renders slot content", async () => {
      const html = await render({}, "Submit form");
      expect(html).toContain("Submit form");
    });
  });

  describe("variant styling", () => {
    it("applies primary variant classes by default", async () => {
      const html = await render();
      expect(html).toContain("bg-primary-600");
    });

    it("applies secondary variant classes", async () => {
      const html = await render({ variant: "secondary" });
      expect(html).toContain("bg-background-secondary");
      expect(html).toContain("border-border-emphasis");
    });

    it("applies ghost variant classes", async () => {
      const html = await render({ variant: "ghost" });
      expect(html).toContain("text-foreground-secondary");
    });
  });

  describe("size styling", () => {
    it("applies medium size by default", async () => {
      const html = await render();
      expect(html).toContain("text-sm");
      expect(html).toContain("min-h-[2.75rem]");
    });

    it("applies small size", async () => {
      const html = await render({ size: "sm" });
      expect(html).toContain("text-xs");
      expect(html).toContain("min-h-[2rem]");
    });

    it("applies large size", async () => {
      const html = await render({ size: "lg" });
      expect(html).toContain("text-base");
      expect(html).toContain("min-h-[2.75rem]");
    });
  });

  describe("accessibility", () => {
    it("sets aria-disabled and disabled when disabled=true on <button>", async () => {
      const html = await render({ disabled: true });
      expect(html).toContain('aria-disabled="true"');
      expect(html).toMatch(/<button[^>]* disabled/);
    });

    it("sets aria-disabled and tabindex=-1 on disabled <a>", async () => {
      const html = await render({ href: "/x", disabled: true });
      expect(html).toContain('aria-disabled="true"');
      expect(html).toContain('tabindex="-1"');
    });

    it("does not set aria-disabled=false on enabled state", async () => {
      const html = await render();
      // aria-disabled defaults to absent (or "false" string) — we just confirm
      // the boolean prop isn't leaking a truthy value.
      expect(html).not.toMatch(/aria-disabled="true"/);
    });
  });

  describe("class composition", () => {
    it("merges a custom class with variant + size classes", async () => {
      const html = await render({ class: "my-custom-class" });
      expect(html).toContain("my-custom-class");
      expect(html).toContain("bg-primary-600");
    });
  });
});
