import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./dropdown.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/dropdown/${exampleName}`);
  const driver = createTestDriver(page);
  return driver;
}

test.describe("Dropdown Component", () => {
  test(`GIVEN an initial Dropdown
        WHEN rendered
        THEN it should have correct initial ARIA attributes`, async ({ page }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();

    await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(driver.getContent()).toBeHidden(); // Also check content is initially hidden
  });

  test(`GIVEN a closed Dropdown
        WHEN the trigger is clicked
        THEN the dropdown content should open`, async ({ page }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    const content = driver.getContent();
    await expect(content).toBeHidden();

    await trigger.click();

    await expect(content).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  test(`GIVEN an open Dropdown
        WHEN the trigger is clicked again
        THEN the dropdown content should close`, async ({ page }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    const content = driver.getContent();
    await trigger.click(); // Open it first
    await expect(content).toBeVisible();

    await trigger.click();

    await expect(content).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test(`GIVEN an open Dropdown
        WHEN the Escape key is pressed
        THEN the dropdown content should close`, async ({ page }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    const content = driver.getContent();
    await trigger.click(); // Open it first
    await expect(content).toBeVisible();
    await trigger.focus(); // Ensure focus is suitable for key press

    await driver.locator.press("body", "Escape");

    await expect(content).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test(`GIVEN an open Dropdown
        WHEN clicking outside the dropdown content
        THEN the dropdown content should close`, async ({ page }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    const content = driver.getContent();
    await trigger.click(); // Open it first
    await expect(content).toBeVisible();

    await driver.locator.locator("body").click({ force: true, position: { x: 0, y: 0 } }); // Click top-left corner

    await expect(content).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test(`GIVEN an open Dropdown with focus on the first item
      WHEN ArrowDown is pressed
      THEN focus should move to the second item`, async ({ page }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    await trigger.click();
    const items = await driver.getItems().all();

    await items[0].waitFor({ state: "visible" });
    await items[0].focus();
    await expect(items[0]).toBeFocused();

    await items[0].press("ArrowDown");

    await expect(items[1]).toBeFocused();
  });

  test(`GIVEN an open Dropdown with focus on the last item
        WHEN ArrowDown is pressed
        THEN focus should wrap to the first item`, async ({ page }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    await trigger.click();
    const items = await driver.getItems().all();

    const lastEnabledItem = items[items.length - 2]; // Assuming item 3 (index 2) is disabled
    await lastEnabledItem.waitFor({ state: "visible" });
    await lastEnabledItem.focus();
    await expect(lastEnabledItem).toBeFocused();

    await lastEnabledItem.press("ArrowDown");

    await expect(items[0]).toBeFocused(); // Wraps to first item
  });

  test(`GIVEN an open Dropdown with focus on the second item
        WHEN ArrowUp is pressed
        THEN focus should move to the first item`, async ({ page }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    await trigger.click();
    const items = await driver.getItems().all();

    await items[1].waitFor({ state: "visible" });
    await items[1].focus();
    await expect(items[1]).toBeFocused();

    await items[1].press("ArrowUp");

    await expect(items[0]).toBeFocused();
  });

  test(`GIVEN an open Dropdown with focus on the first item
        WHEN ArrowUp is pressed
        THEN focus should wrap to the last enabled item`, async ({ page }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    await trigger.click();
    const items = await driver.getItems().all();
    const lastEnabledItem = items[items.length - 2]; // Assuming item 3 (index 2) is disabled
    await lastEnabledItem.waitFor({ state: "visible" });
    await items[0].focus();
    await expect(items[0]).toBeFocused();

    await items[0].press("ArrowUp");

    await expect(lastEnabledItem).toBeFocused(); // Wraps to last enabled item
  });
});
