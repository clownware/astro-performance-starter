import { describe, expect, it } from "vitest";
import { withBase } from "../url-utils";

describe("withBase", () => {
  // Default Vite/Astro BASE_URL is "/" when base is not configured
  it("returns path unchanged when base is root", () => {
    expect(withBase("/blog/")).toBe("/blog/");
  });

  it("handles root path", () => {
    expect(withBase("/")).toBe("/");
  });

  it("handles path without leading slash", () => {
    expect(withBase("blog/")).toBe("/blog/");
  });

  it("handles empty string", () => {
    expect(withBase("")).toBe("/");
  });
});
