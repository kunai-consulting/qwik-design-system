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
    const d = await setup(page, "hero");
    const calendarGrid = d.getCalendarGrid();
    await expect(calendarGrid).toBeVisible();
  });

  test("GIVEN a calendar WHEN the next and previous buttons are clicked THEN the calendar grid should be updated", async ({
    page
  }) => {
    const d = await setup(page, "reactive");
    const calendarGrid = d.getCalendarGrid();
    const daySegment = d.getDaySegment();
    const monthSegment = d.getMonthSegment();
    const yearSegment = d.getYearSegment();
    const selectedDayButton = d.getSelectedDayButton();

    await expect(calendarGrid).toBeVisible();

    await daySegment.fill("11");
    await monthSegment.fill("08");
    await yearSegment.fill("2018");

    await expect(selectedDayButton).toBeVisible();
    await expect(selectedDayButton).toHaveText("11");
    await expect(d.getCalendarTitle()).toHaveText("August 2018");
    await expect(d.getCalendarGridDayButtons().last()).toHaveText("31");

    await d.getNextButton().click();
    await expect(d.getCalendarTitle()).toHaveText("September 2018");
    await expect(d.getCalendarGridDayButtons().last()).toHaveText("30");
    await expect(selectedDayButton).toBeHidden();

    await d.getPreviousButton().click();
    await expect(selectedDayButton).toBeVisible();
    await expect(selectedDayButton).toHaveText("11");
    await expect(d.getCalendarTitle()).toHaveText("August 2018");
    await expect(d.getCalendarGridDayButtons().last()).toHaveText("31");

    await d.getPreviousButton().click();
    await d.getPreviousButton().click();
    await expect(d.getCalendarTitle()).toHaveText("June 2018");
    await expect(d.getCalendarGridDayButtons().last()).toHaveText("30");
    await expect(selectedDayButton).toBeHidden();
  });

  test("GIVEN a calendar THEN the calendar grid show dates correctly for leap years", async ({
    page
  }) => {
    const d = await setup(page, "reactive");
    const calendarGrid = d.getCalendarGrid();
    const daySegment = d.getDaySegment();
    const monthSegment = d.getMonthSegment();
    const yearSegment = d.getYearSegment();
    const selectedDayButton = d.getSelectedDayButton();

    await expect(calendarGrid).toBeVisible();

    await yearSegment.fill("2020");
    await daySegment.fill("29");
    await monthSegment.fill("02");

    await expect(selectedDayButton).toBeVisible();
    await expect(selectedDayButton).toHaveText("29");
    await expect(d.getCalendarTitle()).toHaveText("February 2020");
    await expect(d.getCalendarGridDayButtons().last()).toHaveText("29");

    await yearSegment.fill("2021");
    await expect(d.getCalendarTitle()).toHaveText("February 2021");
    await expect(d.getCalendarGridDayButtons().last()).toHaveText("28");
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

test.describe("Date Picker", () => {
  test("GIVEN a date picker WHEN a date is selected THEN the date field should be updated", async ({
    page
  }) => {
    const d = await setup(page, "date-picker");
    d.getTrigger().click();
    const lastDayOfMonthButton = d.getCalendarGridDayButtons().last();
    const expectedValue = (await lastDayOfMonthButton.getAttribute("data-value")) ?? "";
    const expectedDay = expectedValue.split("-")[2];
    const expectedMonth = `${+expectedValue.split("-")[1]}`;
    const expectedYear = expectedValue.split("-")[0];
    await lastDayOfMonthButton.click();
    d.getTrigger().click();
    const daySegment = d.getDaySegment();
    const monthSegment = d.getMonthSegment();
    const yearSegment = d.getYearSegment();
    await expect(yearSegment).toHaveValue(expectedYear);
    await expect(monthSegment).toHaveValue(expectedMonth);
    await expect(daySegment).toHaveValue(expectedDay);
  });

  test("GIVEN a date picker WHEN a the date field is updated THEN the calendar should be updated", async ({
    page
  }) => {
    const d = await setup(page, "date-picker");
    const daySegment = d.getDaySegment();
    const monthSegment = d.getMonthSegment();
    const yearSegment = d.getYearSegment();
    const selectedDayButton = d.getSelectedDayButton();

    await daySegment.fill("14");
    await monthSegment.fill("02");
    await yearSegment.fill("2022");
    d.getTrigger().click();
    await expect(d.getCalendarTitle()).toHaveText("February 2022");
    await expect(selectedDayButton).toBeVisible();
    await expect(selectedDayButton).toHaveText("14");

    await daySegment.fill("5");
    await monthSegment.fill("9");
    await yearSegment.fill("2024");
    d.getTrigger().click();
    await expect(d.getCalendarTitle()).toHaveText("September 2024");
    await expect(selectedDayButton).toBeVisible();
    await expect(selectedDayButton).toHaveText("5");
  });
});
