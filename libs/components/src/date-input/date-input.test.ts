import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./date-input.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/date-input/${exampleName}`);
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

test.describe("Label", () => {
  test("GIVEN a date input with a label THEN the for attribute of the label should match the id of the entry component", async ({
    page
  }) => {
    const d = await setup(page, "basic");
    const forAttribute = await d.getLabel().getAttribute("for");
    const entryId = await d.getDateEntry().getAttribute("id");
    expect(forAttribute).toEqual(entryId);
  });
});

test.describe("Segments", () => {
  test("GIVEN a date input with the format yyyy-mm-dd THEN the segments should be in the correct order with the correct separators", async ({
    page
  }) => {
    const d = await setup(page, "basic");
    const segments = await d.getSegments().all();
    expect(segments).toHaveLength(3);
    expect(segments[0]).toHaveAttribute("data-qds-date-input-segment-year");
    expect(segments[0]).not.toHaveAttribute("data-qds-date-input-segment-month");
    expect(segments[0]).not.toHaveAttribute("data-qds-date-input-segment-day");
    expect(segments[1]).toHaveAttribute("data-qds-date-input-segment-month");
    expect(segments[1]).not.toHaveAttribute("data-qds-date-input-segment-year");
    expect(segments[1]).not.toHaveAttribute("data-qds-date-input-segment-day");
    expect(segments[2]).toHaveAttribute("data-qds-date-input-segment-day");
    expect(segments[2]).not.toHaveAttribute("data-qds-date-input-segment-year");
    expect(segments[2]).not.toHaveAttribute("data-qds-date-input-segment-month");
    expect(await d.getSeparators().first().textContent()).toEqual("-");
    expect(await d.getSeparators().last().textContent()).toEqual("-");
  });

  test("GIVEN a date input with the format dd-mm-yyyy THEN the segments should be in the correct order with the correct separators", async ({
    page
  }) => {
    const d = await setup(page, "format");
    const segments = await d.getSegments().all();
    expect(segments).toHaveLength(3);
    expect(segments[0]).toHaveAttribute("data-qds-date-input-segment-day");
    expect(segments[1]).toHaveAttribute("data-qds-date-input-segment-month");
    expect(segments[2]).toHaveAttribute("data-qds-date-input-segment-year");
    expect(await d.getSeparators().first().textContent()).toEqual("-");
    expect(await d.getSeparators().last().textContent()).toEqual("-");
  });

  test("GIVEN a date input with no format input THEN the segments should match the default format", async ({
    page
  }) => {
    const d = await setup(page, "change");
    const segments = await d.getSegments().all();
    expect(segments).toHaveLength(3);
    expect(segments[0]).toHaveAttribute("data-qds-date-input-segment-month");
    expect(segments[1]).toHaveAttribute("data-qds-date-input-segment-day");
    expect(segments[2]).toHaveAttribute("data-qds-date-input-segment-year");
    expect(await d.getSeparators().first().textContent()).toEqual("/");
    expect(await d.getSeparators().last().textContent()).toEqual("/");
  });
});

test.describe("Form integration", () => {
  test("GIVEN a date input inside a form WHEN the form is submitted THEN the form should submit the date value", async ({
    page
  }) => {
    const d = await setup(page, "form");
    await d.getYearSegment().fill("2022");
    await d.getMonthSegment().fill("02");
    await d.getDaySegment().fill("14");
    await d.getSubmitButton().click();
    const submittedData = await d.getSubmittedData();
    await expect(submittedData).toBeVisible();
    await expect(submittedData).toHaveText(
      'Submitted: { "appointment-date": "2022-02-14" }'
    );
  });
});

test.describe("Input/Output", () => {
  test("GIVEN a bound date with an initial value THEN the segments should match the initial value", async ({
    page
  }) => {
    const d = await setup(page, "reactive");
    const externalValue = await d.getExternalValue();
    await expect(externalValue).toHaveText("1999-12-31");

    const yearSegment = await d.getYearSegment().inputValue();
    const monthSegment = await d.getMonthSegment().inputValue();
    const daySegment = await d.getDaySegment().inputValue();
    await expect(yearSegment).toBe("1999");
    await expect(monthSegment).toBe("12");
    await expect(daySegment).toBe("31");
  });

  test("GIVEN a bound date input WHEN the date is changed internally THEN the external value should be updated", async ({
    page
  }) => {
    const d = await setup(page, "reactive");
    await d.getYearSegment().fill("2022");
    await d.getMonthSegment().fill("02");
    await d.getDaySegment().fill("14");
    const externalValue = await d.getExternalValue();
    await expect(externalValue).toHaveText("2022-02-14");

    await d.getYearSegment().fill("2024");
    await expect(externalValue).toHaveText("2024-02-14");
  });

  test("GIVEN a bound date input WHEN the date is changed externally THEN the internal value should be updated", async ({
    page
  }) => {
    const d = await setup(page, "reactive");
    await d.getSetValueButton().click();
    const externalValue = await d.getExternalValue();
    await expect(externalValue).toHaveText("2099-12-31");

    const yearSegment = await d.getYearSegment().inputValue();
    const monthSegment = await d.getMonthSegment().inputValue();
    const daySegment = await d.getDaySegment().inputValue();
    await expect(yearSegment).toBe("2099");
    await expect(monthSegment).toBe("12");
    await expect(daySegment).toBe("31");
  });

  test("GIVEN a bound date input WHEN the date is cleared externally THEN the segments should be cleared", async ({
    page
  }) => {
    const d = await setup(page, "reactive");
    await d.getSetNullButton().click();
    const externalValue = await d.getExternalValue();
    await expect(externalValue).toBeEmpty();

    const yearSegment = await d.getYearSegment().inputValue();
    const monthSegment = await d.getMonthSegment().inputValue();
    const daySegment = await d.getDaySegment().inputValue();
    await expect(yearSegment).toEqual("");
    await expect(monthSegment).toEqual("");
    await expect(daySegment).toEqual("");
  });

  test("GIVEN a value-based date input with an initial value THEN the segments should match the initial value", async ({
    page
  }) => {
    const d = await setup(page, "value-based");

    const yearSegment = await d.getYearSegment().inputValue();
    const monthSegment = await d.getMonthSegment().inputValue();
    const daySegment = await d.getDaySegment().inputValue();
    await expect(yearSegment).toEqual("2021");
    await expect(monthSegment).toEqual("01");
    await expect(daySegment).toEqual("01");
  });

  test("GIVEN a value-based date input WHEN the date is cleared externally THEN the segments should be cleared", async ({
    page
  }) => {
    const d = await setup(page, "value-based");

    let externalValue = await d.getExternalValue();
    await expect(externalValue).toHaveText("2021-01-01");

    await d.getSetNullButton().click();
    externalValue = await d.getExternalValue();
    await expect(externalValue).toBeEmpty();

    const yearSegment = await d.getYearSegment().inputValue();
    const monthSegment = await d.getMonthSegment().inputValue();
    const daySegment = await d.getDaySegment().inputValue();
    await expect(yearSegment).toEqual("");
    await expect(monthSegment).toEqual("");
    await expect(daySegment).toEqual("");
  });

  test("GIVEN a value-based date input WHEN the date is updated externally THEN the segments should match the updated value", async ({
    page
  }) => {
    const d = await setup(page, "value-based");

    let externalValue = await d.getExternalValue();
    await expect(externalValue).toHaveText("2021-01-01");

    await d.getSetValueButton().click(); // sets to today
    const { today, yearText, monthText, dayText } = getToday();
    externalValue = await d.getExternalValue();
    await expect(externalValue).toHaveText(today);

    const yearSegment = await d.getYearSegment().inputValue();
    const monthSegment = await d.getMonthSegment().inputValue();
    const daySegment = await d.getDaySegment().inputValue();
    await expect(yearSegment).toEqual(yearText);
    await expect(monthSegment).toEqual(monthText);
    await expect(daySegment).toEqual(dayText);
  });

  test("GIVEN a value-based date input WHEN the date is changed internally THEN the external can be updated via onChange$", async ({
    page
  }) => {
    const d = await setup(page, "value-based");
    await d.getYearSegment().fill("2022");
    await d.getMonthSegment().fill("02");
    await d.getDaySegment().fill("14");
    const externalValue = await d.getExternalValue();
    await expect(externalValue).toHaveText("2022-02-14");

    await d.getYearSegment().fill("2024");
    await expect(externalValue).toHaveText("2024-02-14");
  });
});
