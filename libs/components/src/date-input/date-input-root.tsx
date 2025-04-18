import {
  $,
  type PropsOf,
  type QRL,
  Slot,
  component$,
  useComputed$,
  useContextProvider,
  useId,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { ARIA_LABELS, MONTHS_LG } from "../calendar/constants";
import type { DateFormat, ISODate, LocalDate, Locale } from "../calendar/types";
import type { DateInputContext } from "./date-input-context";
import { dateInputContextId } from "./date-input-context";
import {
  getISODate,
  getLocalDate,
  getSegmentsFromFormat,
  getSeparatorFromFormat
} from "./utils";
export type PublicDateInputRootProps = PropsOf<"div"> & {
  /** The locale used for formatting dates and text */
  locale?: Locale;
  /** The initial date to display when the calendar first loads */
  defaultDate?: Date | ISODate;
  /** The currently selected date */
  date?: LocalDate;
  /** The format of the date. Controls the appearance of the date input. Defaults to "mm/dd/yyyy". */
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
    const defaultDate =
      props.defaultDate && props.defaultDate instanceof Date
        ? getISODate(props.defaultDate)
        : props.defaultDate;
    const activeDateSig = useSignal<LocalDate | null>(null);
    const localId = useId();
    const dateFormat = format ?? "mm/dd/yyyy";
    const separator = getSeparatorFromFormat(dateFormat);
    const segments = getSegmentsFromFormat(dateFormat, separator, defaultDate).map((s) =>
      useSignal(s)
    );

    // signal to track the active segment index
    const activeSegmentIndex = useSignal<number>(-1);

    // biome-ignore lint/style/noNonNullAssertion: valid format will always include day
    const dayOfMonthSegmentSig = segments.find((s) => s.value.type === "day")!;
    // biome-ignore lint/style/noNonNullAssertion: valid format will always include month
    const monthSegmentSig = segments.find((s) => s.value.type === "month")!;
    // biome-ignore lint/style/noNonNullAssertion: valid format will always include year
    const yearSegmentSig = segments.find((s) => s.value.type === "year")!;

    const focusNextSegment$ = $(() => {
      if (
        activeSegmentIndex.value >= 0 &&
        activeSegmentIndex.value < segments.length - 1
      ) {
        // Move to the next segment
        activeSegmentIndex.value++;
      }
    });

    const context: DateInputContext = {
      locale,
      defaultDate,
      activeDateSig,
      currentDate,
      localId,
      format: dateFormat,
      separator,
      orderedSegments: segments,
      dayOfMonthSegmentSig,
      monthSegmentSig,
      yearSegmentSig,
      activeSegmentIndex,
      focusNextSegment$
    };

    useContextProvider(dateInputContextId, context);

    const labelSignal = useComputed$(() => {
      if (!activeDateSig.value) return labelStr;
      const [year, month] = activeDateSig.value.split("-");

      return `${labelStr} ${MONTHS_LG[locale][+month - 1]} ${year}`;
    });

    if (defaultDate && !regex.test(defaultDate)) {
      throw new Error("Invalid date format. Please use yyyy-mm-dd format.");
    }

    useTask$(({ track }) => {
      const date = track(() => activeDateSig.value);
      if (onDateChange$) {
        onDateChange$(date);
      }
    });

    return (
      <div
        data-qds-date-input-root
        data-theme="light"
        aria-label={labelSignal.value}
        {...props}
      >
        <Slot />
      </div>
    );
  }
);
