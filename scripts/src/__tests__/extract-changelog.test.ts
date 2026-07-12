import { describe, expect, it } from "vitest";
import { extractChangelogSection } from "../extract-changelog.ts";

/**
 * Extracts one version's section from the Keep-a-Changelog-format CHANGELOG.md
 * for use as GitHub Release notes (release.yml runs this on v* tag push).
 * Headings look like `## [0.9.0] — 2026-05-17`; the section runs until the
 * next `## [` heading or end of file.
 */
describe("extractChangelogSection", () => {
  const changelog = [
    "# Changelog",
    "",
    "## [Unreleased]",
    "",
    "## [0.9.0] — 2026-05-17",
    "",
    "Release candidate.",
    "",
    "### Added",
    "",
    "- Layered AI constitution",
    "",
    "## [0.2.0] — 2025-11-02",
    "",
    "### Fixed",
    "",
    "- A bug",
  ].join("\n");

  it("returns the body between the version heading and the next section", () => {
    expect(extractChangelogSection(changelog, "0.9.0")).toBe(
      "Release candidate.\n\n### Added\n\n- Layered AI constitution",
    );
  });

  it("returns the last section when the version is the oldest entry", () => {
    expect(extractChangelogSection(changelog, "0.2.0")).toBe("### Fixed\n\n- A bug");
  });

  it("accepts a v-prefixed version (tag names are vX.Y.Z)", () => {
    expect(extractChangelogSection(changelog, "v0.2.0")).toBe("### Fixed\n\n- A bug");
  });

  it("returns null when the version has no section", () => {
    expect(extractChangelogSection(changelog, "0.3.0")).toBeNull();
  });

  it("does not match the version as a substring of another version", () => {
    // "0.2" must not match the "0.2.0" heading
    expect(extractChangelogSection(changelog, "0.2")).toBeNull();
  });

  it("returns null for an empty section body", () => {
    const sparse = "## [1.0.0] — 2026-01-01\n\n## [0.9.0] — 2025-12-01\n\nBody";
    expect(extractChangelogSection(sparse, "1.0.0")).toBeNull();
  });
});
