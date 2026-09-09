import { describe, expect, it } from "vitest";
import {
  extractFences,
  findSnippetDrift,
  jsonSubsetMismatches,
  snippetRules,
  stripJsonComments,
  stripSourceLabel,
  verbatimMismatch,
} from "./check-doc-snippets";

describe("extractFences", () => {
  it("returns each block with its language", () => {
    const md = ["```json", "{}", "```", "text", "```bash", "echo hi", "```"].join("\n");
    expect(extractFences(md)).toEqual([
      { lang: "json", content: "{}" },
      { lang: "bash", content: "echo hi" },
    ]);
  });

  it("keeps a nested fence inside a longer one — the ADR template shape", () => {
    const md = ["````markdown", "# Title", "```ts", "const a = 1;", "```", "````"].join("\n");
    const [fence] = extractFences(md);
    expect(fence.lang).toBe("markdown");
    expect(fence.content).toBe(["# Title", "```ts", "const a = 1;", "```"].join("\n"));
  });

  it("ignores an unterminated block", () => {
    expect(extractFences("```json\n{}")).toEqual([]);
  });
});

describe("stripJsonComments", () => {
  it("drops whole-line // comments so a JSONC snippet parses", () => {
    expect(stripJsonComments('// label\n{"a": 1}')).toBe('{"a": 1}');
  });

  it("leaves a // inside a string value alone", () => {
    const json = '{"url": "https://example.com"}';
    expect(stripJsonComments(json)).toBe(json);
  });
});

describe("jsonSubsetMismatches", () => {
  it("passes when the snippet is a subset with matching values", () => {
    const source = { scripts: { build: "astro build", dev: "astro dev" }, version: "1.0.0" };
    expect(jsonSubsetMismatches({ scripts: { build: "astro build" } }, source)).toEqual([]);
  });

  // The drift this gate exists for: a script changed, the snippet did not.
  it("reports a changed value with both sides and a path", () => {
    const snippet = { scripts: { check: "SITE_URL=http://localhost:4321 astro check" } };
    const source = { scripts: { check: "astro check" } };
    const [message] = jsonSubsetMismatches(snippet, source);
    expect(message).toContain("scripts.check");
    expect(message).toContain("SITE_URL=http://localhost:4321 astro check");
    expect(message).toContain('"astro check"');
  });

  it("reports a key the source no longer has", () => {
    expect(jsonSubsetMismatches({ scripts: { gone: "x" } }, { scripts: {} })).toEqual([
      "scripts.gone: present in the snippet, absent from the source",
    ]);
  });

  it("compares arrays by value", () => {
    expect(jsonSubsetMismatches({ p: ["a"] }, { p: ["a"] })).toEqual([]);
    expect(jsonSubsetMismatches({ p: ["a"] }, { p: ["b"] })).toHaveLength(1);
  });

  it("ignores keys the source has and the snippet omits — snippets are excerpts", () => {
    expect(jsonSubsetMismatches({ a: 1 }, { a: 1, b: 2 })).toEqual([]);
  });
});

describe("stripSourceLabel", () => {
  it("drops a leading comment naming the source", () => {
    expect(
      stripSourceLabel("// .commitlintrc.cjs\nmodule.exports = {};", ".commitlintrc.cjs"),
    ).toBe("module.exports = {};");
  });

  it("keeps a first line that is real content", () => {
    const content = "# Environment Variables Template\nFOO=bar";
    expect(stripSourceLabel(content, ".env.example")).toBe(content);
  });
});

describe("verbatimMismatch", () => {
  it("passes on an exact match", () => {
    expect(verbatimMismatch("a\nb", "a\nb", "f")).toBeNull();
  });

  it("passes when only a source label precedes the copy", () => {
    expect(verbatimMismatch("// f.cjs\na\nb", "a\nb", "f.cjs")).toBeNull();
  });

  it("names the first differing line and both sides", () => {
    const message = verbatimMismatch("a\nWRONG", "a\nright", "f");
    expect(message).toContain("line 2");
    expect(message).toContain("WRONG");
    expect(message).toContain("right");
  });

  it("tolerates trailing-whitespace differences", () => {
    expect(verbatimMismatch("a\nb\n", "a\nb", "f")).toBeNull();
  });
});

describe("findSnippetDrift", () => {
  it("fails a snippet that has no rule, so new ones cannot go unchecked", () => {
    const [message] = findSnippetDrift({
      snippets: { "brand-new": "```json\n{}\n```" },
      sources: {},
    });
    expect(message).toContain("no rule in snippetRules");
  });

  it("skips prose snippets", () => {
    // biome-ignore lint/style/useNamingConvention: the key is the snippet filename, README.md
    expect(findSnippetDrift({ snippets: { README: "anything at all" }, sources: {} })).toEqual([]);
  });

  it("reports a missing fence rather than passing silently", () => {
    const [message] = findSnippetDrift({
      snippets: { "biome-config": "no code here" },
      sources: { "biome.json": "{}" },
    });
    expect(message).toContain("no ```json block found");
  });

  it("reports an unreadable source rather than passing silently", () => {
    const [message] = findSnippetDrift({
      snippets: { "biome-config": "```json\n{}\n```" },
      sources: {},
    });
    expect(message).toContain("could not be read");
  });

  it("passes a JSON snippet that matches its source", () => {
    expect(
      findSnippetDrift({
        snippets: { "package-scripts": '```json\n{"scripts": {"dev": "astro dev"}}\n```' },
        sources: { "package.json": '{"scripts": {"dev": "astro dev", "build": "astro build"}}' },
      }),
    ).toEqual([]);
  });
});

describe("snippetRules", () => {
  it("gives every prose exclusion a stated reason", () => {
    for (const [name, rule] of Object.entries(snippetRules)) {
      if (rule.kind === "prose") {
        expect(rule.reason.length, `${name} needs a reason`).toBeGreaterThan(10);
      }
    }
  });
});
