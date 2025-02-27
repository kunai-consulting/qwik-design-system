import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./toast.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/toast/${exampleName}`);
  const driver = createTestDriver(page);
  return driver;
}

test.describe("critical functionality", () => {
  test(`GIVEN a toast
        WHEN it is initially rendered
        THEN it should be hidden`, async ({ page }) => {
    const d = await setup(page, "hero");
    await expect(d.getRoot()).toHaveAttribute("data-state", "hidden");
  });

  test(`GIVEN a toast
        WHEN the show button is clicked
        THEN it should become visible`, async ({ page }) => {
    const d = await setup(page, "hero");
    await page.click("button");
    await expect(d.getRoot()).toHaveAttribute("data-state", "visible");
  });

  test(`GIVEN a visible toast
        WHEN duration time passes
        THEN it should auto-hide`, async ({ page }) => {
    const d = await setup(page, "hero");
    await page.click("button");
    await expect(d.getRoot()).toHaveAttribute("data-state", "visible");
    await page.waitForTimeout(3100); // + 100ms buffer
    await expect(d.getRoot()).toHaveAttribute("data-state", "hidden");
  });
});

test.describe("positioning", () => {
  const positions = [
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
    "top-center",
    "bottom-center"
  ] as const;

  for (const position of positions) {
    test(`GIVEN a toast with position="${position}"
          WHEN it is visible
          THEN it should be correctly positioned`, async ({ page }) => {
      const d = await setup(page, `${position}-test`);
      await page.click("button");

      const box = await d.getBoundingBox();
      if (!box) throw new Error("Could not get toast position");

      const viewport = page.viewportSize();
      if (!viewport) throw new Error("Could not get viewport size");

      switch (position) {
        case "top-left":
          expect(box.x).toBeLessThan(viewport.width / 2);
          expect(box.y).toBeLessThan(viewport.height / 2);
          break;
        case "top-right":
          expect(box.x).toBeGreaterThan(viewport.width / 2);
          expect(box.y).toBeLessThan(viewport.height / 2);
          break;
        case "bottom-left":
          expect(box.x).toBeLessThan(viewport.width / 2);
          expect(box.y).toBeGreaterThan(viewport.height / 2);
          break;
        case "bottom-right":
          expect(box.x).toBeGreaterThan(viewport.width / 2);
          expect(box.y).toBeGreaterThan(viewport.height / 2);
          break;
        case "top-center":
          expect(box.x + box.width / 2).toBeCloseTo(viewport.width / 2, -1);
          expect(box.y).toBeLessThan(viewport.height / 2);
          break;
        case "bottom-center":
          expect(box.x + box.width / 2).toBeCloseTo(viewport.width / 2, -1);
          expect(box.y).toBeGreaterThan(viewport.height / 2);
          break;
      }
    });
  }
});

test.describe("multiple toasts", () => {
  test(`GIVEN multiple toasts
        WHEN they are shown simultaneously
        THEN each should work independently`, async ({ page }) => {
    const d = await setup(page, "multiple-test");

    const toast1 = page.locator("[data-qds-toast-root]#toast1");
    const toast2 = page.locator("[data-qds-toast-root]#toast2");

    await page.click("#toast1-trigger");
    await expect(toast1).toHaveAttribute("data-state", "visible");
    await expect(toast2).toHaveAttribute("data-state", "hidden");

    await page.click("#toast2-trigger");
    await expect(toast1).toHaveAttribute("data-state", "visible");
    await expect(toast2).toHaveAttribute("data-state", "visible");

    await page.waitForTimeout(3200);
    await expect(toast1).toHaveAttribute("data-state", "hidden");
    await expect(toast2).toHaveAttribute("data-state", "hidden");
  });
});

test.describe("bind:open functionality", () => {
  test(`GIVEN a toast with bind:open
        WHEN the bound signal changes
        THEN toast visibility should update accordingly`, async ({ page }) => {
    const d = await setup(page, "bind-test");

    await expect(d.getRoot()).toHaveAttribute("data-state", "hidden");

    await page.click("#show-button");
    await expect(d.getRoot()).toHaveAttribute("data-state", "visible");

    await page.click("#hide-button");
    await expect(d.getRoot()).toHaveAttribute("data-state", "hidden");
  });
});
