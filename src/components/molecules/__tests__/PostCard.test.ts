// @vitest-environment node
import { describe, expect, it } from "vitest";
import { makePostCardPost } from "../../../../tests/fixtures/posts";
import { render } from "../../__tests__/_helpers/container";
import PostCard from "../PostCard.astro";

// PostCard requires a post + metadata shape. Reusing the fixture from
// tests/fixtures/posts.ts keeps the shape definition in one place.

const renderPostCard = (props: Record<string, unknown>) => render(PostCard, props);

describe("PostCard (molecule)", () => {
  describe("article structure", () => {
    it("wraps the card in <article class='post-card'>", async () => {
      const html = await renderPostCard({ post: makePostCardPost() });
      expect(html).toMatch(/<article[^>]*class="[^"]*post-card/);
    });

    it("renders the post title in an <h3>", async () => {
      const post = makePostCardPost({ data: { title: "Hello World" } as never });
      const html = await renderPostCard({ post });
      expect(html).toMatch(/<h3[^>]*>[\s\S]*Hello World[\s\S]*<\/h3>/);
    });

    it("renders the description", async () => {
      const post = makePostCardPost({
        data: { description: "A focused summary of the post" } as never,
      });
      const html = await renderPostCard({ post });
      expect(html).toContain("A focused summary of the post");
    });

    it("renders the formatted publishedDate inside a <time> element", async () => {
      const post = makePostCardPost({
        metadata: { publishedDate: "Jan 1, 2025", readingTime: "3 min read", isRecent: false },
      });
      const html = await renderPostCard({ post });
      expect(html).toMatch(/<time[^>]*>Jan 1, 2025<\/time>/);
    });

    it("renders the readingTime", async () => {
      const post = makePostCardPost({
        metadata: { publishedDate: "Jan 1, 2025", readingTime: "7 min read", isRecent: false },
      });
      const html = await renderPostCard({ post });
      expect(html).toContain("7 min read");
    });
  });

  describe("tags", () => {
    it("renders one Badge per tag", async () => {
      const post = makePostCardPost({ data: { tags: ["alpha", "beta", "gamma"] } as never });
      const html = await renderPostCard({ post });
      for (const tag of ["alpha", "beta", "gamma"]) {
        // Astro renders <Badge>tag</Badge> as <span ...> tag </span> with
        // surrounding whitespace; tolerate it in the assertion.
        expect(html).toMatch(new RegExp(`>\\s*${tag}\\s*<`));
      }
    });

    it("links each tag to the /blog/tag/<slug>/ route", async () => {
      const post = makePostCardPost({ data: { tags: ["Design System"] } as never });
      const html = await renderPostCard({ post });
      // "Design System" should be slugified to "design-system" by the kebab-replace
      expect(html).toMatch(/href="[^"]*\/blog\/tag\/design-system\//);
    });
  });

  describe("recency badge", () => {
    it("renders a 'New' badge when isRecent=true (requires cover image)", async () => {
      // The recency badge overlays the image, so the image branch must render.
      const post = makePostCardPost({
        data: { cover: "/og-default.svg", coverAlt: "Cover" } as never,
        metadata: { publishedDate: "Today", readingTime: "1 min read", isRecent: true },
      });
      const html = await renderPostCard({ post });
      expect(html).toMatch(/>\s*New\s*</);
    });

    it("omits the 'New' badge when isRecent=false (even with cover image)", async () => {
      const post = makePostCardPost({
        data: { cover: "/og-default.svg", coverAlt: "Cover" } as never,
        metadata: { publishedDate: "Old", readingTime: "1 min read", isRecent: false },
      });
      const html = await renderPostCard({ post });
      // The recency badge sits inside an absolutely-positioned wrapper.
      expect(html).not.toMatch(/<div class="absolute left-3 top-3">[\s\S]*?>\s*New\s*</);
    });
  });

  describe("featured variant", () => {
    it("uses the stretched-link pattern when featured=true", async () => {
      const html = await renderPostCard({ post: makePostCardPost(), featured: true });
      expect(html).toContain("stretched-link");
    });

    it("uses the after:absolute group-hover pattern when featured=false (default)", async () => {
      const html = await renderPostCard({ post: makePostCardPost() });
      // Non-featured: after-pseudo-element overlay rather than stretched-link
      expect(html).not.toContain("stretched-link");
    });

    it("slices tags to the first 3 when featured=true", async () => {
      const post = makePostCardPost({
        data: { tags: ["one", "two", "three", "four", "five"] } as never,
      });
      const html = await renderPostCard({ post, featured: true });
      for (const tag of ["one", "two", "three"]) {
        expect(html).toMatch(new RegExp(`>\\s*${tag}\\s*<`));
      }
      expect(html).not.toMatch(/>\s*four\s*</);
      expect(html).not.toMatch(/>\s*five\s*</);
    });
  });

  describe("title link", () => {
    it("links the title to /blog/<id>/", async () => {
      const post = makePostCardPost({ id: "shipping-fast" });
      const html = await renderPostCard({ post });
      expect(html).toMatch(/href="[^"]*\/blog\/shipping-fast\//);
    });
  });

  describe("class composition", () => {
    it("merges a custom class onto the article wrapper", async () => {
      const html = await renderPostCard({ post: makePostCardPost(), class: "extra" });
      expect(html).toMatch(/<article[^>]*class="[^"]*extra/);
    });
  });
});
