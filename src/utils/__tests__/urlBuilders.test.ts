import { describe, expect, it } from "vitest";
import {
  getBlogPostUrl,
  getBlogTagUrl,
  getProjectUrl,
  isTrustedUrl,
  urlPatterns,
} from "../url-utils";

// urlPatterns uses withBase() with the configured Astro base path. Vitest runs
// with import.meta.env.BASE_URL === "/", so withBase is effectively identity
// here — that's the right test for the default root-deployment case.

describe("urlPatterns", () => {
  it("renders static routes at root base", () => {
    expect(urlPatterns.home()).toBe("/");
    expect(urlPatterns.projects()).toBe("/projects/");
    expect(urlPatterns.blog()).toBe("/blog/");
    expect(urlPatterns.about()).toBe("/about/");
    expect(urlPatterns.contact()).toBe("/contact/");
  });

  it("renders dynamic routes with slugs", () => {
    expect(urlPatterns.project("my-project")).toBe("/projects/my-project/");
    expect(urlPatterns.blogPost("hello-world")).toBe("/blog/hello-world/");
  });

  describe("blogTag", () => {
    it("lowercases and dash-joins tag strings", () => {
      expect(urlPatterns.blogTag("Design System")).toBe("/blog/tag/design-system/");
    });

    it("normalizes runs of whitespace", () => {
      expect(urlPatterns.blogTag("UX   Research")).toBe("/blog/tag/ux-research/");
    });

    it("keeps already-slug-shaped tags intact", () => {
      expect(urlPatterns.blogTag("a11y")).toBe("/blog/tag/a11y/");
    });
  });

  describe("blogArchive", () => {
    it("renders year-only archive URL", () => {
      expect(urlPatterns.blogArchive(2025)).toBe("/blog/2025/");
    });

    it("zero-pads single-digit months", () => {
      expect(urlPatterns.blogArchive(2025, 3)).toBe("/blog/2025/03/");
    });

    it("preserves two-digit months", () => {
      expect(urlPatterns.blogArchive(2025, 11)).toBe("/blog/2025/11/");
    });
  });
});

describe("entry URL helpers", () => {
  it("getProjectUrl uses the entry id as slug", () => {
    const project = { id: "starter-kit", data: { title: "Starter Kit" } };
    expect(getProjectUrl(project)).toBe("/projects/starter-kit/");
  });

  it("getBlogPostUrl uses the entry id as slug", () => {
    const post = {
      id: "shipping-fast",
      data: { title: "Shipping Fast", date: new Date("2025-01-01") },
    };
    expect(getBlogPostUrl(post)).toBe("/blog/shipping-fast/");
  });

  it("getBlogTagUrl normalises through urlPatterns", () => {
    expect(getBlogTagUrl("Open Source")).toBe("/blog/tag/open-source/");
  });
});

describe("isTrustedUrl", () => {
  describe("invalid inputs", () => {
    it("rejects empty string", () => {
      expect(isTrustedUrl("")).toBe(false);
    });

    it("rejects non-string input", () => {
      // @ts-expect-error — runtime guard validates type defensively
      expect(isTrustedUrl(null)).toBe(false);
      // @ts-expect-error — runtime guard validates type defensively
      expect(isTrustedUrl(42)).toBe(false);
    });

    it("rejects malformed URLs", () => {
      expect(isTrustedUrl("not-a-url")).toBe(false);
      expect(isTrustedUrl("://broken")).toBe(false);
    });

    it("rejects javascript: protocol", () => {
      expect(isTrustedUrl("javascript:alert(1)")).toBe(false);
    });

    it("rejects non-http(s) protocols", () => {
      expect(isTrustedUrl("ftp://example.com/file")).toBe(false);
      expect(isTrustedUrl("file:///etc/passwd")).toBe(false);
      expect(isTrustedUrl("data:text/html,<h1>x</h1>")).toBe(false);
    });
  });

  describe("default allow-list behaviour", () => {
    it("accepts any https URL when no allow-list is provided", () => {
      expect(isTrustedUrl("https://example.com/path")).toBe(true);
      expect(isTrustedUrl("https://anything-goes.dev")).toBe(true);
    });

    it("rejects plain http when no allow-list is provided", () => {
      expect(isTrustedUrl("http://example.com")).toBe(false);
    });
  });

  describe("explicit allow-list", () => {
    const allowed = ["example.com", "trusted.dev"];

    it("accepts exact domain match", () => {
      expect(isTrustedUrl("https://example.com/path", allowed)).toBe(true);
    });

    it("accepts subdomain match", () => {
      expect(isTrustedUrl("https://www.example.com/path", allowed)).toBe(true);
      expect(isTrustedUrl("https://api.trusted.dev/v1", allowed)).toBe(true);
    });

    it("rejects unlisted domain", () => {
      expect(isTrustedUrl("https://malicious.com/exploit", allowed)).toBe(false);
    });

    it("rejects look-alike domain (suffix not a subdomain boundary)", () => {
      expect(isTrustedUrl("https://notexample.com/path", allowed)).toBe(false);
    });

    it("matches case-insensitively", () => {
      expect(isTrustedUrl("https://EXAMPLE.COM/path", allowed)).toBe(true);
      expect(isTrustedUrl("https://example.com/path", ["EXAMPLE.com"])).toBe(true);
    });

    it("accepts http when explicitly allow-listed by domain", () => {
      // Allow-list logic doesn't filter by protocol once protocol is http/https.
      expect(isTrustedUrl("http://example.com", allowed)).toBe(true);
    });
  });
});
