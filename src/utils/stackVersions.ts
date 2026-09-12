/**
 * Display versions for the homepage tech-stack grid, derived from the pins in
 * `versions.json` (the public version contract, ADR-061) so the grid cannot
 * drift from what is installed. The hand-typed values it replaces advertised
 * "Astro v6" for seven weeks after the Astro 7 upgrade; `version:check` keeps
 * versions.json honest, so deriving from it keeps the grid honest too.
 *
 * Stable majors show only the major ("7.3.2" → "v7"); pre-1.0 pins keep the
 * minor, because that is the number that moves ("0.35.4" → "v0.35.x").
 */
export function displayVersion(pin: string): string {
  const match = /^v?(\d+)(?:\.(\d+|x))?/.exec(pin.trim());
  if (!match) {
    throw new Error(`Unrecognised version pin: "${pin}"`);
  }
  const major = Number(match[1]);
  if (major > 0) {
    return `v${major}`;
  }
  const minor = match[2];
  if (minor === undefined || minor === "x") {
    throw new Error(`A 0.x pin needs a minor version to display: "${pin}"`);
  }
  return `v0.${minor}.x`;
}
