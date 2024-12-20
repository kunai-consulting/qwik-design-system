import { expect, test, type Page } from "@playwright/test";
import { createTestDriver } from "./checklist.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/checklist/${exampleName}`);
  return createTestDriver(page);
}

test.describe("Select All", () => {
  test(`GIVEN a checklist
        WHEN no items are checked
        THEN the SelectAll control should be unchecked`, async ({ page }) => {
    const d = await setup(page, "select-all");
    await expect(d.getIndicatorAt(0)).toBeHidden();
    await expect(d.getTriggerAt(0)).toHaveAttribute("aria-checked", "false");
  });

  test(`GIVEN a checklist
        WHEN some items are checked
        THEN SelectAll should be partially checked`, async ({ page }) => {
    const d = await setup(page, "group");

    // Check first item only
    await d.getTriggerAt(1).click();
    await expect(d.getIndicatorAt(1)).toBeVisible();
    await expect(d.getTriggerAt(0)).toHaveAttribute("aria-checked", "mixed");
  });

  test(`GIVEN a checklist with multiple items and SelectAll
       WHEN all items are checked
       THEN SelectAll should be checked`, async ({ page }) => {
    const d = await setup(page, "group");

    // Check all items
    await d.getTriggerAt(1).click();
    await d.getTriggerAt(2).click();
    await d.getTriggerAt(3).click();

    await expect(d.getTriggerAt(0)).toHaveAttribute("aria-checked", "true");
    await expect(d.getIndicatorAt(0)).toBeVisible();
  });

  test(`GIVEN a checklist with multiple items
       WHEN SelectAll is clicked
       THEN all items should be checked`, async ({ page }) => {
    const d = await setup(page, "group");

    await d.getTriggerAt(0).click();

    // Verify all items are checked
    await expect(d.getTriggerAt(1)).toHaveAttribute("aria-checked", "true");
    await expect(d.getTriggerAt(2)).toHaveAttribute("aria-checked", "true");
    await expect(d.getTriggerAt(3)).toHaveAttribute("aria-checked", "true");
  });

  test(`GIVEN a checklist with all items checked
       WHEN SelectAll is clicked
       THEN all items should be unchecked`, async ({ page }) => {
    const d = await setup(page, "group");

    // First check all items
    await d.getTriggerAt(0).click();

    // Then uncheck all via SelectAll
    await d.getTriggerAt(0).click();

    // Verify all items are unchecked
    await expect(d.getTriggerAt(1)).toHaveAttribute("aria-checked", "false");
    await expect(d.getTriggerAt(2)).toHaveAttribute("aria-checked", "false");
    await expect(d.getTriggerAt(3)).toHaveAttribute("aria-checked", "false");
  });
});

test.describe("Keyboard interaction", () => {
  test(`GIVEN a checklist
       WHEN Space is pressed on a checkbox
       THEN its state should toggle`, async ({ page }) => {
    const d = await setup(page, "group");

    await d.getTriggerAt(1).press("Space");
    await expect(d.getTriggerAt(1)).toHaveAttribute("aria-checked", "true");

    await d.getTriggerAt(1).press("Space");
    await expect(d.getTriggerAt(1)).toHaveAttribute("aria-checked", "false");
  });

  test(`GIVEN a checklist
       WHEN Space is pressed on SelectAll
       THEN all items should toggle`, async ({ page }) => {
    const d = await setup(page, "group");

    await d.getTriggerAt(0).press("Space");

    // Verify all items are checked
    await expect(d.getTriggerAt(1)).toHaveAttribute("aria-checked", "true");
    await expect(d.getTriggerAt(2)).toHaveAttribute("aria-checked", "true");
    await expect(d.getTriggerAt(3)).toHaveAttribute("aria-checked", "true");
  });
});

test.describe("ARIA attributes", () => {
  test(`GIVEN a checklist
       THEN it should have correct group role and labeling`, async ({ page }) => {
    const d = await setup(page, "group");

    await expect(d.getRoot()).toHaveAttribute("role", "group");
    await expect(d.getRoot()).toHaveAttribute("aria-labelledby");
  });

  test(`GIVEN a checklist item
       THEN it should have correct checkbox role and state`, async ({ page }) => {
    const d = await setup(page, "group");

    await expect(d.getTriggerAt(1)).toHaveAttribute("role", "checkbox");
    await expect(d.getTriggerAt(1)).toHaveAttribute("aria-checked", "false");
  });
});
