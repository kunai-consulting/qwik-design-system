import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./radio-group.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/radio-group/${exampleName}`);
  const rootLocator = createTestDriver(page);
  return rootLocator;
}

test.describe("Radio Group", () => {
  test(`GIVEN a radio group
      WHEN rendered
      THEN the radio group root should have a role of radiogroup`, async ({ page }) => {
    const d = await setup(page, "hero");
    await expect(d.getRoot()).toHaveAttribute("role", "radiogroup");
  });

  test(`GIVEN a radio group
        WHEN the first radio button is clicked
        THEN it should have a checked value of true`, async ({ page }) => {
    const d = await setup(page, "hero");
    const firstRadioButton = d.getInputAt(0);

    // Click the first radio button
    await firstRadioButton.click();

    // Check that the first radio button is checked
    await expect(firstRadioButton).toBeChecked();
  });

  test(`GIVEN a radio group
        WHEN a different radio button is clicked
        THEN the previously selected radio button should no longer be checked`, async ({
    page
  }) => {
    const d = await setup(page, "hero");
    const firstRadioButton = d.getInputAt(0);
    const secondRadioButton = d.getInputAt(1);

    // Click the first radio button
    await firstRadioButton.click();
    await expect(firstRadioButton).toBeChecked();

    // Click the second radio button
    await secondRadioButton.click();

    // Check that the first radio button is no longer checked
    await expect(firstRadioButton).not.toBeChecked();

    // Check that the second radio button is checked
    await expect(secondRadioButton).toBeChecked();
  });

  test(`GIVEN a radio group
        WHEN no radio button is selected
        THEN the error message should be displayed`, async ({ page }) => {
    const d = await setup(page, "error");
    const radioButtons = page.getByRole("radio");
    const errorMessage = d.getErrorMessage();

    const count = await radioButtons.count();
    for (let i = 0; i < count; i++) {
      const radioButton = radioButtons.nth(i);
      await expect(radioButton).not.toBeChecked();
    }

    // Check that the error message is displayed
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText("Error: Please select an item.");
  });

  test(`GIVEN a radio group
        WHEN any radio button is selected
        THEN the error message should not be displayed`, async ({ page }) => {
    const d = await setup(page, "error");
    const firstRadioButton = d.getInputAt(0);
    const errorMessage = d.getErrorMessage();

    await firstRadioButton.click();
    await expect(firstRadioButton).toBeChecked();

    const dataVisible = await errorMessage.getAttribute("data-visible");
    expect(dataVisible).toBe(null);
  });
});

test.describe("Keyboard Navigation", () => {
  test(`GIVEN a radio group in vertical orientation
          WHEN ArrowDown is pressed
          THEN focus should move to the next item`, async ({ page }) => {
    const d = await setup(page, "hero");
    const firstRadio = d.getInputAt(0);
    const secondRadio = d.getInputAt(1);

    await firstRadio.focus();
    await page.keyboard.press("ArrowDown");

    await expect(secondRadio).toBeFocused();
  });

  test(`GIVEN a radio group in vertical orientation
          WHEN ArrowUp is pressed
          THEN focus should move to the previous item`, async ({ page }) => {
    const d = await setup(page, "hero");
    const secondRadio = d.getInputAt(1);
    const firstRadio = d.getInputAt(0);

    await secondRadio.focus();
    await page.keyboard.press("ArrowUp");

    await expect(firstRadio).toBeFocused();
  });

  test(`GIVEN a radio group in horizontal orientation
          WHEN ArrowRight is pressed
          THEN focus should move to the next item`, async ({ page }) => {
    const d = await setup(page, "horizontal");
    const firstRadio = d.getInputAt(0);
    const secondRadio = d.getInputAt(1);

    await firstRadio.focus();
    await page.keyboard.press("ArrowRight");

    await expect(secondRadio).toBeFocused();
  });

  test(`GIVEN a radio group
          WHEN Home key is pressed
          THEN focus should move to the first item`, async ({ page }) => {
    const d = await setup(page, "hero");
    const lastRadio = d.getInputAt(3);
    const firstRadio = d.getInputAt(0);

    await lastRadio.focus();
    await page.keyboard.press("Home");

    await expect(firstRadio).toBeFocused();
  });

  test(`GIVEN a radio group
          WHEN End key is pressed
          THEN focus should move to the last item`, async ({ page }) => {
    const d = await setup(page, "hero");
    const firstRadio = d.getInputAt(0);
    const lastRadio = d.getInputAt(3);

    await firstRadio.focus();
    await page.keyboard.press("End");

    await expect(lastRadio).toBeFocused();
  });

  test(`GIVEN a radio group
          WHEN Space is pressed on focused item
          THEN it should be selected`, async ({ page }) => {
    const d = await setup(page, "hero");
    const firstRadio = d.getInputAt(0);

    await firstRadio.focus();
    await page.keyboard.press("Space");

    await expect(firstRadio).toHaveAttribute("aria-checked", "true");
  });
});

test.describe("Accessibility", () => {
  test(`GIVEN a radio group
          WHEN rendered
          THEN it should have correct ARIA attributes`, async ({ page }) => {
    const d = await setup(page, "form");
    const root = d.getRoot();

    await expect(root).toHaveAttribute("aria-labelledby");
    await expect(root).toHaveAttribute("aria-required", "true");
    await expect(root).toHaveAttribute("role", "radiogroup");
  });

  test(`GIVEN a disabled radio group
          WHEN trying to interact
          THEN items should not be selectable`, async ({ page }) => {
    const d = await setup(page, "disabled");

    // Click toggle disabled button
    await page.getByText("Toggle Disabled").click();

    const firstRadio = d.getInputAt(0);
    await firstRadio.click();

    await expect(firstRadio).not.toBeChecked();
    await expect(firstRadio).toHaveAttribute("disabled", "");
  });

  test(`GIVEN a radio group with description
          WHEN rendered
          THEN description should be properly linked`, async ({ page }) => {
    const d = await setup(page, "form");
    const root = d.getRoot();

    await expect(root).toHaveAttribute("aria-describedby");
  });
});

test.describe("Controlled Mode", () => {
  test(`GIVEN a controlled radio group
          WHEN value is set externally
          THEN correct option should be selected`, async ({ page }) => {
    const d = await setup(page, "controlledValue");
    const secondRadio = d.getInputAt(1);

    // Item 2 should be selected by default
    await expect(secondRadio).toHaveAttribute("aria-checked", "true");
  });
});

test.describe("Form Integration", () => {
  test(`GIVEN a radio group in a form
          WHEN submitted without selection
          THEN should show error message`, async ({ page }) => {
    const d = await setup(page, "form");

    // Try to submit form
    await page.getByText("Continue to Payment").click();

    const errorMessage = d.getErrorMessage();
    await expect(errorMessage).toBeVisible();
  });

  test(`GIVEN a radio group in a form
          WHEN option is selected and form is submitted
          THEN should not show error message`, async ({ page }) => {
    const d = await setup(page, "form");
    const errorMessage = d.getErrorMessage();
    await expect(errorMessage).toBeVisible();

    // Select an option
    const firstRadio = d.getInputAt(0);
    await firstRadio.click();

    await expect(errorMessage).not.toBeVisible();
  });
});

test.describe("Orientation", () => {
  test(`GIVEN a horizontal radio group
          WHEN rendered
          THEN should have horizontal orientation`, async ({ page }) => {
    const d = await setup(page, "horizontal");
    const root = d.getRoot();

    await expect(root).toHaveAttribute("data-orientation", "horizontal");
  });

  test(`GIVEN a horizontal radio group
          WHEN navigating with arrow keys
          THEN should use left/right arrows`, async ({ page }) => {
    const d = await setup(page, "horizontal");
    const firstRadio = d.getInputAt(0);
    const secondRadio = d.getInputAt(1);

    await firstRadio.focus();
    await page.keyboard.press("ArrowRight");

    await expect(secondRadio).toBeFocused();
  });
});
