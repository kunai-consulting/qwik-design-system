import {
  type PropsOf,
  type QRL,
  Slot,
  component$,
  useComputed$,
  useContextProvider,
  useId,
  useSignal,
  useTask$,
  useVisibleTask$
} from "@builder.io/qwik";
import type { DateInputContext } from "./date-input-context";
import { dateInputContextId } from "./date-input-context";
import { ARIA_LABELS, MONTHS_LG } from "../calendar/constants";
import type { DateFormat, LocalDate, Locale, Month } from "../calendar/types";
import { getLocalDate, getSegmentsFromFormat, getSeparatorFromFormat } from "./utils";
export type PublicDateInputRootProps = PropsOf<"div"> & {
  /** The locale used for formatting dates and text */
  locale?: Locale;
  /** The initial date to display when the calendar first loads */
  defaultDate?: LocalDate;
  /** The currently selected date */
  date?: LocalDate;
  /** The format of the date */
  format?: DateFormat;
  /** Event handler called when a date is selected */
  onDateChange$?: QRL<(date: LocalDate | null) => void>;
};
const regex = /^\d{4}-(0[1-9]|1[0-2])-\d{2}$/;
/** The root Date Input component that manages state and provides context */
export const DateInputRoot = component$<PublicDateInputRootProps>(
  ({ date: dateProp, locale = "en", format, onDateChange$, ...props }) => {
    const labelStr = props["aria-label"] ?? ARIA_LABELS[locale].root;
    const date = new Date();
    const currentDate = getLocalDate(date);
    const defaultDate = props.defaultDate ?? currentDate;
    const activeDate = useSignal<LocalDate | null>(null);
    const monthToRender = useSignal<Month>(defaultDate.split("-")[1] as Month);
    const yearToRender = useSignal<number>(+defaultDate.split("-")[0]);
    const localId = useId();
    const maxDayOfMonth = useSignal<number>(31);
    const dateFormat = format ?? "mm/dd/yyyy";
    const separator = getSeparatorFromFormat(dateFormat);
    const segments = getSegmentsFromFormat(dateFormat, separator).map((s) =>
      useSignal(s)
    );
    
    // biome-ignore lint/style/noNonNullAssertion: valid format will always include day
    const dayOfMonthSegmentSig = segments.find((s) => s.value.type === "day")!;
    // biome-ignore lint/style/noNonNullAssertion: valid format will always include month
    const monthSegmentSig = segments.find((s) => s.value.type === "month")!;
    // biome-ignore lint/style/noNonNullAssertion: valid format will always include year
    const yearSegmentSig = segments.find((s) => s.value.type === "year")!;

    const context: DateInputContext = {
      locale,
      monthToRender,
      yearToRender,
      maxDayOfMonth,
      defaultDate,
      activeDate,
      currentDate,
      localId,
      format: dateFormat,
      separator,
      orderedSegments: segments,
      dayOfMonthSegmentSig,
      monthSegmentSig,
      yearSegmentSig
    };

    useContextProvider(dateInputContextId, context);

    const labelSignal = useComputed$(() => {
      if (!activeDate.value) return labelStr;
      const [year, month] = activeDate.value.split("-");

      return `${labelStr} ${MONTHS_LG[locale][+month - 1]} ${year}`;
    });

    if (!regex.test(defaultDate))
      throw new Error("Invalid date format. Please use yyyy-mm-dd format.");

    useTask$(({ track }) => {
      const date = track(() => activeDate.value);
      if (onDateChange$) {
        onDateChange$(date);
      }
    });

    useVisibleTask$(({ track, cleanup }) => {
      // track(() => datesArray.value);
      // if (datesArray.value.flat().includes(dateToFocus.value)) {
      //   const btn = document.querySelector(
      //     `button[data-value="${dateToFocus.value}"]`
      //   ) as HTMLButtonElement | null;
      //   btn?.focus();
      //   btn?.setAttribute("tabindex", "0");
      // }
      // cleanup(() => {
      //   const btn = document.querySelector(
      //     `button[data-value="${dateToFocus.value}"]`
      //   ) as HTMLButtonElement | null;
      //   btn?.setAttribute("tabindex", "-1");
      //   btn?.blur();
      // });
    });

    return (
      <div
        // The root container of the Date Input component
        data-qds-date-input-root
        // Controls the visual theme of the Date Input
        data-theme="light"
        aria-label={labelSignal.value}
        {...props}
      >
        <Slot />
      </div>
    );
  }
);
