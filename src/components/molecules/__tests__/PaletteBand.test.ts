// @vitest-environment node
import { describe, expect, it } from "vitest";
import { render } from "../../__tests__/_helpers/container";
import PaletteBand from "../PaletteBand.astro";

const renderBand = (props: Record<string, unknown> = {}) =>
  render(PaletteBand, { family: "violet", label: "primary / success · 256°", ...props });

describe("PaletteBand (molecule)", () => {
  it("renders all 11 scale steps", async () => {
    const html = await renderBand();
    for (const step of [
      "50",
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
      "950",
    ]) {
      expect(html).toContain(`>${step}<`);
    }
  });

  it("reads each step from its CSS variable for the given family", async () => {
    const html = await renderBand({ family: "violet" });
    expect(html).toContain("hsl(var(--color-violet-500))");
    expect(html).toContain("hsl(var(--color-violet-950))");
  });

  it("renders the family name and label", async () => {
    const html = await renderBand({ family: "rose", label: "secondary / error · 344°" });
    expect(html).toContain("rose");
    expect(html).toContain("secondary / error");
  });

  it("never hardcodes a literal colour (drift guard)", async () => {
    // Only hsl(var(--color-…)) is allowed; a literal hsl(<number> …) would mean
    // the band stopped reading the token source and could drift.
    const html = await renderBand();
    expect(html).not.toMatch(/hsl\(\s*\d/);
    expect(html).not.toMatch(/#[0-9a-fA-F]{3,6}/);
  });
});
