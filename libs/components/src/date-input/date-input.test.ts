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

test.describe("Composition", () => {
  test("GIVEN a date input with the format yyyy-mm-dd THEN the segments should be in the correct order with the correct separators", async ({
    page
  }) => {
    const d = await setup(page, "basic");
    const segments = await d.getSegments().all();
    expect(segments).toHaveLength(3);
    await expect(segments[0]).toHaveAttribute("data-qds-date-input-segment-year");
    await expect(segments[0]).not.toHaveAttribute("data-qds-date-input-segment-month");
    await expect(segments[0]).not.toHaveAttribute("data-qds-date-input-segment-day");
    await expect(segments[1]).toHaveAttribute("data-qds-date-input-segment-month");
    await expect(segments[1]).not.toHaveAttribute("data-qds-date-input-segment-year");
    await expect(segments[1]).not.toHaveAttribute("data-qds-date-input-segment-day");
    await expect(segments[2]).toHaveAttribute("data-qds-date-input-segment-day");
    await expect(segments[2]).not.toHaveAttribute("data-qds-date-input-segment-year");
    await expect(segments[2]).not.toHaveAttribute("data-qds-date-input-segment-month");
    expect(await d.getSeparators().first().textContent()).toEqual("-");
    expect(await d.getSeparators().last().textContent()).toEqual("-");
  });

  test("GIVEN a date input with the format dd.mm.yyyy THEN the segments should be in the correct order with the correct separators", async ({
    page
  }) => {
    const d = await setup(page, "format");
    const segments = await d.getSegments().all();
    expect(segments).toHaveLength(3);
    await expect(segments[0]).toHaveAttribute("data-qds-date-input-segment-day");
    await expect(segments[0]).toHaveAttribute("data-qds-date-input-segment-index", "0");
    await expect(segments[1]).toHaveAttribute("data-qds-date-input-segment-month");
    await expect(segments[1]).toHaveAttribute("data-qds-date-input-segment-index", "1");
    await expect(segments[2]).toHaveAttribute("data-qds-date-input-segment-year");
    await expect(segments[2]).toHaveAttribute("data-qds-date-input-segment-index", "2");
    expect(await d.getSeparators().first().textContent()).toEqual(".");
    expect(await d.getSeparators().last().textContent()).toEqual(".");
  });

  test("GIVEN a date input with no format input THEN the segments should match the default format", async ({
    page
  }) => {
    const d = await setup(page, "change");
    const segments = await d.getSegments().all();
    expect(segments).toHaveLength(3);
    await expect(segments[0]).toHaveAttribute("data-qds-date-input-segment-month");
    await expect(segments[1]).toHaveAttribute("data-qds-date-input-segment-day");
    await expect(segments[2]).toHaveAttribute("data-qds-date-input-segment-year");
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
    const submittedData = d.getSubmittedData();
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
    const externalValue = d.getExternalValue();
    await expect(externalValue).toHaveText("1999-12-31");

    const yearSegment = await d.getYearSegment().inputValue();
    const monthSegment = await d.getMonthSegment().inputValue();
    const daySegment = await d.getDaySegment().inputValue();
    expect(yearSegment).toBe("1999");
    expect(monthSegment).toBe("12");
    expect(daySegment).toBe("31");
  });

  test("GIVEN a bound date input WHEN the date is changed internally THEN the external value should be updated", async ({
    page
  }) => {
    const d = await setup(page, "reactive");
    await d.getYearSegment().fill("2022");
    await d.getMonthSegment().fill("02");
    await d.getDaySegment().fill("14");
    const externalValue = d.getExternalValue();
    await expect(externalValue).toHaveText("2022-02-14");

    await d.getYearSegment().fill("2024");
    await expect(externalValue).toHaveText("2024-02-14");
  });

  test("GIVEN a bound date input WHEN the date is changed externally THEN the internal value should be updated", async ({
    page
  }) => {
    const d = await setup(page, "reactive");
    await d.getSetValueButton().click();
    const externalValue = d.getExternalValue();
    await expect(externalValue).toHaveText("2099-12-31");

    const yearSegment = await d.getYearSegment().inputValue();
    const monthSegment = await d.getMonthSegment().inputValue();
    const daySegment = await d.getDaySegment().inputValue();
    expect(yearSegment).toBe("2099");
    expect(monthSegment).toBe("12");
    expect(daySegment).toBe("31");
  });

  test("GIVEN a bound date input WHEN the date is cleared externally THEN the segments should be cleared", async ({
    page
  }) => {
    const d = await setup(page, "reactive");
    await d.getSetNullButton().click();
    const externalValue = d.getExternalValue();
    await expect(externalValue).toBeEmpty();

    const yearSegment = await d.getYearSegment().inputValue();
    const monthSegment = await d.getMonthSegment().inputValue();
    const daySegment = await d.getDaySegment().inputValue();
    expect(yearSegment).toEqual("");
    expect(monthSegment).toEqual("");
    expect(daySegment).toEqual("");
  });

  test("GIVEN a value-based date input with an initial value THEN the segments should match the initial value", async ({
    page
  }) => {
    const d = await setup(page, "value-based");

    const yearSegment = await d.getYearSegment().inputValue();
    const monthSegment = await d.getMonthSegment().inputValue();
    const daySegment = await d.getDaySegment().inputValue();
    expect(yearSegment).toEqual("2021");
    expect(monthSegment).toEqual("01");
    expect(daySegment).toEqual("01");
  });

  test("GIVEN a value-based date input WHEN the date is cleared externally THEN the segments should be cleared", async ({
    page
  }) => {
    const d = await setup(page, "value-based");

    let externalValue = d.getExternalValue();
    await expect(externalValue).toHaveText("2021-01-01");

    await d.getSetNullButton().click();
    externalValue = d.getExternalValue();
    await expect(externalValue).toBeEmpty();

    const yearSegment = await d.getYearSegment().inputValue();
    const monthSegment = await d.getMonthSegment().inputValue();
    const daySegment = await d.getDaySegment().inputValue();
    expect(yearSegment).toEqual("");
    expect(monthSegment).toEqual("");
    expect(daySegment).toEqual("");
  });

  test("GIVEN a value-based date input WHEN the date is updated externally THEN the segments should match the updated value", async ({
    page
  }) => {
    const d = await setup(page, "value-based");

    let externalValue = d.getExternalValue();
    await expect(externalValue).toHaveText("2021-01-01");

    await d.getSetValueButton().click(); // sets to today
    const { today, yearText, monthText, dayText } = getToday();
    externalValue = d.getExternalValue();
    await expect(externalValue).toHaveText(today);

    const yearSegment = await d.getYearSegment().inputValue();
    const monthSegment = await d.getMonthSegment().inputValue();
    const daySegment = await d.getDaySegment().inputValue();
    expect(yearSegment).toEqual(yearText);
    expect(monthSegment).toEqual(monthText);
    expect(daySegment).toEqual(dayText);
  });

  test("GIVEN a value-based date input WHEN the date is changed internally THEN the external can be updated via onChange$", async ({
    page
  }) => {
    const d = await setup(page, "value-based");
    await d.getYearSegment().fill("2022");
    await d.getMonthSegment().fill("02");
    await d.getDaySegment().fill("14");
    const externalValue = d.getExternalValue();
    await expect(externalValue).toHaveText("2022-02-14");

    await d.getYearSegment().fill("2024");
    await expect(externalValue).toHaveText("2024-02-14");
  });
});

test.describe("Disabled", () => {
  test("GIVEN a disabled date input THEN the segments should be disabled", async ({
    page
  }) => {
    const d = await setup(page, "disabled");
    const yearSegment = d.getYearSegment();
    const monthSegment = d.getMonthSegment();
    const daySegment = d.getDaySegment();
    expect(await yearSegment.inputValue()).toEqual("2000");
    expect(await monthSegment.inputValue()).toEqual("12");
    expect(await daySegment.inputValue()).toEqual("25");
    await expect(yearSegment).toBeDisabled();
    await expect(monthSegment).toBeDisabled();
    await expect(daySegment).toBeDisabled();
  });

  test("GIVEN a date input WHEN the disabled state is toggled THEN the segments' disabled state should be updated", async ({
    page
  }) => {
    const d = await setup(page, "toggle-disabled");
    const yearSegment = d.getYearSegment();
    const monthSegment = d.getMonthSegment();
    const daySegment = d.getDaySegment();
    expect(await yearSegment.inputValue()).toEqual("1998");
    expect(await monthSegment.inputValue()).toEqual("11");
    expect(await daySegment.inputValue()).toEqual("1");
    await expect(yearSegment).toBeEnabled();
    await expect(monthSegment).toBeEnabled();
    await expect(daySegment).toBeEnabled();

    await d.getToggleDisabledButton().click();

    await expect(yearSegment).toBeDisabled();
    await expect(monthSegment).toBeDisabled();
    await expect(daySegment).toBeDisabled();

    await d.getToggleDisabledButton().click();

    await expect(yearSegment).toBeEnabled();
    await expect(monthSegment).toBeEnabled();
    await expect(daySegment).toBeEnabled();
  });
});
