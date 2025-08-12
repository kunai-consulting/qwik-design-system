import { $, type PropsOf, component$, useSignal, useStore } from "@qwik.dev/core";
import { page, userEvent } from "@vitest/browser/context";
import { expect, test } from "vitest";
import { render } from "vitest-browser-qwik";
import * as DateInput from ".";

// Top-level locator constants using data-testid
const Root = page.getByTestId("root");
const Label = page.getByTestId("label");
const DateField = page.getByTestId("date-field");
const Segments = page.getByTestId("segment");
const YearSegment = page.getByTestId("year-segment");
const MonthSegment = page.getByTestId("month-segment");
const DaySegment = page.getByTestId("day-segment");
const BindYearSegment = page.getByTestId("bind-year-segment");
const BindMonthSegment = page.getByTestId("bind-month-segment");
const BindDaySegment = page.getByTestId("bind-day-segment");
const OnChangeYearSegment = page.getByTestId("onchange-year-segment");
const OnChangeMonthSegment = page.getByTestId("onchange-month-segment");
const OnChangeDaySegment = page.getByTestId("onchange-day-segment");
const OnChangeHiddenInput = page.getByTestId("onchange-hidden-input");
const HiddenInput = page.getByTestId("hidden-input");
const ExternalValue = page.getByTestId("external-value");
const SubmitButton = page.getByTestId("submit-button");
const SubmittedData = page.getByTestId("submitted-data");
const SetValueButton = page.getByTestId("set-value-button");
const SetNullButton = page.getByTestId("set-null-button");
const ToggleDisabledButton = page.getByTestId("toggle-disabled-button");

// Multi-field locators
const FirstDateField = page.getByTestId("first-date-field");
const SecondDateField = page.getByTestId("second-date-field");
const FirstYearSegment = FirstDateField.getByTestId("year-segment");
const FirstMonthSegment = FirstDateField.getByTestId("month-segment");
const FirstDaySegment = FirstDateField.getByTestId("day-segment");
const FirstHiddenInput = FirstDateField.getByTestId("hidden-input");
const SecondYearSegment = SecondDateField.getByTestId("year-segment");
const SecondMonthSegment = SecondDateField.getByTestId("month-segment");
const SecondDaySegment = SecondDateField.getByTestId("day-segment");
const SecondHiddenInput = SecondDateField.getByTestId("hidden-input");

function getToday() {
  const today = new Date().toISOString().split("T")[0];
  return {
    today,
    yearText: today.split("-")[0],
    monthText: today.split("-")[1],
    dayText: today.split("-")[2]
  };
}

// Component variations for different test scenarios
const Basic = component$((props: PropsOf<typeof DateInput.Root>) => {
  return (
    <DateInput.Root {...props} data-testid="root">
      <DateInput.Label data-testid="label">Enter your date of birth:</DateInput.Label>
      <DateInput.Field data-testid="date-field">
        <DateInput.Year data-testid="year-segment" />
        <span>-</span>
        <DateInput.Month showLeadingZero={true} data-testid="month-segment" />
        <span>-</span>
        <DateInput.Day showLeadingZero={true} data-testid="day-segment" />
        <DateInput.HiddenInput name="date-of-birth" data-testid="hidden-input" />
      </DateInput.Field>
    </DateInput.Root>
  );
});

// Tests
test("label and date field have correct aria-labelledby relationship", async () => {
  render(<Basic />);
  await expect.element(Label).toBeVisible();
  await expect.element(DateField).toBeVisible();

  const labelElement = Label.element();
  const fieldElement = DateField.element();
  const labelId = labelElement?.getAttribute("id");
  const fieldLabeledBy = fieldElement?.getAttribute("aria-labelledby");
  expect(labelId).toEqual(fieldLabeledBy);
});

test("segments are in correct order for yyyy-mm-dd format", async () => {
  render(<Basic />);
  await expect.element(DaySegment).toBeVisible();
  await expect.element(MonthSegment).toBeVisible();
  await expect.element(YearSegment).toBeVisible();

  await expect(YearSegment).toHaveAttribute("data-qds-date-input-segment-year");
  await expect(YearSegment).not.toHaveAttribute("data-qds-date-input-segment-month");
  await expect(YearSegment).not.toHaveAttribute("data-qds-date-input-segment-day");

  await expect(MonthSegment).toHaveAttribute("data-qds-date-input-segment-month");
  await expect(MonthSegment).not.toHaveAttribute("data-qds-date-input-segment-year");
  await expect(MonthSegment).not.toHaveAttribute("data-qds-date-input-segment-day");

  await expect(DaySegment).toHaveAttribute("data-qds-date-input-segment-day");
  await expect(DaySegment).not.toHaveAttribute("data-qds-date-input-segment-year");
  await expect(DaySegment).not.toHaveAttribute("data-qds-date-input-segment-month");
});

test("segments display placeholder text when provided", async () => {
  render(<Basic />);

  await expect.element(MonthSegment).toHaveAttribute("placeholder", "mm");
  await expect.element(DaySegment).toHaveAttribute("placeholder", "dd");
  await expect.element(YearSegment).toHaveAttribute("placeholder", "yyyy");
});

test("tab key moves focus to next segment", async () => {
  render(<Basic />);

  await userEvent.keyboard("{Tab}");
  expect(document.activeElement).toBe(await YearSegment.element());

  await userEvent.keyboard("{Tab}");
  expect(document.activeElement).toBe(await MonthSegment.element());

  await userEvent.keyboard("{Tab}");
  expect(document.activeElement).toBe(await DaySegment.element());

  await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
  expect(document.activeElement).toBe(await MonthSegment.element());

  await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
  expect(document.activeElement).toBe(await YearSegment.element());
});

test("data entry moves focus to next segment", async () => {
  render(<Basic />);

  await userEvent.fill(YearSegment, "2022");
  await expect.element(MonthSegment).toHaveFocus;

  await userEvent.fill(MonthSegment, "02");
  await expect.element(DaySegment).toHaveFocus;
});

test("arrow keys move focus between segments", async () => {
  render(<Basic />);

  await userEvent.keyboard("{Tab}");
  expect.element(YearSegment).toHaveFocus;

  await userEvent.keyboard("{ArrowRight}");
  expect.element(MonthSegment).toHaveFocus;

  await userEvent.keyboard("{ArrowRight}");
  expect.element(DaySegment).toHaveFocus;

  await userEvent.keyboard("{ArrowLeft}");
  expect.element(MonthSegment).toHaveFocus;

  await userEvent.keyboard("{ArrowLeft}");
  expect.element(YearSegment).toHaveFocus;
});

const Format = component$((props: PropsOf<typeof DateInput.Root>) => {
  return (
    <DateInput.Root {...props} data-testid="root">
      <DateInput.Label data-testid="label">European-style date entry:</DateInput.Label>
      <DateInput.Field separator="." data-testid="date-field">
        <DateInput.Day
          placeholder="DD"
          showLeadingZero={true}
          data-testid="day-segment"
        />
        <DateInput.Month
          placeholder="MM"
          showLeadingZero={true}
          data-testid="month-segment"
        />
        <DateInput.Year placeholder="YYYY" data-testid="year-segment" />
      </DateInput.Field>
    </DateInput.Root>
  );
});

test("segments are in correct order for dd.mm.yyyy format", async () => {
  render(<Format />);
  await expect.element(DaySegment).toBeVisible();
  await expect.element(MonthSegment).toBeVisible();
  await expect.element(YearSegment).toBeVisible();

  await expect(YearSegment).toHaveAttribute("data-qds-date-input-segment-year");
  await expect(YearSegment).not.toHaveAttribute("data-qds-date-input-segment-month");
  await expect(YearSegment).not.toHaveAttribute("data-qds-date-input-segment-day");

  await expect(MonthSegment).toHaveAttribute("data-qds-date-input-segment-month");
  await expect(MonthSegment).not.toHaveAttribute("data-qds-date-input-segment-year");
  await expect(MonthSegment).not.toHaveAttribute("data-qds-date-input-segment-day");

  await expect(DaySegment).toHaveAttribute("data-qds-date-input-segment-day");
  await expect(DaySegment).not.toHaveAttribute("data-qds-date-input-segment-year");
  await expect(DaySegment).not.toHaveAttribute("data-qds-date-input-segment-month");
  await expect(DaySegment).toHaveAttribute("data-qds-date-input-segment-index", "0");
  await expect(MonthSegment).toHaveAttribute("data-qds-date-input-segment-index", "1");
  await expect(YearSegment).toHaveAttribute("data-qds-date-input-segment-index", "2");
});

const Default = component$((props: PropsOf<typeof DateInput.Root>) => {
  return (
    <DateInput.Root {...props} data-testid="root">
      <DateInput.Label data-testid="label">My date input</DateInput.Label>
      <DateInput.Field separator="/" data-testid="date-field">
        <DateInput.Month data-testid="month-segment" />
        <DateInput.Day data-testid="day-segment" />
        <DateInput.Year data-testid="year-segment" />
      </DateInput.Field>
    </DateInput.Root>
  );
});

test("segments match default format when no format specified", async () => {
  render(<Default />);

  await expect.element(DaySegment).toBeVisible();
  await expect.element(MonthSegment).toBeVisible();
  await expect.element(YearSegment).toBeVisible();

  await expect.element(MonthSegment).toHaveAttribute("data-qds-date-input-segment-month");
  await expect.element(DaySegment).toHaveAttribute("data-qds-date-input-segment-day");
  await expect.element(YearSegment).toHaveAttribute("data-qds-date-input-segment-year");
});

const FormBasic = component$(() => {
  const formData = useSignal<Record<string, FormDataEntryValue>>();

  return (
    <form
      preventdefault:submit
      onSubmit$={(e) => {
        const form = e.target as HTMLFormElement;
        const data = new FormData(form);
        const entries: [string, FormDataEntryValue][] = [];
        data.forEach((value, key) => {
          entries.push([key, value]);
        });
        formData.value = Object.fromEntries(entries);
      }}
    >
      <DateInput.Root data-testid="root">
        <DateInput.Label data-testid="label">Appointment Date</DateInput.Label>
        <DateInput.Field separator="/" data-testid="date-field">
          <DateInput.Month data-testid="month-segment" />
          <DateInput.Day data-testid="day-segment" />
          <DateInput.Year data-testid="year-segment" />
          <DateInput.HiddenInput name="appointment-date" data-testid="hidden-input" />
        </DateInput.Field>
      </DateInput.Root>
      <button type="submit" data-testid="submit-button">
        Submit
      </button>
      {formData.value && (
        <div data-testid="submitted-data">
          Submitted: {JSON.stringify(formData.value)}
        </div>
      )}
    </form>
  );
});

test("form submission includes date value", async () => {
  render(<FormBasic />);

  await userEvent.fill(YearSegment, "2022");
  await userEvent.fill(MonthSegment, "02");
  await userEvent.fill(DaySegment, "14");

  // Allow time for the date value to be updated
  await new Promise((resolve) => setTimeout(resolve, 100));
  await userEvent.click(SubmitButton);

  await expect.element(SubmittedData).toBeVisible();
  await expect
    .element(SubmittedData)
    .toHaveTextContent('Submitted: {"appointment-date":"2022-02-14"}');
});

const ExternalState = component$(() => {
  const selectedDateSignal = useSignal<DateInput.ISODate | null>("1999-12-31");
  const selectedDateStore = useStore({ date: "2021-01-01" as DateInput.ISODate | null });
  const isDisabled = useSignal(false);
  const dates = useSignal<(DateInput.ISODate | null)[]>([]);

  const handleChange$ = $((date: DateInput.ISODate | null) => {
    selectedDateStore.date = date;
  });

  const handleRootChange$ = $((newDates: (DateInput.ISODate | null)[]) => {
    dates.value = newDates;
  });

  return (
    <div>
      <DateInput.Root data-testid="root" onChange$={handleRootChange$}>
        <DateInput.Label data-testid="label">Choose your date:</DateInput.Label>
        <div>
          <span>bind:date</span>
          <DateInput.Field
            bind:date={selectedDateSignal}
            disabled={isDisabled.value}
            separator="/"
            data-testid="date-field"
          >
            <DateInput.Month showLeadingZero data-testid="bind-month-segment" />
            <DateInput.Day showLeadingZero data-testid="bind-day-segment" />
            <DateInput.Year data-testid="bind-year-segment" />
          </DateInput.Field>

          <span>onChange$</span>
          <DateInput.Field
            date={selectedDateStore.date}
            onChange$={handleChange$}
            separator="-"
            data-testid="first-date-field"
          >
            <DateInput.Year data-testid="onchange-year-segment" />
            <DateInput.Month
              showLeadingZero={true}
              data-testid="onchange-month-segment"
            />
            <DateInput.Day showLeadingZero={true} data-testid="onchange-day-segment" />
            <DateInput.HiddenInput
              name="departure-date"
              data-testid="onchange-hidden-input"
            />
          </DateInput.Field>

          <DateInput.Field data-testid="second-date-field">
            <DateInput.Year data-testid="year-segment" />
            <DateInput.Month showLeadingZero={true} data-testid="month-segment" />
            <DateInput.Day showLeadingZero={true} data-testid="day-segment" />
            <DateInput.HiddenInput name="return-date" data-testid="hidden-input" />
          </DateInput.Field>
        </div>
      </DateInput.Root>

      <p>
        Selected date:{" "}
        <span data-testid="external-value">{selectedDateSignal.value}</span>
      </p>
      <p>
        Store date: <span data-testid="store-value">{selectedDateStore.date}</span>
      </p>
      <p>
        Root dates: <span data-testid="root-value">{JSON.stringify(dates.value)}</span>
      </p>

      <button
        onClick$={() => (selectedDateSignal.value = "2099-12-31")}
        type="button"
        data-testid="set-value-button"
      >
        Set to 2099-12-31
      </button>
      <button
        onClick$={() => (selectedDateSignal.value = null)}
        type="button"
        data-testid="set-null-button"
      >
        Clear
      </button>
      <button
        onClick$={() => {
          const date = new Date().toISOString().split("T")[0] as DateInput.ISODate;
          selectedDateStore.date = date;
        }}
        type="button"
        data-testid="set-today-button"
      >
        Set store to today
      </button>
      <button
        onClick$={() => (isDisabled.value = !isDisabled.value)}
        type="button"
        data-testid="toggle-disabled-button"
      >
        Toggle disabled
      </button>
    </div>
  );
});

test("bound date shows initial value in segments", async () => {
  render(<ExternalState />);

  await expect.element(ExternalValue).toHaveTextContent("1999-12-31");

  const yearValue = ((await BindYearSegment.element()) as HTMLInputElement).value;
  const monthValue = ((await BindMonthSegment.element()) as HTMLInputElement).value;
  const dayValue = ((await BindDaySegment.element()) as HTMLInputElement).value;

  expect(yearValue).toBe("1999");
  expect(monthValue).toBe("12");
  expect(dayValue).toBe("31");
});

test("internal date changes update external value", async () => {
  render(<ExternalState />);

  await userEvent.fill(BindYearSegment, "2022");
  await userEvent.fill(BindMonthSegment, "02");
  await userEvent.fill(BindDaySegment, "14");

  await expect.element(ExternalValue).toHaveTextContent("2022-02-14");

  await userEvent.fill(BindYearSegment, "2024");
  await expect.element(ExternalValue).toHaveTextContent("2024-02-14");
});

test("external date changes update internal segments", async () => {
  render(<ExternalState />);

  await userEvent.click(SetValueButton);
  await expect.element(ExternalValue).toHaveTextContent("2099-12-31");

  const yearValue = ((await BindYearSegment.element()) as HTMLInputElement).value;
  const monthValue = ((await BindMonthSegment.element()) as HTMLInputElement).value;
  const dayValue = ((await BindDaySegment.element()) as HTMLInputElement).value;

  expect(yearValue).toBe("2099");
  expect(monthValue).toBe("12");
  expect(dayValue).toBe("31");
});

test("external clear updates segments", async () => {
  render(<ExternalState />);

  await userEvent.click(SetNullButton);
  await expect.element(ExternalValue).toHaveTextContent("");

  const yearValue = ((await BindYearSegment.element()) as HTMLInputElement).value;
  const monthValue = ((await BindMonthSegment.element()) as HTMLInputElement).value;
  const dayValue = ((await BindDaySegment.element()) as HTMLInputElement).value;

  expect(yearValue).toEqual("");
  expect(monthValue).toEqual("");
  expect(dayValue).toEqual("");
});

test("value-based date input shows initial value", async () => {
  render(<ExternalState />);

  const storeValue = page.getByTestId("store-value");
  await expect.element(storeValue).toHaveTextContent("2021-01-01");

  const yearValue = ((await OnChangeYearSegment.element()) as HTMLInputElement).value;
  const monthValue = ((await OnChangeMonthSegment.element()) as HTMLInputElement).value;
  const dayValue = ((await OnChangeDaySegment.element()) as HTMLInputElement).value;

  expect(yearValue).toEqual("2021");
  expect(monthValue).toEqual("01");
  expect(dayValue).toEqual("01");
});

test("value-based date input updates externally to today", async () => {
  render(<ExternalState />);

  const storeValue = page.getByTestId("store-value");
  const setTodayButton = page.getByTestId("set-today-button");

  await expect.element(storeValue).toHaveTextContent("2021-01-01");

  await userEvent.click(setTodayButton);
  const { today, yearText, monthText, dayText } = getToday();
  await expect.element(storeValue).toHaveTextContent(today);

  const yearValue = ((await OnChangeYearSegment.element()) as HTMLInputElement).value;
  const monthValue = ((await OnChangeMonthSegment.element()) as HTMLInputElement).value;
  const dayValue = ((await OnChangeDaySegment.element()) as HTMLInputElement).value;

  expect(yearValue).toEqual(yearText);
  expect(monthValue).toEqual(monthText);
  expect(dayValue).toEqual(dayText);
});

test("value-based date input internal changes update external via onChange", async () => {
  render(<ExternalState />);

  const storeValue = page.getByTestId("store-value");

  await userEvent.fill(OnChangeYearSegment, "2022");
  await userEvent.fill(OnChangeMonthSegment, "02");
  await userEvent.fill(OnChangeDaySegment, "14");

  await expect.element(storeValue).toHaveTextContent("2022-02-14");

  await userEvent.fill(OnChangeYearSegment, "2024");
  await expect.element(storeValue).toHaveTextContent("2024-02-14");
});

test("date input with leading zeros updates correctly", async () => {
  render(<ExternalState />);

  const storeValue = page.getByTestId("store-value");

  await userEvent.keyboard("{Tab}");
  await userEvent.type(OnChangeMonthSegment, "05");
  await expect.element(OnChangeMonthSegment).toHaveValue("05");

  await userEvent.keyboard("{Tab}");
  await userEvent.fill(OnChangeDaySegment, "2");
  await expect.element(OnChangeDaySegment).toHaveValue("02");

  await userEvent.type(OnChangeYearSegment, "2025");
  await expect.element(OnChangeYearSegment).toHaveValue("2025");

  await expect.element(storeValue).toHaveTextContent("2025-05-02");

  await userEvent.type(OnChangeMonthSegment, "11");
  await expect.element(OnChangeMonthSegment).toHaveValue("11");

  await userEvent.type(OnChangeDaySegment, "3");
  await expect.element(OnChangeDaySegment).toHaveValue("03");

  await userEvent.type(OnChangeYearSegment, "1999");
  await expect.element(OnChangeYearSegment).toHaveValue("1999");

  await expect.element(storeValue).toHaveTextContent("1999-11-03");

  await userEvent.type(OnChangeMonthSegment, "4");
  await expect.element(OnChangeMonthSegment).toHaveValue("04");

  await expect.element(storeValue).toHaveTextContent("1999-04-03");
});

test("disabled state can be toggled", async () => {
  render(<ExternalState />);

  await expect.element(BindYearSegment).toBeVisible();
  await expect.element(BindMonthSegment).toBeVisible();
  await expect.element(BindDaySegment).toBeVisible();

  const yearValue = ((await BindYearSegment.element()) as HTMLInputElement).value;
  const monthValue = ((await BindMonthSegment.element()) as HTMLInputElement).value;
  const dayValue = ((await BindDaySegment.element()) as HTMLInputElement).value;

  expect(yearValue).toEqual("1999");
  expect(monthValue).toEqual("12");
  expect(dayValue).toEqual("31");

  await expect.element(BindYearSegment).toBeEnabled();
  await expect.element(BindMonthSegment).toBeEnabled();
  await expect.element(BindDaySegment).toBeEnabled();

  await userEvent.click(ToggleDisabledButton);

  await expect.element(BindYearSegment).toBeDisabled();
  await expect.element(BindMonthSegment).toBeDisabled();
  await expect.element(BindDaySegment).toBeDisabled();

  await userEvent.click(ToggleDisabledButton);

  await expect.element(BindYearSegment).toBeEnabled();
  await expect.element(BindMonthSegment).toBeEnabled();
  await expect.element(BindDaySegment).toBeEnabled();
});

test("disabled date input has disabled segments", async () => {
  render(
    <DateInput.Root data-testid="root">
      <DateInput.Label data-testid="label">Permanently Disabled</DateInput.Label>
      <DateInput.Field
        date="2000-12-25"
        disabled={true}
        separator="/"
        data-testid="date-field"
      >
        <DateInput.Month data-testid="month-segment" />
        <DateInput.Day data-testid="day-segment" />
        <DateInput.Year data-testid="year-segment" />
      </DateInput.Field>
    </DateInput.Root>
  );

  await expect.element(YearSegment).toBeVisible();
  await expect.element(MonthSegment).toBeVisible();
  await expect.element(DaySegment).toBeVisible();

  const yearValue = ((await YearSegment.element()) as HTMLInputElement).value;
  const monthValue = ((await MonthSegment.element()) as HTMLInputElement).value;
  const dayValue = ((await DaySegment.element()) as HTMLInputElement).value;

  expect(yearValue).toEqual("2000");
  expect(monthValue).toEqual("12");
  expect(dayValue).toEqual("25");

  await expect.element(YearSegment).toBeDisabled();
  await expect.element(MonthSegment).toBeDisabled();
  await expect.element(DaySegment).toBeDisabled();
});

test("multiple date entries function independently", async () => {
  render(<ExternalState />);

  await expect.element(OnChangeYearSegment).toBeVisible();
  await expect.element(OnChangeMonthSegment).toBeVisible();
  await expect.element(OnChangeDaySegment).toBeVisible();
  await expect.element(OnChangeHiddenInput).toBeVisible();

  // Check initial state (placeholders)
  await expect.element(OnChangeYearSegment).toHaveAttribute("placeholder", "yyyy");
  await expect.element(OnChangeMonthSegment).toHaveAttribute("placeholder", "mm");
  await expect.element(OnChangeDaySegment).toHaveAttribute("placeholder", "dd");
  await expect.element(OnChangeHiddenInput).not.toHaveValue("");

  await expect.element(YearSegment).toHaveAttribute("placeholder", "yyyy");
  await expect.element(MonthSegment).toHaveAttribute("placeholder", "mm");
  await expect.element(DaySegment).toHaveAttribute("placeholder", "dd");
  await expect.element(HiddenInput).toHaveValue("");

  // Fill return date
  await userEvent.fill(YearSegment, "2024");
  await userEvent.fill(MonthSegment, "09");
  await userEvent.fill(DaySegment, "25");

  // Assert return date is set
  await expect.element(YearSegment).toHaveValue("2024");
  await expect.element(MonthSegment).toHaveValue("09");
  await expect.element(DaySegment).toHaveValue("25");
  await expect.element(HiddenInput).toHaveValue("2024-09-25");

  // Assert departure date field is still showing initial value
  await expect.element(OnChangeYearSegment).toHaveValue("2021");
  await expect.element(OnChangeMonthSegment).toHaveValue("01");
  await expect.element(OnChangeDaySegment).toHaveValue("01");
  await expect.element(OnChangeHiddenInput).toHaveValue("2021-01-01");
});

test("arrow keys navigate seamlessly between multiple date entries", async () => {
  render(<ExternalState />);

  await expect.element(OnChangeYearSegment).toBeVisible();
  await expect.element(OnChangeMonthSegment).toBeVisible();
  await expect.element(OnChangeDaySegment).toBeVisible();

  // Focus the first segment of the first entry
  await ((await OnChangeYearSegment.element()) as HTMLInputElement).focus();
  expect.element(OnChangeYearSegment).toHaveFocus;

  // Navigate right through the first entry
  await userEvent.keyboard("{ArrowRight}");
  expect.element(OnChangeMonthSegment).toHaveFocus;

  await userEvent.keyboard("{ArrowRight}");
  expect.element(OnChangeDaySegment).toHaveFocus;

  await expect.element(YearSegment).toBeVisible();
  await expect.element(MonthSegment).toBeVisible();
  await expect.element(DaySegment).toBeVisible();

  // Navigate from the last segment of the first entry to the first segment of the second entry
  await userEvent.keyboard("{ArrowRight}");
  expect.element(YearSegment).toHaveFocus;

  // Navigate right through the second entry
  await userEvent.keyboard("{ArrowRight}");
  expect.element(MonthSegment).toHaveFocus;

  await userEvent.keyboard("{ArrowRight}");
  expect.element(DaySegment).toHaveFocus;

  // Boundary: Pressing ArrowRight on the last segment of the last entry should keep focus there
  await userEvent.keyboard("{ArrowRight}");
  expect.element(DaySegment).toHaveFocus;

  // Navigate left through the second entry
  await userEvent.keyboard("{ArrowLeft}");
  expect.element(MonthSegment).toHaveFocus;

  await userEvent.keyboard("{ArrowLeft}");
  expect.element(YearSegment).toHaveFocus;

  // Navigate from the first segment of the second entry to the last segment of the first entry
  await userEvent.keyboard("{ArrowLeft}");
  expect.element(OnChangeDaySegment).toHaveFocus;

  // Navigate left through the first entry
  await userEvent.keyboard("{ArrowLeft}");
  expect.element(OnChangeMonthSegment).toHaveFocus;

  await userEvent.keyboard("{ArrowLeft}");
  expect.element(OnChangeYearSegment).toHaveFocus;

  // Boundary: Pressing ArrowLeft on the first segment of the first entry should keep focus there
  await userEvent.keyboard("{ArrowLeft}");
  expect.element(OnChangeYearSegment).toHaveFocus;
});

test("root onChange triggers with date values", async () => {
  render(<ExternalState />);

  const rootValue = page.getByTestId("root-value");
  await expect.element(rootValue).toHaveTextContent("[]");

  await userEvent.fill(BindYearSegment, "1985");
  await userEvent.fill(BindMonthSegment, "10");
  await userEvent.fill(BindDaySegment, "20");

  await expect.element(rootValue).toHaveTextContent('["1985-10-20"]');

  await userEvent.fill(YearSegment, "2024");
  await userEvent.fill(MonthSegment, "11");
  await userEvent.fill(DaySegment, "21");

  await expect.element(rootValue).toHaveTextContent('["1985-10-20",null,"2024-11-21"]');

  await expect.element(SecondYearSegment).toBeVisible();
  ((await SecondYearSegment.element()) as HTMLInputElement).focus();
  await userEvent.keyboard("{ArrowDown}");
  await expect.element(rootValue).toHaveTextContent('["1985-10-20",null,"2023-11-21"]');

  await userEvent.clear(BindYearSegment);
  const rootElement = await rootValue.element();
  expect(rootElement?.textContent).toContain("null");

  await userEvent.clear(MonthSegment);
  await expect.element(rootValue).toHaveTextContent("[null,null,null]");
});
