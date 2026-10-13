/**
 * Guards the template's public security claims against what the default
 * deploy actually does (#397, ADR-051).
 *
 * `public/_headers` carries the CSP, HSTS and the other response headers. It is
 * applied by header-capable hosts (Cloudflare Pages, Netlify) and ignored by
 * GitHub Pages, which is the deploy this template ships. Any place that
 * advertises those headers has to say so, or a reader on the default path
 * believes they have a policy they do not have.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const read = (p: string): string => readFileSync(resolve(root, p), "utf-8");

describe("security claims match the shipped deploy", () => {
  const readme = read("README.md");

  it("README names the headers file and says GitHub Pages ignores it", () => {
    const line = readme.split("\n").find((l) => l.includes("public/_headers")) ?? "";
    expect(line, "README has no line about public/_headers").not.toBe("");
    expect(line).toMatch(/GitHub Pages/);
    expect(line).toMatch(/ignore/i);
    expect(line).toContain("051-content-security-policy-strategy.md");
  });

  it("README says the CSP also ships as a meta element, and what that cannot cover", () => {
    const line = readme.split("\n").find((l) => l.includes("public/_headers")) ?? "";
    expect(line).toMatch(/<meta>/);
    expect(line).toMatch(/frame-ancestors/);
  });

  it("the showcase security card does not advertise headers without the host caveat", () => {
    const showcase = read("src/pages/showcase.astro");
    const card = showcase.match(/title="Security"[\s\S]*?\/>/)?.[0] ?? "";
    expect(card, "security card not found").not.toBe("");
    expect(card).not.toMatch(/Hardened headers/);
    expect(card).toMatch(/header-capable host/i);
    expect(card).toMatch(/CSP on every host/);
  });

  it("README states the pnpm major that package.json pins", () => {
    const pinned = JSON.parse(read("package.json")).packageManager.match(/^pnpm@(\d+)\./)?.[1];
    const claimed = readme.match(/\*\*pnpm\*\* (\d+)\.x/)?.[1];
    expect(claimed).toBe(pinned);
  });
});
