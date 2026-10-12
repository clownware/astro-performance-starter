/**
 * Unit tests for the append-only ADR check (ADR-068). Written before the
 * implementation per ADR-037. The check reads a `git diff -U0` of records
 * that were Accepted on the default branch and reports text that was removed
 * or rewritten.
 */
import { describe, expect, it } from "vitest";
import { removedFromAcceptedAdrs } from "../adr-append-only";

const file = "docs/adr/052-script-taxonomy.md";
const header = `diff --git a/${file} b/${file}\n--- a/${file}\n+++ b/${file}\n`;

describe("removedFromAcceptedAdrs", () => {
  const cases: { name: string; diff: string; findings: number }[] = [
    {
      name: "an appended note passes",
      diff: `${header}@@ -40,0 +41,2 @@\n+> **Amended 2026-10-12**: a note.\n+\n`,
      findings: 0,
    },
    {
      name: "decision text rewritten in place is reported",
      diff: `${header}@@ -21 +21 @@\n-The gate script is named \`quality:ci\` and is never renamed.\n+The gate script is named \`verify\`.\n`,
      findings: 1,
    },
    {
      name: "a line deleted outright is reported",
      diff: `${header}@@ -30 +29,0 @@\n-- Renaming a script is a breaking change.\n`,
      findings: 1,
    },
    {
      name: "the Status line may change",
      diff: `${header}@@ -16 +16,2 @@\n-Accepted\n+Accepted (amended 2026-10-12 by [ADR-066](066-x.md): the suite\n+runs last)\n`,
      findings: 0,
    },
    {
      name: "a Status line may move to Superseded",
      diff: `${header}@@ -16 +16 @@\n-Accepted\n+Superseded by ADR-070\n`,
      findings: 0,
    },
    {
      name: "a check's recorded status may graduate or be demoted",
      diff: `${header}@@ -90 +90 @@\n-  - TC-1, TC-2 → check \`script-contract\` (status: **warn**)\n+  - TC-1, TC-2 → check \`script-contract\` (status: **block**)\n`,
      findings: 0,
    },
    {
      name: "a status change that also rewrites the consequence is reported",
      diff: `${header}@@ -90 +90 @@\n-  - TC-1, TC-2 → check \`script-contract\` (status: **warn**)\n+  - TC-1 → check \`something-else\` (status: **block**)\n`,
      findings: 1,
    },
    {
      name: "the empty graduation-log placeholder may be filled",
      diff: `${header}@@ -95 +95,2 @@\n-- **Graduation log:** *(empty at creation; entries added when a check changes status)*\n+- **Graduation log:**\n+  - 2026-10-12 — graduates.\n`,
      findings: 0,
    },
    {
      name: "a one-line graduation log may become a list that keeps its text",
      diff: `${header}@@ -95 +95,3 @@\n-- **Graduation log:** 2026-08-13 — calibration fix, not a graduation.\n+- **Graduation log:**\n+  - 2026-08-13 — calibration fix, not a graduation.\n+  - 2026-10-12 — graduates.\n`,
      findings: 0,
    },
    {
      name: "the frontmatter lastUpdated date may change",
      diff: `${header}@@ -8 +8 @@\n-lastUpdated: 2026-05-16T00:00:00.000Z\n+lastUpdated: 2026-10-12T00:00:00.000Z\n`,
      findings: 0,
    },
    {
      name: "a paragraph re-wrapped with words added keeps its text",
      diff: `${header}@@ -50,2 +50,3 @@\n-Tools that read the spine pick it up\n-natively regardless)\n+Tools that read the spine pick it up natively\n+regardless). Amended 2026-10-12: the list is\n+generated.\n`,
      findings: 0,
    },
    {
      name: "struck-through text is kept, so it passes",
      diff: `${header}@@ -60 +60,2 @@\n-- We assume one trusted hop.\n+- ~~We assume one trusted hop.~~\n+  **Amendment**: falsified.\n`,
      findings: 0,
    },
    {
      name: "a code fence gaining a language tag is formatting",
      diff: `${header}@@ -80 +80 @@\n-\`\`\`\n+\`\`\`text\n`,
      findings: 0,
    },
    {
      name: "emphasis turned into a heading keeps its words",
      diff: `${header}@@ -82 +82 @@\n-**Pros**:\n+#### Pros:\n`,
      findings: 0,
    },
    {
      name: "a blank line removed is not a finding",
      diff: `${header}@@ -70 +69,0 @@\n-\n`,
      findings: 0,
    },
    {
      name: "a deleted record is reported once",
      diff: `diff --git a/${file} b/${file}\ndeleted file mode 100644\n--- a/${file}\n+++ /dev/null\n@@ -1,2 +0,0 @@\n-## Status\n-Accepted\n`,
      findings: 1,
    },
  ];

  for (const c of cases) {
    it(c.name, () => {
      expect(removedFromAcceptedAdrs(c.diff)).toHaveLength(c.findings);
    });
  }

  it("names the file and the old line number", () => {
    const [finding] = removedFromAcceptedAdrs(
      `${header}@@ -21 +21 @@\n-Never renamed.\n+Renamed.\n`,
    );
    expect(finding).toContain(`${file}:21`);
    expect(finding).toContain("Never renamed.");
  });

  it("an empty diff has no findings", () => {
    expect(removedFromAcceptedAdrs("")).toEqual([]);
  });
});
