// Resolves the `site` value for astro.config.mjs.
//
// Only `astro build` bakes `site` into output (canonical URLs, sitemap), so
// only `build` needs it configured. Requiring it for every command made
// `astro preview`, `check`, `sync` and `info` fail on a clean checkout, and
// five package.json scripts carried `SITE_URL=http://localhost:4321` prefixes
// to work around it.
//
// Builds stay guarded: `pnpm run build` runs `env:validate` first, which
// rejects both a missing SITE_URL and the template's placeholder values. The
// throw here is the backstop for `astro build` invoked directly.

/** Stand-in origin for commands that never bake `site` into output. */
export const localSiteFallback = "http://localhost:4321";

/**
 * The Astro subcommand being run — the first positional argument, so a flag
 * value like `--outDir build` is never mistaken for the `build` command.
 */
export function astroCommand(argv = []) {
  return argv.find((arg) => !arg.startsWith("-"));
}

/**
 * @returns the resolved `site`.
 * @throws when a production build has no SITE_URL/PUBLIC_SITE_URL configured.
 */
export function resolveSite({ argv = [], env = {} } = {}) {
  const explicit = env.SITE_URL || env.PUBLIC_SITE_URL;
  if (explicit) {
    return explicit;
  }

  if (astroCommand(argv) === "build") {
    throw new Error(
      "SITE_URL is required for production builds. " +
        "Set SITE_URL or PUBLIC_SITE_URL in your environment or .env file.",
    );
  }

  return localSiteFallback;
}
