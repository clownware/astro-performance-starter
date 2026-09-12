import { describe, expect, it } from "vitest";
import { displayVersion } from "../stackVersions";

describe("displayVersion", () => {
  describe("stable majors", () => {
    it("shows only the major for an exact pin", () => {
      expect(displayVersion("7.3.2")).toBe("v7");
    });

    it("shows only the major for a loose .x pin", () => {
      expect(displayVersion("24.x")).toBe("v24");
    });

    it("accepts a v-prefixed pin", () => {
      expect(displayVersion("v10.13.1")).toBe("v10");
    });
  });

  describe("pre-1.0 pins", () => {
    it("keeps the minor and marks the patch as a range", () => {
      expect(displayVersion("0.35.4")).toBe("v0.35.x");
    });

    it("rejects a 0.x pin that has no minor to keep", () => {
      expect(() => displayVersion("0.x")).toThrow(/minor/);
    });
  });

  describe("invalid input", () => {
    it("rejects a pin that does not start with a number", () => {
      expect(() => displayVersion("latest")).toThrow(/Unrecognised/);
    });
  });
});
