import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./toaster.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/toaster/${exampleName}`);
  const driver = createTestDriver(page);
  return driver;
}

test.describe("critical functionality", () => {
  test(`GIVEN a toaster component
        WHEN the trigger is clicked
        THEN a toast item should be created and visible`, async ({ page }) => {
    const d = await setup(page, "hero");
    await d.getTrigger().click();
    await expect(d.getToastItem(0)).toBeVisible();
  });

  test(`GIVEN a toaster component
        WHEN multiple triggers are clicked
        THEN multiple toast items should be created and visible`, async ({ page }) => {
    const d = await setup(page, "multiple-toasts");

    await d.getTrigger().click();
    await d.getTrigger().click();
    await d.getTrigger().click();

    await expect(d.getToastItem(0)).toBeVisible();
    await expect(d.getToastItem(1)).toBeVisible();
    await expect(d.getToastItem(2)).toBeVisible();
  });

  test(`GIVEN a toaster with multiple toast items
        WHEN a close button is clicked on one item
        THEN only that specific toast item should be closed`, async ({ page }) => {
    const d = await setup(page, "multiple-toasts");

    await d.getTrigger().click();
    await d.getTrigger().click();

    await expect(d.getToastItem(0)).toBeVisible();
    await expect(d.getToastItem(1)).toBeVisible();

    await d.getToastItemClose(0).click();

    await expect(d.getToastItem(0)).not.toBeVisible();
    await expect(d.getToastItem(1)).toBeVisible();
  });

  test(`GIVEN a toaster with limit set to 2
        WHEN 3 toasts are triggered
        THEN only 2 toasts should be visible`, async ({ page }) => {
    const d = await setup(page, "with-limit");

    await d.getTrigger().click();
    await d.getTrigger().click();
    await d.getTrigger().click();

    // Should only show 2 toasts due to limit
    await expect(d.getAllToastItems()).toHaveCount(2);
  });

  test(`GIVEN a toaster with auto-dismiss
        WHEN a toast is created
        THEN the toast should be dismissed automatically after duration`, async ({
    page
  }) => {
    const d = await setup(page, "auto-dismiss");

    await d.getTrigger().click();
    await expect(d.getToastItem(0)).toBeVisible();

    // Wait for auto-dismiss (should be 2000ms)
    await page.waitForTimeout(2100);
    await expect(d.getToastItem(0)).not.toBeVisible();
  });

  test(`GIVEN a toaster component
        WHEN escape key is pressed
        THEN the most recent toast should be dismissed`, async ({ page }) => {
    const d = await setup(page, "hero");

    await d.getTrigger().click();
    await expect(d.getToastItem(0)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(d.getToastItem(0)).not.toBeVisible();
  });
});

test.describe("accessibility", () => {
  test(`GIVEN a toaster component
        WHEN it is rendered
        THEN it should have the correct ARIA attributes`, async ({ page }) => {
    const d = await setup(page, "hero");
    const root = d.getRoot();

    await expect(root).toHaveAttribute("role", "region");
    await expect(root).toHaveAttribute("data-qds-toaster-root");
  });

  test(`GIVEN a toast item in toaster
        WHEN it is created
        THEN it should have proper ARIA attributes from Toast`, async ({ page }) => {
    const d = await setup(page, "hero");

    await d.getTrigger().click();
    const toastItem = d.getToastItem(0);

    await expect(toastItem).toHaveAttribute("role", "alert");
    await expect(toastItem).toHaveAttribute("aria-live", "assertive");
  });

  test(`GIVEN a toast item with title and description
        WHEN it is created
        THEN it should have proper aria-labelledby and aria-describedby`, async ({
    page
  }) => {
    const d = await setup(page, "with-content");

    await d.getTrigger().click();
    const toastItem = d.getToastItem(0);
    const title = d.getToastItemTitle(0);
    const description = d.getToastItemDescription(0);

    await expect(title).toBeVisible();
    await expect(description).toBeVisible();

    const titleId = await title.getAttribute("id");
    const descriptionId = await description.getAttribute("id");

    if (titleId && descriptionId) {
      await expect(toastItem).toHaveAttribute("aria-labelledby", titleId);
      await expect(toastItem).toHaveAttribute("aria-describedby", descriptionId);
    } else {
      throw new Error("Title or description ID not found");
    }
  });
});

test.describe("positioning", () => {
  test(`GIVEN a toaster with position="top"
        WHEN it is rendered
        THEN it should have the correct position data attribute`, async ({ page }) => {
    const d = await setup(page, "position-top");
    const root = d.getRoot();

    await expect(root).toHaveAttribute("data-position", "top");
  });

  test(`GIVEN a toaster with position="bottom-right"
        WHEN it is rendered
        THEN it should have the correct position data attribute`, async ({ page }) => {
    const d = await setup(page, "position-bottom-right");
    const root = d.getRoot();

    await expect(root).toHaveAttribute("data-position", "bottom-right");
  });
});

test.describe("state management", () => {
  test(`GIVEN a toaster with bind:toasts
        WHEN toasts are created and dismissed
        THEN the bound signal should update correctly`, async ({ page }) => {
    const d = await setup(page, "signal-binding");

    // Check initial state
    await expect(page.getByText("Toast count: 0")).toBeVisible();

    // Create a toast
    await d.getTrigger().click();
    await expect(page.getByText("Toast count: 1")).toBeVisible();

    // Create another toast
    await d.getTrigger().click();
    await expect(page.getByText("Toast count: 2")).toBeVisible();

    // Close one toast
    await d.getToastItemClose(0).click();
    await expect(page.getByText("Toast count: 1")).toBeVisible();
  });

  test(`GIVEN a toaster with onToastChange$ callback
        WHEN toasts are created and dismissed
        THEN the callback should be triggered with correct data`, async ({ page }) => {
    const d = await setup(page, "on-toast-change");

    await expect(page.getByText("Toast changes: 0")).toBeVisible();

    // Create a toast
    await d.getTrigger().click();
    await expect(page.getByText("Toast changes: 1")).toBeVisible();

    // Close the toast
    await d.getToastItemClose(0).click();
    await expect(page.getByText("Toast changes: 2")).toBeVisible();
  });
});

test.describe("stacking behavior", () => {
  test(`GIVEN a toaster with multiple toasts
        WHEN they are created
        THEN they should be stacked with proper gap`, async ({ page }) => {
    const d = await setup(page, "stacking");

    await d.getTrigger().click();
    await d.getTrigger().click();

    const firstToast = d.getToastItem(0);
    const secondToast = d.getToastItem(1);

    await expect(firstToast).toBeVisible();
    await expect(secondToast).toBeVisible();

    // Check that toasts are positioned differently (basic positioning test)
    const firstBox = await firstToast.boundingBox();
    const secondBox = await secondToast.boundingBox();

    expect(firstBox).not.toBeNull();
    expect(secondBox).not.toBeNull();

    if (firstBox && secondBox) {
      expect(firstBox.y).not.toBe(secondBox.y);
    }
  });
});
