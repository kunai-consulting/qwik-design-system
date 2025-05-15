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

  test(`GIVEN an open Dropdown with focus on any item
        WHEN Home key is pressed
        THEN focus should move to the first item`, async ({ page }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    await trigger.click();
    const items = await driver.getItems().all();
    await items[1].waitFor({ state: "visible" });
    await items[1].focus();
    await expect(items[1]).toBeFocused();

    await items[1].press("Home");

    await expect(items[0]).toBeFocused();
  });

  test(`GIVEN an open Dropdown with focus on any item
        WHEN End key is pressed
        THEN focus should move to the last enabled item`, async ({ page }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    await trigger.click();
    const items = await driver.getItems().all();

    await items[0].waitFor({ state: "visible" });
    await items[0].focus();
    await expect(items[0]).toBeFocused();

    await items[0].press("End");

    const lastEnabledItem = items[items.length - 2];

    await expect(lastEnabledItem).toBeFocused();
  });

  test(`GIVEN a Dropdown with onOpenChange$ callback
        WHEN the open state changes
        THEN the callback should be triggered`, async ({ page }) => {
    const driver = await setup(page, "callbacks");
    const trigger = driver.getTrigger();

    const callbackIndicator = page.locator("#openChangeCallbackValue");
    await expect(callbackIndicator).toHaveText("Dropdown is closed.");

    await trigger.click();

    await expect(callbackIndicator).toHaveText("Dropdown is opened.");

    await driver.getTrigger().click();

    await expect(callbackIndicator).toHaveText("Dropdown is closed.");
  });

  test(`GIVEN a Dropdown Item with closeOnSelect=false
        WHEN the item is clicked
        THEN the dropdown should remain open`, async ({ page }) => {
    const driver = await setup(page, "close-on-select");
    const trigger = driver.getTrigger();
    const content = driver.getContent();
    await trigger.click();
    await expect(content).toBeVisible();
    const items = await driver.getItems().all();

    await items[0].waitFor({ state: "visible" });
    await items[0].click();
    await expect(content).toBeVisible();
  });
});

test.describe('Dropdown Submenu', () => {
  test('GIVEN a Dropdown with a submenu WHEN the submenu trigger is clicked THEN the submenu content should open', async ({ page }) => {
    const driver = await setup(page, 'submenu');
    const trigger = driver.getTrigger();
    await trigger.click();
    const submenuTrigger = driver.getSubmenuTrigger();
    await submenuTrigger.click();
    const submenuContent = driver.getSubmenuContent();
    await expect(submenuContent).toBeVisible();
  });

  test('GIVEN a Dropdown with a submenu WHEN ArrowRight is pressed on the submenu trigger THEN the submenu content should open and first item is focused', async ({ page }) => {
    const driver = await setup(page, 'submenu');
    const trigger = driver.getTrigger();
    await trigger.click();
    const submenuTrigger = driver.getSubmenuTrigger();
    await submenuTrigger.waitFor({ state: "visible" });
    await submenuTrigger.focus();
    await expect(submenuTrigger).toBeFocused();
    await submenuTrigger.press('ArrowRight');
    const submenuContent = driver.getSubmenuContent();
    await expect(submenuContent).toBeVisible();
    const submenuItems = await driver.getSubmenuItems().all();
    await expect(submenuItems[0]).toBeFocused();
  });

  test('GIVEN an open submenu WHEN ArrowDown is pressed THEN focus should move to the next submenu item', async ({ page }) => {
    const driver = await setup(page, 'submenu');
    const trigger = driver.getTrigger();
    await trigger.click();
    const submenuTrigger = driver.getSubmenuTrigger();
    await submenuTrigger.click();
    const submenuItems = await driver.getSubmenuItems().all();
    await submenuItems[0].focus();
    await expect(submenuItems[0]).toBeFocused();
    await submenuItems[0].press('ArrowDown');
    await expect(submenuItems[1]).toBeFocused();
  });

  test('GIVEN an open submenu WHEN ArrowUp is pressed on the first item THEN focus should wrap to the last submenu item', async ({ page }) => {
    const driver = await setup(page, 'submenu');
    const trigger = driver.getTrigger();
    await trigger.click();
    const submenuTrigger = driver.getSubmenuTrigger();
    await submenuTrigger.click();
    const submenuItems = await driver.getSubmenuItems().all();
    await submenuItems[0].focus();
    await submenuItems[0].press('ArrowUp');
    await expect(submenuItems[submenuItems.length - 1]).toBeFocused();
  });

  test('GIVEN a submenu item with closeOnSelect=false WHEN it is clicked THEN the submenu should remain open', async ({ page }) => {
    const driver = await setup(page, 'submenu');
    const trigger = driver.getTrigger();
    await trigger.click();
    const submenuTrigger = driver.getSubmenuTrigger();
    await submenuTrigger.click();
    const submenuItems = await driver.getSubmenuItems().all();
    // The second submenu item has closeOnSelect=false
    await submenuItems[1].click();
    const submenuContent = driver.getSubmenuContent();
    await expect(submenuContent).toBeVisible();
  });

  test('GIVEN a submenu WHEN Escape is pressed THEN the submenu should close', async ({ page }) => {
    const driver = await setup(page, 'submenu');
    const trigger = driver.getTrigger();
    await trigger.click();
    const submenuTrigger = driver.getSubmenuTrigger();
    await submenuTrigger.click();
    const submenuContent = driver.getSubmenuContent();
    await expect(submenuContent).toBeVisible();
    await submenuContent.press('Escape');
    await expect(submenuContent).toBeHidden();
  });

  test('GIVEN a submenu trigger WHEN rendered THEN it should have correct ARIA attributes', async ({ page }) => {
    const driver = await setup(page, 'submenu');
    const trigger = driver.getTrigger();
    await trigger.click();
    const submenuTrigger = driver.getSubmenuTrigger();
    await expect(submenuTrigger).toHaveAttribute('aria-haspopup', 'menu');
    await expect(submenuTrigger).toHaveAttribute('aria-expanded', 'false');
    await submenuTrigger.click();
    await expect(submenuTrigger).toHaveAttribute('aria-expanded', 'true');
  });
});
