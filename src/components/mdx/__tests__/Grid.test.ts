// @vitest-environment node
import { describe, expect, it } from "vitest";
import { render } from "../../__tests__/_helpers/container";
import Grid from "../Grid.astro";

describe("Grid (mdx)", () => {
  it("defaults to a single column with gap-4", async () => {
    const html = await render(Grid, {}, { default: "<p>cell</p>" });
    expect(html).toContain("grid-cols-1");
    expect(html).toContain("gap-4");
    expect(html).toContain("<p>cell</p>");
  });

  it("emits a class per provided breakpoint and skips absent ones", async () => {
    const html = await render(Grid, { cols: 1, md: 2, xl: 4, gap: 6 });
    expect(html).toContain("grid-cols-1");
    expect(html).toContain("md:grid-cols-2");
    expect(html).toContain("xl:grid-cols-4");
    expect(html).toContain("gap-6");
    expect(html).not.toContain("sm:grid-cols");
    expect(html).not.toContain("lg:grid-cols");
  });

  it("appends a caller-supplied class", async () => {
    const html = await render(Grid, { class: "my-8" });
    expect(html).toMatch(/class="[^"]*\bmy-8\b/);
  });
});
