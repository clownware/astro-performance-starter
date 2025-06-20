import type { Config } from "tailwindcss";
import tokens from "./tokens/dist/tailwind-tokens.js";

const config: Config = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: tokens.colors,
      spacing: tokens.spacing,
      fontSize: tokens.fontSize,
      borderRadius: tokens.borderRadius,
      transitionDuration: tokens.transitionDuration,
    },
  },
  plugins: [],
};

export default config;
