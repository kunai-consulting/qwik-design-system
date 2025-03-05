import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./slider.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/slider/${exampleName}`);
  const driver = createTestDriver(page);
  return driver;
}

test.describe("critical functionality", () => {
  test(`GIVEN a Slider component in single mode
        WHEN it is rendered
        THEN all basic elements should be present in DOM`, async ({ page }) => {
    const d = await setup(page, "hero");

    await expect(d.getRoot()).toBeAttached();
    await expect(d.getTrack()).toBeAttached();
    await expect(d.getRange()).toBeAttached();
    await expect(d.getThumb()).toBeAttached();
  });

  test(`GIVEN a Slider component in range mode
        WHEN it is rendered
        THEN it should have two thumbs`, async ({ page }) => {
    const d = await setup(page, "range");
    const thumbs = d.getAllThumbs();
    await expect(thumbs).toHaveCount(2);
    await expect(d.getThumb("start")).toBeVisible();
    await expect(d.getThumb("end")).toBeVisible();
  });

  test(`GIVEN a Slider in single mode
        WHEN clicking on the track
        THEN the value should update`, async ({ page }) => {
    const d = await setup(page, "hero");
    await page.waitForTimeout(100);
    const track = d.getTrack();
    const thumb = d.getThumb();

    const trackBounds = await track.boundingBox();
    if (!trackBounds) throw new Error("Track not found");

    // Click in the middle of the track
    await page.mouse.click(
      trackBounds.x + trackBounds.width / 2,
      trackBounds.y + trackBounds.height / 2
    );

    await page.waitForTimeout(100);
    // Check if thumb moved to ~50%
    const thumbBounds = await thumb.boundingBox();
    if (!thumbBounds) throw new Error("Thumb not found");

    await expect(thumb).toHaveAttribute("aria-valuenow", "50");
  });
});

test.describe("tooltip functionality", () => {
  test(`GIVEN a Slider with tooltip
        WHEN hovering over thumb
        THEN tooltip should be visible`, async ({ page }) => {
    const d = await setup(page, "hero");
    const thumb = d.getThumb();
    const tooltip = d.getTooltip();

    await thumb.hover();
    await expect(tooltip).toBeVisible();
  });
});

test.describe("marks functionality", () => {
  test(`GIVEN a Slider with marks
        WHEN it is rendered
        THEN marks should be visible`, async ({ page }) => {
    const d = await setup(page, "marks");
    const marks = d.getMarks();
    await expect(marks).toHaveCount(6);
    await expect(marks.first()).toBeVisible();
  });
});

test.describe("keyboard navigation", () => {
  test(`GIVEN a Slider
      WHEN using arrow keys
      THEN value should change accordingly`, async ({ page }) => {
    const d = await setup(page, "callbacks");
    const thumb = d.getThumb();
    await page.waitForTimeout(100);

    const messages: { type: string; value: number }[] = [];

    page.on("console", (msg) => {
      const text = msg.text();
      if (text.startsWith("Value changed:")) {
        messages.push({
          type: "change",
          value: Number(text.split(":")[1].trim())
        });
      }
    });

    const initialValue = Number(await thumb.getAttribute("aria-valuenow"));
    expect(initialValue).toBe(0);

    await thumb.focus();
    await page.keyboard.press("ArrowRight");

    await page.waitForTimeout(200);

    expect(messages.length).toBeGreaterThan(0);

    const lastValue = messages[messages.length - 1].value;
    expect(lastValue).toBe(initialValue + 1);

    await expect(thumb).toHaveAttribute("aria-valuenow", String(lastValue));

    messages.length = 0;
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(100);

    const finalMessages = messages.filter((m) => m.type === "change");
    expect(finalMessages.length).toBeGreaterThan(0);
    expect(finalMessages[finalMessages.length - 1].value).toBe(initialValue);
  });

  test(`GIVEN a Slider
        WHEN using arrow keys with shift
        THEN value should change by larger step`, async ({ page }) => {
    const d = await setup(page, "hero");
    const thumb = d.getThumb();

    await thumb.focus();
    const valueBefore = Number(await thumb.getAttribute("aria-valuenow"));

    await page.keyboard.down("Shift");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.up("Shift");

    await expect(thumb).toHaveAttribute("aria-valuenow", String(valueBefore + 10));
  });

  test(`GIVEN a Slider
        WHEN using Home/End keys
        THEN value should go to min/max`, async ({ page }) => {
    const d = await setup(page, "hero");
    const thumb = d.getThumb();

    await thumb.focus();

    await page.keyboard.press("End");
    await expect(thumb).toHaveAttribute("aria-valuenow", "100");

    await page.keyboard.press("Home");
    await expect(thumb).toHaveAttribute("aria-valuenow", "0");
  });
});

test.describe("a11y", () => {
  test(`GIVEN a Slider component
        WHEN checking accessibility
        THEN it should have proper ARIA attributes`, async ({ page }) => {
    const d = await setup(page, "hero");
    const root = d.getRoot();
    const thumb = d.getThumb();

    await expect(root).toHaveAttribute("role", "slider");
    await expect(thumb).toHaveAttribute("aria-valuemin");
    await expect(thumb).toHaveAttribute("aria-valuemax");
    await expect(thumb).toHaveAttribute("aria-valuenow");
  });
});

test.describe("callbacks", () => {
  test(`GIVEN a Slider
        WHEN clicking on track
        THEN both callbacks should fire once`, async ({ page }) => {
    const d = await setup(page, "callbacks");
    const track = d.getTrack();

    await page.waitForTimeout(100);

    const messages: { type: string; value: number }[] = [];

    page.on("console", (msg) => {
      const text = msg.text();
      if (text.startsWith("Value changed:")) {
        messages.push({
          type: "change",
          value: Number(text.split(":")[1].trim())
        });
      }
      if (text.startsWith("Final value:")) {
        messages.push({
          type: "end",
          value: Number(text.split(":")[1].trim())
        });
      }
    });

    const trackBounds = await track.boundingBox();
    if (!trackBounds) throw new Error("Track not found");

    await page.mouse.click(
      trackBounds.x + trackBounds.width * 0.75,
      trackBounds.y + trackBounds.height / 2
    );

    await page.waitForTimeout(200);

    const changeMessages = messages.filter((m) => m.type === "change");
    const endMessages = messages.filter((m) => m.type === "end");

    expect(changeMessages).toHaveLength(1);
    expect(endMessages).toHaveLength(1);
    expect(changeMessages[0].value).toBeCloseTo(75, 0);
    expect(endMessages[0].value).toBeCloseTo(75, 0);
  });

  test(`GIVEN a Slider
      WHEN dragging thumb
      THEN onValueChange should fire multiple times and onValueChangeEnd once`, async ({
    page
  }) => {
    const d = await setup(page, "callbacks");
    const thumb = d.getThumb();

    const messages: { type: string; value: number }[] = [];

    page.on("console", (msg) => {
      const text = msg.text();
      if (text.startsWith("Value changed:")) {
        messages.push({
          type: "change",
          value: Number(text.split(":")[1].trim())
        });
      }
      if (text.startsWith("Final value:")) {
        messages.push({
          type: "end",
          value: Number(text.split(":")[1].trim())
        });
      }
    });

    const thumbBounds = await thumb.boundingBox();
    if (!thumbBounds) throw new Error("Thumb not found");

    await page.mouse.move(
      thumbBounds.x + thumbBounds.width / 2,
      thumbBounds.y + thumbBounds.height / 2
    );
    await page.mouse.down();

    for (let i = 1; i <= 3; i++) {
      await page.mouse.move(
        thumbBounds.x + i * 30,
        thumbBounds.y + thumbBounds.height / 2,
        { steps: 5 }
      );
      await page.waitForTimeout(50);
    }

    await page.mouse.up();

    await page.waitForTimeout(100);

    const changeMessages = messages.filter((m) => m.type === "change");
    const endMessages = messages.filter((m) => m.type === "end");

    expect(changeMessages.length).toBeGreaterThan(1);
    expect(endMessages).toHaveLength(1);

    expect(changeMessages[0].value).not.toBe(
      changeMessages[changeMessages.length - 1].value
    );
    expect(endMessages[0].value).toBe(changeMessages[changeMessages.length - 1].value);
  });

  test(`GIVEN a Slider
        WHEN using keyboard navigation
        THEN callbacks should fire appropriately`, async ({ page }) => {
    const d = await setup(page, "callbacks");
    await page.waitForTimeout(100);
    const thumb = d.getThumb();

    const messages: { type: string; value: number }[] = [];

    page.on("console", (msg) => {
      const text = msg.text();
      if (text.startsWith("Value changed:")) {
        messages.push({
          type: "change",
          value: Number(text.split(":")[1].trim())
        });
      }
      if (text.startsWith("Final value:")) {
        messages.push({
          type: "end",
          value: Number(text.split(":")[1].trim())
        });
      }
    });

    await thumb.focus();
    await page.keyboard.press("ArrowRight");

    await page.waitForTimeout(200);

    const changeMessages = messages.filter((m) => m.type === "change");
    const endMessages = messages.filter((m) => m.type === "end");

    expect(changeMessages).toHaveLength(1);
    expect(endMessages).toHaveLength(1);

    const expectedValue = 1;
    expect(changeMessages[0].value).toBe(expectedValue);
    expect(endMessages[0].value).toBe(expectedValue);
  });
});

test.describe("range mode", () => {
  test(`GIVEN a Range Slider
        WHEN rendered
        THEN both thumbs should be visible with correct initial positions`, async ({
    page
  }) => {
    const d = await setup(page, "range");
    const startThumb = d.getThumb("start");
    const endThumb = d.getThumb("end");

    await expect(startThumb).toBeVisible();
    await expect(endThumb).toBeVisible();

    await expect(startThumb).toHaveAttribute("aria-valuenow", "30");
    await expect(endThumb).toHaveAttribute("aria-valuenow", "70");
  });

  test(`GIVEN a Range Slider
        WHEN moving start thumb towards end thumb
        THEN it should not exceed end value`, async ({ page }) => {
    const d = await setup(page, "range-marks");
    const startThumb = d.getThumb("start");
    const endThumb = d.getThumb("end");

    const messages: { type: string; values: number[] }[] = [];
    page.on("console", (msg) => {
      const text = msg.text();
      if (text.startsWith("Value changed:")) {
        const values = JSON.parse(text.split(":")[1].trim());
        messages.push({ type: "change", values });
      }
    });

    // Trying to move the start slider past the end slider.
    await startThumb.focus();
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("ArrowRight");
    }
    await page.waitForTimeout(100);

    // Checking that the start value does not exceed the end value.
    const startValue = Number(await startThumb.getAttribute("aria-valuenow"));
    const endValue = Number(await endThumb.getAttribute("aria-valuenow"));
    expect(startValue).toBeLessThanOrEqual(endValue);

    // Checking that in all changes, start <= end.
    messages.forEach((msg) => {
      expect(msg.values[0]).toBeLessThanOrEqual(msg.values[1]);
    });
  });

  test(`GIVEN a Range Slider
        WHEN moving end thumb towards start thumb
        THEN it should not go below start value`, async ({ page }) => {
    const d = await setup(page, "range-marks");
    const startThumb = d.getThumb("start");
    const endThumb = d.getThumb("end");

    const messages: { type: string; values: number[] }[] = [];
    page.on("console", (msg) => {
      const text = msg.text();
      if (text.startsWith("Value changed:")) {
        const values = JSON.parse(text.split(":")[1].trim());
        messages.push({ type: "change", values });
      }
    });

    // Trying to move the end slider past the start slider.
    await endThumb.focus();
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("ArrowLeft");
    }
    await page.waitForTimeout(100);

    // Checking that the end value does not exceed the start value.
    const startValue = Number(await startThumb.getAttribute("aria-valuenow"));
    const endValue = Number(await endThumb.getAttribute("aria-valuenow"));
    expect(endValue).toBeGreaterThanOrEqual(startValue);

    // Checking that in all changes, start <= end.
    messages.forEach((msg) => {
      expect(msg.values[0]).toBeLessThanOrEqual(msg.values[1]);
    });
  });

  test(`GIVEN a Range Slider
        WHEN using keyboard navigation
        THEN values should respect min/max bounds`, async ({ page }) => {
    const d = await setup(page, "range");
    const startThumb = d.getThumb("start");
    const endThumb = d.getThumb("end");

    await startThumb.focus();
    await page.keyboard.press("Home");
    await expect(startThumb).toHaveAttribute("aria-valuenow", "0");

    await page.keyboard.press("End");
    const endValue = await endThumb.getAttribute("aria-valuenow");
    await expect(startThumb).toHaveAttribute("aria-valuenow", String(endValue));

    await endThumb.focus();
    await page.keyboard.press("End");
    await expect(endThumb).toHaveAttribute("aria-valuenow", "100");

    await page.keyboard.press("Home");
    const startValue = await startThumb.getAttribute("aria-valuenow");
    await expect(endThumb).toHaveAttribute("aria-valuenow", String(startValue));
  });
});

test.describe("style customization", () => {
  test(`GIVEN a Slider with custom inline styles
        WHEN rendered
        THEN custom styles should be merged with positioning styles`, async ({
    page
  }) => {
    const d = await setup(page, "custom-styles");
    const thumb = d.getThumb();

    await expect(thumb).toHaveCSS("background-color", "rgb(255, 0, 0)");
    await expect(thumb).toHaveCSS("width", "24px");
    await expect(thumb).toHaveCSS("height", "24px");
    await expect(thumb).toHaveCSS("border", "3px solid rgb(139, 0, 0)"); // darkred

    const track = d.getTrack();
    const trackBounds = await track.boundingBox();
    const thumbBounds = await thumb.boundingBox();

    if (!trackBounds || !thumbBounds) throw new Error("Elements not found");

    expect(thumbBounds.x).toBeGreaterThanOrEqual(trackBounds.x);
    expect(thumbBounds.x + thumbBounds.width).toBeLessThanOrEqual(
      trackBounds.x + trackBounds.width
    );
  });
});

test.describe("disabled state", () => {
  test(`GIVEN a disabled Slider
        WHEN trying to interact
        THEN value should not change`, async ({ page }) => {
    const d = await setup(page, "disabled");
    const thumb = d.getThumb();
    const track = d.getTrack();

    await expect(d.getRoot()).toHaveAttribute("aria-disabled", "true");
    await expect(thumb).toHaveAttribute("aria-disabled", "true");
    await expect(thumb).toHaveAttribute("tabindex", "-1");

    const initialValue = String(await thumb.getAttribute("aria-valuenow"));

    const trackBounds = await track.boundingBox();
    if (trackBounds) {
      await page.mouse.click(
        trackBounds.x + trackBounds.width * 0.75,
        trackBounds.y + trackBounds.height / 2
      );
    }

    await expect(thumb).toHaveAttribute("aria-valuenow", initialValue);

    await thumb.focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("Home");
    await page.keyboard.press("End");

    await expect(thumb).toHaveAttribute("aria-valuenow", initialValue);

    const messages: string[] = [];
    page.on("console", (msg) => {
      messages.push(msg.text());
    });

    await page.mouse.click(
      trackBounds?.x ?? 0 + (trackBounds?.width ?? 0) * 0.25,
      trackBounds?.y ?? 0 + (trackBounds?.height ?? 0) / 2
    );

    await page.waitForTimeout(100);
    expect(messages).not.toContain(
      expect.stringContaining("This should not be called when disabled:")
    );
  });

  test(`GIVEN a disabled Slider
      WHEN toggling disabled state
      THEN interactions should work after enabling`, async ({ page }) => {
    const d = await setup(page, "disabled");
    const thumb = d.getThumb();
    const toggleButton = page.locator("button");

    await expect(d.getRoot()).toHaveAttribute("aria-disabled", "true");

    await toggleButton.click();
    await page.waitForTimeout(100);

    const ariaDisabled = await d.getRoot().getAttribute("aria-disabled");
    console.log("aria-disabled after click:", ariaDisabled);

    await expect(d.getRoot()).toHaveAttribute("aria-disabled", "false");

    await thumb.focus();
    await page.keyboard.press("ArrowRight");

    await expect(thumb).toHaveAttribute("aria-valuenow", "51"); // 50 + 1

    await toggleButton.click();
    await page.waitForTimeout(100);
    await expect(d.getRoot()).toHaveAttribute("aria-disabled", "true");

    await page.keyboard.press("ArrowRight");
    await expect(thumb).toHaveAttribute("aria-valuenow", "51");
  });
});
