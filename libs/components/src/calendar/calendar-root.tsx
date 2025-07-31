import { type BindableProps, useBindings } from "@kunai-consulting/qwik-utils";
import {
  type QRL,
  Slot,
  component$,
  useComputed$,
  useContextProvider,
  useId,
  useSignal,
  useTask$,
  useVisibleTask$
} from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { PopoverRootBase, type PopoverRootProps } from "../popover/popover-root";
import type { CalendarContext } from "./calendar-context";
import { calendarContextId } from "./calendar-context";
import "./calendar-root.css";
import { ARIA_LABELS, MONTHS_LG, WEEKDAYS } from "./constants";
import type { ISODate, Locale, Month } from "./types";
import { daysArrGenerator } from "./utils";

export type PublicCalendarRootProps = Omit<PopoverRootProps, "onChange$"> & {
  /** The locale used for formatting dates and text */
  locale?: Locale;
  /** Whether to show week numbers in the calendar */
  showWeekNumber?: boolean;
  /** Whether to show complete weeks by including days from adjacent months */
  fullWeeks?: boolean;
  /** Whether to show the days of the week header */
  showDaysOfWeek?: boolean;
  /** Event handler called when a date is selected */
  onChange$?: QRL<(date: ISODate | null) => void>;
  /** The display mode of the calendar */
  mode?: "inline" | "popover";
} & BindableProps<CalendarRootBoundProps>;

export type CalendarRootBoundProps = {
  /** The currently selected date */
  date: ISODate | null;
  /** When enabled prevents the user from interacting with the controls */
  disabled: boolean;
  /** The open state of the calendar popover */
  open: boolean;
};

// Regular expression for validating ISO date format (yyyy-mm-dd)
const isoDateRegex = /^\d{1,4}-(0[1-9]|1[0-2])-\d{2}$/;

/** The root calendar component that manages state and provides context */
export const CalendarRootBase = component$<PublicCalendarRootProps>((props) => {
  const {
    fullWeeks = false,
    locale = "en",
    showWeekNumber = false,
    showDaysOfWeek = true,
    onChange$,
    mode = "inline",
    ...otherProps
  } = props;
  const { dateSig, disabledSig, openSig } = useBindings<CalendarRootBoundProps>(props, {
    date: props.date ?? null,
    disabled: false,
    open: false
  });
  const labelStr = props["aria-label"] ?? ARIA_LABELS[locale].root;
  const daysOfWeek = WEEKDAYS[locale];
  const date = new Date();
  const currentDate =
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` as ISODate;
  const initialDate = dateSig.value ?? currentDate;
  const yearToRender = useSignal<number>(+initialDate.split("-")[0]);
  const monthToRender = useSignal<Month>(initialDate.split("-")[1] as Month);
  const dateToFocus = useSignal<ISODate>(initialDate);
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
    dateSig,
    dateToFocus,
    currentDate,
    localId,
    isPopoverOpenSig: openSig,
    mode,
    disabledSig
  };

  useContextProvider(calendarContextId, context);

  const labelSignal = useComputed$(() => {
    if (!dateSig.value) return labelStr;
    const [year, month] = dateSig.value.split("-");

    return `${labelStr} ${MONTHS_LG[locale][+month - 1]} ${year}`;
  });

  if (!isoDateRegex.test(initialDate))
    throw new Error("Invalid date format in Calendar. Please use YYYY-MM-DD format.");

  useVisibleTask$(({ track, cleanup }) => {
    const datesArr = track(() => datesArray.value);

    if (datesArr.flat().includes(dateToFocus.value)) {
      const btn = document.querySelector(
        `button[data-value="${dateToFocus.value}"]`
      ) as HTMLButtonElement | null;
      btn?.focus();
    }

    cleanup(() => {
      const btn = document.querySelector(
        `button[data-value="${dateToFocus.value}"]`
      ) as HTMLButtonElement | null;
      btn?.blur();
    });
  });

  useTask$(({ track }) => {
    const newDate = track(() => dateSig.value);

    if (newDate) {
      yearToRender.value = +newDate.split("-")[0];
      monthToRender.value = newDate.split("-")[1] as Month;
      dateToFocus.value = newDate;
    }
  });

  return (
    <PopoverRootBase
      data-qds-calendar-root
      aria-label={labelSignal.value}
      bind:open={openSig}
      {...otherProps}
    >
      <Slot />
    </PopoverRootBase>
  );
});

export const CalendarRoot = withAsChild(CalendarRootBase);
