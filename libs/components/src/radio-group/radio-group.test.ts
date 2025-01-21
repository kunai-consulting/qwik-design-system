import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./radio-group.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/radio-group/${exampleName}`);
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
