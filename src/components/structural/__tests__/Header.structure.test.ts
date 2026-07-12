// @vitest-environment node
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Structural drift guards for Header.astro (#247).
 *
 * The component reads the navigation content collection, so it can't render
 * through the Astro Container in a unit test — the mobile-menu *behaviour*
 * is e2e-guarded. These guards pin the structural invariants the e2e tests
 * assume, so a markup refactor fails fast here instead of surfacing as a
 * flaky viewport-dependent e2e failure.
 */

const source = readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), "../Header.astro"),
  "utf-8",
);

describe("Header structure", () => {
  it("keeps backdrop-filter off <header> so it can't become the fixed menu's containing block", () => {
    // The containing-block fix: backdrop-blur on <header> would trap the
    // fixed #mobile-menu and shrink it to the header height.
    const headerTag = source.match(/<header[^>]*>/)?.[0] ?? "";
    expect(headerTag).not.toContain("backdrop-blur");
    // the blur must still exist, on an inner wrapper
    expect(source).toContain("supports-backdrop-filter:backdrop-blur-sm");
  });

  it("positions the mobile menu as a fixed full-viewport overlay below the bar", () => {
    const menuTag = source.match(/<nav[^>]*id="mobile-menu"[^>]*>/s)?.[0] ?? "";
    expect(menuTag).toContain("fixed");
    expect(menuTag).toContain("inset-0");
    expect(menuTag).toContain("top-16");
  });

  it("drives menu visibility from the checkbox peer, not JavaScript", () => {
    expect(source).toContain('id="mobile-menu-toggle"');
    expect(source).toMatch(/<input[^>]*type="checkbox"[^>]*class="peer/s);
    const menuTag = source.match(/<nav[^>]*id="mobile-menu"[^>]*>/s)?.[0] ?? "";
    expect(menuTag).toContain("peer-checked:flex");
  });

  it("wires the toggle button's ARIA to the menu and syncs aria-expanded on change", () => {
    const label = source.match(/<label[^>]*for="mobile-menu-toggle"[^>]*>/s)?.[0] ?? "";
    expect(label).toContain('role="button"');
    expect(label).toContain('aria-controls="mobile-menu"');
    expect(label).toContain('aria-expanded="false"');
    // the change listener keeps aria-expanded truthful (CSS can't mutate attributes)
    expect(source).toContain("syncMobileMenuExpanded");
    expect(source).toContain("astro:after-swap");
  });

  it("closes the persisted menu on link click and on Escape", () => {
    // transition:persist keeps the checkbox checked across navigations;
    // without these handlers the menu stays open after every tap.
    expect(source).toContain("transition:persist");
    expect(source).toContain("#mobile-menu a");
    expect(source).toContain("'Escape'");
  });
});
