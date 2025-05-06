import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./toaster.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/toast/${exampleName}`);
  const driver = createTestDriver(page);
  return driver;
}

test.describe("critical functionality", () => {
  test(`GIVEN a toast component
        WHEN it is rendered
        THEN it should have correct ARIA attributes`, async ({ page }) => {
    const d = await setup(page, "hero");

    await expect(d.getRoot()).toHaveAttribute("aria-live", "polite");
  });
});

test.describe("interaction", () => {
  test(`GIVEN a toast component
        WHEN clicking on the trigger
        THEN the Popover should open`, async ({ page }) => {
    const d = await setup(page, "hero");
    const trigger = d.getTrigger();
    const item = d.getItem();
    await trigger.click();

    await expect(item).toBeVisible();
    await expect(item).toHaveAttribute("role", "status");
  });

  test(`GIVEN a toast component
        WHEN clicking on the close button
        THEN the toast should be dismissed`, async ({ page }) => {
    const d = await setup(page, "hero");
    const trigger = d.getTrigger();
    const item = d.getItem();
    const close = d.getClose();
    await trigger.click();

    await expect(item).toBeVisible();
    await close.click();
    await expect(item).not.toBeVisible();
  });
});
