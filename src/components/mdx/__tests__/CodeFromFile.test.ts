// @vitest-environment node
import { describe, expect, it } from "vitest";
import { render } from "../../__tests__/_helpers/container";
import CodeFromFile from "../CodeFromFile.astro";

describe("CodeFromFile (mdx)", () => {
  it("reads the referenced file relative to parentUrl and renders its content", async () => {
    const html = await render(CodeFromFile, {
      src: "./Grid.astro",
      lang: "astro",
      title: "Grid.astro",
      parentUrl: new URL("../Grid.astro", import.meta.url).href,
    });
    expect(html).toContain("Grid.astro");
    // a distinctive line from the source file survives into the highlighted output
    expect(html).toContain("grid-cols-");
  });
});
