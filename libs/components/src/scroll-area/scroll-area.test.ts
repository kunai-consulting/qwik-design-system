import { type Page, expect, test } from "@playwright/test";
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
    await viewport.evaluate((el) => {
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

    if (!thumbBox) return;
    if (!scrollbarBox) return;

    // Calculate expected bottom position considering padding
    const expectedBottom = scrollbarBox.y + scrollbarBox.height;
    const actualBottom = thumbBox.y + thumbBox.height - 2; // 2px for padding

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
    const initialScrollTop = await viewport.evaluate((el) => el.scrollTop);

    // Get thumb position
    const thumbBox = await thumb.boundingBox();
    if (!thumbBox) throw new Error("Could not get thumb position");

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
    const newScrollTop = await viewport.evaluate((el) => el.scrollTop);
    expect(newScrollTop).toBeGreaterThan(initialScrollTop);
  });

  test(`GIVEN a scroll area
      WHEN dragging the horizontal thumb
      THEN content should scroll accordingly`, async ({ page }) => {
    const d = await setup(page, "horizontal-test");
    const thumb = d.getHorizontalThumb();
    const viewport = d.getViewport();

    // Get initial scroll position
    const initialScrollLeft = await viewport.evaluate((el) => el.scrollLeft);

    // Get thumb position
    const thumbBox = await thumb.boundingBox();
    if (!thumbBox) throw new Error("Could not get thumb position");

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
    const newScrollLeft = await viewport.evaluate((el) => el.scrollLeft);
    expect(newScrollLeft).toBeGreaterThan(initialScrollLeft);
  });

  test(`GIVEN a scroll area with both scrollbars
        WHEN dragging the vertical thumb outside scrollbar bounds
        THEN thumb should move smoothly without jumps`, async ({ page }) => {
    const d = await setup(page, "both-test");
    const thumb = d.getVerticalThumb();
    const viewport = d.getViewport();

    // Get initial positions
    const initialScrollTop = await viewport.evaluate((el) => el.scrollTop);
    const initialThumbBox = await thumb.boundingBox();
    if (!initialThumbBox) throw new Error("Could not get thumb position");

    // Start drag from thumb center
    await page.mouse.move(
      initialThumbBox.x + initialThumbBox.width / 2,
      initialThumbBox.y + initialThumbBox.height / 2
    );
    await page.mouse.down();

    // Move mouse outside scrollbar bounds
    await page.mouse.move(
      initialThumbBox.x + initialThumbBox.width * 2, // Move far right
      initialThumbBox.y + initialThumbBox.height / 2 + 100, // Move down
      { steps: 10 }
    );

    // Get new positions
    const newScrollTop = await viewport.evaluate((el) => el.scrollTop);
    const newThumbBox = await thumb.boundingBox();
    if (!newThumbBox) throw new Error("Could not get new thumb position");

    // Verify scroll position changed
    expect(newScrollTop).toBeGreaterThan(initialScrollTop);

    // Verify thumb stayed within scrollbar bounds
    const scrollbar = d.getVerticalScrollbar();
    const scrollbarBox = await scrollbar.boundingBox();
    if (!scrollbarBox) throw new Error("Could not get scrollbar bounds");

    expect(newThumbBox.x).toBeCloseTo(initialThumbBox.x, 0); // X position shouldn't change
    expect(newThumbBox.y).toBeGreaterThanOrEqual(scrollbarBox.y); // Should stay within top bound
    expect(newThumbBox.y + newThumbBox.height).toBeLessThanOrEqual(
      scrollbarBox.y + scrollbarBox.height
    ); // Should stay within bottom bound

    await page.mouse.up();
  });

  test(`GIVEN a scroll area with both scrollbars
        WHEN dragging the horizontal thumb outside scrollbar bounds
        THEN thumb should move smoothly without jumps`, async ({ page }) => {
    const d = await setup(page, "both-test");
    const thumb = d.getHorizontalThumb();
    const viewport = d.getViewport();

    // Get initial positions
    const initialScrollLeft = await viewport.evaluate((el) => el.scrollLeft);
    const initialThumbBox = await thumb.boundingBox();
    if (!initialThumbBox) throw new Error("Could not get thumb position");

    // Start drag from thumb center
    await page.mouse.move(
      initialThumbBox.x + initialThumbBox.width / 2,
      initialThumbBox.y + initialThumbBox.height / 2
    );
    await page.mouse.down();

    // Move mouse outside scrollbar bounds
    await page.mouse.move(
      initialThumbBox.x + initialThumbBox.width / 2 + 100, // Move right
      initialThumbBox.y + initialThumbBox.height * 2, // Move far down
      { steps: 10 }
    );

    // Get new positions
    const newScrollLeft = await viewport.evaluate((el) => el.scrollLeft);
    const newThumbBox = await thumb.boundingBox();
    if (!newThumbBox) throw new Error("Could not get new thumb position");

    // Verify scroll position changed
    expect(newScrollLeft).toBeGreaterThan(initialScrollLeft);

    // Verify thumb stayed within scrollbar bounds
    const scrollbar = d.getHorizontalScrollbar();
    const scrollbarBox = await scrollbar.boundingBox();
    if (!scrollbarBox) throw new Error("Could not get scrollbar bounds");

    expect(newThumbBox.y).toBeCloseTo(initialThumbBox.y, 0); // Y position shouldn't change
    expect(newThumbBox.x).toBeGreaterThanOrEqual(scrollbarBox.x); // Should stay within left bound
    expect(newThumbBox.x + newThumbBox.width).toBeLessThanOrEqual(
      scrollbarBox.x + scrollbarBox.width
    ); // Should stay within right bound

    await page.mouse.up();
  });

  test(`GIVEN a scroll area with both scrollbars
        WHEN dragging is active
        THEN thumb should maintain its drag state`, async ({ page }) => {
    const d = await setup(page, "both-test");
    const verticalThumb = d.getVerticalThumb();
    const horizontalThumb = d.getHorizontalThumb();

    // Test vertical thumb
    const verticalThumbBox = await verticalThumb.boundingBox();
    if (!verticalThumbBox) throw new Error("Could not get vertical thumb position");

    await page.mouse.move(
      verticalThumbBox.x + verticalThumbBox.width / 2,
      verticalThumbBox.y + verticalThumbBox.height / 2
    );
    await page.mouse.down();

    // Move outside bounds
    await page.mouse.move(verticalThumbBox.x + 100, verticalThumbBox.y + 100);

    // Verify drag state maintained
    await expect(verticalThumb).toHaveAttribute("data-dragging", "");

    await page.mouse.up();

    // Test horizontal thumb
    const horizontalThumbBox = await horizontalThumb.boundingBox();
    if (!horizontalThumbBox) throw new Error("Could not get horizontal thumb position");

    await page.mouse.move(
      horizontalThumbBox.x + horizontalThumbBox.width / 2,
      horizontalThumbBox.y + horizontalThumbBox.height / 2
    );
    await page.mouse.down();

    // Move outside bounds
    await page.mouse.move(horizontalThumbBox.x + 100, horizontalThumbBox.y + 100);

    // Verify drag state maintained
    await expect(horizontalThumb).toHaveAttribute("data-dragging", "");

    await page.mouse.up();
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
    if (!thumbBox) throw new Error("Could not get thumb position");

    // Move to center of thumb and click
    await page.mouse.move(
      thumbBox.x + thumbBox.width / 2,
      thumbBox.y + thumbBox.height / 2
    );
    await page.mouse.down();

    // Wait for drag state to update
    await page.waitForTimeout(50);

    await expect(thumb).toHaveAttribute("data-dragging", "");

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
    const initialScrollTop = await viewport.evaluate((el) => el.scrollTop);

    // Get scrollbar position
    const box = await scrollbar.boundingBox();
    if (!box) throw new Error("Could not get scrollbar position");

    // Click in the middle of the scrollbar, but account for padding
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

    // Wait for scroll to complete
    await page.waitForTimeout(50);

    // Verify new scroll position
    const newScrollTop = await viewport.evaluate((el) => el.scrollTop);
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
    const shortcuts = ["PageDown", "PageUp", "Home", "End"];
    for (const key of shortcuts) {
      const initialScrollTop = await viewport.evaluate((el) => el.scrollTop);
      await page.keyboard.press(key);
      const newScrollTop = await viewport.evaluate((el) => el.scrollTop);

      if (key === "PageDown" || key === "End") {
        expect(newScrollTop).toBeGreaterThanOrEqual(initialScrollTop);
      } else {
        expect(newScrollTop).toBeLessThanOrEqual(initialScrollTop);
      }
    }
  });

  test(`GIVEN a scroll area
        WHEN checking viewport attributes
        THEN it should have proper accessibility attributes`, async ({ page }) => {
    const d = await setup(page, "vertical-test");
    const viewport = d.getViewport();

    // Check required accessibility attributes
    await expect(viewport).toHaveAttribute("tabindex", "0");
    await expect(viewport).toHaveAttribute("role", "region");
    await expect(viewport).toHaveAttribute("aria-label");
  });

  test(`GIVEN a scroll area
        WHEN focusing the viewport
        THEN it should be focusable`, async ({ page }) => {
    const d = await setup(page, "vertical-test");
    const viewport = d.getViewport();

    // Try to focus the viewport
    await viewport.focus();

    // Check if viewport is focused
    const isFocused = await viewport.evaluate((el) => document.activeElement === el);
    expect(isFocused).toBe(true);
  });

  test(`GIVEN a scroll area
        WHEN tabbing through the page
        THEN viewport should be in the tab order`, async ({ page }) => {
    const d = await setup(page, "vertical-test");
    const viewport = d.getViewport();

    // Start from the beginning of the page
    await page.keyboard.press("Tab");

    // Check if viewport becomes focused
    const isFocused = await viewport.evaluate((el) => document.activeElement === el);
    expect(isFocused).toBe(true);
  });
});
