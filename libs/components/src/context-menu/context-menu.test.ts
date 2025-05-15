import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./context-menu.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/context-menu/${exampleName}`);
  const driver = createTestDriver(page);
  return driver;
}

test.describe("Context Menu Component", () => {
  test(`GIVEN an initial Context Menu
        WHEN rendered
        THEN it should have correct initial ARIA attributes`, async ({ page }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();

    await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(driver.getContent()).toBeHidden(); // Also check content is initially hidden
  });

  test(`GIVEN a closed Context Menu
        WHEN right-clicking on the trigger
        THEN the context menu content should open`, async ({ page }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    const content = driver.getContent();
    await expect(content).toBeHidden();

    await trigger.click({ button: "right" });

    await expect(content).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  test(`GIVEN an open Context Menu
        WHEN clicking outside the context menu content
        THEN the context menu content should close`, async ({ page }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    const content = driver.getContent();
    await trigger.click({ button: "right" }); // Open it first with right-click
    await expect(content).toBeVisible();

    await driver.locator.locator("body").click({ force: true, position: { x: 0, y: 0 } }); // Click top-left corner

    await expect(content).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test(`GIVEN an open Context Menu
        WHEN the Escape key is pressed
        THEN the context menu content should close`, async ({ page }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    const content = driver.getContent();
    await trigger.click({ button: "right" }); // Open it first
    await expect(content).toBeVisible();

    await driver.locator.press("body", "Escape");

    await expect(content).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test(`GIVEN an open Context Menu with focus on the first item
      WHEN ArrowDown is pressed
      THEN focus should move to the second item`, async ({ page }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    await trigger.click({ button: "right" });
    const items = await driver.getItems().all();

    await items[0].waitFor({ state: "visible" });
    await items[0].focus();
    await expect(items[0]).toBeFocused();

    await items[0].press("ArrowDown");

    await expect(items[1]).toBeFocused();
  });

  test(`GIVEN an open Context Menu with focus on the last item
        WHEN ArrowDown is pressed
        THEN focus should wrap to the first item`, async ({ page }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    await trigger.click({ button: "right" });
    const items = await driver.getItems().all();

    const lastItem = items[items.length - 1];
    await lastItem.waitFor({ state: "visible" });
    await lastItem.focus();
    await expect(lastItem).toBeFocused();

    await lastItem.press("ArrowDown");

    await expect(items[0]).toBeFocused(); // Wraps to first item
  });

  test(`GIVEN an open Context Menu with focus on the second item
        WHEN ArrowUp is pressed
        THEN focus should move to the first item`, async ({ page }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    await trigger.click({ button: "right" });
    const items = await driver.getItems().all();

    await items[1].waitFor({ state: "visible" });
    await items[1].focus();
    await expect(items[1]).toBeFocused();

    await items[1].press("ArrowUp");

    await expect(items[0]).toBeFocused();
  });

  test(`GIVEN an open Context Menu with focus on the first item
        WHEN ArrowUp is pressed
        THEN focus should wrap to the last item`, async ({ page }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    await trigger.click({ button: "right" });
    const items = await driver.getItems().all();

    await items[0].waitFor({ state: "visible" });
    await items[0].focus();
    await expect(items[0]).toBeFocused();

    await items[0].press("ArrowUp");

    await expect(items[items.length - 1]).toBeFocused(); // Wraps to last item
  });

  test(`GIVEN an open Context Menu with focus on any item
        WHEN Home key is pressed
        THEN focus should move to the first item`, async ({ page }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    await trigger.click({ button: "right" });
    const items = await driver.getItems().all();

    await items[1].waitFor({ state: "visible" });
    await items[1].focus();
    await expect(items[1]).toBeFocused();

    await items[1].press("Home");

    await expect(items[0]).toBeFocused();
  });

  test(`GIVEN an open Context Menu with focus on any item
        WHEN End key is pressed
        THEN focus should move to the last enabled item`, async ({ page }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    await trigger.click({ button: "right" });
    const items = await driver.getItems().all();

    await items[0].waitFor({ state: "visible" });
    await items[0].focus();
    await expect(items[0]).toBeFocused();

    await items[0].press("End");

    await expect(items[items.length - 1]).toBeFocused();
  });

  test(`GIVEN a Context Menu with onOpenChange$ callback
        WHEN the open state changes
        THEN the callback should be triggered`, async ({ page }) => {
    const driver = await setup(page, "callbacks");
    const trigger = driver.getTrigger();

    const callbackIndicator = page.locator("#openChangeCallbackValue");
    await expect(callbackIndicator).toHaveText("Context Menu is closed.");

    await trigger.click({ button: "right" });

    await expect(callbackIndicator).toHaveText("Context Menu is opened.");

    await driver.locator.locator("body").click({ force: true, position: { x: 0, y: 0 } });

    await expect(callbackIndicator).toHaveText("Context Menu is closed.");
  });

  test(`GIVEN a Context Menu with preventDefaultContextMenu=false
        WHEN right-clicking on the trigger
        THEN both the context menu and browser context menu should open`, async ({
    page
  }) => {
    // This test can be more challenging to verify as we can't easily detect the browser's native context menu
    // We can check if our custom context menu appears while not preventing the default browser behavior
    const driver = await setup(page, "prevent-default");
    const trigger = driver.getTrigger();
    const content = driver.getContent();

    await trigger.click({ button: "right" });

    await expect(content).toBeVisible();
  });

  test(`GIVEN a Context Menu with preventDefaultContextMenu=true
        WHEN right-clicking on the trigger
        THEN only our custom context menu should open`, async ({ page }) => {
    const driver = await setup(page, "prevent-default-true");
    const trigger = driver.getTrigger();
    const content = driver.getContent();

    await trigger.click({ button: "right" });

    await expect(content).toBeVisible();
  });

  test(`GIVEN a Context Menu Item with closeOnSelect=false
        WHEN the item is clicked
        THEN the context menu should remain open`, async ({ page }) => {
    const driver = await setup(page, "close-on-select");
    const trigger = driver.getTrigger();
    const content = driver.getContent();
    await trigger.click({ button: "right" });
    await expect(content).toBeVisible();
    const items = await driver.getItems().all();

    await items[0].waitFor({ state: "visible" });
    await items[0].click();
    await expect(content).toBeVisible();
  });
});
