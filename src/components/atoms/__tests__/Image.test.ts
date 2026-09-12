// @vitest-environment node
import { describe, expect, it } from "vitest";
import vector from "../../../assets/brand/mark-primary.svg";
import { render } from "../../__tests__/_helpers/container";
import Image from "../Image.astro";
import raster from "./_fixtures/raster.jpg";

// The responsive defaults ADR-030 documents (constrained layout, generated
// srcset + sizes) come from astro.config.mjs — `image.layout` and
// `image.responsiveStyles`. These tests pin the shipped behaviour so the config
// cannot silently stop applying again, as it did when the block was written
// under a key Astro never had (`image.responsive`).

describe("Image (atom) — responsive defaults (ADR-030)", () => {
  describe("raster source with fixed dimensions", () => {
    it("is marked with the constrained layout", async () => {
      const html = await render(Image, { src: raster, alt: "Fixture", width: 320, height: 180 });
      expect(html).toContain('data-astro-image="constrained"');
    });

    it("emits a width-descriptor srcset with more than one candidate", async () => {
      const html = await render(Image, { src: raster, alt: "Fixture", width: 320, height: 180 });
      const srcset = /srcset="([^"]+)"/.exec(html)?.[1] ?? "";
      const widthDescriptors = srcset
        .split(",")
        .filter((candidate) => /\s\d+w$/.test(candidate.trim()));
      expect(widthDescriptors.length).toBeGreaterThan(1);
    });

    it("derives a sizes attribute from the layout when the caller gives none", async () => {
      const html = await render(Image, { src: raster, alt: "Fixture", width: 320, height: 180 });
      expect(html).toContain('sizes="(min-width: 320px) 320px, 100vw"');
    });
  });

  describe("raster source without dimensions", () => {
    it("still receives a width-descriptor srcset", async () => {
      const html = await render(Image, { src: raster, alt: "Fixture" });
      expect(html).toMatch(/srcset="[^"]*\s\d+w/);
    });
  });

  describe("svg source", () => {
    it("passes through outside the responsive layout", async () => {
      const html = await render(Image, { src: vector, alt: "Mark", width: 96, height: 96 });
      expect(html).not.toContain("data-astro-image");
    });
  });
});
