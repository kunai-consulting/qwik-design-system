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
    const calendarGrid = await d.getCalendarGrid();
    await expect(calendarGrid).toBeVisible();
  });
});
