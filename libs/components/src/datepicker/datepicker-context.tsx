import { type Signal, createContextId } from "@builder.io/qwik";
import type { Locale, Month } from "./types";

export const datepickerContextId = createContextId<DatepickerContext>(
  "qds-datepicker-context"
);

export type DatepickerContext = {
  locale: Locale;
  defaultDate: Signal<`${number}-${number}-${number}`>;
  activeDate: Signal<`${number}-${number}-${number}` | null>;
  dateToFocus: Signal<`${number}-${number}-${number}`>;
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
};
