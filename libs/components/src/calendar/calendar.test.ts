import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./calendar.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/calendar/${exampleName}`);
  return createTestDriver(page);
}

function getToday() {
  const today = new Date().toISOString().split("T")[0];
  return {
    today,
    yearText: today.split("-")[0],
    monthText: today.split("-")[1],
    dayText: today.split("-")[2]
  };
}

test.describe("basic functionality", () => {
  test("GIVEN an inline calendar THEN the calendar grid should be visible", async ({
    page
  }) => {
    const d = await setup(page, "inline");
    const calendarGrid = d.getCalendarGrid();
    await expect(calendarGrid).toBeVisible();
  });
});

test.describe("popover calendar", () => {
  test("GIVEN a popover calendar WHEN the trigger is clicked THEN the calendar grid should appear and disappear", async ({
    page
  }) => {
    const d = await setup(page, "popover");
    const calendarGrid = d.getCalendarGrid();

    await expect(calendarGrid).toBeHidden();

    await d.getTrigger().click();
    await expect(calendarGrid).toBeVisible();

    await d.getTrigger().click();
    await expect(calendarGrid).toBeHidden();
  });

  test("GIVEN a popover calendar with bind:open WHEN the signal changes THEN the calendar grid should appear and disappear", async ({
    page
  }) => {
    const d = await setup(page, "popover-bound");
    const calendarGrid = d.getCalendarGrid();

    await expect(d.getOpenStatus()).toHaveText("closed");
    await expect(calendarGrid).toBeHidden();

    await d.getExternalToggle().click();
    await expect(calendarGrid).toBeVisible();
    await expect(d.getOpenStatus()).toHaveText("open");

    await d.getExternalToggle().click();
    await expect(calendarGrid).toBeHidden();
    await expect(d.getOpenStatus()).toHaveText("closed");

    // internal trigger should work here as well
    await d.getTrigger().click();
    await expect(calendarGrid).toBeVisible();
    await expect(d.getOpenStatus()).toHaveText("open");

    await d.getTrigger().click();
    await expect(calendarGrid).toBeHidden();
    await expect(d.getOpenStatus()).toHaveText("closed");
  });
});

test.describe("disabling", () => {
  test("GIVEN a calendar WHEN disabled is set THEN the calendar controls should not be interactable", async ({
    page
  }) => {
    const d = await setup(page, "toggle-disabled");
    const monthSegment = d.getMonthSegment();
    const daySegment = d.getDaySegment();
    const yearSegment = d.getYearSegment();
    const calendarGridDayButtons = d.getCalendarGridDayButtons();

    await expect(monthSegment).toBeEnabled();
    await expect(daySegment).toBeEnabled();
    await expect(yearSegment).toBeEnabled();

    await d.getTrigger().click(); // open calendar
    await expect(calendarGridDayButtons.first()).toBeEnabled();
    await expect(calendarGridDayButtons.last()).toBeEnabled();
    await d.getTrigger().click(); // close calendar

    await d.getExternalToggle().click(); // disable calendar

    await expect(monthSegment).toBeDisabled();
    await expect(daySegment).toBeDisabled();
    await expect(yearSegment).toBeDisabled();

    await d.getTrigger().click(); // open calendar
    await expect(calendarGridDayButtons.first()).toBeDisabled();
    await expect(calendarGridDayButtons.last()).toBeDisabled();
    await d.getTrigger().click(); // close calendar

    await d.getExternalToggle().click(); // enable calendar

    await expect(monthSegment).toBeEnabled();
    await expect(daySegment).toBeEnabled();
    await expect(yearSegment).toBeEnabled();

    await d.getTrigger().click(); // open calendar
    await expect(calendarGridDayButtons.first()).toBeEnabled();
    await expect(calendarGridDayButtons.last()).toBeEnabled();
    await d.getTrigger().click(); // close calendar
  });
});
