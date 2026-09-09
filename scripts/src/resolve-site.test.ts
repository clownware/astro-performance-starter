import { describe, expect, it } from "vitest";
import { astroCommand, localSiteFallback, resolveSite } from "./resolve-site.mjs";

describe("astroCommand", () => {
  it("reads the subcommand from the first positional argument", () => {
    expect(astroCommand(["build"])).toBe("build");
    expect(astroCommand(["preview", "--port", "4351"])).toBe("preview");
  });

  it("does not mistake a flag value for the command", () => {
    // `--outDir build` must not read as `astro build`.
    expect(astroCommand(["preview", "--outDir", "build"])).toBe("preview");
  });

  it("is undefined when only flags are present", () => {
    expect(astroCommand(["--help"])).toBeUndefined();
    expect(astroCommand([])).toBeUndefined();
  });
});

describe("resolveSite", () => {
  it("uses SITE_URL when set, whatever the command", () => {
    // biome-ignore lint/style/useNamingConvention: environment variable names are CONSTANT_CASE
    const env = { SITE_URL: "https://example.com" };
    expect(resolveSite({ argv: ["build"], env })).toBe("https://example.com");
    expect(resolveSite({ argv: ["preview"], env })).toBe("https://example.com");
  });

  it("falls back to PUBLIC_SITE_URL", () => {
    // biome-ignore lint/style/useNamingConvention: environment variable names are CONSTANT_CASE
    expect(resolveSite({ argv: ["build"], env: { PUBLIC_SITE_URL: "https://example.org" } })).toBe(
      "https://example.org",
    );
  });

  it("prefers SITE_URL over PUBLIC_SITE_URL", () => {
    // biome-ignore lint/style/useNamingConvention: environment variable names are CONSTANT_CASE
    const env = { SITE_URL: "https://a.test", PUBLIC_SITE_URL: "https://b.test" };
    expect(resolveSite({ argv: ["build"], env })).toBe("https://a.test");
  });

  it("throws for a build with neither set — the value is baked into output", () => {
    expect(() => resolveSite({ argv: ["build"], env: {} })).toThrow(/SITE_URL is required/);
  });

  // The regression: every one of these failed on a clean checkout, and five
  // package.json scripts carried SITE_URL prefixes to work around it.
  it.each(["preview", "dev", "check", "sync", "info"])(
    "defaults to localhost for `%s`, which never bakes site into output",
    (command) => {
      expect(resolveSite({ argv: [command], env: {} })).toBe(localSiteFallback);
    },
  );

  it("defaults when no command is present, as under a test runner", () => {
    expect(resolveSite({ argv: ["run", "--coverage"], env: {} })).toBe(localSiteFallback);
    expect(resolveSite()).toBe(localSiteFallback);
  });
});
