import type { Config } from "tailwindcss";
import tokens from "./tokens/dist/tailwind-tokens.json";

const config: Config = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: tokens.colors,
      spacing: tokens.spacing,
      fontSize: tokens.fontSize,
      borderRadius: tokens.borderRadius,
      boxShadow: tokens.shadow,
      transitionDuration: tokens.motion.duration,
      transitionTimingFunction: tokens.motion.ease,
    },
  },
  plugins: [],
};

export default config;
