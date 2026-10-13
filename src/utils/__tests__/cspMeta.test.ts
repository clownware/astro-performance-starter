import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { cspForMeta, cspFromHeadersFile } from "../cspMeta";

const headers = `/*
  X-Frame-Options: DENY
  # a comment
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; frame-ancestors 'none'
  Cache-Control: public, max-age=0

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
`;

describe("cspFromHeadersFile", () => {
  it("returns the policy declared for every path", () => {
    expect(cspFromHeadersFile(headers)).toBe(
      "default-src 'self'; img-src 'self' data:; frame-ancestors 'none'",
    );
  });

  it("ignores a policy scoped to a narrower path", () => {
    const scoped = "/admin/*\n  Content-Security-Policy: default-src 'none'\n";
    expect(cspFromHeadersFile(scoped)).toBeNull();
  });

  it("ignores a commented-out policy", () => {
    expect(cspFromHeadersFile("/*\n  # Content-Security-Policy: default-src 'none'\n")).toBeNull();
  });

  it("matches the header name without regard to case", () => {
    expect(cspFromHeadersFile("/*\n  content-security-policy: default-src 'self'\n")).toBe(
      "default-src 'self'",
    );
  });

  it("returns null for a file with no policy", () => {
    expect(cspFromHeadersFile("/*\n  X-Frame-Options: DENY\n")).toBeNull();
  });
});

describe("cspForMeta", () => {
  it("drops frame-ancestors, which a meta element cannot enforce", () => {
    expect(cspForMeta("default-src 'self'; frame-ancestors 'none'; img-src 'self' data:")).toBe(
      "default-src 'self'; img-src 'self' data:",
    );
  });

  it.each(["report-uri /csp", "report-to default", "sandbox allow-scripts"])(
    "drops %s, which is ignored in a meta element",
    (directive) => {
      expect(cspForMeta(`default-src 'self'; ${directive}`)).toBe("default-src 'self'");
    },
  );

  it("keeps every other directive, in order", () => {
    const policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; base-uri 'self'";
    expect(cspForMeta(policy)).toBe(policy);
  });

  it("tolerates a trailing semicolon and extra spaces", () => {
    expect(cspForMeta(" default-src 'self' ;  img-src 'self' ; ")).toBe(
      "default-src 'self'; img-src 'self'",
    );
  });

  it("returns null when nothing enforceable is left", () => {
    expect(cspForMeta("frame-ancestors 'none'")).toBeNull();
    expect(cspForMeta(null)).toBeNull();
  });
});

/**
 * ADR-051 (amended 2026-10-13): the policy has one source, public/_headers.
 * The meta element is derived from it, so the two cannot drift.
 */
describe("the shipped policy and its meta element", () => {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
  const shipped = cspFromHeadersFile(readFileSync(resolve(root, "public/_headers"), "utf-8"));
  const head = readFileSync(resolve(root, "src/components/molecules/Head.astro"), "utf-8");

  it("public/_headers declares a policy the meta element can carry", () => {
    expect(shipped).toContain("default-src 'self'");
    expect(cspForMeta(shipped)).not.toContain("frame-ancestors");
    expect(cspForMeta(shipped)).toContain("script-src 'self' 'unsafe-inline'");
  });

  it("Head.astro derives the meta element from public/_headers, with no second copy of the policy", () => {
    expect(head).toContain('http-equiv="Content-Security-Policy"');
    expect(head).toContain("cspForMeta(");
    expect(head).not.toMatch(/default-src/);
  });

  it("Head.astro emits the policy before any script, style or font", () => {
    const template = head.slice(head.indexOf("---", 3) + 3);
    const csp = template.indexOf('http-equiv="Content-Security-Policy"');
    expect(csp).toBeGreaterThan(-1);
    for (const later of ["<script", "<style", "<Font", "<link"]) {
      const at = template.indexOf(later);
      if (at !== -1) {
        expect(csp, `CSP meta must precede ${later}`).toBeLessThan(at);
      }
    }
  });
});
