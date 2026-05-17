// @vitest-environment node
import { describe, expect, it } from "vitest";
import { render } from "../../__tests__/_helpers/container";
import Tabs from "../Tabs.astro";

const sampleTabs = [
  { id: "overview", label: "Overview" },
  { id: "usage", label: "Usage" },
  { id: "a11y", label: "Accessibility" },
];

const renderTabs = (
  props: Record<string, unknown> = { tabs: sampleTabs },
  slot = '<div data-tab-panel="overview">Body</div>',
) => render(Tabs, props, { default: slot });

describe("Tabs (molecule)", () => {
  describe("tablist structure", () => {
    it("renders a role=tablist container", async () => {
      const html = await renderTabs();
      expect(html).toContain('role="tablist"');
    });

    it("renders one role=tab per tab item", async () => {
      const html = await renderTabs();
      const tabMatches = html.match(/role="tab"/g) ?? [];
      expect(tabMatches).toHaveLength(sampleTabs.length);
    });

    it("renders each tab label as visible text", async () => {
      const html = await renderTabs();
      for (const tab of sampleTabs) {
        expect(html).toContain(tab.label);
      }
    });
  });

  describe("default selection", () => {
    it("marks the first tab as selected when defaultTab is omitted", async () => {
      const html = await renderTabs();
      // The first tab label should carry aria-selected="true" and tabindex="0"
      expect(html).toMatch(/aria-selected="true"[^>]*aria-controls="panel-[^"]*-overview"/);
    });

    it("respects defaultTab when provided", async () => {
      const html = await renderTabs({ tabs: sampleTabs, defaultTab: "usage" });
      expect(html).toMatch(/aria-selected="true"[^>]*aria-controls="panel-[^"]*-usage"/);
    });

    it("non-selected tabs carry tabindex=-1 (roving tabindex pattern)", async () => {
      const html = await renderTabs();
      // The two non-selected tabs both have tabindex="-1"
      const inactiveMatches = html.match(/aria-selected="false"[^>]*tabindex="-1"/g) ?? [];
      expect(inactiveMatches.length).toBe(sampleTabs.length - 1);
    });
  });

  describe("radio-state holders", () => {
    it("renders a sr-only radio for each tab", async () => {
      const html = await renderTabs();
      const radioMatches = html.match(/<input[^>]*type="radio"/g) ?? [];
      expect(radioMatches).toHaveLength(sampleTabs.length);
    });

    it("marks the active tab's radio as checked", async () => {
      const html = await renderTabs({ tabs: sampleTabs, defaultTab: "a11y" });
      expect(html).toMatch(/<input[^>]*value="a11y"[^>]*checked/);
    });

    it("radios are aria-hidden and tabindex=-1", async () => {
      const html = await renderTabs();
      // Every radio must be aria-hidden; never appears in focus order
      expect(html).toMatch(/<input[^>]*aria-hidden="true"/);
      expect(html).toMatch(/<input[^>]*tabindex="-1"/);
    });
  });

  describe("slot rendering", () => {
    it("renders panel slot content inside .tabs__panels", async () => {
      const html = await renderTabs(
        { tabs: sampleTabs },
        '<div data-tab-panel="overview">Overview Body</div>',
      );
      expect(html).toContain("Overview Body");
    });
  });

  describe("class composition", () => {
    it("merges a custom class onto the tabs wrapper", async () => {
      const html = await renderTabs({ tabs: sampleTabs, class: "my-tabs" });
      expect(html).toContain("my-tabs");
    });
  });
});
