// @vitest-environment node
import { describe, expect, it } from "vitest";
import { render } from "../../__tests__/_helpers/container";
import CursorSpotlight from "../CursorSpotlight.astro";

const renderSpotlight = (props: Record<string, unknown> = {}, slot = "<h1>Hero</h1>") =>
  render(CursorSpotlight, props, { default: slot });

describe("CursorSpotlight (atom)", () => {
  it("wraps slot content in a cursor-spotlight container", async () => {
    const html = await renderSpotlight();
    expect(html).toMatch(/<div[^>]*cursor-spotlight/);
  });

  it("renders the slotted children", async () => {
    const html = await renderSpotlight();
    expect(html).toContain("<h1>Hero</h1>");
  });

  it("merges a custom class with the base class", async () => {
    const html = await renderSpotlight({ class: "rounded-2xl" });
    expect(html).toContain("cursor-spotlight");
    expect(html).toContain("rounded-2xl");
  });
});
