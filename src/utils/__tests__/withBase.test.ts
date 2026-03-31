import { describe, expect, it } from "vitest";
import { resolveBasePath, withBase } from "../url-utils";

describe("withBase", () => {
  describe("root base (no-op)", () => {
    it("returns path unchanged when base is /", () => {
      expect(withBase("/blog/", "/")).toBe("/blog/");
    });

    it("returns root path unchanged", () => {
      expect(withBase("/", "/")).toBe("/");
    });
  });

  describe("subpath base", () => {
    it("prepends base to absolute path", () => {
      expect(withBase("/blog/", "/my-repo/")).toBe("/my-repo/blog/");
    });

    it("prepends base to root path", () => {
      expect(withBase("/", "/my-repo/")).toBe("/my-repo/");
    });

    it("handles base without trailing slash", () => {
      expect(withBase("/blog/", "/my-repo")).toBe("/my-repo/blog/");
    });

    it("prepends base to static asset paths", () => {
      expect(withBase("/logo.svg", "/my-repo/")).toBe("/my-repo/logo.svg");
    });

    it("prepends base to nested paths", () => {
      expect(withBase("/blog/my-post/", "/my-repo/")).toBe("/my-repo/blog/my-post/");
    });
  });

  describe("idempotency", () => {
    it("does not double-prefix already-prefixed paths", () => {
      expect(withBase("/my-repo/blog/", "/my-repo/")).toBe("/my-repo/blog/");
    });

    it("does not double-prefix base-only path", () => {
      expect(withBase("/my-repo/", "/my-repo/")).toBe("/my-repo/");
    });

    it("does not double-prefix base without trailing slash", () => {
      expect(withBase("/my-repo", "/my-repo/")).toBe("/my-repo");
    });
  });

  describe("passthrough cases", () => {
    it("passes through empty string", () => {
      expect(withBase("", "/my-repo/")).toBe("");
    });

    it("passes through anchor links", () => {
      expect(withBase("#section", "/my-repo/")).toBe("#section");
    });

    it("passes through external URLs", () => {
      expect(withBase("https://example.com", "/my-repo/")).toBe("https://example.com");
    });

    it("passes through protocol-relative URLs", () => {
      expect(withBase("//example.com/path", "/my-repo/")).toBe("//example.com/path");
    });

    it("passes through relative paths", () => {
      expect(withBase("relative/path", "/my-repo/")).toBe("relative/path");
    });
  });

  describe("trailing slash preservation", () => {
    it("preserves trailing slash on paths", () => {
      expect(withBase("/blog/", "/my-repo/")).toBe("/my-repo/blog/");
    });

    it("preserves no trailing slash on paths", () => {
      expect(withBase("/blog", "/my-repo/")).toBe("/my-repo/blog");
    });
  });
});

describe("resolveBasePath", () => {
  it("prepends base to absolute path", () => {
    expect(resolveBasePath("/my-repo", "/blog/")).toBe("/my-repo/blog/");
  });

  it("adds leading slash to path without one", () => {
    expect(resolveBasePath("/my-repo", "blog/")).toBe("/my-repo/blog/");
  });

  it("strips trailing slash from base before joining", () => {
    expect(resolveBasePath("/my-repo/", "/blog/")).toBe("/my-repo/blog/");
  });
});
