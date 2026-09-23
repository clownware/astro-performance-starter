// @vitest-environment node
import { describe, expect, it } from "vitest";
import { render } from "../../__tests__/_helpers/container";
import CodeFromFile from "../CodeFromFile.astro";

/**
 * Unlike every other component microtest, this one pays for Expressive Code's
 * syntax highlighting: rendering CodeFromFile loads Shiki's grammars and
 * themes on first use. Measured at ~9s in isolation against Vitest's 5s
 * default, so under the full suite's parallel load it timed out roughly one
 * run in three — including in the pre-push hook, where constitution rule 9
 * forbids working around it with --no-verify (#426).
 *
 * Raised here rather than globally: a generous default would hide genuinely
 * hung tests everywhere else, and this is the only test with this cost.
 */
const highlighterWarmupTimeoutMs = 30_000;

describe("CodeFromFile (mdx)", () => {
  it(
    "reads the referenced file relative to parentUrl and renders its content",
    async () => {
      const html = await render(CodeFromFile, {
        src: "./Grid.astro",
        lang: "astro",
        title: "Grid.astro",
        parentUrl: new URL("../Grid.astro", import.meta.url).href,
      });
      expect(html).toContain("Grid.astro");
      // a distinctive line from the source file survives into the highlighted output
      expect(html).toContain("grid-cols-");
    },
    highlighterWarmupTimeoutMs,
  );
});
