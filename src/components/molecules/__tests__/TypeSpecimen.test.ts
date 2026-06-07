// @vitest-environment node
import { describe, expect, it } from "vitest";
import { render } from "../../__tests__/_helpers/container";
import TypeSpecimen from "../TypeSpecimen.astro";

const renderSpecimen = () => render(TypeSpecimen, {});

describe("TypeSpecimen (molecule)", () => {
  it("renders the display + text scale steps", async () => {
    const html = await renderSpecimen();
    // representative sizes from the fontSize token scale
    expect(html).toContain("text-6xl");
    expect(html).toContain("text-base");
    expect(html).toContain("text-xs");
  });

  it("applies the display face via the font-display token utility", async () => {
    const html = await renderSpecimen();
    expect(html).toContain("font-display");
  });

  it("applies the text face via the font-text token utility", async () => {
    const html = await renderSpecimen();
    expect(html).toContain("font-text");
  });

  it("sizes come from token utilities, not hardcoded font-size literals (drift guard)", async () => {
    const html = await renderSpecimen();
    expect(html).not.toMatch(/font-size:\s*\d/);
  });
});
