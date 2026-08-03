/**
 * Unit tests for the ADR enforcement suite's pure check registry (ADR-062).
 * Written before the implementation per ADR-037.
 *
 * Each check is exercised against a minimal compliant snapshot (`clean()`)
 * plus a mutation that violates exactly the invariant under test.
 */
import { describe, expect, it } from "vitest";
import { CHECKS, type EnforcementConfig, type RepoSnapshot, runCheck } from "../enforcement-checks";

const config: EnforcementConfig = {
  islands: [
    {
      file: "src/pages/showcase.astro",
      component: "MotionLab",
      directive: "client:idle",
      adr: "ADR-060",
    },
  ],
  rootAllowlist: [
    "package.json",
    "astro.config.mjs",
    "tsconfig.json",
    "biome.json",
    "README.md",
    "LICENSE.txt",
    "CLAUDE.md",
    "AGENTS.md",
    "versions.json",
    "pnpm-lock.yaml",
  ],
  checks: [],
};

/** Minimal compliant repo snapshot. Mutate per test to violate one invariant. */
function clean(): RepoSnapshot {
  return {
    files: {
      "package.json": JSON.stringify({
        packageManager: "pnpm@10.0.0",
        scripts: {
          "//1": "─── everyday ───",
          dev: "astro dev",
          build: "astro build",
          preview: "astro preview",
          quality: "x",
          "quality:ci":
            "pnpm run format:check && pnpm run lint && pnpm run lint:md && pnpm run check && pnpm run test:unit && pnpm run agents:check && pnpm run version:check",
          test: "vitest",
          "test:unit": "vitest run",
          "test:e2e": "playwright test",
          "tokens:build": "x",
          format: "x",
          "format:check": "x",
          lint: "x",
          "lint:md": "x",
          check: "x",
          clean: "x",
          "//2": "─── maintainer ───",
        },
        dependencies: { preact: "^10.0.0" },
        devDependencies: { "@tailwindcss/vite": "^4.0.0" },
      }),
      "astro.config.mjs": "export default { env: { schema: { PUBLIC_X: {} } } };",
      "src/styles/global.css":
        "@theme inline { --color-primary: hsl(var(--color-primary-500)); }\n@variant dark (&:where(.dark, .dark *));\n",
      "src/layouts/BaseLayout.astro": "<html><slot /></html>",
      "src/components/atoms/Button.astro": "<button class='bg-primary'><slot /></button>",
      "src/components/molecules/Head.astro":
        '<title>{title}</title>\n<meta property="og:title" content={title} />',
      "src/components/__tests__/_helpers/container.ts":
        "import { experimental_AstroContainer } from 'astro/container';",
      "src/components/islands/MotionLab.tsx": "export default function MotionLab() {}",
      "src/pages/showcase.astro": "<MotionLab client:idle />",
      "public/_headers": "/*\n  Content-Security-Policy: default-src 'self'\n",
      "src/assets/fonts/geist-latin-variable.woff2": "",
      "src/assets/fonts/Geist-OFL.txt": "OFL",
      ".github/workflows/ci.yml": "steps:\n  - run: pnpm run quality:ci\n",
      "CLAUDE.md": "# Constitution",
      ".claude/engineering.md": "# Engineering",
      ".claude/workflow.md": "# Workflow",
      ".claude/stack.md": "# Stack",
      "docs/README.md": "# Docs",
      "docs/adr/000-first.md": "## Status\n\nAccepted\n\n## Decision\n\nX\n\n## Enforcement\n\nY\n",
      "docs/adr/001-second.md":
        "## Status\n\nSuperseded by [ADR-000](./000-first.md)\n\n## Enforcement\n\nY\n",
      "README.md": "# Readme",
      "LICENSE.txt": "MIT",
      "tsconfig.json": "{}",
      "biome.json": "{}",
      "AGENTS.md": "generated",
      "versions.json": "{}",
      "pnpm-lock.yaml": "",
    },
  };
}

function withFile(snap: RepoSnapshot, path: string, content: string): RepoSnapshot {
  return { files: { ...snap.files, [path]: content } };
}

function withoutFile(snap: RepoSnapshot, path: string): RepoSnapshot {
  const files = { ...snap.files };
  delete files[path];
  return { files };
}

describe("enforcement check registry", () => {
  it("exposes every check id exactly once", () => {
    const ids = CHECKS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThanOrEqual(23);
  });

  it("passes the clean snapshot on every check", () => {
    for (const check of CHECKS) {
      expect(runCheck(check.id, clean(), config), check.id).toEqual([]);
    }
  });
});

describe("ADR-000 tooling invariants", () => {
  it("pnpm-only flags a foreign lockfile", () => {
    const snap = withFile(clean(), "package-lock.json", "{}");
    expect(runCheck("pnpm-only", snap, config).join()).toContain("package-lock.json");
  });

  it("pnpm-only flags a missing pnpm packageManager pin", () => {
    const snap = clean();
    snap.files["package.json"] = snap.files["package.json"].replace("pnpm@10.0.0", "npm@11.0.0");
    expect(runCheck("pnpm-only", snap, config).length).toBeGreaterThan(0);
  });

  it("biome-only flags ESLint/Prettier artefacts", () => {
    const snap = withFile(clean(), ".eslintrc.json", "{}");
    expect(runCheck("biome-only", snap, config).join()).toContain(".eslintrc.json");
  });
});

describe("ADR-001/060 island policy", () => {
  it("no-client-load flags an unallowlisted client:load", () => {
    const snap = withFile(clean(), "src/pages/index.astro", "<Widget client:load />");
    expect(runCheck("no-client-load", snap, config).join()).toContain("client:load");
  });

  it("no-client-load ignores client:load in prose", () => {
    const snap = withFile(
      clean(),
      "src/pages/doc.astro",
      "<p>Never use `client:load` without ADR justification.</p>",
    );
    expect(runCheck("no-client-load", snap, config)).toEqual([]);
  });

  it("island-allowlist flags a hydrated island missing from the allowlist", () => {
    const snap = withFile(clean(), "src/pages/rogue.astro", "<Rogue client:visible />");
    expect(runCheck("island-allowlist", snap, config).join()).toContain("Rogue");
  });

  it("island-allowlist still sees a real island between code fences in MDX", () => {
    const snap = withFile(
      clean(),
      "src/content/blog/post/post.mdx",
      "```astro\nexample fence\n```\n\n<ToggleDetail client:visible detail={d} />\n\nThe `client:visible` directive defers hydration.\n\n```js\nanother fence\n```",
    );
    expect(runCheck("island-allowlist", snap, config).join()).toContain("ToggleDetail");
  });

  it("island-allowlist ignores directives inside prose attribute values", () => {
    const snap = withFile(
      clean(),
      "src/pages/demo2.astro",
      '<Wrapper\n  title="x"\n  description="It hydrates with client:idle, costing nothing until idle."\n>\n</Wrapper>',
    );
    expect(runCheck("island-allowlist", snap, config)).toEqual([]);
  });

  it("island-allowlist ignores directives inside escaped code-snippet strings", () => {
    const snap = withFile(
      clean(),
      "src/pages/demo.astro",
      "<Wrapper title=\"x\" codeSnippet={'&lt;MotionLab client:idle /&gt;'}>\n</Wrapper>",
    );
    expect(runCheck("island-allowlist", snap, config)).toEqual([]);
  });

  it("island-allowlist flags a stale allowlist entry", () => {
    const snap = withoutFile(clean(), "src/pages/showcase.astro");
    expect(runCheck("island-allowlist", snap, config).join()).toContain("MotionLab");
  });
});

describe("structure invariants", () => {
  it("atomic-dirs flags a component outside the sanctioned directories", () => {
    const snap = withFile(clean(), "src/components/ui/Fancy.astro", "<div />");
    expect(runCheck("atomic-dirs", snap, config).join()).toContain("ui/Fancy.astro");
  });

  it("baselayout-no-named-slots flags a named slot", () => {
    const snap = clean();
    snap.files["src/layouts/BaseLayout.astro"] = '<slot name="hero" /><slot />';
    expect(runCheck("baselayout-no-named-slots", snap, config).length).toBeGreaterThan(0);
  });

  it("container-single-import flags a second import site", () => {
    const snap = withFile(
      clean(),
      "src/components/__tests__/Card.test.ts",
      "import { experimental_AstroContainer } from 'astro/container';",
    );
    expect(runCheck("container-single-import", snap, config).join()).toContain("Card.test.ts");
  });

  it("container-single-import ignores docs and non-src mentions", () => {
    const snap = withFile(clean(), "docs/adr/040-container.md", "experimental_AstroContainer");
    expect(runCheck("container-single-import", snap, config)).toEqual([]);
  });
});

describe("ADR-025/032/047 styling invariants", () => {
  it("tw4-shape flags a resurrected tailwind config file", () => {
    const snap = withFile(clean(), "tailwind.config.ts", "export default {}");
    expect(runCheck("tw4-shape", snap, config).join()).toContain("tailwind.config.ts");
  });

  it("dark-mode-shape flags a missing class-based dark variant", () => {
    const snap = clean();
    snap.files["src/styles/global.css"] = "@theme inline { }";
    expect(runCheck("dark-mode-shape", snap, config).length).toBeGreaterThan(0);
  });

  it("no-dark-variants flags manual dark: utilities", () => {
    const snap = withFile(clean(), "src/pages/x.astro", '<div class="dark:bg-black" />');
    expect(runCheck("no-dark-variants", snap, config).join()).toContain("dark:bg-black");
  });

  it("no-hardcoded-colors flags a hex literal outside tokens", () => {
    const snap = withFile(clean(), "src/pages/x.astro", "<style>h1 { color: #ff0000; }</style>");
    expect(runCheck("no-hardcoded-colors", snap, config).join()).toContain("#ff0000");
  });

  it("no-hardcoded-colors permits token-wrapped hsl(var(...))", () => {
    const snap = withFile(
      clean(),
      "src/pages/x.astro",
      "<style>h1 { color: hsl(var(--color-primary-500)); }</style>",
    );
    expect(runCheck("no-hardcoded-colors", snap, config)).toEqual([]);
  });
});

describe("ADR-048 motion invariants", () => {
  it("motion-gated flags animation without a reduced-motion gate", () => {
    const snap = withFile(
      clean(),
      "src/styles/motion.css",
      "@keyframes spin { to { transform: rotate(360deg); } }\n.x { animation: spin 1s; }",
    );
    expect(runCheck("motion-gated", snap, config).join()).toContain("prefers-reduced-motion");
  });

  it("motion-gated flags layout-triggering keyframe properties", () => {
    const snap = withFile(
      clean(),
      "src/styles/motion.css",
      "@media (prefers-reduced-motion: no-preference) { @keyframes grow { to { width: 100px; } } }",
    );
    expect(runCheck("motion-gated", snap, config).join()).toContain("width");
  });
});

describe("head/image/env/csp/fonts invariants", () => {
  it("head-single-source flags a <title> outside Head.astro", () => {
    const snap = withFile(clean(), "src/pages/x.astro", "<title>Rogue</title>");
    expect(runCheck("head-single-source", snap, config).join()).toContain("x.astro");
  });

  it("head-single-source ignores accessible SVG <title> elements", () => {
    const snap = withFile(
      clean(),
      "src/pages/x.astro",
      '<svg viewBox="0 0 24 24">\n  <title>Warning icon</title>\n</svg>',
    );
    expect(runCheck("head-single-source", snap, config)).toEqual([]);
  });

  it("no-raw-img flags an unjustified raw <img>", () => {
    const snap = withFile(clean(), "src/pages/x.astro", '<img src="/x.png" alt="" />');
    expect(runCheck("no-raw-img", snap, config).join()).toContain("x.astro");
  });

  it("no-raw-img permits an ADR-030-justified <img>", () => {
    const snap = withFile(
      clean(),
      "src/pages/x.astro",
      '{/* ADR-030 exemption: string-src fallback */}\n<img src={src} alt="" />',
    );
    expect(runCheck("no-raw-img", snap, config)).toEqual([]);
  });

  it("no-react-dep flags react in dependencies", () => {
    const snap = clean();
    const pkg = JSON.parse(snap.files["package.json"]);
    pkg.dependencies.react = "^19.0.0";
    snap.files["package.json"] = JSON.stringify(pkg);
    expect(runCheck("no-react-dep", snap, config).join()).toContain("react");
  });

  it("env-via-schema flags a raw import.meta.env.PUBLIC_ read", () => {
    const snap = withFile(clean(), "src/pages/x.astro", "const v = import.meta.env.PUBLIC_FOO;");
    expect(runCheck("env-via-schema", snap, config).join()).toContain("PUBLIC_FOO");
  });

  it("csp-shape flags a missing CSP header", () => {
    const snap = clean();
    snap.files["public/_headers"] = "/*\n  X-Frame-Options: DENY\n";
    expect(runCheck("csp-shape", snap, config).length).toBeGreaterThan(0);
  });

  it("fonts-vendored flags a @fontsource dependency", () => {
    const snap = clean();
    const pkg = JSON.parse(snap.files["package.json"]);
    pkg.dependencies["@fontsource/inter"] = "^5.0.0";
    snap.files["package.json"] = JSON.stringify(pkg);
    expect(runCheck("fonts-vendored", snap, config).join()).toContain("@fontsource");
  });

  it("fonts-vendored flags missing vendored woff2", () => {
    const snap = withoutFile(clean(), "src/assets/fonts/geist-latin-variable.woff2");
    expect(runCheck("fonts-vendored", snap, config).length).toBeGreaterThan(0);
  });
});

describe("process/governance checks", () => {
  it("no-push-sync flags a resurrected sync workflow", () => {
    const snap = withFile(clean(), ".github/workflows/sync-docs-to-starlight.yml", "on: push");
    expect(runCheck("no-push-sync", snap, config).join()).toContain("sync-docs");
  });

  it("scope-boundary flags a maintenance artefact at root", () => {
    const snap = withFile(clean(), "PERFORMANCE_FIX.md", "# fix");
    expect(runCheck("scope-boundary", snap, config).join()).toContain("PERFORMANCE_FIX.md");
  });

  it("scope-boundary flags an unallowlisted root file", () => {
    const snap = withFile(clean(), "mystery-file.txt", "?");
    expect(runCheck("scope-boundary", snap, config).join()).toContain("mystery-file.txt");
  });

  it("scope-boundary permits dotfiles", () => {
    const snap = withFile(clean(), ".editorconfig", "root = true");
    expect(runCheck("scope-boundary", snap, config)).toEqual([]);
  });

  it("constitution-shape flags a missing layer file", () => {
    const snap = withoutFile(clean(), ".claude/stack.md");
    expect(runCheck("constitution-shape", snap, config).join()).toContain("stack.md");
  });

  it("ci-runs-quality flags CI not running the gate", () => {
    const snap = clean();
    snap.files[".github/workflows/ci.yml"] = "steps:\n  - run: pnpm build\n";
    expect(runCheck("ci-runs-quality", snap, config).join()).toContain("quality:ci");
  });

  it("ci-runs-quality flags a hollowed-out quality:ci script", () => {
    const snap = clean();
    const pkg = JSON.parse(snap.files["package.json"]);
    pkg.scripts["quality:ci"] = "pnpm run lint";
    snap.files["package.json"] = JSON.stringify(pkg);
    expect(runCheck("ci-runs-quality", snap, config).join()).toContain("test:unit");
  });

  it("script-contract flags a removed stable script name", () => {
    const snap = clean();
    const pkg = JSON.parse(snap.files["package.json"]);
    delete pkg.scripts["test:e2e"];
    snap.files["package.json"] = JSON.stringify(pkg);
    expect(runCheck("script-contract", snap, config).join()).toContain("test:e2e");
  });

  it("adr-log-valid flags a non-canonical status word", () => {
    const snap = withFile(clean(), "docs/adr/002-third.md", "## Status\n\nLGTM\n");
    expect(runCheck("adr-log-valid", snap, config).join()).toContain("002");
  });

  it("adr-log-valid permits supersession by an explained upstream change", () => {
    const snap = withFile(
      clean(),
      "docs/adr/002-third.md",
      "## Status\n\nSuperseded — the integration was deprecated upstream and removed\n\n## Enforcement\n\nY\n",
    );
    expect(runCheck("adr-log-valid", snap, config)).toEqual([]);
  });

  it("scope-boundary ignores the suite's own report artifact", () => {
    const snap = withFile(clean(), "enforcement-report.json", "{}");
    expect(runCheck("scope-boundary", snap, config)).toEqual([]);
  });

  it("adr-log-valid flags a numbering gap", () => {
    const snap = withFile(
      clean(),
      "docs/adr/004-fifth.md",
      "## Status\n\nAccepted\n\n## Enforcement\n\nY\n",
    );
    expect(runCheck("adr-log-valid", snap, config).join()).toContain("gap");
  });
});
