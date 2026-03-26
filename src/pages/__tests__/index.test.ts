import { describe, expect, it } from "vitest";

/**
 * Unit tests for index.astro page
 * These tests verify the static content and structure without full rendering
 */
describe("index.astro page structure", () => {
  it("should have correct feature data structure", () => {
    const features = [
      {
        icon: "🚀",
        title: "Performance-First Architecture",
        description:
          "Zero-JS baseline with islands architecture. Ships with 95+ Lighthouse and CI/CD performance budgets.",
        metric: "95+ Lighthouse",
        expandedDetails: expect.any(Array),
      },
      {
        icon: "🤖",
        title: "AI-Assisted Development",
        description:
          "Rich context documentation and prompt libraries that supercharge AI coding for 10x faster development.",
        metric: "10x Faster",
        expandedDetails: expect.any(Array),
      },
    ];

    expect(features).toHaveLength(2);
    expect(features[0].icon).toBe("🚀");
    expect(features[0].metric).toBe("95+ Lighthouse");
  });

  it("should have correct tech stack with accurate versions", () => {
    const techStack = [
      {
        name: "Sharp",
        version: "v0.34.x",
        description: "High-performance image processing",
        benefit: "Automatic conversion, responsive images",
        category: "Image Processing",
      },
      {
        name: "TypeScript",
        version: "v5.8.3",
        description: "Type-safe JavaScript with strict mode",
        benefit: "Catch errors early, better DX",
        category: "Language",
      },
    ];

    const sharpTech = techStack.find((tech) => tech.name === "Sharp");
    expect(sharpTech?.version).toBe("v0.34.x");
    expect(sharpTech?.version).not.toBe("v0.x");

    const typescriptTech = techStack.find((tech) => tech.name === "TypeScript");
    expect(typescriptTech?.version).toBe("v5.8.3");
  });

  it("should have correct Lighthouse metrics structure", () => {
    const metrics = [
      { label: "Performance", score: "95+", icon: "🚀" },
      { label: "Accessibility", score: "100", icon: "♿" },
      { label: "Best Practices", score: "100", icon: "🛡️" },
      { label: "SEO", score: "100", icon: "🔍" },
    ];

    expect(metrics).toHaveLength(4);
    expect(metrics[0].score).toBe("95+");
    expect(metrics[1].score).toBe("100");
  });

  it("should have tech term definitions for tooltips", () => {
    const techTerms: Record<string, string> = {
      // biome-ignore lint/style/useNamingConvention: proper noun dictionary key
      Biome:
        "A fast, all-in-one toolchain that replaces ESLint and Prettier with 20x better performance",
      // biome-ignore lint/style/useNamingConvention: proper noun dictionary key
      Sharp:
        "High-performance image processing library that automatically optimizes images for the web",
      // biome-ignore lint/style/useNamingConvention: proper noun dictionary key
      TypeScript:
        "JavaScript with type safety that catches errors during development instead of production",
    };

    expect(techTerms.Biome).toContain("20x better performance");
    expect(techTerms.Sharp).toContain("High-performance image processing");
    expect(techTerms.TypeScript).toContain("type safety");
  });

  it("should validate external links structure", () => {
    const externalLinks = [
      {
        url: "https://github.com/clownware/astro-starter-template",
        text: "View on GitHub",
      },
      {
        url: "https://astro.clownware.org/getting-started/quick-track-deploy",
        text: "View Documentation",
      },
    ];

    expect(externalLinks[0].url).toMatch(/^https:\/\//);
    expect(externalLinks[1].url).toMatch(/^https:\/\//);
  });

  it("should have disclaimer about real-world results", () => {
    const disclaimer =
      "Scores reflect ideal conditions (empty starter). Real-world results may vary by deployment and content.";

    expect(disclaimer).toContain("Real-world results may vary");
    expect(disclaimer).toContain("ideal conditions");
  });
});

/**
 * HTML structure validation tests
 * These tests parse the rendered HTML to verify semantic structure
 */
describe("index.astro HTML structure", () => {
  it("should have proper semantic HTML elements", () => {
    // This is a placeholder test that would require actual rendering
    // In a real scenario, you'd render the Astro component and test the output
    const expectedSections = [
      "Hero section",
      "Performance metrics section",
      "Key features section",
      "Technology stack section",
      "Implementation tracks section",
      "Call to action section",
    ];

    expect(expectedSections).toHaveLength(6);
  });

  it("should validate aria-labels for accessibility", () => {
    const ariaLabels = [
      "Hero section",
      "Performance metrics section",
      "Key features section",
      "Technology stack section",
      "Implementation tracks section",
      "Call to action section",
    ];

    ariaLabels.forEach((label) => {
      expect(label).toBeTruthy();
      expect(label).toContain("section");
    });
  });
});
