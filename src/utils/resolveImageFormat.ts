type RequestedFormat = "avif" | "webp" | "png" | "jpeg" | "jpg" | "svg" | "gif" | undefined;
type ProcessedFormat = "avif" | "webp" | "png" | "jpeg" | "svg";

/**
 * Decide the output format for the Image atom.
 *
 * SVG sources must pass through as `svg`: Astro 6.4+ disables SVG
 * rasterization by default, so handing an SVG to sharp with a raster
 * output format fails the build. Passthrough is also the better
 * outcome — the vector stays a vector.
 */
export function resolveImageFormat(
  requested: RequestedFormat,
  sourceFormat: string | undefined,
): ProcessedFormat {
  if (sourceFormat === "svg") {
    return "svg";
  }
  if (requested === "jpg") {
    return "jpeg";
  }
  if (requested === "svg" || requested === "gif") {
    // sharp does not output these; fall back to a processed format
    return "png";
  }
  return requested ?? "avif";
}
