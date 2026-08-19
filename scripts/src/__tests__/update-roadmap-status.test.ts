import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildRoadmapChecklist,
  getPhaseStatus,
  replaceRoadmapSection,
} from "../update-roadmap-status.ts";

/**
 * The roadmap checklist in docs/README.md is regenerated from the
 * implementation guides: a phase is complete when its guide lives in
 * `completed/`, or when the guide's frontmatter carries `status: complete`
 * (the documented override). Guides the script cannot find are rendered as
 * unchecked with a "(Guide not found)" marker.
 */

/** Build a throwaway implementation-guides tree. */
function makeGuides(layout: Record<string, Record<string, string>>): string {
  const root = mkdtempSync(join(tmpdir(), "roadmap-test-"));
  for (const [dir, files] of Object.entries(layout)) {
    mkdirSync(join(root, dir), { recursive: true });
    for (const [name, body] of Object.entries(files)) {
      writeFileSync(join(root, dir, name), body);
    }
  }
  return root;
}

const foundation = { id: 0, name: "Foundation", pathMatcher: /phase-0-foundation\.md$/i };
const components = { id: 5, name: "Components", pathMatcher: /phase-5-components\.md$/i };

describe("getPhaseStatus", () => {
  it("marks a phase complete when its guide lives in completed/", () => {
    const guidesDir = makeGuides({
      completed: { "phase-0-foundation.md": "# Phase 0\n" },
    });

    expect(getPhaseStatus(foundation, guidesDir)).toEqual({
      id: 0,
      name: "Foundation",
      completed: true,
      found: true,
    });
  });

  it("marks a phase incomplete when its guide lives in active-phases/", () => {
    const guidesDir = makeGuides({
      "active-phases": { "phase-5-components.md": "# Phase 5\n" },
    });

    expect(getPhaseStatus(components, guidesDir)).toMatchObject({
      completed: false,
      found: true,
    });
  });

  it("honours a frontmatter `status: complete` override outside completed/", () => {
    const guidesDir = makeGuides({
      "active-phases": {
        "phase-5-components.md": "---\nstatus: complete\n---\n# Phase 5\n",
      },
    });

    expect(getPhaseStatus(components, guidesDir)).toMatchObject({
      completed: true,
      found: true,
    });
  });

  it("reports a missing guide as not found and not completed", () => {
    const guidesDir = makeGuides({ completed: {}, "active-phases": {} });

    expect(getPhaseStatus(components, guidesDir)).toEqual({
      id: 5,
      name: "Components",
      completed: false,
      found: false,
    });
  });
});

describe("buildRoadmapChecklist", () => {
  it("renders one checkbox line per phase with a not-found marker where needed", () => {
    const guidesDir = makeGuides({
      completed: { "phase-0-foundation.md": "# Phase 0\n" },
      "active-phases": { "phase-5-components.md": "# Phase 5\n" },
    });
    const phases = [
      foundation,
      components,
      { id: 12, name: "Post-Launch", pathMatcher: /phase-12-post-launch\.md$/i },
    ];

    expect(buildRoadmapChecklist(guidesDir, phases)).toBe(
      [
        "- [x] Phase 0: Foundation",
        "- [ ] Phase 5: Components",
        "- [ ] Phase 12: Post-Launch (Guide not found)",
      ].join("\n"),
    );
  });
});

describe("replaceRoadmapSection", () => {
  const readme = [
    "# Docs",
    "",
    "<!-- ROADMAP_STATUS_START -->",
    "<!-- Synced by `pnpm run roadmap:update`. Do not manually edit. -->",
    "- [ ] Phase 0: Foundation",
    "<!-- ROADMAP_STATUS_END -->",
    "",
    "## After",
  ].join("\n");

  it("replaces only the content between the markers and keeps the sync notice", () => {
    const result = replaceRoadmapSection(readme, "- [x] Phase 0: Foundation");

    expect(result).toBe(
      [
        "# Docs",
        "",
        "<!-- ROADMAP_STATUS_START -->",
        "<!-- Synced by `pnpm run roadmap:update`. Do not manually edit. -->",
        "- [x] Phase 0: Foundation",
        "<!-- ROADMAP_STATUS_END -->",
        "",
        "## After",
      ].join("\n"),
    );
  });

  it("is idempotent: applying the same checklist twice yields the same document", () => {
    const once = replaceRoadmapSection(readme, "- [x] Phase 0: Foundation");
    expect(replaceRoadmapSection(once, "- [x] Phase 0: Foundation")).toBe(once);
  });

  it("throws when the start marker is missing", () => {
    const noStart = readme.replace("<!-- ROADMAP_STATUS_START -->", "");
    expect(() => replaceRoadmapSection(noStart, "- [x] x")).toThrow(/markers/);
  });

  it("throws when the markers are in the wrong order", () => {
    const swapped = [
      "<!-- ROADMAP_STATUS_END -->",
      "- [ ] x",
      "<!-- ROADMAP_STATUS_START -->",
    ].join("\n");
    expect(() => replaceRoadmapSection(swapped, "- [x] x")).toThrow(/markers/);
  });
});
