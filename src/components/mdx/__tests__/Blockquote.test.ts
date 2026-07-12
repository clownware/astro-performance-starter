// @vitest-environment node
import { describe, expect, it } from "vitest";
import { render } from "../../__tests__/_helpers/container";
import Blockquote from "../Blockquote.astro";

const renderBlockquote = (props: Record<string, unknown> = {}, slot = "Quoted text") =>
  render(Blockquote, props, { default: slot });

describe("Blockquote (mdx)", () => {
  it("renders the slot content inside a <blockquote>", async () => {
    const html = await renderBlockquote();
    expect(html).toContain("<blockquote");
    expect(html).toContain("Quoted text");
  });

  describe("attribution", () => {
    it("renders no footer when neither author nor source is given", async () => {
      const html = await renderBlockquote();
      expect(html).not.toContain("<footer");
      expect(html).not.toContain("aria-describedby");
    });

    it("renders author attribution with an em-dash prefix", async () => {
      const html = await renderBlockquote({ author: "Ada Lovelace" });
      expect(html).toContain("<footer");
      expect(html).toContain("— Ada Lovelace");
    });

    it("joins author and source with a comma", async () => {
      const html = await renderBlockquote({ author: "Ada Lovelace", source: "Notes" });
      expect(html).toContain("— Ada Lovelace");
      expect(html).toContain("Notes");
      const text = html.replace(/<[^>]+>/g, "");
      expect(text).toMatch(/— Ada Lovelace\s*,\s*Notes/);
    });

    it("links the quote to its attribution via aria-describedby", async () => {
      const html = await renderBlockquote({ source: "Notes" });
      const described = html.match(/aria-describedby="([^"]+)"/);
      expect(described).not.toBeNull();
      expect(html).toContain(`<cite id="${described?.[1]}"`);
    });
  });

  it("passes the cite URL through to the blockquote element", async () => {
    const html = await renderBlockquote({ cite: "https://example.org/quote" });
    expect(html).toContain('cite="https://example.org/quote"');
  });

  it("marks the decorative quote icon aria-hidden", async () => {
    const html = await renderBlockquote();
    expect(html).toMatch(/<svg[^>]*aria-hidden="true"/);
  });
});
