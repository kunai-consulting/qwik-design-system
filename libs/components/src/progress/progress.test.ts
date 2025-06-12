import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./progress.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/progress/${exampleName}`);
  const driver = createTestDriver(page);
  return driver;
}

test.describe("Critical functionality", () => {
  test(`GIVEN a progress
        WHEN the progress is rendered
        THEN it should have root, label, track and indicator`, async ({ page }) => {
    const d = await setup(page, "hero");

    await expect(d.getRoot()).toBeVisible();
    await expect(d.getLabel()).toBeVisible();
    await expect(d.getTrack()).toBeVisible();
    await expect(d.getProgressIndicator()).toBeVisible();
  });

  test(`GIVEN a progress
        WHEN progress is not completed
        THEN it should have progress state loading`, async ({ page }) => {
    const d = await setup(page, "hero");

    await expect(d.getProgressIndicator()).toBeVisible();
    expect(await d.getProgressState()).toBe("loading");
    expect(await d.getProgressValue()).toBe("30");
  });

  test(`GIVEN a progress
        WHEN progress is null
        THEN it should have progress state indeterminate`, async ({ page }) => {
    const d = await setup(page, "indeterminate");

    await expect(d.getProgressIndicator()).toBeVisible();
    expect(await d.getProgressState()).toBe("indeterminate");
  });

  test(`GIVEN a progress
        WHEN progress is 100%
        THEN it should have progress state complete`, async ({ page }) => {
    const d = await setup(page, "complete");

    await expect(d.getProgressIndicator()).toBeVisible();
    expect(await d.getProgressState()).toBe("complete");
  });
});

test.describe("State", () => {
  test(`GIVEN a progress
        WHEN the value is 30
        THEN it should be 30% complete`, async ({ page }) => {
    const d = await setup(page, "hero");

    await expect(d.getRoot()).toBeVisible();
    await expect(d.getRoot()).toHaveAttribute("aria-valuetext", "30%");
  });

  test(`GIVEN a progress
        WHEN the value is 20 and the max is 25
        THEN it should be 80% complete`, async ({ page }) => {
    const d = await setup(page, "max");

    await expect(d.getRoot()).toBeVisible();
    await expect(d.getRoot()).toHaveAttribute("aria-valuetext", "80%");
  });

  test(`GIVEN a progress with the value of 5000
        WHEN the min is 2000 and the max is 10000
        THEN it should be 38% complete`, async ({ page }) => {
    const d = await setup(page, "min");

    await expect(d.getRoot()).toBeVisible();
    await expect(d.getRoot()).toHaveAttribute("aria-valuetext", "38%");
  });

  test(`GIVEN a progress with the value of 30
        WHEN the value is reactively changed to 70
        THEN it should be 70% complete`, async ({ page }) => {
    const d = await setup(page, "reactive");

    await expect(d.getRoot()).toHaveAttribute("aria-valuetext", "30%");

    await page.locator("button").click();

    await expect(d.getRoot()).toBeVisible();
    await expect(d.getRoot()).toHaveAttribute("aria-valuetext", "70%");
  });
});

test.describe("A11y", () => {
  test(`GIVEN a progress
        WHEN the progress is rendered
        THEN it should have aria-valuemin attribute`, async ({ page }) => {
    const d = await setup(page, "hero");
    await expect(d.getRoot()).toHaveAttribute("aria-valuemin", "0");
  });

  test(`GIVEN a progress
        WHEN the progress is rendered
        THEN it should have aria-valuemax attribute`, async ({ page }) => {
    const d = await setup(page, "hero");
    await expect(d.getRoot()).toHaveAttribute("aria-valuemax", "100");
  });

  test(`GIVEN a progress
        WHEN the progress is rendered
        THEN it should have aria-valuenow attribute`, async ({ page }) => {
    const d = await setup(page, "hero");
    await expect(d.getRoot()).toHaveAttribute("aria-valuenow", "30");
  });

  test(`GIVEN a progress
        WHEN the progress is rendered
        THEN it should have aria-valuetext attribute`, async ({ page }) => {
    const d = await setup(page, "hero");
    await expect(d.getRoot()).toHaveAttribute("aria-valuetext", "30%");
  });
});

test.describe("Component Structure", () => {
  test(`GIVEN a progress with label
        WHEN the progress is rendered
        THEN the label should contain expected text`, async ({ page }) => {
    const d = await setup(page, "hero");
    await expect(d.getLabel()).toContainText("Export data 30%");
  });

  test(`GIVEN a progress with track
        WHEN the progress is rendered
        THEN the track should contain the indicator`, async ({ page }) => {
    const d = await setup(page, "hero");
    await expect(d.getTrack()).toBeVisible();
    await expect(d.getTrack().locator("[data-qds-progress-indicator]")).toBeVisible();
  });

  test(`GIVEN a progress components
        WHEN the progress is rendered
        THEN all components should have proper data attributes`, async ({ page }) => {
    const d = await setup(page, "hero");
    await expect(d.getRoot()).toHaveAttribute("data-qds-progress-root");
    await expect(d.getLabel()).toHaveAttribute("data-qds-progress-label");
    await expect(d.getTrack()).toHaveAttribute("data-qds-progress-track");
    await expect(d.getProgressIndicator()).toHaveAttribute("data-qds-progress-indicator");
  });
});
