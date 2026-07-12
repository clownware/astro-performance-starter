// @vitest-environment node
import { describe, expect, it } from "vitest";
import { render } from "../../__tests__/_helpers/container";
import Figure from "../Figure.astro";

describe("Figure (mdx)", () => {
  it("renders the image with its src and alt", async () => {
    const html = await render(Figure, { src: "/img/diagram.svg", alt: "System diagram" });
    expect(html).toContain('src="/img/diagram.svg"');
    expect(html).toContain('alt="System diagram"');
  });

  it("renders no figcaption when caption is omitted", async () => {
    const html = await render(Figure, { src: "/img/diagram.svg", alt: "System diagram" });
    expect(html).not.toContain("<figcaption");
  });

  it("renders the caption in a figcaption when given", async () => {
    const html = await render(Figure, {
      src: "/img/diagram.svg",
      alt: "System diagram",
      caption: "Figure 1 — request flow",
    });
    expect(html).toMatch(/<figcaption[^>]*>Figure 1 — request flow<\/figcaption>/);
  });

  it("passes extra figure attributes through", async () => {
    const html = await render(Figure, {
      src: "/img/diagram.svg",
      alt: "System diagram",
      id: "fig-1",
    });
    expect(html).toMatch(/<figure[^>]*id="fig-1"/);
  });
});
