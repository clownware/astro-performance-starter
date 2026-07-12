// @vitest-environment node
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { render } from "../../__tests__/_helpers/container";
import ScrollReveal from "../ScrollReveal.astro";

describe("ScrollReveal (atom)", () => {
  it("defaults to the fade-up animation with no delay style", async () => {
    const html = await render(ScrollReveal, {}, { default: "content" });
    expect(html).toContain("scroll-reveal--fade-up");
    expect(html).not.toContain("--reveal-delay:");
    expect(html).toContain("content");
  });

  it("selects the animation variant class from the prop", async () => {
    const html = await render(ScrollReveal, { animation: "slide-left" });
    expect(html).toContain("scroll-reveal--slide-left");
    expect(html).not.toContain("scroll-reveal--fade-up");
  });

  it("maps named delays to the --reveal-delay custom property", async () => {
    const html = await render(ScrollReveal, { delay: "medium" });
    expect(html).toContain("--reveal-delay: 200ms");
  });

  describe("progressive-enhancement gating (source guard)", () => {
    // The reveal must be zero-JS and must never hide content from users the
    // animation can't serve: unsupported browsers (@supports) and
    // reduced-motion users both get the content immediately. Guard the
    // gating structure so a style refactor can't silently drop either gate.
    const source = readFileSync(
      resolve(dirname(fileURLToPath(import.meta.url)), "../ScrollReveal.astro"),
      "utf-8",
    );

    it("gates all animation behind @supports (animation-timeline: view())", () => {
      const supportsBlock = source.indexOf("@supports (animation-timeline: view())");
      expect(supportsBlock).toBeGreaterThan(-1);
      // no animation declarations before the @supports gate
      expect(source.slice(0, supportsBlock)).not.toMatch(/animation:\s/);
    });

    it("gates all animation behind prefers-reduced-motion: no-preference", () => {
      expect(source).toContain("@media (prefers-reduced-motion: no-preference)");
    });

    it("ships no client-side script (CSS-only per constitution rule 7)", () => {
      expect(source).not.toContain("<script");
    });
  });
});
