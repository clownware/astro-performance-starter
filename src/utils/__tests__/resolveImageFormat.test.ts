// @vitest-environment node
import { describe, expect, it } from "vitest";
import { resolveImageFormat } from "../resolveImageFormat";

describe("resolveImageFormat", () => {
  it("passes SVG sources through as svg regardless of requested format", () => {
    // Astro 6.4+ disables SVG rasterization; svg sources must keep format="svg"
    expect(resolveImageFormat(undefined, "svg")).toBe("svg");
    expect(resolveImageFormat("avif", "svg")).toBe("svg");
    expect(resolveImageFormat("png", "svg")).toBe("svg");
    expect(resolveImageFormat("jpg", "svg")).toBe("svg");
  });

  it("defaults raster sources to avif", () => {
    expect(resolveImageFormat(undefined, "png")).toBe("avif");
    expect(resolveImageFormat(undefined, "jpeg")).toBe("avif");
    expect(resolveImageFormat(undefined, undefined)).toBe("avif");
  });

  it("normalizes jpg to jpeg for raster sources", () => {
    expect(resolveImageFormat("jpg", "png")).toBe("jpeg");
  });

  it("maps unprocessable requested formats to png for raster sources", () => {
    // sharp does not output svg/gif; keep the pre-existing png fallback
    expect(resolveImageFormat("svg", "png")).toBe("png");
    expect(resolveImageFormat("gif", "png")).toBe("png");
  });

  it("honours explicit processed formats for raster sources", () => {
    expect(resolveImageFormat("webp", "png")).toBe("webp");
    expect(resolveImageFormat("png", "jpeg")).toBe("png");
  });
});
