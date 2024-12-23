import { expect, test, type Page } from "@playwright/test";
import { createTestDriver } from "./scroll-area.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/scroll-area/${exampleName}`);

  const driver = createTestDriver(page);

  return driver;
}

test.describe("critical functionality", () => {
  test(`GIVEN a scroll area
        WHEN content exceeds viewport height
        THEN vertical scrollbar should be visible`, async ({ page }) => {
    const d = await setup(page, "vertical-test");
    await expect(d.getVerticalScrollbar()).toBeVisible();
  });

  test(`GIVEN a scroll area
        WHEN content exceeds viewport width
        THEN horizontal scrollbar should be visible`, async ({ page }) => {
    const d = await setup(page, "horizontal-test");
    await expect(d.getHorizontalScrollbar()).toBeVisible();
  });

  test(`GIVEN a scroll area with vertical content
        WHEN scrolling to bottom
        THEN thumb should move to bottom position`, async ({ page }) => {
    const d = await setup(page, "vertical-test");
    const viewport = d.getViewport();

    // Scroll to bottom
    await viewport.evaluate(el => {
      el.scrollTop = el.scrollHeight;
    });

    // Wait for scroll to complete and thumb to update position
    await page.waitForTimeout(100);

    // Verify thumb position
    const thumb = d.getVerticalThumb();
    await expect(thumb).toBeVisible();

    // Check if thumb is at bottom position
    const scrollbar = d.getVerticalScrollbar();
    const thumbBox = await thumb.boundingBox();
    const scrollbarBox = await scrollbar.boundingBox();

    // Calculate expected bottom position considering padding
    const expectedBottom = scrollbarBox!.y + scrollbarBox!.height ;
    const actualBottom = thumbBox!.y + thumbBox!.height - 2; // 2px for padding

    expect(actualBottom).toBeCloseTo(expectedBottom, 1);
  });
});

test.describe("drag functionality", () => {
  test(`GIVEN a scroll area
        WHEN dragging the vertical thumb
        THEN content should scroll accordingly`, async ({ page }) => {
    const d = await setup(page, "vertical-test");
    const thumb = d.getVerticalThumb();
    const viewport = d.getViewport();

    // Get initial scroll position
    const initialScrollTop = await viewport.evaluate(el => el.scrollTop);

    // Get thumb position
    const thumbBox = await thumb.boundingBox();
    if (!thumbBox) throw new Error('Could not get thumb position');

    // Simulate drag operation
    // Start at the center of the thumb
    await page.mouse.move(
      thumbBox.x + thumbBox.width / 2,
      thumbBox.y + thumbBox.height / 2
    );
    await page.mouse.down();

    // Move mouse down by 100px
    await page.mouse.move(
      thumbBox.x + thumbBox.width / 2,
      thumbBox.y + thumbBox.height / 2 + 100,
      { steps: 10 } // Make movement smoother
    );

    await page.mouse.up();

    // Wait for scrolling to complete
    await page.waitForTimeout(100);

    // Verify new scroll position
    const newScrollTop = await viewport.evaluate(el => el.scrollTop);
    expect(newScrollTop).toBeGreaterThan(initialScrollTop);
  });

  test(`GIVEN a scroll area
      WHEN dragging the horizontal thumb
      THEN content should scroll accordingly`, async ({ page }) => {
    const d = await setup(page, "horizontal-test");
    const thumb = d.getHorizontalThumb();
    const viewport = d.getViewport();

    // Get initial scroll position
    const initialScrollLeft = await viewport.evaluate(el => el.scrollLeft);

    // Get thumb position
    const thumbBox = await thumb.boundingBox();
    if (!thumbBox) throw new Error('Could not get thumb position');

    // Simulate drag operation
    // Start at the center of the thumb
    await page.mouse.move(
      thumbBox.x + thumbBox.width / 2,
      thumbBox.y + thumbBox.height / 2
    );
    await page.mouse.down();

    // Move mouse right by 100px
    await page.mouse.move(
      thumbBox.x + thumbBox.width / 2 + 100,
      thumbBox.y + thumbBox.height / 2,
      { steps: 10 } // Make movement smoother
    );

    await page.mouse.up();

    // Wait for scrolling to complete
    await page.waitForTimeout(100);

    // Verify new scroll position
    const newScrollLeft = await viewport.evaluate(el => el.scrollLeft);
    expect(newScrollLeft).toBeGreaterThan(initialScrollLeft);
  });
});

test.describe("thumb behavior", () => {
  test(`GIVEN a scroll area
      WHEN thumb is being dragged
      THEN it should have dragging state`, async ({ page }) => {
    const d = await setup(page, "vertical-test");
    const thumb = d.getVerticalThumb();

    // Get thumb position
    const thumbBox = await thumb.boundingBox();
    if (!thumbBox) throw new Error('Could not get thumb position');

    // Move to center of thumb and click
    await page.mouse.move(
      thumbBox.x + thumbBox.width / 2,
      thumbBox.y + thumbBox.height / 2
    );
    await page.mouse.down();

    // Wait for drag state to update
    await page.waitForTimeout(50);

    await expect(thumb).toHaveAttribute('data-dragging', '');

    // Cleanup
    await page.mouse.up();
  });

  test(`GIVEN a scroll area
        WHEN clicking on scrollbar track
        THEN viewport should scroll to that position`, async ({ page }) => {
    const d = await setup(page, "vertical-test");
    const scrollbar = d.getVerticalScrollbar();
    const viewport = d.getViewport();

    // Get initial scroll position
    const initialScrollTop = await viewport.evaluate(el => el.scrollTop);

    // Get scrollbar position
    const box = await scrollbar.boundingBox();
    if (!box) throw new Error('Could not get scrollbar position');

    // Click in the middle of the scrollbar, but account for padding
    await page.mouse.click(
      box.x + box.width / 2,
      box.y + box.height / 2
    );

    // Wait for scroll to complete
    await page.waitForTimeout(50);

    // Verify new scroll position
    const newScrollTop = await viewport.evaluate(el => el.scrollTop);
    expect(newScrollTop).toBeGreaterThan(initialScrollTop);
  });
});

test.describe("a11y", () => {
  test(`GIVEN a scroll area
        WHEN scrolling
        THEN native keyboard shortcuts should work`, async ({ page }) => {
    const d = await setup(page, "vertical-test");
    const viewport = d.getViewport();

    // Focus the viewport
    await viewport.focus();

    // Test various keyboard shortcuts
    const shortcuts = ['PageDown', 'PageUp', 'Home', 'End'];
    for (const key of shortcuts) {
      const initialScrollTop = await viewport.evaluate(el => el.scrollTop);
      await page.keyboard.press(key);
      const newScrollTop = await viewport.evaluate(el => el.scrollTop);

      if (key === 'PageDown' || key === 'End') {
        expect(newScrollTop).toBeGreaterThanOrEqual(initialScrollTop);
      } else {
        expect(newScrollTop).toBeLessThanOrEqual(initialScrollTop);
      }
    }
  });
});

