import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./popover.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/popover/${exampleName}`);
  const driver = createTestDriver(page);
  return driver;
}

test.describe("critical functionality", () => {
  test(`GIVEN a popover
        WHEN it is rendered
        THEN the trigger should be visible`, async ({ page }) => {
    const d = await setup(page, "hero");
    await expect(d.getTrigger()).toBeVisible();
  });

  test(`GIVEN a popover
        WHEN the trigger is clicked
        THEN the popover should be visible`, async ({ page }) => {
    const d = await setup(page, "hero");
    await d.getTrigger().click();
    await expect(d.getPopover()).toBeVisible();
  });

  test(`GIVEN an open popover
        WHEN the trigger is clicked
        THEN the popover should be closed`, async ({ page }) => {
    const d = await setup(page, "hero");
    // initial setup
    await d.getTrigger().click();
    await expect(d.getPopover()).toBeVisible();

    await d.getTrigger().click();
    await expect(d.getPopover()).not.toBeVisible();
  });

  test(`GIVEN a popover
        WHEN the trigger is pressed via enter key
        THEN the popover should toggle`, async ({ page }) => {
    const d = await setup(page, "hero");
    await d.getTrigger().press("Enter");
    await expect(d.getPopover()).toBeVisible();

    await d.getTrigger().press("Enter");
    await expect(d.getPopover()).not.toBeVisible();
  });

  test(`GIVEN a popover
        WHEN the trigger is pressed via space key
        THEN the popover should toggle`, async ({ page }) => {
    const d = await setup(page, "hero");
    await d.getTrigger().press("Space");
    await expect(d.getPopover()).toBeVisible();

    await d.getTrigger().press("Space");
    await expect(d.getPopover()).not.toBeVisible();
  });

  test(`GIVEN an open popover
        WHEN the escape key is pressed
        THEN the popover should be closed`, async ({ page }) => {
    const d = await setup(page, "hero");
    await d.getTrigger().press("Enter");
    await expect(d.getPopover()).toBeVisible();

    await d.getTrigger().press("Escape");
    await expect(d.getPopover()).not.toBeVisible();
  });
});
