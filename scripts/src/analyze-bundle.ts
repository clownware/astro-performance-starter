#!/usr/bin/env tsx

import { readFileSync } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const dirname = fileURLToPath(new URL(".", import.meta.url));
const distPath = join(dirname, "../../dist");

interface FileInfo {
  path: string;
  size: number;
  gzipSize: number;
  type: "js" | "css" | "html" | "image" | "other";
}

async function getFileSize(filePath: string): Promise<number> {
  const stats = await stat(filePath);
  return stats.size;
}

function getGzipSize(filePath: string): number {
  const content = readFileSync(filePath);
  return gzipSync(content).length;
}

function getFileType(filePath: string): FileInfo["type"] {
  const ext = extname(filePath).toLowerCase();
  switch (ext) {
    case ".js":
    case ".mjs":
      return "js";
    case ".css":
      return "css";
    case ".html":
      return "html";
    case ".png":
    case ".jpg":
    case ".jpeg":
    case ".webp":
    case ".avif":
    case ".svg":
      return "image";
    default:
      return "other";
  }
}

async function analyzeDirectory(dirPath: string): Promise<FileInfo[]> {
  const files: FileInfo[] = [];

  try {
    const entries = await readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);

      if (entry.isDirectory()) {
        const subFiles = await analyzeDirectory(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        const size = await getFileSize(fullPath);
        const gzipSize = getGzipSize(fullPath);
        const type = getFileType(fullPath);

        files.push({
          path: relative(distPath, fullPath),
          size,
          gzipSize,
          type,
        });
      }
    }
  } catch (error) {
    console.error(`Error analyzing directory ${dirPath}:`, error);
  }

  return files;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

function analyzeBundle(files: FileInfo[]) {
  const stats = {
    js: { count: 0, size: 0, gzipSize: 0 },
    css: { count: 0, size: 0, gzipSize: 0 },
    html: { count: 0, size: 0, gzipSize: 0 },
    image: { count: 0, size: 0, gzipSize: 0 },
    other: { count: 0, size: 0, gzipSize: 0 },
    total: { count: 0, size: 0, gzipSize: 0 },
  };

  files.forEach((file) => {
    stats[file.type].count++;
    stats[file.type].size += file.size;
    stats[file.type].gzipSize += file.gzipSize;

    stats.total.count++;
    stats.total.size += file.size;
    stats.total.gzipSize += file.gzipSize;
  });

  return stats;
}

async function main() {
  console.log("🔍 Analyzing bundle...\n");

  try {
    const files = await analyzeDirectory(distPath);
    const stats = analyzeBundle(files);

    console.log("📊 Bundle Analysis Results");
    console.log("=".repeat(50));

    // Overall stats
    console.log(`\n📦 Total Files: ${stats.total.count}`);
    console.log(`📏 Total Size: ${formatBytes(stats.total.size)}`);
    console.log(`🗜️  Gzipped Size: ${formatBytes(stats.total.gzipSize)}`);
    console.log(
      `📉 Compression Ratio: ${((1 - stats.total.gzipSize / stats.total.size) * 100).toFixed(1)}%`,
    );

    // Breakdown by type
    console.log("\n📋 Breakdown by Type:");
    console.log("-".repeat(50));

    Object.entries(stats).forEach(([type, data]) => {
      if (type === "total" || data.count === 0) {
        return;
      }

      const iconMap: Record<string, string> = {
        js: "⚡",
        css: "🎨",
        html: "📄",
        image: "🖼️",
        other: "📁",
      };

      const icon = iconMap[type] || "📁";

      console.log(`${icon} ${type.toUpperCase()}: ${data.count} files`);
      console.log(`   Size: ${formatBytes(data.size)} (${formatBytes(data.gzipSize)} gzipped)`);
    });

    // Largest files
    console.log("\n🏆 Largest Files:");
    console.log("-".repeat(50));

    const largestFiles = files.sort((a, b) => b.size - a.size).slice(0, 10);

    largestFiles.forEach((file, index) => {
      const iconMap: Record<string, string> = {
        js: "⚡",
        css: "🎨",
        html: "📄",
        image: "🖼️",
        other: "📁",
      };

      const icon = iconMap[file.type] || "📁";

      console.log(`${index + 1}. ${icon} ${file.path}`);
      console.log(`   ${formatBytes(file.size)} (${formatBytes(file.gzipSize)} gzipped)`);
    });

    // Performance recommendations
    console.log("\n💡 Performance Recommendations:");
    console.log("-".repeat(50));

    const jsSize = stats.js.gzipSize;
    const cssSize = stats.css.gzipSize;
    const htmlSize = stats.html.gzipSize;
    const codeSize = jsSize + cssSize + htmlSize; // Core code bundle
    const totalSize = stats.total.gzipSize;

    // JavaScript bundle recommendations
    if (jsSize > 100 * 1024) {
      console.log("⚠️  JavaScript bundle is large (>100KB gzipped). Consider code splitting.");
    } else if (jsSize > 50 * 1024) {
      console.log("⚡ JavaScript bundle is moderate (>50KB gzipped). Monitor for growth.");
    } else {
      console.log("✅ JavaScript bundle size is excellent (<50KB gzipped).");
    }

    // CSS bundle recommendations
    if (cssSize > 50 * 1024) {
      console.log("⚠️  CSS bundle is large (>50KB gzipped). Consider purging unused styles.");
    } else if (cssSize > 20 * 1024) {
      console.log("🎨 CSS bundle is moderate (>20KB gzipped). Monitor for growth.");
    } else {
      console.log("✅ CSS bundle size is excellent (<20KB gzipped).");
    }

    // Core code bundle assessment (JS + CSS + HTML)
    console.log(`\n📊 Core Code Bundle: ${formatBytes(codeSize)} gzipped`);
    if (codeSize < 100 * 1024) {
      console.log("🎉 Excellent core code size! Perfect for Astro performance.");
    } else if (codeSize < 200 * 1024) {
      console.log("👍 Good core code size. Well within Astro best practices.");
    } else {
      console.log("📈 Large core code size. Consider optimization strategies.");
    }

    // Total bundle assessment (including assets)
    console.log(`\n📦 Total Bundle: ${formatBytes(totalSize)} gzipped`);
    if (totalSize < 500 * 1024) {
      console.log("✅ Good total bundle size for a complete site with assets.");
    } else if (totalSize < 1024 * 1024) {
      console.log("👍 Moderate total bundle size. Consider image optimization if needed.");
    } else {
      console.log("📈 Large total bundle size. Focus on asset optimization.");
    }

    // Astro-specific insights
    console.log("\n🚀 Astro Performance Insights:");
    console.log("-".repeat(50));

    const jsFiles = files.filter((f) => f.type === "js");
    const hasClientRouter = jsFiles.some((f) => f.path.includes("ClientRouter"));
    const hasPreact = jsFiles.some((f) => f.path.includes("preact"));

    if (hasClientRouter) {
      console.log("✅ Using Astro's ClientRouter for View Transitions");
    }

    if (hasPreact) {
      console.log("⚡ Preact islands detected - ensure strategic hydration");
    }

    if (jsFiles.length === 0) {
      console.log("🎯 Zero JavaScript bundle - Perfect for static sites!");
    } else {
      console.log(`📊 ${jsFiles.length} JavaScript files - Following islands architecture`);
    }

    // Image optimization recommendation based on bundle analysis
    console.log("\n🎯 **Image Optimization Recommendation:**");
    const imageFiles = files.filter((f) => f.type === "image");
    const largeImages = imageFiles.filter((f) => f.size > 100 * 1024); // >100KB

    if (largeImages.length > 0) {
      console.log(
        `📢 **CONSIDER** - ${largeImages.length} large image(s) detected. Run 'pnpm run analyze:images' to check optimization opportunities.`,
      );
      largeImages.forEach((img) => {
        console.log(`   • ${img.path}: ${formatBytes(img.size)}`);
      });
    } else if (imageFiles.length > 0) {
      console.log(`📢 **NO** - All ${imageFiles.length} images are well-optimized (<100KB each)`);
    } else {
      console.log(`📢 **N/A** - No images found in bundle`);
    }

    console.log("\n✨ Analysis complete!");
  } catch (error) {
    console.error("❌ Error analyzing bundle:", error);
    process.exit(1);
  }
}

main();
