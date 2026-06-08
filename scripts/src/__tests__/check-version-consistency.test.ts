import { describe, expect, it } from "vitest";
import { findVersionMismatches } from "../check-version-consistency.ts";

/**
 * Guards against the README footer version drifting from package.json (the
 * exact drift that shipped: README said v0.2.0 while package.json was 0.9.0).
 * Matches the `• vX.Y.Z` footer pattern and compares against the package version.
 */
describe("findVersionMismatches", () => {
  it("returns no mismatches when the footer matches package.json", () => {
    const readme = "Some intro\n\n**Status**: Active development • v0.9.0\n";
    expect(findVersionMismatches("0.9.0", readme)).toEqual([]);
  });

  it("flags a stale footer version", () => {
    const readme = "**Status**: Active development • v0.2.0\n";
    expect(findVersionMismatches("0.9.0", readme)).toEqual(["v0.2.0"]);
  });

  it("flags every drifted occurrence", () => {
    const readme = "• v0.1.0 ... later • v0.9.0 ... • v0.2.0";
    expect(findVersionMismatches("0.9.0", readme)).toEqual(["v0.1.0", "v0.2.0"]);
  });

  it("matches prerelease versions exactly", () => {
    const readme = "• v1.0.0-rc.1";
    expect(findVersionMismatches("1.0.0-rc.1", readme)).toEqual([]);
    expect(findVersionMismatches("1.0.0", readme)).toEqual(["v1.0.0-rc.1"]);
  });

  it("returns nothing when the README has no version footer", () => {
    expect(findVersionMismatches("0.9.0", "no version here")).toEqual([]);
  });
});
