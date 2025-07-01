import type { Config } from "tailwindcss";
import tokens from "./tokens/dist/tailwind-tokens.json";

/**
 * Simple utility to transform design tokens into Tailwind format
 * Handles nested "value" properties and HSL color conversion
 */
function transformTokens<T = Record<string, unknown>>(
  tokenObj: Record<string, unknown> | undefined,
): T {
  if (!tokenObj) {
    return {} as T;
  }

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(tokenObj)) {
    if (value && typeof value === "object") {
      if ("value" in value && typeof value.value === "string") {
        // Handle HSL colors for opacity modifier support
        if (typeof value.value === "string" && value.value.includes("%")) {
          result[key] = `hsl(${value.value} / <alpha-value>)`;
        } else {
          result[key] = value.value;
        }
      } else {
        result[key] = transformTokens(value as Record<string, unknown>);
      }
    }
  }

  return result as T;
}

const config: Config = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}", "!./src/content/docs/**/*"],
  darkMode: "class",
  theme: {
    extend: {
      colors: transformTokens(tokens.colors),
      spacing: transformTokens(tokens.spacing),
      fontSize: transformTokens(tokens.fontSize),
      borderRadius: transformTokens(tokens.borderRadius),
      boxShadow: transformTokens(tokens.shadow),
      transitionDuration: transformTokens(tokens.motion?.duration),
      transitionTimingFunction: transformTokens(tokens.motion?.ease),
      animation: {
        "fade-in": "fade-in 0.5s ease-in-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [
    // Accessibility plugin
    ({ addUtilities }) => {
      addUtilities({
        ".focus-ring": {
          "@apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2": {},
        },
        ".sr-only": {
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: "0",
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          borderWidth: "0",
        },
      });
    },
  ],
} satisfies Config;

export default config;
