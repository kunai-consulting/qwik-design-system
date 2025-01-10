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
  useSignal,
  useVisibleTask$
} from "@builder.io/qwik";

import { ARIA_LABELS, MONTHS_LG, WEEKDAYS } from "./constants";
import type { DatepickerContext } from "./datepicker-context";
import { datepickerContextId } from "./datepicker-context";
import type { LocalDate, Locale, Month } from "./types";
import { daysArrGenerator } from "./utils";

export type DatePickerRootProps = PropsOf<"div"> & {
  locale?: Locale;
  showWeekNumber?: boolean;
  fullWeeks?: boolean;
  date?: LocalDate;
  "bind:date"?: Signal<LocalDate>;
  showDaysOfWeek?: boolean;
  onDateChange$?: QRL<(date: LocalDate) => void>;
}

const regex = /^\d{4}-(0[1-9]|1[0-2])-\d{2}$/;

export const DatePickerRoot = component$<DatePickerRootProps>(
  ({
    date: dateProp,
    fullWeeks = false,
    locale = "en",
    showWeekNumber = false,
    showDaysOfWeek = true,
    onDateChange$,
    ...props
  }) => {
    const date = new Date().toISOString().split("T")[0] as LocalDate;
    const labelStr = props["aria-label"] ?? ARIA_LABELS[locale].root;
    const daysOfWeek = WEEKDAYS[locale];

    const dateSignal = useSignal<LocalDate>(dateProp ?? date);
    const defaultDate = props["bind:date"] ?? dateSignal;
    const activeDate = useSignal<LocalDate | null>(null);
    const monthToRender = useSignal<Month>(defaultDate.value.split("-")[1] as Month);
    const yearToRender = useSignal<number>(+defaultDate.value.split("-")[0]);
    const dateToFocus = useSignal<LocalDate>(defaultDate.value);

    const datesArray = useComputed$(() => {
      const dates = daysArrGenerator({
        month: monthToRender.value,
        year: yearToRender.value.toString(),
        fullWeeks
      });
      return dates;
    });

    const context: DatepickerContext = {
      showWeekNumber,
      showDaysOfWeek,
      daysOfWeek,
      datesArray,
      locale,
      monthToRender,
      yearToRender,
      defaultDate,
      activeDate,
      dateToFocus
    };

    useContextProvider(datepickerContextId, context);

    const labelSignal = useComputed$(() => {
      if (!activeDate.value) return labelStr;
      const [year, month] = activeDate.value.split("-");

      return `${labelStr} ${MONTHS_LG[locale][+month - 1]} ${year}`;
    });

    if (!regex.test(defaultDate.value))
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
        data-qds-datepicker-root
        data-theme="light"
        aria-label={labelSignal.value}
        {...props}
      >
        <Slot />
      </div>
    );
  }
);
