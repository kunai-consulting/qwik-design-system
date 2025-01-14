import { type Signal, createContextId } from "@builder.io/qwik";
import type { Locale, Month, LocalDate } from "./types";

export const calendarContextId = createContextId<CalendarContext>(
  "qds-calendar-context"
);

export type CalendarContext = {
  locale: Locale;
  defaultDate: LocalDate;
  activeDate: Signal<LocalDate | null>;
  dateToFocus: Signal<LocalDate>;
  showWeekNumber: boolean;
  showDaysOfWeek: boolean;
  daysOfWeek: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  datesArray: Signal<(string | null)[][]>;
  monthToRender: Signal<Month>;
  yearToRender: Signal<number>;
  currentDate: LocalDate;
  localId: string;
  isPopoverOpenSig: Signal<boolean>;
};
