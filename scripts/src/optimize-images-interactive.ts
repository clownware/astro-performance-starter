#!/usr/bin/env tsx

import { promises as fs } from "node:fs";
import path, { dirname } from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";
import { glob } from "glob";
import sharp from "sharp";

const filename = fileURLToPath(import.meta.url);
const dirName = dirname(filename);
const projectRoot = path.resolve(dirName, "../..");

// Image category configurations
const imageCategories = {
  thumbnail: { maxWidth: 400, maxHeight: 400, suggestedWidth: 200, suggestedHeight: 200 },
  content: { maxWidth: 1200, maxHeight: 900, suggestedWidth: 800, suggestedHeight: 600 },
  hero: { maxWidth: 1920, maxHeight: 1080, suggestedWidth: 1200, suggestedHeight: 675 },
  avatar: { maxWidth: 200, maxHeight: 200, suggestedWidth: 100, suggestedHeight: 100 },
  icon: { maxWidth: 512, maxHeight: 512, suggestedWidth: 180, suggestedHeight: 180 },
  logo: { maxWidth: 800, maxHeight: 600, suggestedWidth: 400, suggestedHeight: 300 },
  other: { maxWidth: 800, maxHeight: 600, suggestedWidth: 400, suggestedHeight: 300 },
};

// File size efficiency thresholds (bytes per pixel)
const compressionThresholds = {
  // PNG efficiency thresholds (bytes per pixel)
  png: {
    excellent: 0.4, // <0.4 bytes/pixel = well optimized
    good: 0.8, // 0.4-0.8 bytes/pixel = acceptable
    poor: 1.5, // 0.8-1.5 bytes/pixel = needs compression
    terrible: 2.5, // >1.5 bytes/pixel = definitely needs compression
  },
  // JPEG efficiency thresholds
  jpeg: {
    excellent: 0.25,
    good: 0.5,
    poor: 1.0,
    terrible: 1.8,
  },
};

interface ImageInfo {
  path: string;
  size: number;
  width: number;
  height: number;
  category: keyof typeof imageCategories;
  context: "static" | "content";
  needsOptimization: boolean;
  needsCompression: boolean;
  compressionReason: string;
  suggestedWidth: number;
  suggestedHeight: number;
  bytesPerPixel: number;
  compressionEfficiency: "excellent" | "good" | "poor" | "terrible";
}

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim().toLowerCase());
    });
  });
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

function getImageContext(imagePath: string): "static" | "content" {
  return imagePath.startsWith("public/") ? "static" : "content";
}

function categorizeImage(imagePath: string): keyof typeof imageCategories {
  const filename = path.basename(imagePath).toLowerCase();
  const dirPath = path.dirname(imagePath).toLowerCase();

  if (filename.includes("thumb") || filename.includes("thumbnail")) {
    return "thumbnail";
  }
  if (filename.includes("avatar") || filename.includes("profile")) {
    return "avatar";
  }
  if (filename.includes("hero") || filename.includes("banner") || filename.includes("featured")) {
    return "hero";
  }
  if (filename.includes("logo") || filename.includes("brand")) {
    return "logo";
  }
  if (filename.includes("icon") || filename.includes("touch")) {
    return "icon";
  }
  if (dirPath.includes("content") || dirPath.includes("blog") || dirPath.includes("project")) {
    return "content";
  }

  return "other";
}

function shouldOptimizeImage(
  width: number,
  height: number,
  category: keyof typeof imageCategories,
): boolean {
  const config = imageCategories[category];
  return width > config.maxWidth || height > config.maxHeight;
}

function calculateSuggestedDimensions(
  width: number,
  height: number,
  category: keyof typeof imageCategories,
): { width: number; height: number } {
  const config = imageCategories[category];
  const aspectRatio = width / height;

  // If image is within acceptable range, don't change
  if (width <= config.maxWidth && height <= config.maxHeight) {
    return { width, height };
  }

  // Calculate new dimensions maintaining aspect ratio
  let newWidth = config.suggestedWidth;
  let newHeight = Math.round(newWidth / aspectRatio);

  // If height is too large, scale based on height instead
  if (newHeight > config.suggestedHeight) {
    newHeight = config.suggestedHeight;
    newWidth = Math.round(newHeight * aspectRatio);
  }

  return { width: newWidth, height: newHeight };
}

function analyzeCompression(
  width: number,
  height: number,
  fileSize: number,
  format: string,
): "excellent" | "good" | "poor" | "terrible" {
  const pixels = width * height;
  const bytesPerPixel = fileSize / pixels;
  const formatKey = format.toLowerCase() as keyof typeof compressionThresholds;
  const thresholds = compressionThresholds[formatKey] || compressionThresholds.png;

  if (bytesPerPixel < thresholds.excellent) {
    return "excellent";
  }
  if (bytesPerPixel < thresholds.good) {
    return "good";
  }
  if (bytesPerPixel < thresholds.poor) {
    return "poor";
  }
  return "terrible";
}

function shouldCompressImage(
  size: number,
  width: number,
  height: number,
  format: string,
  category: keyof typeof imageCategories,
): boolean {
  // Updated thresholds to match analysis script and reflect realistic optimization targets

  // Touch icons should be optimized if over 50KB (was 32KB - too aggressive)
  if (category === "icon" && size > 50 * 1024) {
    return true;
  }

  // Logo images should be optimized if over 80KB (was 50KB - too aggressive for detailed logos)
  if (category === "logo" && size > 80 * 1024) {
    return true;
  }

  // Hero images should be optimized if over 150KB (was 100KB - allow for high-quality hero images)
  if (category === "hero" && size > 150 * 1024) {
    return true;
  }

  // Content images should be optimized if over 100KB (unchanged - good threshold)
  if (category === "content" && size > 100 * 1024) {
    return true;
  }

  // Thumbnails should be optimized if over 30KB (was 50KB - thumbnails should be smaller)
  if (category === "thumbnail" && size > 30 * 1024) {
    return true;
  }

  // For other categories, use compression efficiency
  const efficiency = analyzeCompression(width, height, size, format);
  return efficiency === "poor" || efficiency === "terrible";
}

async function getImageInfo(imagePath: string): Promise<ImageInfo | null> {
  try {
    const stats = await fs.stat(imagePath);
    const metadata = await sharp(imagePath).metadata();

    if (!metadata.width || !metadata.height) {
      return null;
    }

    const category = categorizeImage(imagePath);
    const context = getImageContext(imagePath);
    const needsOptimization = shouldOptimizeImage(metadata.width, metadata.height, category);
    const suggested = calculateSuggestedDimensions(metadata.width, metadata.height, category);
    const compressionEfficiency = analyzeCompression(
      metadata.width,
      metadata.height,
      stats.size,
      metadata.format,
    );
    const needsCompression = shouldCompressImage(
      stats.size,
      metadata.width,
      metadata.height,
      metadata.format,
      category,
    );
    const compressionReason = needsCompression
      ? category === "icon" && stats.size > 50 * 1024
        ? `Icon is ${Math.round(stats.size / 1024)}KB - touch icons should be <50KB for optimal performance`
        : `Compression efficiency is ${compressionEfficiency}`
      : "";

    return {
      path: imagePath,
      size: stats.size,
      width: metadata.width,
      height: metadata.height,
      category,
      context,
      needsOptimization,
      needsCompression,
      compressionReason,
      suggestedWidth: suggested.width,
      suggestedHeight: suggested.height,
      bytesPerPixel: stats.size / (metadata.width * metadata.height),
      compressionEfficiency,
    };
  } catch (error) {
    console.error(`Error analyzing ${imagePath}:`, error);
    return null;
  }
}

async function createBackup(imagePath: string): Promise<string> {
  const backupDir = path.join(projectRoot, ".backups/images/originals");
  await fs.mkdir(backupDir, { recursive: true });

  const filename = path.basename(imagePath);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(backupDir, `${timestamp}_${filename}`);

  await fs.copyFile(imagePath, backupPath);
  return backupPath;
}

async function optimizeImage(
  imagePath: string,
  targetWidth: number,
  targetHeight: number,
): Promise<void> {
  await sharp(imagePath)
    .resize(targetWidth, targetHeight, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(`${imagePath}.tmp`);

  await fs.rename(`${imagePath}.tmp`, imagePath);
}

async function showImagePreview(imageInfo: ImageInfo): Promise<void> {
  const currentSize = formatBytes(imageInfo.size);
  const estimatedNewSize = formatBytes(Math.round(imageInfo.size * 0.3)); // Rough estimate
  const contextIcon = imageInfo.context === "static" ? "" : "";
  const contextLabel = imageInfo.context === "static" ? "Static Asset" : "Content Image";

  console.log(`   ${contextIcon} ${imageInfo.path} (${contextLabel})`);
  console.log(`   Current: ${imageInfo.width}x${imageInfo.height}px (${currentSize})`);
  console.log(
    `   Suggested: ${imageInfo.suggestedWidth}x${imageInfo.suggestedHeight}px (~${estimatedNewSize})`,
  );
  console.log(`   Category: ${imageInfo.category}`);
  console.log(`   Reduction: ~${Math.round((1 - 0.3) * 100)}% size reduction expected`);

  if (imageInfo.context === "static") {
    console.log(`   Static asset - will be served as-is after optimization`);
  } else {
    console.log(`   Content image - Astro will further optimize at build time`);
  }

  if (imageInfo.needsCompression) {
    console.log(
      `   Compression efficiency: ${imageInfo.compressionEfficiency} (${imageInfo.bytesPerPixel.toFixed(2)} bytes/pixel)`,
    );
    console.log(`   ${imageInfo.compressionReason}`);
  }
}

async function main(): Promise<void> {
  console.log("Interactive Image Optimization Tool");
  console.log("=====================================\n");

  const imageGlobs = ["src/**/*.{png,jpg,jpeg,webp,avif}", "public/**/*.{png,jpg,jpeg,webp,avif}"];

  const imagePaths = await glob(imageGlobs, { cwd: projectRoot });
  console.log(`Found ${imagePaths.length} images. Analyzing...`);

  const imageInfos: ImageInfo[] = [];

  for (const imagePath of imagePaths) {
    const fullPath = path.join(projectRoot, imagePath);
    const info = await getImageInfo(fullPath);
    if (info) {
      console.log(`\n ${imagePath}:`);
      console.log(`   Size: ${(info.size / 1024).toFixed(1)}KB`);
      console.log(`   Dimensions: ${info.width}x${info.height}`);
      console.log(`   Category: ${info.category}`);
      console.log(
        `   Compression: ${info.compressionEfficiency} (${info.bytesPerPixel.toFixed(3)} bytes/pixel)`,
      );
      console.log(`   Needs optimization: ${info.needsOptimization} (dimension-based)`);
      console.log(`   Needs compression: ${info.needsCompression} (efficiency-based)`);

      if (info.needsOptimization || info.needsCompression) {
        imageInfos.push(info);
      }
    }
  }

  if (imageInfos.length === 0) {
    console.log("All images are already optimally sized!");
    rl.close();
    return;
  }

  // Separate by context
  const contentImages = imageInfos.filter((img) => img.context === "content");
  const staticImages = imageInfos.filter((img) => img.context === "static");

  console.log(`Found ${imageInfos.length} images that could benefit from optimization:`);
  if (contentImages.length > 0) {
    console.log(`   Content images (src/): ${contentImages.length}`);
  }
  if (staticImages.length > 0) {
    console.log(`   Static assets (public/): ${staticImages.length}`);
  }
  console.log("");

  // Show overview
  for (const imageInfo of imageInfos) {
    await showImagePreview(imageInfo);
    console.log("");
  }

  console.log("SAFETY FEATURES:");
  console.log("   • Original images will be backed up to .backups/images/originals/");
  console.log("   • You can approve/skip each image individually");
  console.log("   • Process can be stopped at any time with Ctrl+C");

  if (staticImages.length > 0) {
    console.log("\nSTATIC ASSET WARNING:");
    console.log("   • Static assets (public/) are served as-is");
    console.log("   • These optimizations are permanent for your users");
    console.log("   • Content images (src/) get further optimization by Astro");
  }

  const proceed = await askQuestion(
    "\nDo you want to proceed with interactive optimization? (y/n): ",
  );

  if (proceed !== "y" && proceed !== "yes") {
    console.log("Operation cancelled.");
    rl.close();
    return;
  }

  let optimizedCount = 0;
  let skippedCount = 0;

  // Process each image interactively
  for (let i = 0; i < imageInfos.length; i++) {
    const imageInfo = imageInfos[i];

    console.log(`\n[${i + 1}/${imageInfos.length}] Processing:`);
    await showImagePreview(imageInfo);

    const action = await askQuestion("\nOptimize this image? (y)es, (n)o, (q)uit: ");

    if (action === "q" || action === "quit") {
      console.log("Operation stopped by user.");
      break;
    }

    if (action === "y" || action === "yes") {
      try {
        console.log("   Creating backup...");
        const backupPath = await createBackup(imageInfo.path);
        console.log(`   Backup created: ${path.relative(projectRoot, backupPath)}`);

        console.log("   Optimizing image...");
        await optimizeImage(imageInfo.path, imageInfo.suggestedWidth, imageInfo.suggestedHeight);

        // Get new file size
        const newStats = await fs.stat(imageInfo.path);
        const newSize = formatBytes(newStats.size);
        const reduction = Math.round((1 - newStats.size / imageInfo.size) * 100);

        console.log(`   Optimized! New size: ${newSize} (${reduction}% reduction)`);
        optimizedCount++;
      } catch (error) {
        console.error(`   Error optimizing image: ${error}`);
        skippedCount++;
      }
    } else {
      console.log("   Skipped");
      skippedCount++;
    }
  }

  console.log("\nOptimization Complete!");
  console.log(`   Optimized: ${optimizedCount} images`);
  console.log(`   Skipped: ${skippedCount} images`);

  if (optimizedCount > 0) {
    console.log("\nBackups saved to: .backups/images/originals/");
    console.log('Run "pnpm run build" to see the final optimized output sizes');
  }

  rl.close();
}

main().catch(console.error);
