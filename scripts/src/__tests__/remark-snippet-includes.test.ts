import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { remark } from "remark";
import { describe, expect, it } from "vitest";
import { remarkSnippetIncludes } from "../remark-snippet-includes.mjs";

/**
 * Guards against the ADR-062 cold-rebuild failure: the plugin expanded
 * shortcodes inside code spans and fences, so a literal documentation
 * example like `{% snippet "name" %}` threw "Snippet not found: name"
 * on every cold content build. Code contexts are where the syntax is
 * documented — they must never be expanded.
 */

function makeSnippetsRoot(): string {
  const root = mkdtempSync(join(tmpdir(), "snippet-test-"));
  mkdirSync(join(root, "docs/snippets"), { recursive: true });
  writeFileSync(join(root, "docs/snippets/real.md"), "EXPANDED CONTENT");
  return root;
}

async function run(markdown: string, rootDir: string): Promise<string> {
  const result = await remark().use(remarkSnippetIncludes, { rootDir }).process(markdown);
  return String(result);
}

describe("remarkSnippetIncludes", () => {
  it("expands a shortcode in a plain text node", async () => {
    const root = makeSnippetsRoot();
    const out = await run('{% snippet "real" %}\n', root);
    expect(out).toContain("EXPANDED CONTENT");
  });

  it("does not expand inside inline code spans", async () => {
    const root = makeSnippetsRoot();
    const out = await run('The plugin expands `{% snippet "real" %}` shortcodes.\n', root);
    expect(out).toContain('`{% snippet "real" %}`');
    expect(out).not.toContain("EXPANDED CONTENT");
  });

  it("does not expand inside fenced code blocks", async () => {
    const root = makeSnippetsRoot();
    const out = await run('```md\n{% snippet "real" %}\n```\n', root);
    expect(out).toContain('{% snippet "real" %}');
    expect(out).not.toContain("EXPANDED CONTENT");
  });

  it("does not throw for an unknown snippet name inside inline code (ADR-062 case)", async () => {
    const root = makeSnippetsRoot();
    await expect(
      run('- `remarkSnippetIncludes` — expands `{% snippet "name" %}` shortcodes\n', root),
    ).resolves.toBeDefined();
  });

  it("still throws for an unknown snippet name in a text node", async () => {
    const root = makeSnippetsRoot();
    await expect(run('{% snippet "missing" %}\n', root)).rejects.toThrow(/Snippet not found/);
  });
});
