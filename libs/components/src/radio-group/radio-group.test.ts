import { expect, test, type Page } from '@playwright/test';
import { createTestDriver } from './radio-group.driver';

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/radio-group/${exampleName}`);
  const rootLocator = createTestDriver(page);
  return rootLocator;
}

test.describe('Radio Group', () => {
  test(`GIVEN a radio group
      WHEN rendered
      THEN the radio group root should have a role of radiogroup`, async ({
    page,
  }) => {
    const d = await setup(page, 'hero');
    await expect(d.getRoot()).toHaveAttribute('role', 'radiogroup');
  });

  test(`GIVEN a radio group
        WHEN the first radio button is clicked
        THEN it should have a checked value of true`, async ({ page }) => {
    const d = await setup(page, 'hero');
    const firstRadioButton = d.getInputAt(0);

    // Click the first radio button
    await firstRadioButton.click();

    // Check that the first radio button is checked
    await expect(firstRadioButton).toBeChecked();
  });

  test(`GIVEN a radio group
        WHEN a different radio button is clicked
        THEN the previously selected radio button should no longer be checked`, async ({
    page,
  }) => {
    const d = await setup(page, 'hero');
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
});
