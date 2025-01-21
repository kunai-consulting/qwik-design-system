import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./qr-code.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/qr-code/${exampleName}`);
  const driver = createTestDriver(page);
  return driver;
}

test.describe("critical functionality", () => {
  test(`GIVEN a QR code component
        WHEN it is rendered
        THEN canvas should be visible`, async ({ page }) => {
    const d = await setup(page, "base");
    await expect(d.getCanvas()).toBeVisible();
  });

  test(`GIVEN a QR code component
        WHEN it is rendered
        THEN it should have correct size`, async ({ page }) => {
    const d = await setup(page, "base");
    const canvas = d.getCanvas();

    // Check if canvas size matches the specified size
    const size = 200; // default size
    const box = await canvas.boundingBox();
    expect(box?.width).toBe(size);
    expect(box?.height).toBe(size);
  });

  test(`GIVEN a QR code component
        WHEN checking the rendered QR code
        THEN it should have both black and white pixels`, async ({ page }) => {
    const d = await setup(page, "base");

    // Check center pixel (should be white for background)
    const centerColor = await d.getCanvasPixelColor(100, 100);
    expect(centerColor).toBe("rgb(255, 255, 255)");

    // Check corner pixel (should be black for QR code)
    const cornerColor = await d.getCanvasPixelColor(50, 50);
    expect(cornerColor).toBe("rgb(0, 0, 0)");
  });
});

test.describe("overlay functionality", () => {
  test(`GIVEN a QR code with overlay
        WHEN it is rendered
        THEN overlay should be visible in the center`, async ({ page }) => {
    const d = await setup(page, "overlay");

    // Wait for overlay to be rendered
    await page.waitForTimeout(100);

    // Check center pixel (should be white for overlay background)
    const centerColor = await d.getCanvasPixelColor(100, 100);
    expect(centerColor).toBe("rgb(181, 126, 252)");
  });

  test(`GIVEN a QR code with overlay
        WHEN overlay image fails to load
        THEN QR code should still be visible`, async ({ page }) => {
    const d = await setup(page, "overlay");

    // Force image load error
    await page.route("**/*.svg", (route) => route.abort());

    // Check if QR code is still visible
    const canvas = d.getCanvas();
    await expect(canvas).toBeVisible();

    // Check if QR code pixels are present
    const cornerColor = await d.getCanvasPixelColor(50, 50);
    expect(cornerColor).toBe("rgb(0, 0, 0)");
  });
});

test.describe("multiple instances", () => {
  test.describe("multiple instances", () => {
    test(`GIVEN multiple QR codes on the same page
        WHEN they are rendered
        THEN each should be visible and unique`, async ({ page }) => {
      const d = await setup(page, "multiple");

      // Get all canvases using driver
      const canvases = d.getAllCanvases();

      // Wait for canvases to be rendered
      await page.waitForTimeout(100);

      // Check if we have exactly 3 canvases
      await expect(canvases).toHaveCount(2);

      // Check if each canvas is visible
      const count = await canvases.count();
      for (let i = 0; i < count; i++) {
        await expect(canvases.nth(i)).toBeVisible();

        const centerPixel = await d.getCanvasPixelColor(100, 100);
        expect(centerPixel).toBeDefined();
      }

      const firstQR = await canvases.first().screenshot();
      const lastQR = await canvases.last().screenshot();
      expect(firstQR).not.toEqual(lastQR);
    });
  });
});

test.describe("a11y", () => {
  test(`GIVEN a QR code component
        WHEN checking accessibility
        THEN it should have proper ARIA attributes`, async ({ page }) => {
    const d = await setup(page, "base");
    const root = d.getRoot();

    // Check for proper ARIA role
    await expect(root).toHaveAttribute("role", "img");

    // Check for proper ARIA label
    await expect(root).toHaveAttribute("aria-label");
  });
});
