#!/usr/bin/env tsx
/**
 * Doc-snippet drift guard. `docs/snippets/*.md` reproduce real files in this
 * repository, and the docs site pulls them byte-for-byte — so a snippet that
 * falls behind its source ships wrong instructions to docs.clownware.org.
 *
 * Three changes in one evening left a snippet stale (the SITE_URL script
 * prefixes, the analytics path in .env.example, the Playwright config), each
 * caught only by reading. This makes it mechanical, in the same shape as the
 * other no-drift gates: pure functions here, unit-tested, wired into
 * `quality:ci` alongside `agents:check`, `version:check` and `docs:count`.
 *
 * Every snippet must be declared below. A new one with no rule fails the gate
 * rather than being silently unchecked.
 *
 * Usage: pnpm run docs:snippets
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export type SnippetRule =
  /** The fence is a subset of the source's JSON: every key it shows must match. */
  | { kind: "json"; source: string; fence: string }
  /** The fence reproduces the source file exactly. */
  | { kind: "verbatim"; source: string; fence: string }
  /** Prose or instructions, with no single source to compare against. */
  | { kind: "prose"; reason: string };

/** Snippet basename (without .md) → how to check it. */
export const snippetRules: Record<string, SnippetRule> = {
  "adr-template": { kind: "verbatim", source: "docs/adr/template.md", fence: "markdown" },
  "biome-config": { kind: "json", source: "biome.json", fence: "json" },
  "commitlint-config": { kind: "verbatim", source: ".commitlintrc.cjs", fence: "js" },
  "env-example": { kind: "verbatim", source: ".env.example", fence: "bash" },
  "essential-scripts": { kind: "json", source: "package.json", fence: "json" },
  "lint-staged-config": { kind: "json", source: "package.json", fence: "json" },
  "package-scripts": { kind: "json", source: "package.json", fence: "json" },
  "tsconfig-paths": { kind: "json", source: "tsconfig.json", fence: "json" },
  "git-hooks": {
    kind: "prose",
    reason: "setup instructions interleaved with the hook bodies, not a copy of any one file",
  },
  // biome-ignore lint/style/useNamingConvention: the key is the snippet filename, README.md
  README: { kind: "prose", reason: "index of the other snippets" },
};

export interface Fence {
  lang: string;
  content: string;
}

/** Fenced blocks in `markdown`, honouring fences longer than three backticks. */
export function extractFences(markdown: string): Fence[] {
  const fences: Fence[] = [];
  const lines = markdown.split("\n");
  let open: { ticks: string; lang: string; body: string[] } | null = null;

  for (const line of lines) {
    const match = line.match(/^(`{3,})(\S*)\s*$/);
    if (open === null) {
      if (match) {
        open = { ticks: match[1], lang: match[2], body: [] };
      }
      continue;
    }
    // Only a fence of at least the opening length closes the block, so a
    // nested ```ts inside a ````markdown block stays part of the body.
    if (match && match[2] === "" && match[1].length >= open.ticks.length) {
      fences.push({ lang: open.lang, content: open.body.join("\n") });
      open = null;
      continue;
    }
    open.body.push(line);
  }
  return fences;
}

/** Strips `//` line comments so a JSONC snippet can be parsed. */
export function stripJsonComments(text: string): string {
  return text
    .split("\n")
    .filter((line) => !/^\s*\/\//.test(line))
    .join("\n");
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Every key the snippet shows must exist in the source with an equal value.
 * Keys the source has and the snippet omits are fine — snippets are excerpts.
 */
export function jsonSubsetMismatches(snippet: unknown, source: unknown, path = ""): string[] {
  if (isPlainObject(snippet) && isPlainObject(source)) {
    const messages: string[] = [];
    for (const key of Object.keys(snippet)) {
      const where = path ? `${path}.${key}` : key;
      if (!(key in source)) {
        messages.push(`${where}: present in the snippet, absent from the source`);
        continue;
      }
      messages.push(...jsonSubsetMismatches(snippet[key], source[key], where));
    }
    return messages;
  }

  if (JSON.stringify(snippet) === JSON.stringify(source)) {
    return [];
  }
  return [`${path}: snippet has ${JSON.stringify(snippet)}, source has ${JSON.stringify(source)}`];
}

/**
 * Drops a leading comment that only labels the source file (`// biome.json`),
 * which several snippets carry and no source file contains.
 */
export function stripSourceLabel(content: string, source: string): string {
  const [first, ...rest] = content.split("\n");
  const isComment = /^\s*(\/\/|#)/.test(first ?? "");
  const namesSource = first?.includes(source) || first?.includes(source.split("/").pop() ?? "");
  return isComment && namesSource ? rest.join("\n") : content;
}

export function verbatimMismatch(fence: string, sourceText: string, source: string): string | null {
  const normalise = (text: string) => text.replace(/\s+$/, "");
  if (normalise(fence) === normalise(sourceText)) {
    return null;
  }

  const stripped = stripSourceLabel(fence, source);
  if (normalise(stripped) === normalise(sourceText)) {
    return null;
  }

  const snippetLines = normalise(stripped).split("\n");
  const sourceLines = normalise(sourceText).split("\n");
  for (let i = 0; i < Math.max(snippetLines.length, sourceLines.length); i++) {
    if (snippetLines[i] !== sourceLines[i]) {
      return `line ${i + 1}: snippet has ${JSON.stringify(snippetLines[i] ?? "(end of block)")}, ${source} has ${JSON.stringify(sourceLines[i] ?? "(end of file)")}`;
    }
  }
  return `differs from ${source}`;
}

export interface SnippetCheckInput {
  /** Snippet basename → file contents. */
  snippets: Record<string, string>;
  /** Repo-relative source path → file contents. */
  sources: Record<string, string>;
}

/** One diagnostic per drifted snippet; empty means everything is in sync. */
export function findSnippetDrift({ snippets, sources }: SnippetCheckInput): string[] {
  const messages: string[] = [];

  for (const [name, markdown] of Object.entries(snippets)) {
    const rule = snippetRules[name];
    if (!rule) {
      messages.push(
        `${name}.md: no rule in snippetRules — add one (json, verbatim, or prose with a reason)`,
      );
      continue;
    }
    if (rule.kind === "prose") {
      continue;
    }

    const fence = extractFences(markdown).find((block) => block.lang === rule.fence);
    if (!fence) {
      messages.push(`${name}.md: no \`\`\`${rule.fence} block found`);
      continue;
    }

    const sourceText = sources[rule.source];
    if (sourceText === undefined) {
      messages.push(`${name}.md: source ${rule.source} could not be read`);
      continue;
    }

    if (rule.kind === "verbatim") {
      const mismatch = verbatimMismatch(fence.content, sourceText, rule.source);
      if (mismatch) {
        messages.push(`${name}.md: ${mismatch}`);
      }
      continue;
    }

    let snippetJson: unknown;
    let sourceJson: unknown;
    try {
      snippetJson = JSON.parse(stripJsonComments(fence.content));
    } catch (error) {
      messages.push(`${name}.md: fence is not valid JSON — ${String(error)}`);
      continue;
    }
    try {
      sourceJson = JSON.parse(stripJsonComments(sourceText));
    } catch (error) {
      messages.push(`${name}.md: source ${rule.source} is not valid JSON — ${String(error)}`);
      continue;
    }

    for (const mismatch of jsonSubsetMismatches(snippetJson, sourceJson)) {
      messages.push(`${name}.md (vs ${rule.source}): ${mismatch}`);
    }
  }

  return messages;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
  const snippetsDir = join(root, "docs", "snippets");

  const snippets: Record<string, string> = {};
  for (const entry of readdirSync(snippetsDir)) {
    if (entry.endsWith(".md")) {
      snippets[entry.replace(/\.md$/, "")] = readFileSync(join(snippetsDir, entry), "utf8");
    }
  }

  const sources: Record<string, string> = {};
  for (const rule of Object.values(snippetRules)) {
    if (rule.kind === "prose" || sources[rule.source] !== undefined) {
      continue;
    }
    try {
      sources[rule.source] = readFileSync(join(root, rule.source), "utf8");
    } catch {
      // Left absent; findSnippetDrift reports it against the snippet.
    }
  }

  const drift = findSnippetDrift({ snippets, sources });
  if (drift.length > 0) {
    console.error(`❌ ${drift.length} doc snippet(s) have drifted from their source:\n`);
    for (const message of drift) {
      console.error(`   ${message}`);
    }
    console.error("\nUpdate the snippet in docs/snippets/ to match the file it reproduces.");
    process.exit(1);
  }

  const checked = Object.values(snippetRules).filter((rule) => rule.kind !== "prose").length;
  console.log(`✅ ${checked} doc snippets match their source files.`);
}
