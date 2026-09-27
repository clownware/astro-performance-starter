import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const dependabot = readFileSync(join(repoRoot, ".github/dependabot.yml"), "utf8");

const npmBlock =
  dependabot.split(/\n\s*- package-ecosystem:/).find((block) => /"npm"/.test(block)) ?? "";

/**
 * The raw body of each group under the npm ecosystem's `groups:` key, keyed by
 * group name. Line-based on purpose: the file is small and regular, and a YAML
 * parser here would only be a transitive dependency.
 */
function npmGroups(): Record<string, string> {
  const groups: Record<string, string> = {};
  const body = /\n(\s+)groups:\n([\s\S]*)$/.exec(npmBlock);
  if (!body) return groups;

  const nameIndent = body[1].length + 2;
  let current: string | undefined;
  for (const line of body[2].split("\n")) {
    const indent = line.length - line.trimStart().length;
    if (line.trim() === "" || line.trimStart().startsWith("#")) continue;
    if (indent < nameIndent) break;
    if (indent === nameIndent) {
      current = line.trim().replace(/:$/, "");
      groups[current] = "";
    } else if (current) {
      groups[current] += `${line.trim()}\n`;
    }
  }

  return groups;
}

/**
 * Every singleton Dependabot PR, and every rebase after a neighbouring merge,
 * costs a CI run in this repo and in every clone of it. Production bumps used
 * to arrive one PR each (#441). Minor and patch bumps now share one group
 * across production and development dependencies; majors stay individual so
 * each gets its own review (vitest 5 slipped in inside a group, #407).
 */
describe("Dependabot npm grouping", () => {
  it("groups production and development dependencies together", () => {
    const coversEverything = Object.values(npmGroups()).some(
      (group) => /patterns:\s*\[\s*"\*"\s*\]/.test(group) && !/dependency-type:/.test(group),
    );

    expect(coversEverything).toBe(true);
  });

  it("keeps majors out of every group", () => {
    const admitsMajors = Object.entries(npmGroups())
      .filter(([, group]) => !/update-types:\s*\[\s*"minor",\s*"patch"\s*\]/.test(group))
      .map(([name]) => name);

    expect(admitsMajors).toEqual([]);
  });
});
