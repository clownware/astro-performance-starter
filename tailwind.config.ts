import type { Config } from "tailwindcss";
import tokens from "./tokens/dist/tailwind-tokens.json";

// Helper function to extract .value from nested token objects
function extractValues<T = unknown>(obj: unknown): T {
  if (obj && typeof obj === "object") {
    if ("value" in obj) {
      return (obj as { value: T }).value;
    }
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = extractValues(value);
    }
    return result as T;
  }
  return obj as T;
}

const config: Config = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    // Explicitly exclude docs to prevent style conflicts
    "!./src/content/docs/**/*",
    "!./docs/**/*",
    "!./docs-site/**/*",
  ],
  darkMode: "class" as const,
  theme: {
    extend: {
      colors: extractValues(tokens.colors),
      spacing: extractValues(tokens.spacing),
      fontSize: extractValues(tokens.fontSize),
      borderRadius: extractValues(tokens.borderRadius),
      boxShadow: extractValues(tokens.shadow),
      transitionDuration: extractValues(tokens.motion.duration),
      transitionTimingFunction: extractValues(tokens.motion.ease),
    },
  },
  plugins: [],
};

export default config satisfies Config;
