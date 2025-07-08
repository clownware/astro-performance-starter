#!/usr/bin/env node
import { spawn } from "node:child_process";
/**
 * baseline-performance.ts
 *
 * Measures Lighthouse scores for a given URL and stores a JSON baseline that can
 * be used by CI to fail builds when future regressions occur.
 *
 * Usage:
 *   pnpm tsx scripts/src/baseline-performance.ts --url=http://localhost:4321/
 *
 * The output file defaults to performance-baseline.json in the repo root.
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const DEFAULT_URL = "http://localhost:4321";

interface Args {
  url: string;
  out: string;
  device: "desktop" | "mobile";
}

function parseArgs(): Args {
  const urlArg = process.argv.find((a) => a.startsWith("--url="));
  const outArg = process.argv.find((a) => a.startsWith("--out="));
  const deviceArg = process.argv.find((a) => a.startsWith("--device="));
  return {
    url: urlArg ? urlArg.split("=")[1] : DEFAULT_URL,
    out: outArg ? outArg.split("=")[1] : "performance-baseline.json",
    device: (deviceArg ? deviceArg.split("=")[1] : "desktop") as "desktop" | "mobile",
  };
}

async function run() {
  const { url, out, device } = parseArgs();
  console.log(`Running Lighthouse for ${url} (${device})…`);

  // Use lighthouse CLI via child_process to avoid heavy API import and keep ts-node startup fast
  const flags = [
    url,
    "--output=json",
    "--output-path=stdout",
    `--preset=${device}`,
    "--quiet",
    "--chrome-flags=--headless=new",
  ];

  const lh = spawn("lighthouse", flags, { stdio: ["ignore", "pipe", "inherit"] });

  let json = "";
  lh.stdout.on("data", (chunk) => {
    json += chunk.toString();
  });

  lh.on("close", (code) => {
    if (code !== 0) {
      console.error("Lighthouse run failed.");
      process.exit(code ?? 1);
    }
    try {
      const report = JSON.parse(json);
      const { categories } = report;
      const scores = Object.fromEntries(
        Object.entries(categories).map(([k, v]: [string, any]) => [k, v.score]),
      );
      const baseline = {
        generatedAt: new Date().toISOString(),
        url,
        device,
        scores,
      };
      const outPath = resolve(out);
      writeFileSync(outPath, JSON.stringify(baseline, null, 2));
      console.log(`Baseline written to ${outPath}`);
    } catch (err) {
      console.error("Failed to parse Lighthouse JSON output", err);
      process.exit(1);
    }
  });
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
