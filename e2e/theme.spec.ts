import { expect, test } from "@playwright/test";

// Dark-first default (ADR-032, amended for the v2 design language): with no
// stored preference the site renders dark, regardless of OS preference. An
// explicit stored choice still wins and persists.
test.describe("Theme — dark-first default", () => {
	test("defaults to dark when no preference is stored", async ({ page }) => {
		await page.goto("/");
		await expect(page.locator("html")).toHaveClass(/dark/);
	});

	test("respects an explicit stored light preference", async ({ page }) => {
		await page.addInitScript(() => localStorage.setItem("theme", "light"));
		await page.goto("/");
		await expect(page.locator("html")).not.toHaveClass(/dark/);
	});

	test("persists an explicit stored dark preference", async ({ page }) => {
		await page.addInitScript(() => localStorage.setItem("theme", "dark"));
		await page.goto("/");
		await expect(page.locator("html")).toHaveClass(/dark/);
	});
});
