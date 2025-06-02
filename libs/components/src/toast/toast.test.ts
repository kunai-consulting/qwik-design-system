import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./toast.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/toast/${exampleName}`);
  const driver = createTestDriver(page);
  return driver;
}

test.describe("critical functionality", () => {
  test(`GIVEN a toast component
        WHEN the trigger is clicked
        THEN the toast should be visible`, async ({ page }) => {
    const d = await setup(page, "hero");
    await d.getTrigger().click();
    await expect(d.getContent()).toBeVisible();
  });

  test(`GIVEN a toast component
        WHEN it is opened
        THEN it should have the correct ARIA attributes`, async ({ page }) => {
    const d = await setup(page, "hero");
    await d.getTrigger().click();
    const root = d.getRoot();

    await expect(root).toHaveAttribute("role", "alert");
    await expect(root).toHaveAttribute("aria-live", "assertive");
  });

  test(`GIVEN a toast with title and description
        WHEN it is opened
        THEN it should have proper aria-labelledby and aria-describedby`, async ({
    page
  }) => {
    const d = await setup(page, "hero");
    await d.getTrigger().click();
    const root = d.getRoot();
    const title = d.getTitle();
    const description = d.getDescription();

    await expect(title).toBeVisible();
    await expect(description).toBeVisible();

    const titleId = await title.getAttribute("id");
    const descriptionId = await description.getAttribute("id");

    if (titleId && descriptionId) {
      await expect(root).toHaveAttribute("aria-labelledby", titleId);
      await expect(root).toHaveAttribute("aria-describedby", descriptionId);
    } else {
      throw new Error("Title or description ID not found");
    }
  });

  test(`GIVEN an open toast
        WHEN the close button is clicked
        THEN the toast should be closed`, async ({ page }) => {
    const d = await setup(page, "hero");

    await d.getTrigger().click();
    await expect(d.getContent()).toBeVisible();
    await d.getClose().click();
    await expect(d.getContent()).not.toBeVisible();
  });

  test(`GIVEN an open toast
        WHEN the escape key is pressed
        THEN the toast should be closed`, async ({ page }) => {
    const d = await setup(page, "hero");

    await d.getTrigger().click();
    await expect(d.getContent()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(d.getContent()).not.toBeVisible();
  });

  test(`GIVEN a toast with auto-dismiss
        WHEN it is opened
        THEN the toast should be closed automatically after the duration`, async ({
    page
  }) => {
    const d = await setup(page, "auto-dismiss");

    await d.getTrigger().click();
    await expect(d.getContent()).toBeVisible();
    // Wait for auto-dismiss (should be 2000ms)
    await page.waitForTimeout(2100);
    await expect(d.getContent()).not.toBeVisible();
  });
});

test.describe("accessibility", () => {
  test(`GIVEN a toast with role="status"
        WHEN it is opened
        THEN it should have the correct role and aria-live`, async ({ page }) => {
    const d = await setup(page, "status-role");
    await d.getTrigger().click();
    const root = d.getRoot();

    await expect(root).toHaveAttribute("role", "status");
    await expect(root).toHaveAttribute("aria-live", "polite");
  });

  test(`GIVEN a toast with assertive priority
        WHEN it is opened
        THEN it should have aria-live="assertive"`, async ({ page }) => {
    const d = await setup(page, "assertive");
    await d.getTrigger().click();
    const root = d.getRoot();

    await expect(root).toHaveAttribute("aria-live", "assertive");
  });
});

test.describe("positioning", () => {
  test(`GIVEN a toast with position="top"
        WHEN it is opened
        THEN it should have the correct position data attribute`, async ({ page }) => {
    const d = await setup(page, "position-top");
    await d.getTrigger().click();
    const root = d.getRoot();

    await expect(root).toHaveAttribute("data-position", "top");
  });

  test(`GIVEN a toast with position="bottom-right"
        WHEN it is opened
        THEN it should have the correct position data attribute`, async ({ page }) => {
    const d = await setup(page, "position-bottom-right");
    await d.getTrigger().click();
    const root = d.getRoot();

    await expect(root).toHaveAttribute("data-position", "bottom-right");
  });
});

test.describe("state management", () => {
  test(`GIVEN a toast with bind:open
        WHEN the toast state changes
        THEN the bound signal should update`, async ({ page }) => {
    const d = await setup(page, "signal-binding");

    // Check initial state
    await expect(page.getByText("Is open: false")).toBeVisible();

    // Open the toast
    await d.getTrigger().click();
    await expect(page.getByText("Is open: true")).toBeVisible();

    // Close the toast
    await d.getClose().click();
    await expect(page.getByText("Is open: false")).toBeVisible();
  });

  test(`GIVEN a toast with onChange$ callback
        WHEN the toast is opened and closed
        THEN the callback should be triggered`, async ({ page }) => {
    const d = await setup(page, "on-change");

    await expect(page.getByText("onChange called: 0")).toBeVisible();

    // Open the toast
    await d.getTrigger().click();
    await expect(page.getByText("onChange called: 1")).toBeVisible();

    // Close the toast
    await d.getClose().click();
    await expect(page.getByText("onChange called: 2")).toBeVisible();
  });
});
