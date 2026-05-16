// @vitest-environment node
// node env: validateOgImage relies on fileURLToPath(import.meta.url) which
// requires a file:// URL (jsdom serves http://) and on node:fs.existsSync.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { validateOgImage } from "../validateOgImage";

// Tests run against the real /public/ directory. validateOgImage resolves
// paths relative to src/utils/, so /public/ files like favicon.svg should
// pass validation while a clearly bogus filename should fail.

describe("validateOgImage", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("PROD", false);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  describe("non-validating inputs (always pass)", () => {
    it("returns true for ImageMetadata-shaped objects", () => {
      expect(validateOgImage({ src: "/_astro/og.abc.svg" })).toBe(true);
    });

    it("returns true for unexpected non-string inputs", () => {
      // @ts-expect-error — intentionally invalid input to exercise guard
      expect(validateOgImage(42)).toBe(true);
      // @ts-expect-error — null is neither string nor object-with-src
      expect(validateOgImage(null)).toBe(true);
    });

    it("returns true for Astro dev-server FS-prefixed paths", () => {
      expect(validateOgImage("/@fs/abs/path/og.svg")).toBe(true);
    });

    it("returns true for Astro ImageMetadata src query strings", () => {
      expect(validateOgImage("/_astro/og.abc.svg?origWidth=1200")).toBe(true);
    });

    it("returns true for absolute http/https URLs", () => {
      expect(validateOgImage("http://example.com/og.png")).toBe(true);
      expect(validateOgImage("https://example.com/og.png")).toBe(true);
    });

    it("short-circuits to true in production builds", () => {
      vi.stubEnv("PROD", true);
      // A clearly-missing file would normally fail; PROD skips fs lookup entirely.
      expect(validateOgImage("/definitely-not-a-real-image-xyz.svg")).toBe(true);
    });
  });

  describe("filesystem validation (dev mode)", () => {
    it("returns true for a real /public/ asset", () => {
      expect(validateOgImage("/favicon.svg")).toBe(true);
    });

    it("warns and returns false when the file is missing", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      expect(validateOgImage("/definitely-not-a-real-image-xyz.svg")).toBe(false);
      expect(warn).toHaveBeenCalledOnce();
      expect(warn.mock.calls[0]?.[0]).toContain("definitely-not-a-real-image-xyz.svg");
    });
  });
});
