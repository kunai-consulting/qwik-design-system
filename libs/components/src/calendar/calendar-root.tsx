import {
  $,
  type Component,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  component$,
  useComputed$,
  useContextProvider,
  useId,
  useSignal,
  useVisibleTask$
} from "@qwik.dev/core";

import { useBoundSignal } from "../../utils/bound-signal";
import type { CalendarContext } from "./calendar-context";
import { calendarContextId } from "./calendar-context";
import { ARIA_LABELS, MONTHS_LG, WEEKDAYS } from "./constants";
import type { LocalDate, Locale, Month } from "./types";
import { daysArrGenerator } from "./utils";
export type PublicCalendarRootProps = PropsOf<"div"> & {
  /** The locale used for formatting dates and text */
  locale?: Locale;
  /** The initial date to display when the calendar first loads */
  defaultDate?: LocalDate;
  /** Whether to show week numbers in the calendar */
  showWeekNumber?: boolean;
  /** Whether to show complete weeks by including days from adjacent months */
  fullWeeks?: boolean;
  /** The currently selected date */
  date?: LocalDate;
  /** Whether to show the days of the week header */
  showDaysOfWeek?: boolean;
  /** Event handler called when a date is selected */
  onDateChange$?: QRL<(date: LocalDate) => void>;
  /** Reactive value to control the open state of the calendar popover */
  "bind:open"?: Signal<boolean>;
};
const regex = /^\d{4}-(0[1-9]|1[0-2])-\d{2}$/;
/** The root calendar component that manages state and provides context */
export const CalendarRoot = component$<PublicCalendarRootProps>(
  ({
    date: dateProp,
    fullWeeks = false,
    locale = "en",
    showWeekNumber = false,
    showDaysOfWeek = true,
    onDateChange$,
    "bind:open": givenOpenSig,
    ...props
  }) => {
    const labelStr = props["aria-label"] ?? ARIA_LABELS[locale].root;
    const daysOfWeek = WEEKDAYS[locale];
    const isPopoverOpenSig = useBoundSignal(givenOpenSig, false);
    const date = new Date();
    const currentDate =
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` as LocalDate;
    const defaultDate = props.defaultDate ?? currentDate;
    const activeDate = useSignal<LocalDate | null>(null);
    const monthToRender = useSignal<Month>(defaultDate.split("-")[1] as Month);
    const yearToRender = useSignal<number>(+defaultDate.split("-")[0]);
    const dateToFocus = useSignal<LocalDate>(defaultDate);
    const localId = useId();

    const datesArray = useComputed$(() => {
      const dates = daysArrGenerator({
        month: monthToRender.value,
        year: yearToRender.value.toString(),
        fullWeeks
      });
      return dates;
    });

    const context: CalendarContext = {
      showWeekNumber,
      showDaysOfWeek,
      daysOfWeek,
      datesArray,
      locale,
      monthToRender,
      yearToRender,
      defaultDate,
      activeDate,
      dateToFocus,
      currentDate,
      localId,
      isPopoverOpenSig
    };

    useContextProvider(calendarContextId, context);

    const labelSignal = useComputed$(() => {
      if (!activeDate.value) return labelStr;
      const [year, month] = activeDate.value.split("-");

      return `${labelStr} ${MONTHS_LG[locale][+month - 1]} ${year}`;
    });

    if (!regex.test(defaultDate))
      throw new Error("Invalid date format in Calendar. Please use YYYY-MM-DD format.");

    useVisibleTask$(({ track, cleanup }) => {
      track(() => datesArray.value);

      if (datesArray.value.flat().includes(dateToFocus.value)) {
        const btn = document.querySelector(
          `button[data-value="${dateToFocus.value}"]`
        ) as HTMLButtonElement | null;
        btn?.focus();
        btn?.setAttribute("tabindex", "0");
      }

      cleanup(() => {
        const btn = document.querySelector(
          `button[data-value="${dateToFocus.value}"]`
        ) as HTMLButtonElement | null;
        btn?.setAttribute("tabindex", "-1");
        btn?.blur();
      });
    });

    return (
      <div
        // The root container of the calendar component
        data-qds-datepicker-root
        // Controls the visual theme of the calendar
        data-theme="light"
        aria-label={labelSignal.value}
        {...props}
      >
        <Slot />
      </div>
    );
  }
);
