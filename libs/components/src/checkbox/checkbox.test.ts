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
});
