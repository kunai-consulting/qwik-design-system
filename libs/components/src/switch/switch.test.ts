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
        WHEN clicking on the control
        THEN the state should toggle`, async ({ page }) => {
    const d = await setup(page, "hero");
    const control = d.getControl();

    await control.click();
    await expect(d.getRoot()).toHaveAttribute("aria-checked", "true");
    await control.click();
    await expect(d.getRoot()).toHaveAttribute("aria-checked", "false");
  });

  test(`GIVEN a Switch component
        WHEN using keyboard navigation
        THEN the state should toggle`, async ({ page }) => {
    const d = await setup(page, "hero");
    const control = d.getControl();

    await control.focus();
    await page.keyboard.press("Space");
    await expect(d.getRoot()).toHaveAttribute("aria-checked", "true");
    await page.keyboard.press("Space");
    await expect(d.getRoot()).toHaveAttribute("aria-checked", "false");
  });
});

test.describe("disabled state", () => {
  test(`GIVEN a disabled Switch component
        WHEN clicking on the control
        THEN the state should not change`, async ({ page }) => {
    const d = await setup(page, "disabled");
    const control = d.getControl();

    await expect(d.getRoot()).toHaveAttribute("aria-disabled", "true");
    await control.click();
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

test.describe("description", () => {
  test(`GIVEN a Switch component with description
        WHEN it is rendered
        THEN the description should be visible`, async ({ page }) => {
    const d = await setup(page, "description");
    const description = d.getDescription();

    await expect(description).toBeVisible();
    await expect(description).toHaveText("Receive notifications about important updates");
  });
});