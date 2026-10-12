/**
 * Append-only ADR check (ADR-068).
 *
 * A record that is Accepted on the default branch loses no text: notes are
 * appended, the Status line may change, a check's recorded status may move
 * between warn and block, an empty graduation log may be filled, and a
 * paragraph may be re-wrapped or struck through as long as its words survive.
 * Anything else that removes or rewrites a line is reported.
 *
 * The write-time guard (`adr-guard.ts`) only sees the edit tools. This check
 * reads the diff, so it also catches a shell write and a human's editor.
 *
 * The pure half (`removedFromAcceptedAdrs`) is unit-tested and used by the
 * enforcement registry; the I/O half shells out to git. This file imports
 * nothing but Node built-ins so `governance-diff.yml` can run it with plain
 * `node`, without installing dependencies.
 *
 * Usage: node scripts/src/adr-append-only.ts [base-sha]
 */
import { execFileSync } from "node:child_process";

const recordPath = /^docs\/adr\/\d{3}-[^/]+\.md$/;
const statusLine = /^(Accepted|Proposed|Superseded|Withdrawn)\b/;
const checkStatus = /\(status: \*\*(?:warn|block)\*\*[^)]*\)/g;
const hunkHeader = /^@@ -(\d+)/;

const squash = (s: string): string => s.replace(/\s+/g, " ").trim();

/** A line's words without its list or quote marker and without a leading bold label. */
const body = (line: string): string =>
  squash(line)
    .replace(/^(?:[-*>]\s+)+/, "")
    .replace(/^\*\*[^*]+:\*\*\s*/, "");

/** Words only: markdown emphasis, heading, code and strikethrough marks do not count as text. */
const plain = (s: string): string => squash(s.replace(/[*_#`~]/g, ""));

function removalAllowed(removed: string, added: string[]): boolean {
  const text = squash(removed);
  if (text === "" || statusLine.test(text) || /^lastUpdated:/.test(text)) {
    return true;
  }
  if (text.includes("(empty at creation")) {
    return true;
  }
  // A code fence gaining or losing its language tag is formatting, not text.
  if (/^(`{3,}|~{3,})[\w-]*$/.test(text)) {
    return true;
  }
  const words = plain(body(removed));
  if (words === "") {
    return true;
  }
  // Re-wrapping, extension, re-formatting and strikethrough all keep the words, in order,
  // somewhere in the hunk.
  if (plain(added.join(" ")).includes(words)) {
    return true;
  }
  // A check's recorded status moving between warn and block, with nothing else on the line changed.
  if (text.search(checkStatus) >= 0) {
    const neutral = text.replace(checkStatus, "(status)");
    return added.some((a) => squash(a).replace(checkStatus, "(status)") === neutral);
  }
  return false;
}

/** One finding per removed or rewritten line, and one per deleted record. Input: `git diff -U0`. */
export function removedFromAcceptedAdrs(diff: string): string[] {
  const findings: string[] = [];
  let file = "";
  let deleted = false;
  let oldLine = 0;
  let removed: { line: number; text: string }[] = [];
  let added: string[] = [];

  const flush = (): void => {
    for (const r of removed) {
      if (!removalAllowed(r.text, added)) {
        findings.push(
          `${file}:${r.line} — accepted text removed or rewritten: "${squash(r.text).slice(0, 120)}"`,
        );
      }
    }
    removed = [];
    added = [];
  };

  for (const line of diff.split("\n")) {
    if (line.startsWith("diff --git ")) {
      flush();
      file = "";
      deleted = false;
    } else if (line.startsWith("--- a/")) {
      file = line.slice("--- a/".length);
    } else if (line === "+++ /dev/null") {
      deleted = true;
      findings.push(`${file} — accepted record deleted or renamed`);
    } else if (line.startsWith("--- ") || line.startsWith("+++ ")) {
      // file headers
    } else if (line.startsWith("@@")) {
      flush();
      oldLine = Number(hunkHeader.exec(line)?.[1] ?? 0);
    } else if (deleted || file === "") {
      // body of a deleted file, or noise before the first header
    } else if (line.startsWith("-")) {
      removed.push({ line: oldLine, text: line.slice(1) });
      oldLine += 1;
    } else if (line.startsWith("+")) {
      added.push(line.slice(1));
    }
  }
  flush();
  return findings;
}

function git(root: string, args: string[]): string | undefined {
  try {
    return execFileSync("git", ["-C", root, ...args], {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch {
    return undefined;
  }
}

/**
 * The `-U0` diff, against where this branch left the default branch, of every
 * record that was Accepted there. Undefined when there is nothing to compare
 * against (a shallow clone, a fresh fork, not a repository): the check then
 * has no findings rather than a false one.
 */
export function collectAdrDiff(root: string, baseSha?: string): string | undefined {
  let base = baseSha;
  if (!base) {
    for (const ref of ["origin/master", "origin/main"]) {
      const found = git(root, ["merge-base", "HEAD", ref])?.trim();
      if (found) {
        base = found;
        break;
      }
    }
  }
  if (!base) {
    return undefined;
  }
  const changed = git(root, [
    "diff",
    "--name-only",
    "--no-renames",
    "--diff-filter=MD",
    base,
    "--",
    "docs/adr",
  ]);
  if (changed === undefined) {
    return undefined;
  }
  const accepted = changed
    .split("\n")
    .filter((p) => recordPath.test(p))
    .filter((p) => {
      const before = git(root, ["show", `${base}:${p}`]) ?? "";
      return (
        statusLine.test(before.match(/## Status\s*\n+([^\n]*)/)?.[1]?.trim() ?? "") &&
        /## Status\s*\n+Accepted\b/.test(before)
      );
    });
  if (accepted.length === 0) {
    return "";
  }
  return git(root, [
    "diff",
    "--no-color",
    "--no-ext-diff",
    "--no-renames",
    "-U0",
    "--diff-filter=MD",
    base,
    "--",
    ...accepted,
  ]);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const diff = collectAdrDiff(process.cwd(), process.argv[2]);
  if (diff === undefined) {
    console.log("adr-append-only: skipped, no base to compare against");
  } else {
    const findings = removedFromAcceptedAdrs(diff);
    for (const f of findings) {
      const at = /^(\S+?):(\d+) — (.*)$/.exec(f);
      // In a GitHub job this becomes an annotation on the line; elsewhere it is just a line of text.
      console.log(
        at
          ? `::warning file=${at[1]},line=${at[2]},title=Accepted ADR text changed::${at[3]}`
          : `::warning title=Accepted ADR changed::${f}`,
      );
    }
    console.log(
      `adr-append-only: ${findings.length} finding(s). Review signal only; this never fails the job (ADR-068).`,
    );
  }
}
