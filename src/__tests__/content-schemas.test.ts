import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "astro/zod";
import { describe, expect, it } from "vitest";
import { collections } from "@/content.config";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/**
 * Stand-in for the `image()` helper Astro injects into schema factories. The
 * real helper resolves a path to ImageMetadata at build time; the shape is
 * irrelevant to the field-level assertions here, so a permissive schema keeps
 * the fixtures readable.
 */
const imageStub = () => z.any();

function projectsSchema(): z.ZodObject<z.ZodRawShape> {
  const { schema } = collections.projects;
  const resolved = typeof schema === "function" ? schema({ image: imageStub }) : schema;

  return resolved as z.ZodObject<z.ZodRawShape>;
}

const validProject = {
  title: "Example",
  description: "A project used as a schema fixture.",
  date: new Date("2026-01-01"),
  cover: "./cover.jpg",
  coverAlt: "Cover",
  tags: ["demo"],
  technologies: ["Astro"],
};

describe("projects collection schema", () => {
  it("accepts githubUrl, which ProjectCard renders as the Source Code link", () => {
    const result = projectsSchema().safeParse({
      ...validProject,
      githubUrl: "https://github.com/clownware/astro-performance-starter",
    });

    expect(result.success).toBe(true);
    expect(result.success && result.data.githubUrl).toBe(
      "https://github.com/clownware/astro-performance-starter",
    );
  });

  it("rejects a githubUrl that is not a URL", () => {
    const result = projectsSchema().safeParse({ ...validProject, githubUrl: "clownware/repo" });

    expect(result.success).toBe(false);
  });

  it("leaves githubUrl optional", () => {
    expect(projectsSchema().safeParse(validProject).success).toBe(true);
  });
});

/**
 * The projects index page reads fields straight off `entry.data`. A field the
 * schema does not declare is always `undefined`, so whatever it feeds renders
 * as dead markup — silently, because nothing type-errors on an unknown key
 * reached through a collection entry. That is exactly how #390 shipped:
 * `githubUrl` was read by the page and rendered by ProjectCard, but never
 * declared, so the Source Code link could not appear for any project.
 */
describe("projects index page reads only declared fields", () => {
  const pageSource = readFileSync(join(repoRoot, "src/pages/projects/index.astro"), "utf8");
  const readFields = [...pageSource.matchAll(/entry\.data\.([a-zA-Z][a-zA-Z0-9_]*)/g)].map(
    (match) => match[1],
  );

  it("finds the entry.data reads it is meant to be guarding", () => {
    // A page refactor that renamed the destructured entry would make the
    // assertion below pass against an empty list.
    expect(new Set(readFields).size).toBeGreaterThan(3);
  });

  it("declares every field the page reads", () => {
    const declared = new Set(Object.keys(projectsSchema().shape));
    const undeclared = [...new Set(readFields)].filter((field) => !declared.has(field)).sort();

    expect(
      undeclared,
      `src/pages/projects/index.astro reads these off entry.data, but the projects schema in src/content.config.ts does not declare them — they are always undefined: ${undeclared.join(", ")}`,
    ).toEqual([]);
  });
});
