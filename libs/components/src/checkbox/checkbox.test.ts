import { expect, test, type Page } from "@playwright/test";
import { createTestDriver } from "./checkbox.driver";
async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/checkbox/${exampleName}`);

  const driver = createTestDriver(page);

  return driver;
}

test.describe("critical functionality", () => {
  test(`GIVEN a checkbox
        WHEN the trigger is clicked
        THEN the indicator should be visible`, async ({ page }) => {
    const d = await setup(page, "hero");

    await d.getTrigger().click();
    await expect(d.getIndicator()).toBeVisible();
  });

  test(`GIVEN a checkbox that is initially checked
        WHEN the trigger is clicked
        THEN the indicator should be hidden`, async ({ page }) => {
    const d = await setup(page, "hero");

    // initial setup
    await d.getTrigger().click();
    await expect(d.getIndicator()).toBeVisible();

    await d.getTrigger().click();
    await expect(d.getIndicator()).toBeHidden();
  });

  test(`GIVEN a checkbox
        WHEN the trigger is pressed via space key
        THEN the indicator should be visible`, async ({ page }) => {
    const d = await setup(page, "hero");

    await d.getTrigger().press("Space");
    await expect(d.getIndicator()).toBeVisible();
  });

  test(`GIVEN a checkbox that is initially checked
        WHEN the trigger is pressed via space key
        THEN the indicator should be hidden`, async ({ page }) => {
    const d = await setup(page, "hero");

    // initial setup
    await d.getTrigger().press("Space");
    await expect(d.getIndicator()).toBeVisible();

    await d.getTrigger().press("Space");
    await expect(d.getIndicator()).toBeHidden();
  });
});

test.describe("state", () => {
  test(`GIVEN a checkbox with the checked prop
        WHEN the checkbox is rendered
        THEN it should be checked`, async ({ page }) => {
    const d = await setup(page, "initial");

    await expect(d.getIndicator()).toBeVisible();
    await expect(d.getTrigger()).toHaveAttribute("aria-checked", "true");
  });

  test(`GIVEN a checkbox with the bind:checked prop
        WHEN the checkbox is clicked
        THEN the read state should be true`, async ({ page }) => {
    const d = await setup(page, "reactive");

    const readStateEl = page.locator("p");

    await d.getTrigger().click();
    await expect(d.getIndicator()).toBeVisible();
    await expect(d.getTrigger()).toHaveAttribute("aria-checked", "true");

    await expect(readStateEl).toContainText("Checked: true");
  });

  test(`GIVEN a checkbox with the bind:checked prop that is initially checked
        WHEN the checkbox is clicked
        THEN the read state should be false`, async ({ page }) => {
    const d = await setup(page, "reactive");

    const readStateEl = page.locator("p");

    // initial setup
    await d.getTrigger().click();
    await expect(d.getIndicator()).toBeVisible();
    await expect(d.getTrigger()).toHaveAttribute("aria-checked", "true");
    await expect(readStateEl).toContainText("Checked: true");

    await d.getTrigger().click();
    await expect(readStateEl).toContainText("Checked: false");
  });

  test(`GIVEN a checkbox with a bind:checked prop
        WHEN the signal passed to the bind:checked prop is changed to true
        THEN the checkbox should be checked`, async ({ page }) => {
    const d = await setup(page, "programmatic");

    await expect(d.getIndicator()).toBeHidden();

    const programmaticEl = page.locator("button").last();

    await programmaticEl.click();
    await expect(d.getIndicator()).toBeVisible();
  });

  test(`GIVEN a checkbox with an onChange$ prop
    WHEN the checkbox is toggled
    THEN the onChange$ handler should be called`, async ({ page }) => {
    const d = await setup(page, "change");

    const readChangeEl = page.locator("p");

    await expect(readChangeEl).toContainText("Times changed: 0");
    await d.getTrigger().click();
    await expect(readChangeEl).toContainText("Times changed: 1");
  });

  test(`GIVEN a checkbox with an onChange$ prop
        WHEN the checkbox is toggled
        THEN a new value should be passed as an argument`, async ({ page }) => {
    const d = await setup(page, "change");

    const isCheckedEl = page.locator("section");

    await expect(isCheckedEl).toContainText("New value: false");
    await d.getTrigger().click();
    await expect(isCheckedEl).toContainText("New value: true");
  });

  test(`GIVEN a checkbox with a disabled prop
        WHEN the checkbox is rendered
        THEN the checkbox trigger should be disabled`, async ({ page }) => {
    const d = await setup(page, "disabled");

    await expect(d.getTrigger()).toBeDisabled();
  });

  test(`GIVEN a checkbox with a disabled prop
        WHEN programmatically toggling the disabled prop
        THEN the checkbox trigger should reflect the new state`, async ({ page }) => {
    const d = await setup(page, "disabled");

    const toggleDisabledEl = page.locator("button").last();

    await expect(d.getTrigger()).toBeDisabled();

    await toggleDisabledEl.click();
    await expect(d.getTrigger()).toBeEnabled();
  });

  test(`GIVEN a checkbox with bind:checked
        WHEN programmatically setting the state to mixed
        THEN the checkbox should reflect the mixed state`, async ({ page }) => {
    const d = await setup(page, "mixed-reactive");

    await expect(d.getTrigger()).toHaveAttribute("aria-checked", "false");

    const mixedButton = page.locator("button").last();
    await mixedButton.click();

    await expect(d.getTrigger()).toHaveAttribute("aria-checked", "mixed");
  });
});

test.describe("a11y", () => {
  test(`GIVEN a checkbox
        WHEN the trigger is clicked
        THEN aria-checked should be true`, async ({ page }) => {
    const d = await setup(page, "hero");

    await d.getTrigger().click();
    await expect(d.getTrigger()).toHaveAttribute("aria-checked", "true");
  });

  test(`GIVEN a checkbox that is initially checked
        WHEN the trigger is clicked
        THEN aria-checked should be false`, async ({ page }) => {
    const d = await setup(page, "hero");

    // initial setup
    await d.getTrigger().click();
    await expect(d.getTrigger()).toHaveAttribute("aria-checked", "true");

    await d.getTrigger().click();
    await expect(d.getTrigger()).toHaveAttribute("aria-checked", "false");
  });

  test(`GIVEN a checkbox with a label
        WHEN rendered
        THEN the trigger should have a correct aria-labelledby attribute`, async ({
    page
  }) => {
    const d = await setup(page, "label");

    const triggerId = await d.getTrigger().getAttribute("id");
    expect(triggerId).toBeTruthy();
    await expect(d.getLabel()).toHaveAttribute("for", triggerId as string);
  });

  test(`GIVEN a checkbox with a label
        WHEN the label is clicked
        THEN the checkbox should become checked`, async ({ page }) => {
    const d = await setup(page, "label");

    await d.getLabel().click();
    await expect(d.getIndicator()).toBeVisible();
    await expect(d.getTrigger()).toHaveAttribute("aria-checked", "true");
  });

  test(`GIVEN a checkbox with a label that is initially checked
        WHEN the label is clicked
        THEN the checkbox should be unchecked`, async ({ page }) => {
    const d = await setup(page, "label");

    // initial setup
    await d.getLabel().click();
    await expect(d.getIndicator()).toBeVisible();

    await d.getLabel().click();
    await expect(d.getIndicator()).toBeHidden();
    await expect(d.getTrigger()).toHaveAttribute("aria-checked", "false");
  });

  test(`GIVEN a checkbox that is initially mixed
        WHEN the checkbox is rendered
        THEN the trigger should have aria-checked="mixed"`, async ({ page }) => {
    const d = await setup(page, "mixed-initial");

    // initial setup
    await expect(d.getTrigger()).toHaveAttribute("aria-checked", "mixed");
  });

  test(`GIVEN a checkbox that is initially mixed
    WHEN the checkbox is clicked
    THEN it should become checked`, async ({ page }) => {
    const d = await setup(page, "mixed-initial");

    await expect(d.getTrigger()).toHaveAttribute("aria-checked", "mixed");

    await d.getTrigger().click();
    await expect(d.getTrigger()).toHaveAttribute("aria-checked", "true");
    await expect(d.getIndicator()).toBeVisible();
  });

  test(`GIVEN a checkbox that was mixed and is now checked
        WHEN the checkbox is clicked again
        THEN it should become unchecked`, async ({ page }) => {
    const d = await setup(page, "mixed-initial");

    // Get to checked state first
    await d.getTrigger().click();
    await expect(d.getTrigger()).toHaveAttribute("aria-checked", "true");

    // Now click again
    await d.getTrigger().click();
    await expect(d.getTrigger()).toHaveAttribute("aria-checked", "false");
    await expect(d.getIndicator()).toBeHidden();
  });
});

test.describe("forms", () => {
  test(`GIVEN a checkbox inside a form
        WHEN the checkbox is rendered
        THEN there should be a hidden input
    `, async ({ page }) => {
    const d = await setup(page, "form");

    await expect(d.getHiddenInput()).toBeVisible();
  });

  test(`GIVEN a checkbox inside a form
        WHEN the checkbox is checked
        THEN the hidden input should be checked
`, async ({ page }) => {
    const d = await setup(page, "form");

    await d.getTrigger().click();
    await expect(d.getHiddenInput()).toBeChecked();
  });

  test(`GIVEN a checkbox inside a form that is initially checked
        WHEN the checkbox is checked
        THEN the hidden input should be unchecked
`, async ({ page }) => {
    const d = await setup(page, "form");

    // initial setup
    await d.getTrigger().click();
    await expect(d.getHiddenInput()).toBeChecked();

    await d.getTrigger().click();
    await expect(d.getHiddenInput()).not.toBeChecked();
  });
});
