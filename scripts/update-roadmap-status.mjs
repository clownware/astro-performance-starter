import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter"; // For parsing frontmatter

const DOCS_DIR = path.join(process.cwd(), "docs");
const GUIDES_DIR = path.join(DOCS_DIR, "implementation-guides");
const README_PATH = path.join(DOCS_DIR, "README.md");

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

async function findPhaseFile(phase) {
  const directories = await fs.readdir(GUIDES_DIR, { withFileTypes: true });
  for (const dirent of directories) {
    if (dirent.isDirectory()) {
      const subDir = path.join(GUIDES_DIR, dirent.name);
      try {
        const files = await fs.readdir(subDir);
        const matchedFile = files.find((file) => phase.pathMatcher.test(file));
        if (matchedFile) {
          return path.join(subDir, matchedFile);
        }
      } catch (_err) {
        // console.warn(`Could not read directory: ${subDir}`, _err.message);
        // This can happen if a directory is expected but not found, e.g. if phases are not yet created
      }
    }
  }
  return null;
}

async function getPhaseStatus(phase) {
  const filePath = await findPhaseFile(phase);
  if (!filePath) {
    // console.log(`Phase ${phase.id} (${phase.name}) document not found.`);
    return { ...phase, completed: false, found: false };
  }
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const { data } = matter(fileContent);
    const isComplete = data.status === "complete" || data.status === "Completed";
    // console.log(`Phase ${phase.id} (${phase.name}) found: ${filePath}, status: ${data.status}, completed: ${isComplete}`);
    return { ...phase, completed: isComplete, found: true };
  } catch (error) {
    console.error(`Error reading or parsing phase file ${filePath}:`, error);
    return { ...phase, completed: false, found: true }; // Assume not complete if error
  }
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
  // console.log('\nGenerated Checklist Markdown:\n', checklistMarkdown);

  try {
    let readmeContent = await fs.readFile(README_PATH, "utf-8");
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

    await fs.writeFile(README_PATH, readmeContent, "utf-8");
    console.log("Successfully updated roadmap status in docs/README.md");
  } catch (error) {
    console.error("Error updating docs/README.md:", error);
  }
}

main().catch(console.error);
