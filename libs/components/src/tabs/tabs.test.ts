import AxeBuilder from "@axe-core/playwright";
import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./tabs.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/tabs/${exampleName}`);
  const driver = createTestDriver(page);
  return { driver };
}

test.describe("critical functionality", () => {
  test(`GIVEN a tabs component
        WHEN rendered
        THEN it should meet the axe a11y requirements
`, async ({ page }) => {
    await setup(page, "hero");

    const initialResults = await new AxeBuilder({ page })
      .include("[data-qds-tabs-root]")
      .analyze();

    expect(initialResults.violations).toEqual([]);
  });

  test(`GIVEN a tabs component
        WHEN rendered
        THEN the first tab should be active
`, async ({ page }) => {
    const { driver: d } = await setup(page, "hero");

    await expect(d.getTriggerAt(0)).toHaveAttribute("aria-selected", "true");
    await expect(d.getContentAt(1)).toHaveAttribute("aria-selected", "false");
  });

  test(`GIVEN a tabs component
        WHEN rendered
        THEN the first content should be visible
`, async ({ page }) => {
    const { driver: d } = await setup(page, "hero");

    await expect(d.getContentAt(0)).toBeVisible();
    await expect(d.getContentAt(1)).toBeHidden();
  });

  test(`GIVEN a tabs component
        WHEN clicking a new tab
        THEN the selected tab should be updated
`, async ({ page }) => {
    const { driver: d } = await setup(page, "hero");

    await expect(d.getTriggerAt(0)).toHaveAttribute("aria-selected", "true");
    await expect(d.getTriggerAt(1)).toHaveAttribute("aria-selected", "false");

    await d.getTriggerAt(1).click();

    await expect(d.getTriggerAt(0)).toHaveAttribute("aria-selected", "false");
    await expect(d.getTriggerAt(1)).toHaveAttribute("aria-selected", "true");
  });

  test(`GIVEN a tabs component
        WHEN clicking a new tab
        THEN the tabs content should be updated
`, async ({ page }) => {
    const { driver: d } = await setup(page, "hero");

    await expect(d.getContentAt(0)).toBeVisible();
    await expect(d.getContentAt(1)).toBeHidden();

    await d.getTriggerAt(1).click();

    await expect(d.getContentAt(0)).toBeHidden();
    await expect(d.getContentAt(1)).toBeVisible();
  });
});

test.describe("keyboard navigation", () => {
  test(`GIVEN a tabs
        WHEN focus is inside the tablist
        THEN only the active tab should be focusable
`, async ({ page }) => {
    const { driver: d } = await setup(page, "hero");

    await expect(d.getTriggerAt(0)).toHaveAttribute("tabindex", "0");
    await expect(d.getTriggerAt(1)).toHaveAttribute("tabindex", "-1");
    await expect(d.getTriggerAt(2)).toHaveAttribute("tabindex", "-1");
  });

  test(`GIVEN a horizontal tabs
        WHEN pressing right
        THEN the next tab should be focused
`, async ({ page }) => {
    const { driver: d } = await setup(page, "hero");

    await d.getTriggerAt(0).press("ArrowRight");

    await expect(d.getTriggerAt(1)).toBeFocused();
  });

  test(`GIVEN a horizontal tabs
        WHEN pressing left
        THEN the previous tab should be focused
`, async ({ page }) => {
    const { driver: d } = await setup(page, "hero");

    await d.getTriggerAt(1).press("ArrowLeft");

    await expect(d.getTriggerAt(0)).toBeFocused();
  });

  test(`GIVEN a vertical tabs
        WHEN pressing down
        THEN the next tab should be focused
`, async ({ page }) => {
    const { driver: d } = await setup(page, "hero");

    await d.getTriggerAt(0).press("ArrowDown");

    await expect(d.getTriggerAt(1)).toBeFocused();
  });

  test(`GIVEN a vertical tabs
        WHEN pressing up
        THEN the previous tab should be focused
`, async ({ page }) => {
    const { driver: d } = await setup(page, "hero");

    await d.getTriggerAt(1).press("ArrowUp");

    await expect(d.getTriggerAt(0)).toBeFocused();
  });

  test(`GIVEN a tabs
        WHEN pressing the end key
        THEN the last tab should be focused
`, async ({ page }) => {
    const { driver: d } = await setup(page, "hero");

    await d.getTriggerAt(0).press("End");

    await expect(d.getTriggerAt(2)).toBeFocused();
  });

  test(`GIVEN a tabs
        WHEN pressing the home key
        THEN the first tab should be focused
`, async ({ page }) => {
    const { driver: d } = await setup(page, "hero");

    await d.getTriggerAt(2).press("Home");

    await expect(d.getTriggerAt(0)).toBeFocused();
  });

  test(`GIVEN a tabs
        WHEN the next tab is disabled
        THEN the next enabled tab should be focused
`, async ({ page }) => {
    const { driver: d } = await setup(page, "hero");

    await d.getTriggerAt(0).press("ArrowRight");

    await expect(d.getTriggerAt(2)).toBeFocused();
  });

  test(`GIVEN a tabs
        WHEN the previous tab is disabled
        THEN the previous enabled tab should be focused
`, async ({ page }) => {
    const { driver: d } = await setup(page, "hero");

    await d.getTriggerAt(2).press("ArrowLeft");

    await expect(d.getTriggerAt(0)).toBeFocused();
  });
});

test.describe("looping", () => {
  test(`GIVEN a horizontal tabs
        WHEN pressing the right key on the last tab
        THEN the first tab should be focused
`, async ({ page }) => {
    const { driver: d } = await setup(page, "hero");

    // setup
    await d.getTriggerAt(0).press("End");
    await expect(d.getTriggerAt(2)).toBeFocused();

    await d.getTriggerAt(2).press("ArrowRight");
    await expect(d.getTriggerAt(0)).toBeFocused();
  });

  test(`GIVEN a horizontal tabs
        WHEN pressing the left key on the first tab
        THEN the last tab should be focused
`, async ({ page }) => {
    const { driver: d } = await setup(page, "hero");

    // setup
    await expect(d.getTriggerAt(0)).toBeFocused();

    await d.getTriggerAt(0).press("ArrowLeft");
    await expect(d.getTriggerAt(2)).toBeFocused();
  });

  test(`GIVEN a vertical tabs
        WHEN pressing the down key on the last tab
        THEN the first tab should be focused
`, async ({ page }) => {
    const { driver: d } = await setup(page, "hero");

    // setup
    await d.getTriggerAt(0).press("End");
    await expect(d.getTriggerAt(2)).toBeFocused();

    await d.getTriggerAt(2).press("ArrowDown");
    await expect(d.getTriggerAt(0)).toBeFocused();
  });

  test(`GIVEN a vertical tabs
        WHEN pressing the up key on the first tab
        THEN the last tab should be focused
`, async ({ page }) => {
    const { driver: d } = await setup(page, "hero");

    // setup
    await expect(d.getTriggerAt(0)).toBeFocused();

    await d.getTriggerAt(0).press("ArrowUp");
    await expect(d.getTriggerAt(2)).toBeFocused();
  });
});
