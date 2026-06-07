import { expect, test } from "@playwright/test";

// Regression guard for the mobile menu (sandwich) surface.
//
// The floating menu must be a SOLID, full-coverage panel — never transparent or
// blended into the page. Two historical failure modes are pinned here:
//   1. The fixed menu was trapped by the header's `backdrop-filter` containing
//      block, shrinking it to ~49px (the header height) so nav links overflowed
//      onto the page with no panel behind them.
//   2. The menu used `bg-background` (the page colour), so even when sized
//      correctly it was indistinguishable from the page in dark-first mode.
test.describe("Header — mobile sandwich menu", () => {
	test.use({ viewport: { width: 390, height: 844 } });

	test("opens to a full-height, solid surface panel", async ({ page }) => {
		await page.goto("/");
		await page.locator("[data-mobile-menu-button]").click();

		const menu = page.locator("#mobile-menu");
		await expect(menu).toBeVisible();

		// Covers the viewport below the header (regression: was ~49px).
		const box = await menu.boundingBox();
		expect(box).not.toBeNull();
		expect(box?.height ?? 0).toBeGreaterThan(600);

		// Solid background — must not be transparent.
		const bg = await menu.evaluate((el) => getComputedStyle(el).backgroundColor);
		expect(bg).not.toBe("rgba(0, 0, 0, 0)");
		expect(bg).not.toBe("transparent");

		// Distinct from the page body — the menu is a raised surface, not the page bg.
		const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
		expect(bg).not.toBe(bodyBg);
	});
});
