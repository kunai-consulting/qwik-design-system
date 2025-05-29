import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./switch.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/switch/${exampleName}`);
  const driver = createTestDriver(page);
  return driver;
}

test.describe("critical functionality", () => {
  test(`GIVEN a Switch component
        WHEN it is rendered
        THEN it should have correct ARIA attributes`, async ({ page }) => {
    const d = await setup(page, "hero");

    await expect(d.getRoot()).toHaveAttribute("role", "switch");
    await expect(d.getRoot()).toHaveAttribute("aria-checked", "false");
  });
});

test.describe("interaction", () => {
  test(`GIVEN a Switch component
        WHEN clicking on the trigger
        THEN the state should toggle`, async ({ page }) => {
    const d = await setup(page, "hero");
    const trigger = d.getTrigger();

    await trigger.click();
    await expect(d.getRoot()).toHaveAttribute("aria-checked", "true");
    await trigger.click();
    await expect(d.getRoot()).toHaveAttribute("aria-checked", "false");
  });

  test(`GIVEN a Switch component
        WHEN using keyboard navigation
        THEN the state should toggle`, async ({ page }) => {
    const d = await setup(page, "hero");
    const trigger = d.getTrigger();

    await trigger.focus();
    await page.keyboard.press("Space");
    await expect(d.getRoot()).toHaveAttribute("aria-checked", "true");
    await page.keyboard.press("Space");
    await expect(d.getRoot()).toHaveAttribute("aria-checked", "false");
  });
});

test.describe("disabled state", () => {
  test(`GIVEN a disabled Switch component
        WHEN clicking on the trigger
        THEN the state should not change`, async ({ page }) => {
    const d = await setup(page, "disabled");
    const trigger = d.getTrigger();

    await expect(d.getRoot()).toHaveAttribute("aria-disabled", "true");
    await expect(trigger).toBeDisabled();
    await expect(d.getRoot()).toHaveAttribute("aria-checked", "false");
  });
});

test.describe("form integration", () => {
  test(`GIVEN a Switch component with name and value
        WHEN it is rendered
        THEN it should have a hidden input with correct attributes`, async ({ page }) => {
    const d = await setup(page, "form");
    const input = d.getHiddenInput();

    await expect(input).toHaveAttribute("name", "notifications");
    await expect(input).toHaveAttribute("value", "enabled");
  });
});

test.describe("form validation", () => {
  test(`GIVEN a required Switch in a form
      WHEN submitting without checking
      THEN form should be invalid`, async ({ page }) => {
    const d = await setup(page, "form");
    const submitButton = page.locator('button[type="submit"]');

    await submitButton.click();

    await expect(d.getRoot()).toHaveAttribute("data-error", "");
    await expect(d.getError()).toBeVisible();
    await expect(d.getError()).toHaveText("This field is required");
  });

  test(`GIVEN a required Switch with error
        WHEN checking the switch
        THEN error should be cleared`, async ({ page }) => {
    const d = await setup(page, "form");
    const submitButton = page.locator('button[type="submit"]');

    await submitButton.click();
    await expect(d.getError()).toBeVisible();

    await d.getTrigger().click();
    await expect(d.getError()).not.toBeVisible();
  });
});

test.describe("error message", () => {
  test(`GIVEN a Switch with error
        WHEN rendered
        THEN error message should be correctly associated`, async ({ page }) => {
    const d = await setup(page, "form");
    const submitButton = page.locator('button[type="submit"]');

    await submitButton.click();
    const errorId = await d.getError().getAttribute("id");
    await expect(d.getRoot()).toHaveAttribute("aria-errormessage", String(errorId));
  });
});

test.describe("keyboard navigation", () => {
  test(`GIVEN a Switch
        WHEN pressing Enter
        THEN the state should toggle`, async ({ page }) => {
    const d = await setup(page, "hero");
    const trigger = d.getTrigger();

    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(d.getRoot()).toHaveAttribute("aria-checked", "true");
    await page.keyboard.press("Enter");
    await expect(d.getRoot()).toHaveAttribute("aria-checked", "false");
  });

  test(`GIVEN a disabled Switch
        WHEN using keyboard
        THEN the state should not change`, async ({ page }) => {
    const d = await setup(page, "disabled");
    const trigger = d.getTrigger();

    await trigger.focus();
    await page.keyboard.press("Space");
    await expect(d.getRoot()).toHaveAttribute("aria-checked", "false");
    await page.keyboard.press("Enter");
    await expect(d.getRoot()).toHaveAttribute("aria-checked", "false");
  });
});

test.describe("label interaction", () => {
  test(`GIVEN a Switch with label
        WHEN clicking the label
        THEN the switch should toggle`, async ({ page }) => {
    const d = await setup(page, "hero");
    const label = d.getLabel();

    await label.click();
    await expect(d.getRoot()).toHaveAttribute("aria-checked", "true");
    await label.click();
    await expect(d.getRoot()).toHaveAttribute("aria-checked", "false");
  });
});

test.describe("description", () => {
  test(`GIVEN a Switch component with description
        WHEN it is rendered
        THEN the description should be visible`, async ({ page }) => {
    const d = await setup(page, "description");
    const description = d.getDescription();

    await expect(description).toBeVisible();
    await expect(description).toHaveText(
      "(Receive notifications about important updates)"
    );
  });
});
