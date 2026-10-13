/**
 * Content-Security-Policy for hosts that cannot send response headers
 * (ADR-051, amended 2026-10-13).
 *
 * The policy has one source: `public/_headers`. Header-capable hosts apply that
 * file. GitHub Pages and other plain static hosts ignore it, so the build also
 * emits the same policy as a `<meta http-equiv>` element, derived here so the
 * two cannot drift.
 */

/** Directives a `<meta>` element cannot enforce; browsers ignore them there. */
const headerOnlyDirectives = new Set(["frame-ancestors", "report-uri", "report-to", "sandbox"]);

/**
 * The Content-Security-Policy that a `_headers` file declares for every path
 * (the `/*` block), or null when it declares none.
 */
export function cspFromHeadersFile(text: string): string | null {
  let path = "";
  for (const line of text.split("\n")) {
    if (line.trim() === "" || line.trim().startsWith("#")) {
      continue;
    }
    if (!/^\s/.test(line)) {
      path = line.trim();
      continue;
    }
    const match = line.match(/^\s+content-security-policy:\s*(.+)$/i);
    if (path === "/*" && match) {
      return match[1].trim();
    }
  }
  return null;
}

/**
 * The same policy without the directives only a response header can carry.
 * Returns null when nothing enforceable is left.
 */
export function cspForMeta(policy: string | null): string | null {
  if (!policy) {
    return null;
  }
  const kept = policy
    .split(";")
    .map((directive) => directive.trim())
    .filter((directive) => directive !== "")
    .filter((directive) => !headerOnlyDirectives.has(directive.split(/\s+/)[0].toLowerCase()));
  return kept.length > 0 ? kept.join("; ") : null;
}
