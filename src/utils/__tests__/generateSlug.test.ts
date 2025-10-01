import { describe, expect, it } from "vitest";
import { generateSlug, isTrustedUrl } from "../url-utils";

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

  it("handles empty string", () => {
    expect(generateSlug("")).toBe("");
  });

  it("preserves accented characters", () => {
    expect(generateSlug("Crème Brûlée")).toBe("crème-brûlée");
  });
});

describe("isTrustedUrl", () => {
  describe("basic validation", () => {
    it("returns false for empty string", () => {
      expect(isTrustedUrl("")).toBe(false);
    });

    it("returns false for null input", () => {
      expect(isTrustedUrl(null as any)).toBe(false);
    });

    it("returns false for undefined input", () => {
      expect(isTrustedUrl(undefined as any)).toBe(false);
    });

    it("returns false for non-string input", () => {
      expect(isTrustedUrl(123 as any)).toBe(false);
    });

    it("returns false for malformed URLs", () => {
      expect(isTrustedUrl("not-a-url")).toBe(false);
    });
  });

  describe("protocol validation", () => {
    it("returns false for javascript: protocol", () => {
      expect(isTrustedUrl("javascript:alert('xss')")).toBe(false);
    });

    it("returns false for data: protocol", () => {
      expect(isTrustedUrl("data:text/html,<script>alert('xss')</script>")).toBe(false);
    });

    it("returns false for file: protocol", () => {
      expect(isTrustedUrl("file:///etc/passwd")).toBe(false);
    });

    it("allows https: protocol", () => {
      expect(isTrustedUrl("https://example.com")).toBe(true);
    });

    it("allows http: protocol when no allowlist provided", () => {
      expect(isTrustedUrl("http://example.com")).toBe(false); // http not allowed by default
    });
  });

  describe("default behavior (no allowlist)", () => {
    it("allows valid https URLs", () => {
      expect(isTrustedUrl("https://github.com")).toBe(true);
      expect(isTrustedUrl("https://www.google.com")).toBe(true);
      expect(isTrustedUrl("https://example.com/path/to/page")).toBe(true);
    });

    it("rejects http URLs when no allowlist", () => {
      expect(isTrustedUrl("http://example.com")).toBe(false);
    });

    it("allows https URLs with query params", () => {
      expect(isTrustedUrl("https://example.com?foo=bar&baz=qux")).toBe(true);
    });

    it("allows https URLs with fragments", () => {
      expect(isTrustedUrl("https://example.com#section")).toBe(true);
    });
  });

  describe("allowlist validation", () => {
    it("allows exact domain match", () => {
      expect(isTrustedUrl("https://example.com", ["example.com"])).toBe(true);
    });

    it("allows subdomain match", () => {
      expect(isTrustedUrl("https://www.example.com", ["example.com"])).toBe(true);
      expect(isTrustedUrl("https://blog.example.com", ["example.com"])).toBe(true);
    });

    it("rejects non-allowlisted domains", () => {
      expect(isTrustedUrl("https://evil.com", ["example.com"])).toBe(false);
    });

    it("handles multiple allowed domains", () => {
      const allowed = ["example.com", "github.com", "google.com"];
      expect(isTrustedUrl("https://example.com", allowed)).toBe(true);
      expect(isTrustedUrl("https://github.com", allowed)).toBe(true);
      expect(isTrustedUrl("https://google.com", allowed)).toBe(true);
      expect(isTrustedUrl("https://evil.com", allowed)).toBe(false);
    });

    it("is case-insensitive for domain matching", () => {
      expect(isTrustedUrl("https://EXAMPLE.COM", ["example.com"])).toBe(true);
      expect(isTrustedUrl("https://example.com", ["EXAMPLE.COM"])).toBe(true);
    });

    it("prevents domain suffix attacks", () => {
      // Should not match "notexample.com" when allowlist is ["example.com"]
      expect(isTrustedUrl("https://notexample.com", ["example.com"])).toBe(false);
    });

    it("allows http when domain is in allowlist", () => {
      expect(isTrustedUrl("http://example.com", ["example.com"])).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("handles URLs with ports", () => {
      expect(isTrustedUrl("https://example.com:8080", ["example.com"])).toBe(true);
    });

    it("handles URLs with authentication", () => {
      expect(isTrustedUrl("https://user:pass@example.com", ["example.com"])).toBe(true);
    });

    it("handles URLs with complex paths", () => {
      expect(
        isTrustedUrl("https://example.com/path/to/resource.html?q=1#top", ["example.com"]),
      ).toBe(true);
    });

    it("handles empty allowlist array", () => {
      expect(isTrustedUrl("https://example.com", [])).toBe(true);
    });

    it("handles deeply nested subdomains", () => {
      expect(isTrustedUrl("https://a.b.c.example.com", ["example.com"])).toBe(true);
    });
  });
});
