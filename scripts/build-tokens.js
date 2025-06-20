#!/usr/bin/env node
// Simple token build script: converts tokens/base.json to Tailwind-ready JS module
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = dirname(new URL(import.meta.url).pathname.replace(/^\//, ""));
const basePath = join(root, "..", "tokens", "base.json");
const distDir = join(root, "..", "tokens", "dist");

// ensure dist dir
mkdirSync(distDir, { recursive: true });

const base = JSON.parse(readFileSync(basePath, "utf-8"));

// Build Tailwind JSON
const tailwindTokens = {
  colors: base.color || {},
  spacing: base.spacing || {},
  fontSize: base.fontSize || {},
  borderRadius: base.borderRadius || {},
  shadow: base.shadow || {},
  motion: base.motion || {},
};

const outJson = join(distDir, "tailwind-tokens.json");
writeFileSync(outJson, JSON.stringify(tailwindTokens, null, 2));
console.log("✅ Built Tailwind tokens ->", outJson);

// Build CSS variables (light/dark)
const semanticPath = join(root, "..", "tokens", "semantic.json");
const semantic = JSON.parse(readFileSync(semanticPath, "utf-8"));

function toKebab(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function flatten(obj, prefix = []) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const newPrefix = [...prefix, toKebab(key)];
    if (value && typeof value === "object" && !("value" in value)) {
      Object.assign(acc, flatten(value, newPrefix));
    } else if (value && typeof value === "object" && "value" in value) {
      const varName = `--${newPrefix.join("-")}`;
      acc[varName] = value.value;
      if (value.dark) {
        acc[`${varName}|dark`] = value.dark;
      }
    }
    return acc;
  }, {});
}

const vars = {
  ...flatten(base),
  ...flatten(semantic.semantic || {}),
};

let lightCss = ":root {\n";
let darkCss = ".dark {\n";
for (const [name, val] of Object.entries(vars)) {
  if (name.endsWith("|dark")) {
    continue;
  }
  lightCss += `  ${name}: ${val};\n`;
  const darkVal = vars[`${name}|dark`];
  if (darkVal) {
    darkCss += `  ${name}: ${darkVal};\n`;
  }
}
lightCss += "}\n";
if (darkCss !== ".dark {\n") {
  darkCss += "}\n";
}

writeFileSync(join(distDir, "tokens.css"), lightCss + darkCss);
console.log("✅ Built CSS variables tokens ->", join(distDir, "tokens.css"));
