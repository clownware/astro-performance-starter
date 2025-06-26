import { describe, expect, it } from "vitest";
import { generateSlug } from "../url-utils";

describe("generateSlug", () => {
  it("converts spaces to hyphens and lowercases", () => {
    expect(generateSlug("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(generateSlug("Café & Bistro!")).toBe("café-bistro");
  });

  it("deduplicates multiple hyphens", () => {
    expect(generateSlug("A  B   C")).toBe("a-b-c");
  });
});
