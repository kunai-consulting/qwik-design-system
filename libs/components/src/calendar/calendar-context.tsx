import { type Signal, createContextId } from "@builder.io/qwik";
import type { ISODate, Locale, Month } from "./types";

export const calendarContextId = createContextId<CalendarContext>("qds-calendar-context");

export type CalendarContext = {
  locale: Locale;
  activeDate: Signal<ISODate | null>;
  dateToFocus: Signal<ISODate>;
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
  currentDate: ISODate;
  localId: string;
  isPopoverOpenSig: Signal<boolean>;
  mode: "inline" | "popover";
  disabledSig: Signal<boolean>;
};
