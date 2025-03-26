import { type Page, expect, test } from "@playwright/test";

async function setup(page: Page, exampleName: string) {
	await page.goto(`http://localhost:6174/base/as-child/${exampleName}`);
}

test.describe("JSX Node", () => {
	test(`GIVEN a component that uses asChild
        WHEN the direct child is a JSX span node
        THEN the span node should be rendered instead of the returning jsx
    `, async ({ page }) => {
		await setup(page, "jsx-node");

		await expect(page.locator("span").first()).toBeVisible();
	});

	test(`GIVEN a component that uses asChild
        WHEN the direct child is a JSX span node
        THEN the props should merge on the jsx node itself
`, async ({ page }) => {
		await setup(page, "jsx-node");

		await expect(page.locator("span").first()).toHaveAttribute("data-on-span");
	});

	test(`GIVEN a component that uses asChild
        WHEN the direct child is a JSX span node
        THEN the props should merge on the component with asChild prop
`, async ({ page }) => {
		await setup(page, "jsx-node");

		await expect(page.locator("span").first()).toHaveAttribute(
			"data-from-comp",
		);
	});
});

test.describe("Component", () => {
	test(`GIVEN a component that uses asChild
        WHEN the direct child is a component
        THEN the component should be rendered instead of the returning jsx
    `, async ({ page }) => {
		await setup(page, "component");

		await expect(page.locator("span").first()).toBeVisible();
	});

	test(`GIVEN a component that uses asChild
        WHEN the direct child is a component
        THEN the props should merge and pass to the child component
    `, async ({ page }) => {
		await setup(page, "component");

		await expect(page.locator("span").first()).toHaveAttribute(
			"data-outside-comp",
		);
		await expect(page.locator("span").first()).toHaveAttribute(
			"data-inside-comp",
		);
	});
});
