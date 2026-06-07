import { expect, test } from "@playwright/test";

test.describe("How It Works Page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/how-it-works/");
	});

	test("should load successfully with correct title", async ({ page }) => {
		await expect(page).toHaveTitle(/How It Works/);
	});

	test("should have a single h1 and section landmarks", async ({ page }) => {
		await expect(page.locator("h1")).toHaveCount(1);

		const sections = page.locator("section");
		expect(await sections.count()).toBeGreaterThan(3);
	});

	test("@a11y headings descend without skipping a level", async ({ page }) => {
		// Mirrors the axe `heading-order` rule: each heading may go one level
		// deeper than the previous at most. A jump (e.g. h2 → h4) fails WCAG 1.3.1.
		const levels = await page
			.locator("h1, h2, h3, h4, h5, h6")
			.evaluateAll((nodes) => nodes.map((n) => Number(n.tagName[1])));

		expect(levels.length).toBeGreaterThan(0);

		const skips: string[] = [];
		for (let i = 1; i < levels.length; i++) {
			if (levels[i] - levels[i - 1] > 1) {
				skips.push(`h${levels[i - 1]} → h${levels[i]} at index ${i}`);
			}
		}
		expect(skips, `heading-order skips: ${skips.join(", ")}`).toEqual([]);
	});
});
