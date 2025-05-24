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
  test("GIVEN a date input with a label THEN the aria-labelledby attribute of the entry should match the id of the label", async ({
    page
  }) => {
    const d = await setup(page, "basic");
    const labelId = await d.getLabel().getAttribute("id");
    const entryLabeledBy = await d.getDateEntry().getAttribute("aria-labelledby");
    expect(labelId).toEqual(entryLabeledBy);
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

  test("GIVEN a date input with placeholder inputs THEN the segments should have the placeholder text", async ({
    page
  }) => {
    const d = await setup(page, "placeholder");
    await expect(d.getMonthSegment()).toHaveAttribute("placeholder", "Month");
    await expect(d.getDaySegment()).toHaveAttribute("placeholder", "Day");
    await expect(d.getYearSegment()).toHaveAttribute("placeholder", "Year");
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

  test("GIVEN a date input WHEN date info is typed THEN the values should be updated", async ({
    page
  }) => {
    const d = await setup(page, "hero");
    const monthSegment = d.getMonthSegment();
    const yearSegment = d.getYearSegment();
    const daySegment = d.getDaySegment();
    const externalValue = d.getExternalValue();

    await monthSegment.pressSequentially("12");
    expect(await monthSegment.inputValue()).toEqual("12");
    await daySegment.pressSequentially("15");
    expect(await daySegment.inputValue()).toEqual("15");
    await yearSegment.pressSequentially("2025", { delay: 50 });
    expect(await yearSegment.inputValue()).toEqual("2025");

    await expect(externalValue).toHaveText("2025-12-15");

    await monthSegment.pressSequentially("11");
    expect(await monthSegment.inputValue()).toEqual("11");

    await monthSegment.pressSequentially("9");
    expect(await monthSegment.inputValue()).toEqual("9");

    await daySegment.pressSequentially("3");
    expect(await daySegment.inputValue()).toEqual("3");

    await yearSegment.pressSequentially("1999", { delay: 50 });
    expect(await yearSegment.inputValue()).toEqual("1999");

    await expect(externalValue).toHaveText("1999-09-03");
  });

  test("GIVEN a date input that uses leading zeros WHEN date info is typed THEN the values should be updated", async ({
    page
  }) => {
    const d = await setup(page, "value-based");
    const monthSegment = d.getMonthSegment();
    const yearSegment = d.getYearSegment();
    const daySegment = d.getDaySegment();
    const externalValue = d.getExternalValue();

    await page.keyboard.press("Tab");
    await monthSegment.pressSequentially("05");
    await expect(monthSegment).toHaveValue("05");
    await page.keyboard.press("Tab");
    await daySegment.fill("2");
    await expect(daySegment).toHaveValue("02");
    await yearSegment.pressSequentially("2025", { delay: 50 });
    await expect(yearSegment).toHaveValue("2025");

    await expect(externalValue).toHaveText("2025-05-02");

    await monthSegment.pressSequentially("11");
    await expect(monthSegment).toHaveValue("11");

    await daySegment.pressSequentially("3");
    await expect(daySegment).toHaveValue("03");

    await yearSegment.pressSequentially("1999", { delay: 50 });
    await expect(yearSegment).toHaveValue("1999");

    await expect(externalValue).toHaveText("1999-11-03");

    await monthSegment.pressSequentially("4");
    await expect(monthSegment).toHaveValue("04");

    await expect(externalValue).toHaveText("1999-04-03");
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

test.describe("Keyboard interactions", () => {
  test("GIVEN a date input WHEN the tab key is pressed THEN the focus should move to the next segment", async ({
    page
  }) => {
    const d = await setup(page, "basic");
    const yearSegment = d.getYearSegment();
    const monthSegment = d.getMonthSegment();
    const daySegment = d.getDaySegment();

    await page.keyboard.press("Tab");
    await expect(yearSegment).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(monthSegment).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(daySegment).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(monthSegment).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(yearSegment).toBeFocused();
  });

  test("GIVEN a date input WHEN data is entered THEN the focus should move to the next segment", async ({
    page
  }) => {
    const d = await setup(page, "basic");
    const yearSegment = d.getYearSegment();
    const monthSegment = d.getMonthSegment();
    const daySegment = d.getDaySegment();

    await yearSegment.fill("2022");
    await expect(monthSegment).toBeFocused();

    await monthSegment.fill("02");
    await expect(daySegment).toBeFocused();
  });

  test("GIVEN a date input WHEN the right/left arrow keys are pressed THEN the focus should move to the next/previous segment", async ({
    page
  }) => {
    const d = await setup(page, "basic");
    const yearSegment = d.getYearSegment();
    const monthSegment = d.getMonthSegment();
    const daySegment = d.getDaySegment();
    await page.keyboard.press("Tab");
    await expect(yearSegment).toBeFocused();

    await page.keyboard.press("ArrowRight");
    await expect(monthSegment).toBeFocused();

    await page.keyboard.press("ArrowRight");
    await expect(daySegment).toBeFocused();

    await page.keyboard.press("ArrowLeft");
    await expect(monthSegment).toBeFocused();

    await page.keyboard.press("ArrowLeft");
    await expect(yearSegment).toBeFocused();
  });
});

test.describe("Multiple date entries", () => {
  test("GIVEN two date entries WHEN the updating the segments THEN the entries should function independently", async ({
    page
  }) => {
    const d = await setup(page, "date-range");

    const depYear = d.getFirstYearSegment();
    const depMonth = d.getFirstMonthSegment();
    const depDay = d.getFirstDaySegment();
    const depHidden = d.getFirstHiddenInput();

    const retYear = d.getSecondYearSegment();
    const retMonth = d.getSecondMonthSegment();
    const retDay = d.getSecondDaySegment();
    const retHidden = d.getSecondHiddenInput();

    // 1. Check initial state (placeholders)
    await expect(depYear).toHaveAttribute("placeholder", "yyyy");
    await expect(depMonth).toHaveAttribute("placeholder", "mm");
    await expect(depDay).toHaveAttribute("placeholder", "dd");
    await expect(depHidden).toHaveValue("");

    await expect(retYear).toHaveAttribute("placeholder", "yyyy");
    await expect(retMonth).toHaveAttribute("placeholder", "mm");
    await expect(retDay).toHaveAttribute("placeholder", "dd");
    await expect(retHidden).toHaveValue("");

    // 2. Fill departure date
    await depYear.fill("2023");
    await depMonth.fill("07");
    await depDay.fill("15");

    // Assert departure date is set
    await expect(depYear).toHaveValue("2023");
    await expect(depMonth).toHaveValue("07");
    await expect(depDay).toHaveValue("15");
    await expect(depHidden).toHaveValue("2023-07-15");

    // Assert return date is still empty (placeholders)
    await expect(retYear).toHaveAttribute("placeholder", "yyyy");
    await expect(retMonth).toHaveAttribute("placeholder", "mm");
    await expect(retDay).toHaveAttribute("placeholder", "dd");
    await expect(retHidden).toHaveValue("");

    // 3. Fill return date
    await retYear.fill("2024");
    await retMonth.fill("09");
    await retDay.fill("25");

    // Assert return date is set
    await expect(retYear).toHaveValue("2024");
    await expect(retMonth).toHaveValue("09");
    await expect(retDay).toHaveValue("25");
    await expect(retHidden).toHaveValue("2024-09-25");

    // Assert departure date remains unchanged
    await expect(depYear).toHaveValue("2023");
    await expect(depMonth).toHaveValue("07");
    await expect(depDay).toHaveValue("15");
    await expect(depHidden).toHaveValue("2023-07-15");
  });

  test("GIVEN two date entries WHEN using the arrow keys to navigate between segments THEN focus should also seamlessly move between entries", async ({
    page
  }) => {
    const d = await setup(page, "date-range");

    const depYear = d.getFirstYearSegment();
    const depMonth = d.getFirstMonthSegment();
    const depDay = d.getFirstDaySegment();

    const retYear = d.getSecondYearSegment();
    const retMonth = d.getSecondMonthSegment();
    const retDay = d.getSecondDaySegment();

    // Focus the first segment of the first entry
    await depYear.focus();
    await expect(depYear).toBeFocused();

    // Navigate right through the first entry
    await page.keyboard.press("ArrowRight");
    await expect(depMonth).toBeFocused();

    await page.keyboard.press("ArrowRight");
    await expect(depDay).toBeFocused();

    // Navigate from the last segment of the first entry to the first segment of the second entry
    await page.keyboard.press("ArrowRight");
    await expect(retYear).toBeFocused();

    // Navigate right through the second entry
    await page.keyboard.press("ArrowRight");
    await expect(retMonth).toBeFocused();

    await page.keyboard.press("ArrowRight");
    await expect(retDay).toBeFocused();

    // Boundary: Pressing ArrowRight on the last segment of the last entry should keep focus there
    await page.keyboard.press("ArrowRight");
    await expect(retDay).toBeFocused();

    // Navigate left through the second entry
    await page.keyboard.press("ArrowLeft");
    await expect(retMonth).toBeFocused();

    await page.keyboard.press("ArrowLeft");
    await expect(retYear).toBeFocused();

    // Navigate from the first segment of the second entry to the last segment of the first entry
    await page.keyboard.press("ArrowLeft");
    await expect(depDay).toBeFocused();

    // Navigate left through the first entry
    await page.keyboard.press("ArrowLeft");
    await expect(depMonth).toBeFocused();

    await page.keyboard.press("ArrowLeft");
    await expect(depYear).toBeFocused();

    // Boundary: Pressing ArrowLeft on the first segment of the first entry should keep focus there
    await page.keyboard.press("ArrowLeft");
    await expect(depYear).toBeFocused();
  });

  test("GIVEN two date entries with hidden inputs WHEN the form is filled and submitted THEN the form should submit both date values", async ({
    page
  }) => {
    const d = await setup(page, "date-range");

    const depYear = d.getFirstYearSegment();
    const depMonth = d.getFirstMonthSegment();
    const depDay = d.getFirstDaySegment();

    const retYear = d.getSecondYearSegment();
    const retMonth = d.getSecondMonthSegment();
    const retDay = d.getSecondDaySegment();

    const submitButton = d.getSubmitButton();
    const submittedData = d.getSubmittedData();

    // Fill departure date
    await depYear.fill("2023");
    await depMonth.fill("10");
    await depDay.fill("20");

    // Fill return date
    await retYear.fill("2024");
    await retMonth.fill("11");
    await retDay.fill("21");

    await submitButton.click();

    // Verify submitted data
    const expectedSubmittedValue = {
      "departure-date": "2023-10-20",
      "return-date": "2024-11-21"
    };

    await expect(submittedData).toBeVisible();
    const textContent = await submittedData.textContent();
    if (textContent === null) {
      throw new Error(
        "Submitted data text content is null, but was expected to be a string."
      );
    }
    const jsonString = textContent.replace("Submitted: ", "");
    const actualSubmittedValue = JSON.parse(jsonString);

    expect(actualSubmittedValue).toEqual(expectedSubmittedValue);
  });
});

test.describe("root onChange", () => {
  test("GIVEN two date entries WHEN one of the dates changes THEN the root onChange event should be triggered with the date values", async ({
    page
  }) => {
    const d = await setup(page, "root-change");

    const firstGuessYear = d.getFirstYearSegment();
    const firstGuessMonth = d.getFirstMonthSegment();
    const firstGuessDay = d.getFirstDaySegment();

    const secondGuessYear = d.getSecondYearSegment();
    const secondGuessMonth = d.getSecondMonthSegment();
    const secondGuessDay = d.getSecondDaySegment();

    const externalValue = d.getExternalValue();

    await expect(externalValue).toHaveText("[]");

    await firstGuessYear.fill("1985");
    await firstGuessMonth.fill("10");
    await firstGuessDay.fill("20");

    await expect(externalValue).toHaveText('["1985-10-20"]');

    await secondGuessYear.fill("2024");
    await secondGuessMonth.fill("11");
    await secondGuessDay.fill("21");

    await expect(externalValue).toHaveText('["1985-10-20","2024-11-21"]');

    await secondGuessYear.press("ArrowDown");
    await expect(externalValue).toHaveText('["1985-10-20","2023-11-21"]');

    await firstGuessDay.clear();
    await expect(externalValue).toHaveText('[null,"2023-11-21"]');

    await secondGuessMonth.clear();
    await expect(externalValue).toHaveText("[null,null]");
  });
});
