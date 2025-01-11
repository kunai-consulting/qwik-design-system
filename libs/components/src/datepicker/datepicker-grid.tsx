import { $, type PropsOf, type QRL, component$, useContext } from "@builder.io/qwik";
import { datepickerContextId } from "./datepicker-context";
import type { LocalDate, Locale, Month } from "./types";
import { getWeekNumber } from "./utils";

type DatePickerGridProps = PropsOf<"table"> & {
  buttonProps?: PropsOf<"button">;
  onDateChange$?: QRL<(date: LocalDate) => void>;
};

const ACTION_KEYS = [
  "enter",
  " ",
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "home",
  "end",
  "pageup",
  "pagedown"
] as const;

const dateFormatter = (locale: Locale) =>
  new Intl.DateTimeFormat(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

export const DatePickerGrid = component$<DatePickerGridProps>((props) => {
  const context = useContext(datepickerContextId);

  const decreaseDate = $(() => {
    const currentMonth = Number.parseInt(context.monthToRender.value);
    if (currentMonth === 1) {
      context.monthToRender.value = "12";
      context.yearToRender.value--;
      return;
    }

    context.monthToRender.value = String(currentMonth - 1).padStart(2, "0") as Month;
  });

  const increaseDate = $(() => {
    const currentMonth = Number.parseInt(context.monthToRender.value);
    if (currentMonth === 12) {
      context.monthToRender.value = "01";
      context.yearToRender.value++;
      return;
    }

    context.monthToRender.value = String(currentMonth + 1).padStart(2, "0") as Month;
  });

  const updateDateFocused = $((e: KeyboardEvent, tbody: HTMLTableSectionElement) => {
    if (!ACTION_KEYS.includes(e.key.toLowerCase() as (typeof ACTION_KEYS)[number])) return;
    const elFocus = document.activeElement;
    if (elFocus?.tagName.toLowerCase() !== "button") return;

    const buttons = Array.from(tbody.getElementsByTagName("button"));
    const idx = buttons.indexOf(elFocus as HTMLButtonElement);
    const currentDate = elFocus?.getAttribute("data-value") as LocalDate;
    const key = e.key.toLowerCase();

    const getNewIndex = (step: number) => {
      const newIdx = idx + step;
      if (newIdx < 0 || newIdx >= buttons.length) return idx;
      return buttons[newIdx].hasAttribute("disabled") ? idx : newIdx;
    };

    const handleDateChange = (step: number, newIdx: number) => {
      if (idx === newIdx) {
        const newDate = adjustDate(currentDate, { days: step });
        updateFocus(newIdx, newDate);
        step < 0 ? decreaseDate() : increaseDate();
      } else {
        updateFocus(newIdx);
      }
    };

    const adjustDate = (
      date: string,
      adjustment: { days?: number; months?: number }
    ): LocalDate => {
      const d = new Date(date);
      if (adjustment.days) d.setDate(d.getDate() + adjustment.days);
      if (adjustment.months) d.setMonth(d.getMonth() + adjustment.months);
      return d.toISOString().split("T")[0] as LocalDate;
    };

    const updateFocus = (newIdx: number, newDate: LocalDate | null = null) => {
      const dateToSet =
        newDate ?? (buttons[newIdx].getAttribute("data-value") as LocalDate);
      context.dateToFocus.value = dateToSet;
      elFocus?.setAttribute("tabindex", "-1");
      buttons[newIdx].setAttribute("tabindex", "0");
      buttons[newIdx].focus({ preventScroll: true });
    };

    const handleMonthChange = (date: LocalDate, currentMonth: string) => {
      if (date.split("-")[1] !== currentMonth) {
        date.split("-")[1] < currentMonth ? decreaseDate() : increaseDate();
      }
    };

    switch (key) {
      case "arrowup":
      case "arrowdown": {
        const step = key === "arrowup" ? -7 : 7;
        handleDateChange(step, getNewIndex(step));
        break;
      }

      case "arrowleft":
      case "arrowright": {
        const step = key === "arrowleft" ? -1 : 1;
        handleDateChange(step, getNewIndex(step));
        break;
      }

      case " ":
      case "enter": {
        (elFocus as HTMLButtonElement).click();
        break;
      }

      case "pageup":
      case "pagedown": {
        const step = key === "pageup" ? -1 : 1;
        const newDate = adjustDate(currentDate, { months: step });
        updateFocus(idx, newDate);
        step < 0 ? decreaseDate() : increaseDate();
        break;
      }

      case "home": {
        const rowStartIndex = Math.floor(idx / 7) * 7;
        const newDate = buttons[rowStartIndex].getAttribute("data-value") as LocalDate;
        handleMonthChange(newDate, context.monthToRender.value);
        updateFocus(rowStartIndex, newDate);
        break;
      }

      case "end": {
        const rowEndIndex = Math.min(Math.ceil((idx + 1) / 7) * 7 - 1, buttons.length - 1);
        const newDate = buttons[rowEndIndex].getAttribute("data-value") as LocalDate;
        handleMonthChange(newDate, context.monthToRender.value);
        updateFocus(rowEndIndex, newDate);
        break;
      }
    }
  });

  const {buttonProps, onDateChange$, ...tableProps } = props;

  return (
    <table data-qds-datepicker-grid role="grid" {...tableProps}>
      {context.showDaysOfWeek && (
        <thead data-qds-datepicker-grid-header>
          <tr data-qds-datepicker-grid-header-row>
            {context.showWeekNumber && <td />}
            {context.daysOfWeek.map((day) => (
              <th key={day} scope="col" aria-label={day} data-qds-datepicker-grid-header-cell>
                {
                  day
                    .slice(0, 2)
                    .normalize("NFD")
                    .replace(/\p{M}/gu, "")
                }
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody
        data-qds-datepicker-grid-body
        preventdefault:keydown
        onKeyDown$={[
          $((e: KeyboardEvent, target: HTMLTableSectionElement) => {
            updateDateFocused(e, target);
          }),
        ]}
      >
        {context.datesArray.value.map((week, index) => {
          return (
            <tr key={`${week.toString()}-${index}`} data-qds-datepicker-grid-body-row class="">
              {context.showWeekNumber && (
                <td data-qds-datepicker-grid-body-week-number>
                  <span>
                    {week.find((day): day is string => day !== null)
                      ? getWeekNumber(
                          week.find((day): day is string => day !== null)!
                        ).toString()
                      : ""}
                  </span>
                </td>
              )}
              {week.map((day, dayIndex) => {
                const label = day
                  ? dateFormatter(context.locale).format(new Date(`${day}T12:00:00`))
                  : undefined;
                const disabled = day?.split("-")[1] !== context.monthToRender.value;

                return (
                  <td
                    key={`${week.toString()}-${day}-${dayIndex}`}
                    role="presentation"
                    aria-disabled={disabled}
                  >
                    {day && (
                      <button
                        {...buttonProps}
                        type="button"
                        data-current={day === context.currentDate}
                        data-selected={day === context.activeDate.value}
                        aria-selected={
                          day === context.activeDate.value ? "true" : undefined
                        }
                        data-value={day}
                        aria-label={label}
                        disabled={disabled}
                        tabIndex={day === context.dateToFocus.value ? 0 : -1} 
                        onClick$={[
                          $(() => {
                            context.activeDate.value = day as LocalDate;
                            props.onDateChange$?.(day as LocalDate);
                          }),
                        ]}
                      >
                        {day.split("-")[2]}
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
});
