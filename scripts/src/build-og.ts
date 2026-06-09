#!/usr/bin/env tsx
/**
 * Brand raster pipeline (ADR-047 / ADR-054). Regenerates the raster brand assets
 * from their committed SOURCE SVGs so they never drift from the vector artwork:
 *   - public/og-{default,blog,about}.png  <- public/og-*.svg            (1200x630)
 *   - public/apple-touch-icon.png         <- src/assets/brand/app-icon-gradient.svg (180x180)
 *   - public/favicon.ico                  <- public/favicon.svg          (16/32/48 ICO)
 *
 * sharp cannot emit .ico, so favicon.ico is assembled as a multi-size
 * PNG-in-ICO container (dependency-free encoder below).
 *
 * `pnpm og:build`  regenerates the rasters + writes scripts/og-manifest.json
 *                  (sha256 of each source SVG).
 * `pnpm og:check`  re-hashes the sources against the manifest and verifies every
 *                  target exists — fails if a source SVG changed but the rasters
 *                  were not rebuilt. (Hash-of-source, not byte-compare, so it is
 *                  deterministic across platforms / sharp versions.) Wired into
 *                  quality:ci alongside the other no-drift guards.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const manifestPath = join(root, "scripts", "og-manifest.json");

interface RasterJob {
  source: string;
  target: string;
  render: (src: string) => Promise<Buffer>;
}

const ogPages = ["default", "blog", "about"] as const;

const jobs: RasterJob[] = [
  ...ogPages.map((page) => ({
    source: `public/og-${page}.svg`,
    target: `public/og-${page}.png`,
    render: (src: string) =>
      sharp(src, { density: 144 }).resize(1200, 630).png({ compressionLevel: 9 }).toBuffer(),
  })),
  {
    source: "src/assets/brand/app-icon-gradient.svg",
    target: "public/apple-touch-icon.png",
    render: (src: string) =>
      sharp(src, { density: 384 }).resize(180, 180).png({ compressionLevel: 9 }).toBuffer(),
  },
  {
    source: "public/favicon.svg",
    target: "public/favicon.ico",
    render: (src: string) => buildIco(src, [16, 32, 48]),
  },
];

/** Assemble a multi-size PNG-in-ICO buffer from an SVG source. */
async function buildIco(src: string, sizes: number[]): Promise<Buffer> {
  const pngs = await Promise.all(
    sizes.map((size) => sharp(src, { density: 384 }).resize(size, size).png().toBuffer()),
  );
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4); // image count

  const entries: Buffer[] = [];
  let offset = 6 + pngs.length * 16;
  pngs.forEach((png, i) => {
    const entry = Buffer.alloc(16);
    const dim = sizes[i] >= 256 ? 0 : sizes[i];
    entry.writeUInt8(dim, 0); // width (0 => 256)
    entry.writeUInt8(dim, 1); // height
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(png.length, 8); // image byte size
    entry.writeUInt32LE(offset, 12); // image byte offset
    offset += png.length;
    entries.push(entry);
  });

  return Buffer.concat([header, ...entries, ...pngs]);
}

function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

async function build(): Promise<void> {
  const manifest: Record<string, string> = {};
  for (const job of jobs) {
    const buf = await job.render(join(root, job.source));
    writeFileSync(join(root, job.target), buf);
    manifest[job.source] = sha256(join(root, job.source));
    console.log(`  ✓ ${job.target}  (${(buf.length / 1024).toFixed(1)} KB) ← ${job.source}`);
  }
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`✅ Regenerated ${jobs.length} brand rasters; wrote scripts/og-manifest.json.`);
}

function check(): void {
  if (!existsSync(manifestPath)) {
    console.error("❌ scripts/og-manifest.json missing — run `pnpm og:build`.");
    process.exit(1);
  }
  const manifest: Record<string, string> = JSON.parse(readFileSync(manifestPath, "utf-8"));
  const problems: string[] = [];
  for (const job of jobs) {
    if (!existsSync(join(root, job.target))) {
      problems.push(`missing target ${job.target} — run \`pnpm og:build\``);
      continue;
    }
    const current = sha256(join(root, job.source));
    if (manifest[job.source] !== current) {
      problems.push(`${job.source} changed since last raster build — run \`pnpm og:build\``);
    }
  }
  if (problems.length) {
    console.error("❌ Brand rasters are stale:");
    for (const p of problems) {
      console.error(`   - ${p}`);
    }
    process.exit(1);
  }
  console.log("✅ Brand rasters are in sync with their source SVGs.");
}

if (process.argv.includes("--check")) {
  check();
} else {
  await build();
}
