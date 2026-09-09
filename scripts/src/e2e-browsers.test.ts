import { describe, expect, it } from "vitest";
import {
  formatMissingBrowsers,
  isMissingBrowserError,
  projectFilters,
  selectedProjectNames,
} from "./e2e-browsers";

const allProjects = ["chromium", "firefox", "webkit"];

describe("projectFilters", () => {
  it("reads both --project=x and --project x", () => {
    expect(projectFilters(["--project=chromium"])).toEqual(["chromium"]);
    expect(projectFilters(["--project", "chromium"])).toEqual(["chromium"]);
  });

  it("collects repeated filters", () => {
    expect(projectFilters(["--project=chromium", "--project", "webkit"])).toEqual([
      "chromium",
      "webkit",
    ]);
  });

  it("does not treat the value as another flag", () => {
    expect(projectFilters(["--project", "chromium", "--grep", "@a11y"])).toEqual(["chromium"]);
  });

  it("ignores a trailing --project with no value", () => {
    expect(projectFilters(["--project"])).toEqual([]);
  });

  it("is empty when no filter is given", () => {
    expect(projectFilters(["--grep", "@a11y"])).toEqual([]);
  });
});

describe("selectedProjectNames", () => {
  // The regression this guards: FullConfig.projects is not filtered by
  // --project, so checking every configured project would fail a
  // chromium-only run on a machine (or CI) that only installs Chromium.
  it("narrows to the filtered project", () => {
    expect(selectedProjectNames(["--project=chromium"], allProjects)).toEqual(["chromium"]);
  });

  it("returns every project when unfiltered, which is what test:e2e runs", () => {
    expect(selectedProjectNames([], allProjects)).toEqual(allProjects);
  });

  it("ignores a filter naming a project that is not configured", () => {
    expect(selectedProjectNames(["--project=edge"], allProjects)).toEqual([]);
  });
});

describe("isMissingBrowserError", () => {
  it("recognises Playwright's missing-executable failure", () => {
    const error = new Error(
      "browserType.launch: Executable doesn't exist at /Users/x/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell",
    );
    expect(isMissingBrowserError(error)).toBe(true);
  });

  it("does not claim unrelated failures — the preflight must never block a run", () => {
    expect(
      isMissingBrowserError(new Error("Target page, context or browser has been closed")),
    ).toBe(false);
    expect(isMissingBrowserError(new Error("EACCES: permission denied"))).toBe(false);
    expect(isMissingBrowserError("some string")).toBe(false);
  });
});

describe("formatMissingBrowsers", () => {
  it("names an install command covering every missing browser", () => {
    const message = formatMissingBrowsers(["firefox", "webkit"]);
    expect(message).toContain("pnpm exec playwright install firefox webkit");
    expect(message).toContain("browsers are not installed");
  });

  it("reads correctly for a single browser", () => {
    expect(formatMissingBrowsers(["chromium"])).toContain("browser is not installed");
  });
});
