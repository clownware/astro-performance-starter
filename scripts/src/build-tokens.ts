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

const tailwindTokens: Record<string, TokenGroup> = {};

// Conditionally add token categories only if they exist in the base tokens
if (baseTokens.color) {
  tailwindTokens.colors = baseTokens.color;
}
if (baseTokens.spacing) {
  tailwindTokens.spacing = baseTokens.spacing;
}
if (baseTokens.fontSize) {
  tailwindTokens.fontSize = baseTokens.fontSize;
}
if (baseTokens.borderRadius) {
  tailwindTokens.borderRadius = baseTokens.borderRadius;
}
if (baseTokens.shadow) {
  tailwindTokens.shadow = baseTokens.shadow;
}
if (baseTokens.motion) {
  tailwindTokens.motion = baseTokens.motion;
}

// --- Load semantic tokens early --- //
const semanticTokenPath = join(tokensDir, "semantic.json");
const semanticTokens = JSON.parse(readFileSync(semanticTokenPath, "utf-8")) as SemanticTokens;

// Function to resolve token references like {color.moonstone.100}
function resolveTokenReferences(obj: TokenGroup, context: BaseTokens): TokenGroup {
  const resolved: TokenGroup = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === "object") {
      if ("value" in value) {
        const token = value as Token;
        // Check if value contains a reference
        if (
          typeof token.value === "string" &&
          token.value.startsWith("{") &&
          token.value.endsWith("}")
        ) {
          const refPath = token.value.slice(1, -1).split(".");
          let resolvedValue: any = context;

          // Navigate through the reference path
          for (const part of refPath) {
            if (resolvedValue && typeof resolvedValue === "object" && part in resolvedValue) {
              resolvedValue = resolvedValue[part];
            } else {
              resolvedValue = null;
              break;
            }
          }

          // If we found a token with a value, use it
          if (resolvedValue && typeof resolvedValue === "object" && "value" in resolvedValue) {
            resolved[key] = { value: resolvedValue.value };

            // Handle dark mode token references
            if (token.dark) {
              if (
                typeof token.dark === "string" &&
                token.dark.startsWith("{") &&
                token.dark.endsWith("}")
              ) {
                // Resolve dark mode reference
                const darkRefPath = token.dark.slice(1, -1).split(".");
                let darkResolvedValue: any = context;

                for (const part of darkRefPath) {
                  if (
                    darkResolvedValue &&
                    typeof darkResolvedValue === "object" &&
                    part in darkResolvedValue
                  ) {
                    darkResolvedValue = darkResolvedValue[part];
                  } else {
                    darkResolvedValue = null;
                    break;
                  }
                }

                if (
                  darkResolvedValue &&
                  typeof darkResolvedValue === "object" &&
                  "value" in darkResolvedValue
                ) {
                  (resolved[key] as Token).dark = darkResolvedValue.value;
                }
              } else {
                // Use dark value as-is if it's not a reference
                (resolved[key] as Token).dark = token.dark;
              }
            }
          } else {
            // Fallback to original if reference couldn't be resolved
            resolved[key] = value;
          }
        } else {
          resolved[key] = value;
        }
      } else {
        // Recursively resolve nested groups
        resolved[key] = resolveTokenReferences(value as TokenGroup, context);
      }
    }
  }

  return resolved;
}

// Add semantic tokens to Tailwind config
if (semanticTokens.semantic) {
  // Merge semantic color tokens into colors object
  if (!tailwindTokens.colors) {
    tailwindTokens.colors = {};
  }

  // Resolve token references using base tokens as context
  const resolvedSemantic = resolveTokenReferences(semanticTokens.semantic, baseTokens);

  // Add primary and secondary color scales from semantic tokens
  if (resolvedSemantic.primary) {
    tailwindTokens.colors.primary = resolvedSemantic.primary;
  }
  if (resolvedSemantic.secondary) {
    tailwindTokens.colors.secondary = resolvedSemantic.secondary;
  }

  // Add other semantic colors if needed
  if (resolvedSemantic.background) {
    tailwindTokens.colors.background = resolvedSemantic.background;
  }
  if (resolvedSemantic.foreground) {
    tailwindTokens.colors.foreground = resolvedSemantic.foreground;
  }
  if (resolvedSemantic.border) {
    tailwindTokens.colors.border = resolvedSemantic.border;
  }
}

const tailwindTokenPath = join(distDir, "tailwind-tokens.json");
writeFileSync(tailwindTokenPath, JSON.stringify(tailwindTokens, null, 2));
console.log(`✅ Built Tailwind tokens -> ${tailwindTokenPath}`);

// --- Build CSS variables (light/dark) --- //

const toKebabCase = (str: string) =>
  str.replace(/([a-z0-9]|(?<=[a-z0-9]))([A-Z])/g, "$1-$2").toLowerCase();

function flattenTokensRecursive(obj: TokenGroup, prefix: string[], acc: Record<string, string>) {
  for (const [key, value] of Object.entries(obj)) {
    const newPrefix = [...prefix, toKebabCase(key)];
    if (value && typeof value === "object" && !("value" in value)) {
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
  } else {
    darkCss = ""; // Ensure darkCss is empty if no dark tokens are found
  }

  return lightCss + darkCss;
};

// Resolve semantic tokens before flattening for CSS
const resolvedSemanticForCss = resolveTokenReferences(semanticTokens.semantic ?? {}, baseTokens);

const allVars = {
  ...flattenTokens(baseTokens as TokenGroup),
  ...flattenTokens(resolvedSemanticForCss),
};

const cssTokenPath = join(distDir, "tokens.css");
writeFileSync(cssTokenPath, generateCssVariables(allVars));
console.log(`✅ Built CSS variables -> ${cssTokenPath}`);
