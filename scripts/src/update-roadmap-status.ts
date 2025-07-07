#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// --- CONFIGURATION ---
const DOCS_DIR = join(process.cwd(), "src", "content", "docs");
const GUIDES_DIR = join(DOCS_DIR, "implementation-guides");
const README_PATH = join(DOCS_DIR, "README.md");
const PHASES = [
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

interface Phase {
  id: number;
  name: string;
  pathMatcher: RegExp;
  completed?: boolean;
  found?: boolean;
}

function findPhaseFile(phase: Phase): Promise<string | null> {
  return new Promise((resolve) => {
    const fs = require("node:fs");
    const path = require("node:path");
    fs.readdir(
      GUIDES_DIR,
      { withFileTypes: true },
      (err: NodeJS.ErrnoException | null, directories: any[]) => {
        if (err) {
          resolve(null);
        } else {
          for (const dirent of directories) {
            if (dirent.isDirectory()) {
              const subDir = path.join(GUIDES_DIR, dirent.name);
              fs.readdir(subDir, (err: NodeJS.ErrnoException | null, files: string[]) => {
                if (err) {
                  resolve(null);
                } else {
                  const matchedFile = files.find((file: string) => phase.pathMatcher.test(file));
                  if (matchedFile) {
                    resolve(path.join(subDir, matchedFile));
                  } else {
                    resolve(null);
                  }
                }
              });
            }
          }
        }
      },
    );
  });
}

function getPhaseStatus(phase: Phase): Promise<Phase> {
  return new Promise((resolve) => {
    findPhaseFile(phase).then((filePath) => {
      if (!filePath) {
        resolve({ ...phase, completed: false, found: false });
      } else {
        const fs = require("node:fs");
        const matter = require("gray-matter");
        fs.readFile(filePath, "utf-8", (err: NodeJS.ErrnoException | null, fileContent: string) => {
          if (err) {
            resolve({ ...phase, completed: false, found: true });
          } else {
            const { data } = matter(fileContent);
            const isComplete = data.status === "complete" || data.status === "Completed";
            resolve({ ...phase, completed: isComplete, found: true });
          }
        });
      }
    });
  });
}

async function main() {
  console.log("Starting roadmap status update...");
  const phaseStatuses = await Promise.all(PHASES.map(getPhaseStatus));

  let checklistMarkdown = "";
  for (const phase of phaseStatuses) {
    const checkbox = phase.completed ? "[x]" : "[ ]";
    const statusMarker = phase.found ? "" : " (Guide not found)";
    checklistMarkdown += `- ${checkbox} Phase ${phase.id}: ${phase.name}${statusMarker}\n`;
  }

  try {
    let readmeContent = readFileSync(README_PATH, "utf-8");
    const startMarker = "<!-- ROADMAP_STATUS_START -->";
    const endMarker = "<!-- ROADMAP_STATUS_END -->";

    const startIndex = readmeContent.indexOf(startMarker);
    const endIndex = readmeContent.indexOf(endMarker);

    if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
      console.error("Error: Roadmap status markers not found or in wrong order in docs/README.md.");
      console.error(`StartIndex: ${startIndex}, EndIndex: ${endIndex}`);
      return;
    }

    const contentBefore = readmeContent.substring(0, startIndex + startMarker.length);
    const contentAfter = readmeContent.substring(endIndex);

    readmeContent = `${contentBefore}\n<!-- The script will automatically update this section. Do not manually edit. -->\n${checklistMarkdown.trim()}\n${contentAfter}`;

    writeFileSync(README_PATH, readmeContent, "utf-8");
    console.log("Successfully updated roadmap status in docs/README.md");
  } catch (error) {
    console.error("Error updating docs/README.md:", error);
  }
}

main();
