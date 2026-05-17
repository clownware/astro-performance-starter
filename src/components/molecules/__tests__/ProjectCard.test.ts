// @vitest-environment node
import { describe, expect, it } from "vitest";
import { render } from "../../__tests__/_helpers/container";
import ProjectCard from "../ProjectCard.astro";

// ProjectCard has two render branches keyed on `href`:
//   - With href: title is wrapped in a stretched link
//   - Without href: title is plain h3
// We exercise both branches.

const baseProps = {
  title: "Demo Project",
  description: "A test project for ProjectCard rendering",
  image: "/placeholder.svg",
  techStack: ["Astro", "TypeScript"],
};

const renderProjectCard = (props: Record<string, unknown> = baseProps) =>
  render(ProjectCard, props);

describe("ProjectCard (molecule)", () => {
  describe("required content", () => {
    it("renders the title in an <h3>", async () => {
      const html = await renderProjectCard();
      expect(html).toMatch(/<h3[^>]*>[\s\S]*Demo Project[\s\S]*<\/h3>/);
    });

    it("renders the description", async () => {
      const html = await renderProjectCard();
      expect(html).toContain("A test project for ProjectCard rendering");
    });

    it("renders one tech-stack chip per entry", async () => {
      const html = await renderProjectCard();
      expect(html).toContain(">Astro<");
      expect(html).toContain(">TypeScript<");
    });

    it("renders the image with descriptive alt", async () => {
      const html = await renderProjectCard();
      expect(html).toMatch(/<img[^>]*alt="Screenshot of Demo Project project"/);
    });
  });

  describe("href branch", () => {
    it("wraps the title in a link when href is provided", async () => {
      const html = await renderProjectCard({ ...baseProps, href: "/projects/demo" });
      expect(html).toMatch(/<a[^>]*href="\/projects\/demo"[^>]*>[\s\S]*Demo Project/);
    });

    it("does NOT wrap the title in a link when href is omitted", async () => {
      const html = await renderProjectCard();
      // Title should appear inside h3 but NOT inside an <a href> at the title position
      expect(html).not.toMatch(/<a[^>]*href="\/projects/);
    });
  });

  describe("optional tags", () => {
    it("renders a 'Categories' section when tags are provided", async () => {
      const html = await renderProjectCard({ ...baseProps, href: "/x", tags: ["Web", "Design"] });
      expect(html).toContain("Categories");
      // <Badge>Tag</Badge> compiles to <span ...> Tag </span> with whitespace.
      expect(html).toMatch(/>\s*Web\s*</);
      expect(html).toMatch(/>\s*Design\s*</);
    });

    it("omits the 'Categories' section when tags are empty or missing", async () => {
      const html = await renderProjectCard({ ...baseProps, href: "/x" });
      expect(html).not.toContain("Categories");
    });
  });

  describe("optional metadata", () => {
    it("renders the client when provided", async () => {
      const html = await renderProjectCard({ ...baseProps, client: "Acme Corp" });
      expect(html).toContain("Acme Corp");
    });

    it("renders projectRole when provided", async () => {
      const html = await renderProjectCard({ ...baseProps, projectRole: "Lead Engineer" });
      expect(html).toContain("Lead Engineer");
    });

    it("renders duration when provided", async () => {
      const html = await renderProjectCard({ ...baseProps, duration: "Q3 2024" });
      expect(html).toContain("Q3 2024");
    });

    it("renders a <time> when date is provided", async () => {
      const html = await renderProjectCard({
        ...baseProps,
        date: new Date("2025-01-15T00:00:00Z"),
      });
      expect(html).toMatch(/<time[^>]*datetime="2025-01-15T00:00:00\.000Z"/);
    });
  });

  describe("recency badge", () => {
    it("shows 'New' badge when date is within the last 7 days", async () => {
      const recent = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      const html = await renderProjectCard({ ...baseProps, date: recent });
      expect(html).toMatch(/>\s*New\s*</);
    });

    it("omits 'New' badge when date is older than 7 days", async () => {
      const old = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const html = await renderProjectCard({ ...baseProps, date: old });
      // "New" might appear elsewhere; assert specifically on the badge span
      expect(html).not.toMatch(/<span[^>]*class="[^"]*bg-secondary-600[^"]*">[\s\S]*?New/);
    });
  });

  describe("action links", () => {
    it("renders a Live Demo link when demoUrl is provided", async () => {
      const html = await renderProjectCard({ ...baseProps, demoUrl: "https://example.com/demo" });
      expect(html).toMatch(/<a[^>]*href="https:\/\/example\.com\/demo"[\s\S]*?Live Demo/);
    });

    it("renders a Source Code link when githubUrl is provided", async () => {
      const html = await renderProjectCard({
        ...baseProps,
        githubUrl: "https://github.com/example/repo",
      });
      expect(html).toMatch(/<a[^>]*href="https:\/\/github\.com\/example\/repo"[\s\S]*?Source Code/);
    });

    it("opens external action links in a new tab with rel=noopener", async () => {
      const html = await renderProjectCard({ ...baseProps, demoUrl: "https://example.com" });
      expect(html).toMatch(/target="_blank"[^>]*rel="noopener noreferrer"/);
    });

    it("omits the actions footer when neither demoUrl nor githubUrl is provided", async () => {
      const html = await renderProjectCard();
      expect(html).not.toContain("project-card__actions");
    });
  });

  describe("class composition", () => {
    it("merges a custom class onto the article wrapper", async () => {
      const html = await renderProjectCard({ ...baseProps, class: "my-card-extra" });
      expect(html).toContain("my-card-extra");
    });
  });
});
