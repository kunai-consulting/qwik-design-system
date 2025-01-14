import { $, component$, useContext, type PropsOf } from "@builder.io/qwik";
import type { LocalDate, Locale } from "./types";
import { getWeekNumber } from "./utils";
import { calendarContextId } from "./calendar-context";

type CalendarGridDayProps = PropsOf<"button"> & { // Replace with proper context type
  onDateChange$?: (date: LocalDate) => void;
};

export const CalendarGridDay = component$<CalendarGridDayProps>(({
  onDateChange$, ...buttonProps
}) => {
  const context = useContext(calendarContextId);    
  const dateFormatter = (locale: Locale) =>
    new Intl.DateTimeFormat(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

  return (
    <>
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
                            onDateChange$?.(day as LocalDate);
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
        </>
  );
});