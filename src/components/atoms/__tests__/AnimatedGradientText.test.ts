// @vitest-environment node
import { describe, expect, it } from "vitest";
import { render } from "../../__tests__/_helpers/container";
import AnimatedGradientText from "../AnimatedGradientText.astro";

const renderAgt = (props: Record<string, unknown> = {}, slot = "Ship instantly") =>
  render(AnimatedGradientText, props, { default: slot });

describe("AnimatedGradientText (atom)", () => {
  it("renders the slot content", async () => {
    const html = await renderAgt();
    expect(html).toContain("Ship instantly");
  });

  it("applies the animated-gradient-text class by default", async () => {
    const html = await renderAgt();
    expect(html).toContain("animated-gradient-text");
  });

  it("defaults to a span element", async () => {
    const html = await renderAgt();
    expect(html).toMatch(/<span[^>]*animated-gradient-text/);
  });

  it("renders the requested tag via the as prop", async () => {
    const html = await renderAgt({ as: "h1" });
    expect(html).toMatch(/<h1[^>]*animated-gradient-text/);
  });

  it("omits the hero-grad morph hook by default", async () => {
    const html = await renderAgt();
    expect(html).not.toContain("hero-grad");
  });

  it("adds the hero-grad morph hook when morph is set", async () => {
    // morph tags the headline with view-transition-name: hero-grad so it
    // tweens across routes during page transitions (ADR-048, technique 2).
    const html = await renderAgt({ morph: true });
    expect(html).toContain("hero-grad");
  });
});
