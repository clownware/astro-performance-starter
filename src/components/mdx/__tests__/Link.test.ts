import { h, render } from "preact";
import { afterEach, describe, expect, it } from "vitest";
import Link from "../Link";

// jsdom-based rendering with preact's own runtime — preact-render-to-string
// is not directly resolvable under pnpm's strict node_modules layout.
function mount(props: { href?: string; class?: string }, text = "link text"): HTMLAnchorElement {
  render(h(Link, { ...props, children: text }), document.body);
  const anchor = document.body.querySelector("a");
  if (!anchor) {
    throw new Error("Link did not render an <a>");
  }
  return anchor;
}

afterEach(() => {
  render(null, document.body);
});

describe("Link (mdx)", () => {
  describe("external links", () => {
    it("opens http(s) URLs in a new tab with rel protection", () => {
      const anchor = mount({ href: "https://example.org/" });
      expect(anchor.getAttribute("target")).toBe("_blank");
      expect(anchor.getAttribute("rel")).toBe("noopener noreferrer");
    });

    it("announces the new tab to screen readers", () => {
      const anchor = mount({ href: "http://example.org/" });
      const srOnly = anchor.querySelector(".sr-only");
      expect(srOnly?.textContent).toContain("opens in new tab");
    });
  });

  describe("internal links", () => {
    it.each([
      "/blog/",
      "#section",
      "relative/page",
    ])("leaves %s without target/rel so view transitions handle it", (href) => {
      const anchor = mount({ href });
      expect(anchor.getAttribute("target")).toBeNull();
      expect(anchor.getAttribute("rel")).toBeNull();
      expect(anchor.querySelector(".sr-only")).toBeNull();
    });
  });

  it("uses the link role token, never a hardcoded colour class", () => {
    const anchor = mount({ href: "/about/" });
    expect(anchor.className).toContain("text-link");
    expect(anchor.className).not.toMatch(/text-(blue|indigo|violet)-\d+/);
  });

  it("appends caller classes after the defaults", () => {
    const anchor = mount({ href: "/about/", class: "font-bold" });
    expect(anchor.className).toContain("text-link");
    expect(anchor.className).toContain("font-bold");
  });
});
