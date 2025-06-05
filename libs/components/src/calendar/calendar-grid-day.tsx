import { $, type PropsOf, component$, useContext } from "@builder.io/qwik";
import { calendarContextId } from "./calendar-context";
import type { LocalDate, Locale } from "./types";
import { getWeekNumber } from "./utils";
type PublicCalendarGridDayProps = PropsOf<"button"> & {
  /** Event handler called when a date is selected */
  onDateChange$?: (date: LocalDate) => void;
};
/** A component that renders a single day cell in the calendar grid */
export const CalendarGridDay = component$<PublicCalendarGridDayProps>(
  ({ onDateChange$, ...buttonProps }) => {
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
            <tr
              key={`${week.toString()}-${index}`}
              // Identifies a row in the calendar grid body
              data-qds-calendar-grid-body-row
              class=""
            >
              {context.showWeekNumber && (
                // Displays the week number in the calendar grid
                <td data-qds-calendar-grid-body-week-number>
                  <span>
                    {(() => {
                      const validDay = week.find((day): day is string => day !== null);
                      return validDay ? getWeekNumber(validDay).toString() : "";
                    })()}
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
                        // Indicates if this date is the current date
                        data-current={day === context.currentDate}
                        // Indicates if this date is currently selected
                        data-selected={day === context.activeDate.value}
                        aria-selected={
                          day === context.activeDate.value ? "true" : undefined
                        }
                        // Stores the date value for this calendar cell
                        data-value={day}
                        aria-label={label}
                        disabled={disabled}
                        tabIndex={day === context.dateToFocus.value ? 0 : -1}
                        onClick$={[
                          $(() => {
                            context.activeDate.value = day as LocalDate;
                            onDateChange$?.(day as LocalDate);
                          })
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
  }
);
