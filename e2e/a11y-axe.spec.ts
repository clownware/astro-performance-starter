import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Automated axe-core sweep (ADR-018/ADR-019): every key page passes the
 * WCAG 2.1 A/AA rulesets with zero serious or critical violations. The
 * hand-written @a11y tests in the sibling specs cover structural checks
 * (landmarks, heading order); this spec is the engine-driven complement.
 */
const PAGES = [
	"/",
	"/about/",
	"/blog/",
	"/projects/",
	"/contact/",
	"/how-it-works/",
	"/showcase/",
];

test.describe("axe-core accessibility scan", () => {
	for (const path of PAGES) {
		test(`@a11y ${path} has no serious or critical axe violations`, async ({ page }) => {
			// Reduced motion settles ADR-048's scroll-reveal animations, so axe
			// measures the real text colors instead of mid-animation opacity blends
			// (and mirrors how many assistive-tech users actually browse).
			await page.emulateMedia({ reducedMotion: "reduce" });
			await page.goto(path);
			const results = await new AxeBuilder({ page })
				.withTags(["wcag2a", "wcag2aa"])
				.analyze();
			const blocking = results.violations.filter((v) =>
				["serious", "critical"].includes(v.impact ?? ""),
			);
			expect(
				blocking,
				blocking
					.map((v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} node(s)`)
					.join("\n"),
			).toEqual([]);
		});
	}
});
