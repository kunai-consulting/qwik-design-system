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
        THEN SVG should be visible`, async ({ page }) => {
    const d = await setup(page, "base");
    await expect(d.getSvg()).toBeVisible();
  });

  test(`GIVEN a QR code component
        WHEN it is rendered
        THEN it should have correct size`, async ({ page }) => {
    const d = await setup(page, "base");
    const svg = d.getSvg();

    // Check if canvas size matches the specified size
    await expect(svg).toHaveAttribute('width', '200');
    await expect(svg).toHaveAttribute('height', '200');
  });

  test(`GIVEN a QR code component
        WHEN checking the rendered QR code
        THEN it should have path with QR code data`, async ({ page }) => {
    const d = await setup(page, "base");

    const path = d.getPath();
    await expect(path).toBeVisible();
    await expect(path).toHaveAttribute("d");
    await expect(path).toHaveAttribute("fill", "black");
  });
});

test.describe("overlay functionality", () => {
  test(`GIVEN a QR code with overlay
        WHEN it is rendered
        THEN overlay image should be present`, async ({ page }) => {
    const d = await setup(page, "overlay");
    const overlay = d.getOverlay();

    await expect(overlay).toBeVisible();
    await expect(overlay).toHaveAttribute("src");
    await expect(overlay).toHaveAttribute("width");
    await expect(overlay).toHaveAttribute("height");
  });

  test(`GIVEN a QR code with custom colors
        WHEN it is rendered
        THEN it should use the specified colors`, async ({ page }) => {
    const d = await setup(page, "overlay-custom-color");
    const frame = d.getFrame();

    await expect(frame).toHaveCSS("background-color", "rgb(255, 255, 0)");

    const path = d.getPath();
    await expect(path).toHaveAttribute("fill", "blue");
  });
});

test.describe("multiple instances", () => {
  test(`GIVEN multiple QR codes on the same page
        WHEN they are rendered
        THEN each should be visible and unique`, async ({ page }) => {
    const d = await setup(page, "multiple");
    const svgs = d.getAllSvgs();

    await expect(svgs).toHaveCount(2);

    const count = await svgs.count();
    for (let i = 0; i < count; i++) {
      await expect(svgs.nth(i)).toBeVisible();
    }

    const firstQR = await svgs.first().screenshot();
    const lastQR = await svgs.last().screenshot();
    expect(firstQR).not.toEqual(lastQR);
  });
});

test.describe("a11y", () => {
  test(`GIVEN a QR code component
        WHEN checking accessibility
        THEN it should have proper ARIA attributes`, async ({ page }) => {
    const d = await setup(page, "base");
    const root = d.getRoot();
    const svg = d.getSvg();

    // Check for proper ARIA role
    await expect(root).toHaveAttribute("role", "img");

    // Check for proper ARIA label
    await expect(root).toHaveAttribute("aria-label");
    await expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});
