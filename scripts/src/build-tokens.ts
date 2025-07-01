#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Type definitions for design tokens
interface Token {
  value: string;
  dark?: string;
}

type TokenGroup = { [key: string]: Token | TokenGroup };

interface BaseTokens {
  color?: TokenGroup;
  spacing?: TokenGroup;
  fontSize?: TokenGroup;
  borderRadius?: TokenGroup;
  shadow?: TokenGroup;
  motion?: TokenGroup;
  [key: string]: TokenGroup | undefined;
}

interface SemanticTokens {
  semantic?: TokenGroup;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tokensDir = join(__dirname, "..", "..", "tokens");
const distDir = join(tokensDir, "dist");

// Ensure dist directory exists
mkdirSync(distDir, { recursive: true });

// --- Build Tailwind-specific tokens --- //
const baseTokenPath = join(tokensDir, "base.json");
const baseTokens = JSON.parse(readFileSync(baseTokenPath, "utf-8")) as BaseTokens;

const tailwindTokens = {
  colors: baseTokens.color ?? {},
  spacing: baseTokens.spacing ?? {},
  fontSize: baseTokens.fontSize ?? {},
  borderRadius: baseTokens.borderRadius ?? {},
  shadow: baseTokens.shadow ?? {},
  motion: baseTokens.motion ?? {},
};

const tailwindTokenPath = join(distDir, "tailwind-tokens.json");
writeFileSync(tailwindTokenPath, JSON.stringify(tailwindTokens, null, 2));
console.log(`✅ Built Tailwind tokens -> ${tailwindTokenPath}`);

// --- Build CSS variables (light/dark) --- //
const semanticTokenPath = join(tokensDir, "semantic.json");
const semanticTokens = JSON.parse(readFileSync(semanticTokenPath, "utf-8")) as SemanticTokens;

const toKebabCase = (str: string) =>
  str.replace(/([a-z0-9]|(?<=[a-z0-9]))([A-Z])/g, "$1-$2").toLowerCase();

// Recursively flattens token groups into a record of CSS variable names and values.
// This is more performant than the previous reduce-based implementation.
function flattenTokensRecursive(obj: TokenGroup, prefix: string[], acc: Record<string, string>) {
  for (const [key, value] of Object.entries(obj)) {
    const newPrefix = [...prefix, toKebabCase(key)];
    if (value && typeof value === "object" && !("value" in value)) {
      // Recursively flatten nested tokens
      const nestedTokens = flattenTokens(value as TokenGroup, newPrefix);
      for (const [nestedKey, nestedValue] of Object.entries(nestedTokens)) {
        acc[nestedKey] = nestedValue;
      }
    } else if (value && typeof value === "object" && "value" in value) {
      const token = value as Token;
      const varName = `--${newPrefix.join("-")}`;
      acc[varName] = token.value;
      if (token.dark) {
        acc[`${varName}|dark`] = token.dark;
      }
    }
  }
}

const flattenTokens = (obj: TokenGroup, prefix: string[] = []): Record<string, string> => {
  const acc: Record<string, string> = {};
  flattenTokensRecursive(obj, prefix, acc);
  return acc;
};

// Generates CSS variables from flattened tokens
const generateCssVariables = (tokens: Record<string, string>): string => {
  let lightCss = ":root {\n";
  let darkCss = ".dark {\n";

  for (const [name, value] of Object.entries(tokens)) {
    if (name.endsWith("|dark")) {
      continue;
    }
    lightCss += `  ${name}: ${value};\n`;
  }

  if (tokens) {
    for (const [name, value] of Object.entries(tokens)) {
      if (name.endsWith("|dark")) {
        const lightName = name.replace("|dark", "");
        darkCss += `  ${lightName}: ${value};\n`;
      }
    }
  }

  lightCss += "}\n";
  if (darkCss !== ".dark {\n") {
    darkCss += "}\n";
  }

  return lightCss + darkCss;
};

const allVars = {
  ...flattenTokens(baseTokens as TokenGroup),
  ...flattenTokens(semanticTokens.semantic ?? {}),
};

const cssTokenPath = join(distDir, "tokens.css");
writeFileSync(cssTokenPath, generateCssVariables(allVars));
console.log(`✅ Built CSS variables -> ${cssTokenPath}`);
