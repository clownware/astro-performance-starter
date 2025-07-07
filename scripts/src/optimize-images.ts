#!/usr/bin/env node

import { readdir, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = join(__dirname, "../..");

interface ImageInfo {
  path: string;
  size: number;
  sizeKB: number;
  sizeMB: number;
  extension: string;
  category: "hero" | "content" | "thumbnail" | "avatar" | "icon" | "logo" | "other";
  context: "static" | "content";
  insights: string[];
  width?: number;
  height?: number;
}

// Recommended dimensions for different image types
const DIMENSION_GUIDELINES = {
  hero: {
    max: 1920,
    recommended: "1200-1920px wide for hero images",
    maxWidth: 1920,
    maxHeight: 1080,
    idealWidth: 1200,
    idealHeight: 675,
  },
  content: {
    max: 1200,
    recommended: "800-1200px wide for content images",
    maxWidth: 1200,
    maxHeight: 800,
    idealWidth: 800,
    idealHeight: 600,
  },
  thumbnail: {
    max: 400,
    recommended: "200-400px for thumbnails",
    maxWidth: 400,
    maxHeight: 400,
    idealWidth: 200,
    idealHeight: 200,
  },
  avatar: {
    max: 200,
    recommended: "100-200px for avatars",
    maxWidth: 200,
    maxHeight: 200,
    idealWidth: 100,
    idealHeight: 100,
  },
  icon: {
    max: 512,
    recommended: "180-512px for touch icons and favicons",
    maxWidth: 512,
    maxHeight: 512,
    idealWidth: 180,
    idealHeight: 180,
  },
  logo: {
    max: 800,
    recommended: "400-800px for logos and branding",
    maxWidth: 800,
    maxHeight: 600,
    idealWidth: 400,
    idealHeight: 300,
  },
  other: {
    max: 800,
    recommended: "Appropriate for usage context",
    maxWidth: 800,
    maxHeight: 600,
    idealWidth: 400,
    idealHeight: 300,
  },
};

async function findImages(dir: string, images: ImageInfo[] = []): Promise<ImageInfo[]> {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
      await findImages(fullPath, images);
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      if ([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif"].includes(ext)) {
        const stats = await stat(fullPath);
        const relativePath = relative(rootDir, fullPath);

        const imageInfo: ImageInfo = {
          path: relativePath,
          size: stats.size,
          sizeKB: Math.round(stats.size / 1024),
          sizeMB: Math.round((stats.size / 1024 / 1024) * 100) / 100,
          extension: ext,
          category: categorizeImage(relativePath),
          context: getImageContext(relativePath),
          insights: [],
        };

        // Add width and height properties
        try {
          const sharpModule = await import("sharp");
          const sharpInstance = sharpModule.default;
          const metadata = await sharpInstance(fullPath).metadata();
          imageInfo.width = metadata.width;
          imageInfo.height = metadata.height;
        } catch (error) {
          console.error(`Error getting image dimensions for ${relativePath}: ${error}`);
        }

        imageInfo.insights = generateInsights(imageInfo);
        images.push(imageInfo);
      }
    }
  }

  return images;
}

function getImageContext(path: string): "static" | "content" {
  return path.startsWith("public/") ? "static" : "content";
}

function categorizeImage(path: string): ImageInfo["category"] {
  const lowerPath = path.toLowerCase();

  if (lowerPath.includes("hero") || lowerPath.includes("featured")) {
    return "hero";
  }
  if (lowerPath.includes("thumb") || lowerPath.includes("thumbnail")) {
    return "thumbnail";
  }
  if (lowerPath.includes("avatar") || lowerPath.includes("profile")) {
    return "avatar";
  }
  if (
    lowerPath.includes("icon") ||
    lowerPath.includes("favicon") ||
    lowerPath.includes("apple-touch")
  ) {
    return "icon";
  }
  if (
    lowerPath.includes("logo") ||
    lowerPath.includes("astro-logo") ||
    lowerPath.includes("brand")
  ) {
    return "logo";
  }
  if (
    lowerPath.includes("content") ||
    lowerPath.includes("blog") ||
    lowerPath.includes("project")
  ) {
    return "content";
  }

  return "other";
}

function generateInsights(image: ImageInfo): string[] {
  const insights: string[] = [];
  const guidelines = DIMENSION_GUIDELINES[image.category];

  // Context-specific insights
  if (image.context === "static") {
    insights.push(`🔧 Static asset - served as-is, should be pre-optimized`);
  } else {
    // Format optimization insights for content images
    if (image.extension === ".png" && image.sizeKB > 50) {
      insights.push(`✨ Will be optimized to AVIF format (expect 60-80% size reduction)`);
    }
  }

  // More aggressive size-based insights with lower thresholds
  if (image.category === "hero" && image.sizeKB > 200) {
    insights.push(
      `🖼️ Large hero image - consider reducing source size (current: ${image.sizeKB}KB)`,
    );
  }

  if (image.category === "logo" && image.sizeKB > 100) {
    insights.push(
      `🏷️ Large logo image - consider optimizing (current: ${image.sizeKB}KB, target: <50KB)`,
    );
  }

  if (image.category === "thumbnail" && image.sizeKB > 100) {
    insights.push(
      `📏 Large thumbnail - consider reducing source dimensions (current: ${image.sizeKB}KB)`,
    );
  }

  if (image.category === "icon" && image.sizeKB > 32) {
    insights.push(
      `🎯 Large icon - touch icons should be <32KB for optimal performance (current: ${image.sizeKB}KB)`,
    );
  }

  if (image.category === "content" && image.sizeKB > 150) {
    insights.push(
      `📄 Large content image - consider optimization (current: ${image.sizeKB}KB, target: <100KB)`,
    );
  }

  // Dimension-based insights
  if (image.width && image.height) {
    const isOversized = image.width > guidelines.maxWidth || image.height > guidelines.maxHeight;
    if (isOversized) {
      insights.push(
        `📐 Oversized dimensions: ${image.width}x${image.height}px (max: ${guidelines.maxWidth}x${guidelines.maxHeight}px)`,
      );
    }
  }

  // Best practice insights for specific categories
  if (image.category === "hero" || image.category === "logo") {
    insights.push(`💡 Best practice: ${guidelines.recommended}`);
  }

  if (image.category === "icon") {
    insights.push(`💡 Best practice: ${guidelines.recommended}`);
  }

  if (insights.length === 0) {
    insights.push(`✅ Good size for ${image.category} image`);
  }

  return insights;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`;
}

async function analyzeImages() {
  console.log("🔍 Analyzing images in project...\n");

  const images = await findImages(rootDir);

  if (images.length === 0) {
    console.log("No images found in project.");
    return;
  }

  // Sort by size (largest first)
  images.sort((a, b) => b.size - a.size);

  const totalSize = images.reduce((sum, img) => sum + img.size, 0);
  const contentImages = images.filter((img) => img.context === "content");
  const staticImages = images.filter((img) => img.context === "static");

  console.log(`📊 **Image Analysis Results**`);
  console.log(`Total images: ${images.length}`);
  console.log(`Total size: ${formatBytes(totalSize)}`);
  console.log(`\n📈 **Image Distribution:**`);
  console.log(
    `   Content images (src/): ${contentImages.length} (${formatBytes(contentImages.reduce((sum, img) => sum + img.size, 0))})`,
  );
  console.log(
    `   Static assets (public/): ${staticImages.length} (${formatBytes(staticImages.reduce((sum, img) => sum + img.size, 0))})`,
  );
  console.log(`\n💡 **Processing Notes:**`);
  console.log(`   📁 Content images: Processed by Astro with Sharp optimization`);
  console.log(`   🔧 Static assets: Served as-is, should be pre-optimized\n`);

  // Group by category
  const categories = images.reduce(
    (acc, img) => {
      if (!acc[img.category]) {
        acc[img.category] = [];
      }
      acc[img.category].push(img);
      return acc;
    },
    {} as Record<string, ImageInfo[]>,
  );

  // Display results by category
  for (const [category, categoryImages] of Object.entries(categories)) {
    const categorySize = categoryImages.reduce((sum, img) => sum + img.size, 0);
    const guidelines = DIMENSION_GUIDELINES[category as keyof typeof DIMENSION_GUIDELINES];

    console.log(`\n📁 **${category.toUpperCase()} Images** (${guidelines.recommended})`);
    console.log(`   Total: ${categoryImages.length} images, ${formatBytes(categorySize)}`);

    for (const image of categoryImages) {
      const contextIcon = image.context === "static" ? "🔧" : "📁";
      console.log(`   ${contextIcon} ${image.path}`);
      console.log(`      Size: ${formatBytes(image.size)} (${image.sizeKB}KB)`);

      for (const insight of image.insights) {
        console.log(`      ${insight}`);
      }
    }
  }

  // Check if any images need dimension optimization
  const oversizedImages = images.filter((img) => {
    const guidelines = DIMENSION_GUIDELINES[img.category];
    return (
      img.width &&
      img.height &&
      (img.width > guidelines.maxWidth || img.height > guidelines.maxHeight)
    );
  });

  if (oversizedImages.length > 0) {
    console.log(`\n📏 **Image Resizing Recommendations:**`);
    console.log(`${oversizedImages.length} images could benefit from dimension optimization:`);

    for (const img of oversizedImages) {
      const guidelines = DIMENSION_GUIDELINES[img.category];
      const contextNote = img.context === "static" ? " (static asset)" : " (content image)";
      console.log(`\n   🖼️  ${img.path}${contextNote}`);
      console.log(`      Current: ${img.width}x${img.height}px`);
      console.log(
        `      Suggested: ${guidelines.idealWidth}x${guidelines.idealHeight}px (${img.category})`,
      );
    }
  }

  // Check for images that could benefit from optimization
  const needsOptimization = images.filter((img) => {
    // Check if image is large enough to benefit from optimization
    if (img.category === "hero" && img.sizeKB > 50) {
      return true;
    }
    if (img.category === "logo" && img.sizeKB > 50) {
      return true;
    }
    if (img.category === "content" && img.sizeKB > 75) {
      return true;
    }
    if (img.category === "thumbnail" && img.sizeKB > 25) {
      return true;
    }
    if (img.category === "avatar" && img.sizeKB > 15) {
      return true;
    }
    if (img.category === "icon" && img.sizeKB > 20) {
      return true;
    }
    if (img.category === "other" && img.sizeKB > 50) {
      return true;
    }
    return false;
  });

  // Performance insights
  const largeImages = images.filter((img) => img.sizeKB > 1000);
  const pngImages = images.filter((img) => img.extension === ".png");
  const largeStaticImages = staticImages.filter((img) => img.sizeKB > 100);

  console.log(`\n🎯 **Performance Insights**`);
  console.log(`Large images (>1MB): ${largeImages.length}/${images.length}`);
  console.log(`PNG images: ${pngImages.length}/${images.length}`);
  if (largeStaticImages.length > 0) {
    console.log(`Large static assets (>100KB): ${largeStaticImages.length}/${staticImages.length}`);
  }

  if (
    largeImages.length > 0 ||
    pngImages.length > 0 ||
    largeStaticImages.length > 0 ||
    needsOptimization.length > 0
  ) {
    console.log(`\n🚀 **Optimization Recommendations:**`);
    if (contentImages.length > 0) {
      console.log(`📁 **Content Images (src/):**`);
      console.log(`   1. 🎨 Astro converts PNG → AVIF/WebP at build time`);
      console.log(`   2. 📱 Add responsive image sizes for hero images`);
      console.log(`   3. ⚡ Lazy loading already configured in Image component`);

      if (needsOptimization.filter((img) => img.context === "content").length > 0) {
        console.log(`   4. 🛠️ Run 'pnpm run optimize:images' to pre-optimize source images`);
      }
    }
    if (staticImages.length > 0) {
      console.log(`🔧 **Static Assets (public/):**`);
      console.log(`   1. 🛠️ Run 'pnpm run optimize:images' for manual optimization`);
      console.log(`   2. 📏 Consider reducing dimensions for oversized assets`);
      console.log(`   3. 🎨 Convert PNG to WebP/AVIF for better compression`);
    }
    console.log(`5. 🔍 Run 'pnpm run build' to see final optimized sizes`);
    console.log(`6. 🔍 Run 'pnpm run analyze:images' again to re-analyze optimized images`);
  } else {
    console.log(`🎉 All images are well-optimized for their usage!`);
  }

  // Clear recommendation about optimization script
  console.log(`\n🎯 **Optimization Recommendation:**`);
  if (needsOptimization.length > 0) {
    console.log(
      `📢 **YES** - Run 'pnpm run optimize:images' to optimize ${needsOptimization.length} image(s)`,
    );
  } else {
    console.log(
      `📢 **NO** - All images are already well-optimized, no need to run optimize:images`,
    );
  }
}

// Run the analysis
analyzeImages().catch(console.error);
