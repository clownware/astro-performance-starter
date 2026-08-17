/**
 * ADR enforcement suite — pure check registry (ADR-064).
 *
 * Every check derives from a Testable Consequence recorded in an ADR's
 * Enforcement section. Checks are pure functions over a `RepoSnapshot`
 * (path → content map) so they are unit-testable without filesystem access;
 * `run-enforcement.ts` builds the snapshot and applies statuses from
 * `enforcement.config.json`.
 *
 * House rule (informative failures): every finding names the file and the
 * violation; every check carries a remedy naming the governing ADR and the
 * legal moves. Bare failures train bypass behaviour.
 */

export interface RepoSnapshot {
  /** Repo-relative path → text content ("" for binary/existence-only). */
  files: Record<string, string>;
}

export interface IslandEntry {
  file: string;
  component: string;
  directive: string;
  adr: string;
}

export interface CheckStatusEntry {
  id: string;
  adr: string;
  tc: string;
  status: "warn" | "block";
  added: string;
  graduated: string | null;
  /** Set when the check is enforced by an existing gate, not this runner. */
  external?: string;
}

export interface EnforcementConfig {
  islands: IslandEntry[];
  rootAllowlist: string[];
  checks: CheckStatusEntry[];
}

export interface CheckDef {
  id: string;
  adr: string;
  tc: string;
  remedy: string;
  run: (snap: RepoSnapshot, cfg: EnforcementConfig) => string[];
}

const paths = (snap: RepoSnapshot): string[] => Object.keys(snap.files);

const srcFiles = (snap: RepoSnapshot, exts: string[]): string[] =>
  paths(snap).filter((p) => p.startsWith("src/") && exts.some((e) => p.endsWith(e)));

function pkg(snap: RepoSnapshot): {
  packageManager?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
} {
  try {
    return JSON.parse(snap.files["package.json"] ?? "{}");
  } catch {
    return {};
  }
}

function allDeps(snap: RepoSnapshot): Record<string, string> {
  const p = pkg(snap);
  return { ...p.dependencies, ...p.devDependencies };
}

/** Lines of `content` whose index satisfies `test`, reported as `path:line`. */
function grepLines(path: string, content: string, test: RegExp): string[] {
  const out: string[] = [];
  content.split("\n").forEach((line, i) => {
    if (test.test(line)) out.push(`${path}:${i + 1} — ${line.trim().slice(0, 120)}`);
  });
  return out;
}

/**
 * Hydration directives in real component tags: `<Component … client:X`.
 * The tag-context requirement (`<` + capitalised name) skips prose, and
 * quoted attribute values are stripped first — a real directive is an
 * attribute name and can never sit inside quotes (prose descriptions and
 * code-snippet strings mention directives only inside quoted values).
 */
const islandTag = /<([A-Z][A-Za-z0-9_.]*)[^<>]*?\bclient:(load|idle|visible|media|only)/g;

/** Fenced code blocks are stripped whole; quotes/inline code never cross lines,
 *  so a real multi-line component tag between fences survives the strip. */
const codeFence = /```[\s\S]*?```/g;
const quotedValue = /"[^"\n]*"|'[^'\n]*'|`[^`\n]*`/g;

interface TagHit {
  file: string;
  component: string;
  directive: string;
}

function islandTags(snap: RepoSnapshot): TagHit[] {
  const hits: TagHit[] = [];
  for (const file of srcFiles(snap, [".astro", ".mdx"])) {
    const content = snap.files[file].replace(codeFence, "").replace(quotedValue, '""');
    for (const m of content.matchAll(islandTag)) {
      hits.push({ file, component: m[1], directive: `client:${m[2]}` });
    }
  }
  return hits;
}

/** Sanctioned component subdirectories: ADR-003 trio + structural, plus
 *  `islands/` (ADR-060), `mdx/` and `a11y/` (ADR-003 amendment), and
 *  colocated `__tests__/` (ADR-040). */
const componentDirs = new Set([
  "atoms",
  "molecules",
  "organisms",
  "structural",
  "islands",
  "mdx",
  "a11y",
  "__tests__",
]);

/** Sanctioned root-level files directly under src/components/. */
const componentRootFiles = new Set(["ThemeSetup.astro", "CLAUDE.md"]);

/** Compositor-safe animatable properties per ADR-048. */
const compositorSafe = new Set([
  "transform",
  "translate",
  "scale",
  "rotate",
  "opacity",
  "background-position",
  "offset-distance",
]);

/** Colour literal not wrapped in a token var() lookup. */
const colorLiteral = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch)\((?!\s*var\()/;

/** Stable cloner-facing script names — the ADR-052 contract. */
const stableScripts = [
  "dev",
  "build",
  "preview",
  "quality",
  "quality:ci",
  "test",
  "test:unit",
  "test:e2e",
  "tokens:build",
  "format",
  "format:check",
  "lint",
  "lint:md",
  "check",
  "clean",
];

/** Steps that must remain inside quality:ci (ADR-039). */
const qualityCiSteps = [
  "format:check",
  "lint",
  "lint:md",
  "check",
  "test:unit",
  "agents:check",
  "version:check",
];

export const CHECKS: CheckDef[] = [
  {
    id: "pnpm-only",
    adr: "ADR-000",
    tc: "TC-1",
    remedy:
      "pnpm is the package manager. Remove foreign lockfiles and keep the pnpm packageManager pin, or supersede ADR-000.",
    run: (snap) => {
      const findings: string[] = [];
      if (!pkg(snap).packageManager?.startsWith("pnpm@")) {
        findings.push("package.json — packageManager is not pinned to pnpm");
      }
      for (const lock of ["package-lock.json", "yarn.lock", "bun.lockb"]) {
        if (lock in snap.files) findings.push(`${lock} — foreign lockfile present`);
      }
      return findings;
    },
  },
  {
    id: "biome-only",
    adr: "ADR-000",
    tc: "TC-2",
    remedy:
      "Biome is the only lint/format tool. Remove ESLint/Prettier configs and deps, or supersede ADR-000.",
    run: (snap) => {
      const findings = paths(snap).filter((p) =>
        /^(\.eslintrc|eslint\.config\.|\.prettierrc|prettier\.config\.)/.test(p),
      );
      const deps = Object.keys(allDeps(snap)).filter(
        (d) => d === "eslint" || d === "prettier" || d.startsWith("eslint-"),
      );
      return [
        ...findings.map((f) => `${f} — ESLint/Prettier artefact present`),
        ...deps.map((d) => `package.json — dependency \`${d}\` conflicts with Biome-only rule`),
      ];
    },
  },
  {
    id: "no-client-load",
    adr: "ADR-001",
    tc: "TC-1",
    remedy:
      "client:load requires ADR justification (ADR-001). Use client:idle/client:visible, or add an allowlist entry naming the justifying ADR.",
    run: (snap, cfg) =>
      islandTags(snap)
        .filter((h) => h.directive === "client:load")
        .filter(
          (h) =>
            !cfg.islands.some(
              (e) =>
                e.file === h.file && e.component === h.component && e.directive === "client:load",
            ),
        )
        .map(
          (h) => `${h.file} — <${h.component} client:load> without allowlisted ADR justification`,
        ),
  },
  {
    id: "island-allowlist",
    adr: "ADR-060",
    tc: "TC-1",
    remedy:
      "Every hydrated island must be enumerated in enforcement.config.json (ADR-001/ADR-060). Add the entry with its justifying ADR, or de-hydrate the component.",
    run: (snap, cfg) => {
      const hits = islandTags(snap);
      const findings = hits
        .filter(
          (h) =>
            !cfg.islands.some(
              (e) =>
                e.file === h.file && e.component === h.component && e.directive === h.directive,
            ),
        )
        .map((h) => `${h.file} — <${h.component} ${h.directive}> not in the island allowlist`);
      for (const e of cfg.islands) {
        const alive = hits.some(
          (h) => h.file === e.file && h.component === e.component && h.directive === e.directive,
        );
        if (!alive) {
          findings.push(
            `enforcement.config.json — stale allowlist entry: <${e.component} ${e.directive}> in ${e.file} no longer exists`,
          );
        }
      }
      return findings;
    },
  },
  {
    id: "atomic-dirs",
    adr: "ADR-003",
    tc: "TC-1",
    remedy:
      "Components live in atoms/, molecules/, organisms/, structural/, islands/ (ADR-060), mdx/, or a11y/ (ADR-003 amendment). Move the file or supersede ADR-003.",
    run: (snap) =>
      paths(snap)
        .filter((p) => p.startsWith("src/components/"))
        .filter((p) => {
          const seg = p.split("/")[2];
          if (seg.includes(".")) return !componentRootFiles.has(seg);
          return !componentDirs.has(seg);
        })
        .map(
          (p) =>
            `${p.replace("src/components/", "src/components/")} — outside the sanctioned component directories`,
        ),
  },
  {
    id: "baselayout-no-named-slots",
    adr: "ADR-013",
    tc: "TC-1",
    remedy:
      "BaseLayout owns document structure, not content patterns (ADR-013). Compose hero/CTA in the page, or supersede ADR-013.",
    run: (snap) => {
      const layout = snap.files["src/layouts/BaseLayout.astro"];
      if (!layout) return ["src/layouts/BaseLayout.astro — file missing"];
      return grepLines("src/layouts/BaseLayout.astro", layout, /<slot\s+name=/);
    },
  },
  {
    id: "tw4-shape",
    adr: "ADR-025",
    tc: "TC-1..3",
    remedy:
      "Tailwind v4 is CSS-configured (ADR-025): no tailwind.config.*, @tailwindcss/vite as the integration, @theme inline in global.css.",
    run: (snap) => {
      const findings: string[] = [];
      for (const p of paths(snap)) {
        if (/^tailwind\.config\.(js|ts|mjs|cjs)$/.test(p)) {
          findings.push(`${p} — Tailwind JS config resurrected (v4 config lives in CSS)`);
        }
      }
      const deps = allDeps(snap);
      if ("@astrojs/tailwind" in deps) {
        findings.push("package.json — @astrojs/tailwind present (replaced by @tailwindcss/vite)");
      }
      if (!("@tailwindcss/vite" in deps)) {
        findings.push("package.json — @tailwindcss/vite missing");
      }
      if (!snap.files["src/styles/global.css"]?.includes("@theme inline")) {
        findings.push("src/styles/global.css — @theme inline block missing");
      }
      return findings;
    },
  },
  {
    id: "head-single-source",
    adr: "ADR-029",
    tc: "TC-1",
    remedy:
      "Metadata is emitted only by Head.astro (ADR-029). Pass props to Head instead of declaring <title>/OG tags elsewhere.",
    run: (snap) => {
      const findings: string[] = [];
      for (const file of srcFiles(snap, [".astro"])) {
        if (file.endsWith("/Head.astro")) continue;
        const lines = snap.files[file].split("\n");
        lines.forEach((line, i) => {
          if (!/<title[\s>]|property=["']og:/.test(line)) return;
          // Accessible <title> inside an <svg> is an a11y pattern (ADR-019),
          // not document metadata — skip when an svg opens in the preceding lines.
          const context = lines.slice(Math.max(0, i - 10), i + 1).join("\n");
          const opens = (context.match(/<svg\b/g) ?? []).length;
          const closes = (context.match(/<\/svg>/g) ?? []).length;
          if (opens > closes) return;
          findings.push(`${file}:${i + 1} — ${line.trim().slice(0, 120)}`);
        });
      }
      return findings;
    },
  },
  {
    id: "no-raw-img",
    adr: "ADR-030",
    tc: "TC-1",
    remedy:
      "Raw <img> is forbidden outside the ADR-030 exemptions. Use the Astro Image component, or add an inline `ADR-030` justifying comment on the preceding lines.",
    run: (snap) => {
      const findings: string[] = [];
      for (const file of srcFiles(snap, [".astro", ".tsx"])) {
        const lines = snap.files[file].split("\n");
        lines.forEach((line, i) => {
          if (!/<img\b/.test(line)) return;
          const context = lines.slice(Math.max(0, i - 5), i + 1).join("\n");
          if (!context.includes("ADR-030")) {
            findings.push(`${file}:${i + 1} — raw <img> without ADR-030 exemption comment`);
          }
        });
      }
      return findings;
    },
  },
  {
    id: "no-react-dep",
    adr: "ADR-031",
    tc: "TC-1",
    remedy:
      "Preact is the islands framework (ADR-031). Use preact/compat for React-ecosystem libraries, or supersede ADR-031.",
    run: (snap) => {
      const deps = allDeps(snap);
      const findings = ["react", "react-dom"]
        .filter((d) => d in deps)
        .map((d) => `package.json — dependency \`${d}\` present (Preact-only per ADR-031)`);
      if (!("preact" in deps)) findings.push("package.json — preact missing");
      return findings;
    },
  },
  {
    id: "dark-mode-shape",
    adr: "ADR-032",
    tc: "TC-1",
    remedy:
      "Dark mode is class-based (ADR-032): global.css must declare the .dark-scoped @variant.",
    run: (snap) => {
      const css = snap.files["src/styles/global.css"] ?? "";
      return /@variant dark/.test(css) && css.includes(".dark")
        ? []
        : ["src/styles/global.css — class-based dark variant (@variant dark …(.dark …)) missing"];
    },
  },
  {
    id: "container-single-import",
    adr: "ADR-040",
    tc: "TC-1",
    remedy:
      "experimental_AstroContainer is imported only by the shared helper (ADR-040). Import from _helpers/container.ts instead.",
    run: (snap) =>
      srcFiles(snap, [".ts", ".tsx"])
        .filter((p) => /from\s+["']astro\/container["']/.test(snap.files[p]))
        .filter((p) => p !== "src/components/__tests__/_helpers/container.ts")
        .map((p) => `${p} — direct astro/container import (use the shared helper)`),
  },
  {
    id: "no-dark-variants",
    adr: "ADR-047",
    tc: "TC-2",
    remedy:
      "Role tokens flip in .dark via generated CSS (ADR-047); manual dark: utilities reintroduce per-component theming. Use role tokens.",
    run: (snap) => {
      const findings: string[] = [];
      for (const file of srcFiles(snap, [".astro", ".tsx"])) {
        findings.push(...grepLines(file, snap.files[file], /[\s"'`{]dark:[a-z-]/));
      }
      return findings;
    },
  },
  {
    id: "no-hardcoded-colors",
    adr: "ADR-047",
    tc: "TC-3",
    remedy:
      "Colours come from design tokens (ADR-047, constitution rule 3). Use a token; if one is missing, add it to tokens/ first.",
    run: (snap) => {
      const findings: string[] = [];
      for (const file of srcFiles(snap, [".astro", ".css", ".ts", ".tsx"])) {
        if (file.includes("__tests__") || file.endsWith(".test.ts")) continue;
        if (file === "src/styles/global.css") continue; // token bridge: hsl(var(--…)) wrappers only
        findings.push(...grepLines(file, snap.files[file], colorLiteral));
      }
      return findings;
    },
  },
  {
    id: "motion-gated",
    adr: "ADR-048",
    tc: "TC-1..2",
    remedy:
      "Animations are compositor-only and gated behind prefers-reduced-motion (ADR-048). Gate the file's motion and animate only transform/opacity/background-position.",
    run: (snap) => {
      const findings: string[] = [];
      const styleFiles = paths(snap).filter(
        (p) => p.startsWith("src/") && (p.endsWith(".css") || p.endsWith(".astro")),
      );
      for (const file of styleFiles) {
        const content = snap.files[file];
        const hasMotion = /@keyframes|\banimation(?:-name)?\s*:/.test(content);
        if (!hasMotion) continue;
        if (!content.includes("prefers-reduced-motion")) {
          findings.push(`${file} — animation without a prefers-reduced-motion gate`);
        }
        for (const kf of content.matchAll(/@keyframes[^{]*\{([\s\S]*?)\}\s*\}/g)) {
          for (const decl of kf[1].matchAll(/([a-z-]+)\s*:/g)) {
            const prop = decl[1];
            if (!compositorSafe.has(prop) && !prop.startsWith("--")) {
              findings.push(`${file} — @keyframes animates \`${prop}\` (not compositor-safe)`);
            }
          }
        }
      }
      return findings;
    },
  },
  {
    id: "env-via-schema",
    adr: "ADR-050",
    tc: "TC-1..2",
    remedy:
      "PUBLIC_* vars are read via astro:env/client with the schema in astro.config (ADR-050). Import from astro:env/client.",
    run: (snap) => {
      const findings: string[] = [];
      for (const file of srcFiles(snap, [".astro", ".ts", ".tsx"])) {
        findings.push(...grepLines(file, snap.files[file], /import\.meta\.env\.PUBLIC_/));
      }
      const config = snap.files["astro.config.mjs"] ?? "";
      if (!/env\s*:/.test(config) || !/schema/.test(config)) {
        findings.push("astro.config.mjs — env.schema declaration missing");
      }
      return findings;
    },
  },
  {
    id: "csp-shape",
    adr: "ADR-051",
    tc: "TC-1..2",
    remedy:
      "CSP ships as a header via public/_headers; Astro's built-in security.csp stays off (ADR-051).",
    run: (snap) => {
      const findings: string[] = [];
      if (!snap.files["public/_headers"]?.includes("Content-Security-Policy")) {
        findings.push("public/_headers — Content-Security-Policy header missing");
      }
      if (/security\s*:\s*\{[\s\S]*?csp/.test(snap.files["astro.config.mjs"] ?? "")) {
        findings.push("astro.config.mjs — built-in security.csp enabled (rejected by ADR-051)");
      }
      return findings;
    },
  },
  {
    id: "fonts-vendored",
    adr: "ADR-053",
    tc: "TC-1..2",
    remedy:
      "Fonts are vendored woff2 with licenses in src/assets/fonts/ via the Fonts API local provider (ADR-053); @fontsource deps are retired.",
    run: (snap) => {
      const findings: string[] = [];
      const fonts = paths(snap).filter((p) => p.startsWith("src/assets/fonts/"));
      if (!fonts.some((p) => p.endsWith(".woff2"))) {
        findings.push("src/assets/fonts/ — no vendored .woff2 files");
      }
      if (!fonts.some((p) => p.toUpperCase().includes("OFL"))) {
        findings.push("src/assets/fonts/ — font license text missing");
      }
      const fontsource = Object.keys(allDeps(snap)).filter((d) => d.startsWith("@fontsource"));
      findings.push(
        ...fontsource.map(
          (d) => `package.json — \`${d}\` present (@fontsource retired by ADR-053)`,
        ),
      );
      return findings;
    },
  },
  {
    id: "no-push-sync",
    adr: "ADR-059",
    tc: "TC-1",
    remedy:
      "The docs push-sync is retired (ADR-059); the docs repo pulls instead. Remove the workflow or supersede ADR-059.",
    run: (snap) =>
      paths(snap)
        .filter((p) => p.startsWith(".github/workflows/sync-docs"))
        .map((p) => `${p} — retired push-sync workflow resurrected`),
  },
  {
    id: "scope-boundary",
    adr: "ADR-035",
    tc: "TC-1..2",
    remedy:
      "Root files must be Category 1 per ADR-035. Move reference material into docs/, delete maintenance artefacts, or add a deliberate allowlist entry.",
    run: (snap, cfg) => {
      const findings: string[] = [];
      const generated = new Set([
        "enforcement-report.json",
        "lighthouse-report.html",
        "lighthouse-report.json",
      ]);
      const rootFiles = paths(snap).filter((p) => !p.includes("/") && !generated.has(p));
      for (const f of rootFiles) {
        if (/_(FIX|ANALYSIS|REGRESSION[A-Z_]*)\.md$/i.test(f)) {
          findings.push(
            `${f} — maintenance artefact at root (ADR-035 Category 3: remove or archive)`,
          );
        } else if (!f.startsWith(".") && !cfg.rootAllowlist.includes(f)) {
          findings.push(`${f} — root file not in the ADR-035 allowlist`);
        }
      }
      if (!("docs/README.md" in snap.files)) {
        findings.push("docs/README.md — dual-purpose docs contract file missing (ADR-034)");
      }
      return findings;
    },
  },
  {
    id: "constitution-shape",
    adr: "ADR-036",
    tc: "TC-1",
    remedy:
      "The layered constitution requires all four layer files (ADR-036). Restore the missing layer.",
    run: (snap) =>
      ["CLAUDE.md", ".claude/engineering.md", ".claude/workflow.md", ".claude/stack.md"]
        .filter((f) => !(f in snap.files))
        .map((f) => `${f} — constitution layer missing`),
  },
  {
    id: "ci-runs-quality",
    adr: "ADR-039",
    tc: "TC-1..2",
    remedy:
      "CI must run quality:ci with all gate steps intact (ADR-039). Rewire the step or amend ADR-039.",
    run: (snap) => {
      const findings: string[] = [];
      const ci = snap.files[".github/workflows/ci.yml"] ?? "";
      if (!ci.includes("pnpm run quality:ci")) {
        findings.push(".github/workflows/ci.yml — does not run `pnpm run quality:ci`");
      }
      const script = pkg(snap).scripts?.["quality:ci"] ?? "";
      for (const step of qualityCiSteps) {
        if (!script.includes(step)) {
          findings.push(`package.json — quality:ci no longer runs \`${step}\``);
        }
      }
      return findings;
    },
  },
  {
    id: "script-contract",
    adr: "ADR-052",
    tc: "TC-1..2",
    remedy:
      "Script names are a stable contract — no renames, ever (ADR-052). Restore the script name.",
    run: (snap) => {
      const scripts = pkg(snap).scripts ?? {};
      const findings = stableScripts
        .filter((s) => !(s in scripts))
        .map((s) => `package.json — stable script \`${s}\` missing (ADR-052 forbids renames)`);
      for (const sep of ["//1", "//2"]) {
        if (!(sep in scripts)) {
          findings.push(`package.json — \`${sep}\` group separator missing`);
        }
      }
      return findings;
    },
  },
  {
    id: "adr-log-valid",
    adr: "ADR-064",
    tc: "TC-1..4",
    remedy:
      "ADRs follow the log conventions (docs/adr/README.md): canonical status word, gapless numbering, forward links on supersession, an Enforcement section.",
    run: (snap) => {
      const findings: string[] = [];
      const adrs = paths(snap)
        .filter((p) => /^docs\/adr\/\d{3}-.+\.md$/.test(p))
        .sort();
      const numbers = adrs.map((p) =>
        Number.parseInt(p.slice("docs/adr/".length, "docs/adr/".length + 3), 10),
      );
      numbers.forEach((n, i) => {
        if (i > 0 && n !== numbers[i - 1] + 1 && n !== numbers[i - 1]) {
          findings.push(
            `docs/adr/ — numbering gap between ${numbers[i - 1]} and ${n} (reserve the number with a stub)`,
          );
        }
      });
      for (const p of adrs) {
        const content = snap.files[p];
        const status = content.match(/## Status\s*\n+([^\n]*)/)?.[1]?.trim() ?? "";
        if (!/^(Accepted|Proposed|Superseded|Withdrawn)\b/.test(status)) {
          findings.push(`${p} — status "${status.slice(0, 40)}" is not a canonical status word`);
        }
        if (
          status.startsWith("Superseded") &&
          !/ADR-\d+|upstream|config change|deprecated|removed|replaced/i.test(status)
        ) {
          findings.push(`${p} — Superseded without a forward link`);
        }
        if (!content.includes("## Enforcement")) {
          findings.push(`${p} — Enforcement section missing`);
        }
      }
      return findings;
    },
  },
];

const checkIndex = new Map(CHECKS.map((c) => [c.id, c]));

/** Run one check by id. Throws on unknown ids — config/registry drift is a bug. */
export function runCheck(id: string, snap: RepoSnapshot, cfg: EnforcementConfig): string[] {
  const check = checkIndex.get(id);
  if (!check) throw new Error(`Unknown enforcement check: ${id}`);
  return check.run(snap, cfg);
}
