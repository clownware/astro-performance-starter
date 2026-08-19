#!/usr/bin/env node

/**
 * Sync the roadmap checklist in docs/README.md (between the
 * ROADMAP_STATUS markers) from the implementation guides.
 *
 * A phase counts as completed when its guide lives in
 * docs/implementation-guides/completed/, or when the guide's frontmatter
 * carries an explicit `status: complete` override (the documented contract
 * in docs/README.md). Phases 0-4 ship completed from the template's
 * perspective; the split is cloner-facing (see ADR-034 and the
 * implementation-guides README).
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

export interface Phase {
  id: number;
  name: string;
  pathMatcher: RegExp;
}

export interface PhaseStatus {
  id: number;
  name: string;
  completed: boolean;
  found: boolean;
}

export const phases: Phase[] = [
  { id: 0, name: "Foundation", pathMatcher: /phase-0-foundation\.md$/i },
  { id: 1, name: "Content Architecture", pathMatcher: /phase-1-content-arch\.md$/i },
  { id: 2, name: "Design System", pathMatcher: /phase-2-design-system\.md$/i },
  { id: 3, name: "Tooling", pathMatcher: /phase-3-tooling\.md$/i },
  { id: 4, name: "Skeleton", pathMatcher: /phase-4-skeleton\.md$/i },
  { id: 5, name: "Components", pathMatcher: /phase-5-components\.md$/i },
  { id: 6, name: "Sections", pathMatcher: /phase-6-sections\.md$/i },
  { id: 7, name: "Content", pathMatcher: /phase-7-content\.md$/i },
  { id: 8, name: "QA", pathMatcher: /phase-8-qa\.md$/i },
  { id: 9, name: "Performance", pathMatcher: /phase-9-performance\.md$/i },
  { id: 10, name: "Deployment", pathMatcher: /phase-10-deployment\.md$/i },
  { id: 11, name: "Documentation", pathMatcher: /phase-11-documentation\.md$/i },
  { id: 12, name: "Post-Launch", pathMatcher: /phase-12-post-launch\.md$/i },
];

const startMarker = "<!-- ROADMAP_STATUS_START -->";
const endMarker = "<!-- ROADMAP_STATUS_END -->";
const syncNotice = "<!-- Synced by `pnpm run roadmap:update`. Do not manually edit. -->";

function locateGuide(guidesDir: string, matcherRe: RegExp): { path: string; dir: string } | null {
  for (const dirent of readdirSync(guidesDir, { withFileTypes: true })) {
    if (!dirent.isDirectory()) continue;
    const subDir = join(guidesDir, dirent.name);
    const match = readdirSync(subDir).find((file) => matcherRe.test(file));
    if (match) return { path: join(subDir, match), dir: dirent.name };
  }
  return null;
}

/** Resolve one phase's completion from the guide's directory or frontmatter override. */
export function getPhaseStatus(phase: Phase, guidesDir: string): PhaseStatus {
  const guide = locateGuide(guidesDir, phase.pathMatcher);
  if (!guide) return { id: phase.id, name: phase.name, completed: false, found: false };
  const { data } = matter(readFileSync(guide.path, "utf-8"));
  const frontmatterComplete = data.status === "complete" || data.status === "Completed";
  const completed = guide.dir === "completed" || frontmatterComplete;
  return { id: phase.id, name: phase.name, completed, found: true };
}

/** Render the markdown checklist for every phase. */
export function buildRoadmapChecklist(guidesDir: string, phaseList: Phase[] = phases): string {
  return phaseList
    .map((phase) => getPhaseStatus(phase, guidesDir))
    .map(
      (p) =>
        `- ${p.completed ? "[x]" : "[ ]"} Phase ${p.id}: ${p.name}${p.found ? "" : " (Guide not found)"}`,
    )
    .join("\n");
}

/**
 * Replace the block between the ROADMAP_STATUS markers with the checklist.
 * Throws when the markers are missing or out of order.
 */
export function replaceRoadmapSection(readmeContent: string, checklistMarkdown: string): string {
  const startIndex = readmeContent.indexOf(startMarker);
  const endIndex = readmeContent.indexOf(endMarker);
  if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
    throw new Error("Roadmap status markers not found or in wrong order in docs/README.md.");
  }

  const contentBefore = readmeContent.substring(0, startIndex + startMarker.length);
  const contentAfter = readmeContent.substring(endIndex);
  return `${contentBefore}\n${syncNotice}\n${checklistMarkdown}\n${contentAfter}`;
}

function main() {
  const guidesDir = join(process.cwd(), "docs", "implementation-guides");
  const readmePath = join(process.cwd(), "docs", "README.md");

  console.log("Starting roadmap status update...");
  const checklistMarkdown = buildRoadmapChecklist(guidesDir);

  let updated: string;
  try {
    updated = replaceRoadmapSection(readFileSync(readmePath, "utf-8"), checklistMarkdown);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }

  writeFileSync(readmePath, updated, "utf-8");
  console.log("Successfully updated roadmap status in docs/README.md");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
