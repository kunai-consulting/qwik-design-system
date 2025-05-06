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
import { type BindableProps, useBindings } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { ARIA_LABELS, MONTHS_LG } from "../calendar/constants";
import type { DateFormat, ISODate, Locale } from "../calendar/types";
import { Render } from "../render/render";
import type { DateInputContext } from "./date-input-context";
import { dateInputContextId } from "./date-input-context";
import { getSegmentsFromFormat, getSeparatorFromFormat } from "./utils";

export type PublicDateInputRootProps = PropsOf<"div"> & {
  /** The locale used for formatting dates and text */
  locale?: Locale;
  /** The format of the date. Controls the appearance of the date input. Defaults to "mm/dd/yyyy". */
  format?: DateFormat;
  /** Event handler called when a date is selected */
  onChange$?: QRL<(date: ISODate | null) => void>;
} & BindableProps<DateInputBoundProps>;

export type DateInputBoundProps = {
  /** The currently selected date */
  date: ISODate | null;
  /** When enabled prevents the user from interacting with the date input */
  disabled: boolean;
};

// Regular expression for validating ISO date format (yyyy-mm-dd)
const regex = /^\d{4}-(0[1-9]|1[0-2])-\d{2}$/;

/** The root Date Input component that manages state and provides context */
export const DateInputRootBase = component$<PublicDateInputRootProps>((props) => {
  const locale = props.locale || "en";
  const format = props.format;
  const onDateChange$ = props.onChange$;
  const labelStr = props["aria-label"] ?? ARIA_LABELS[locale].root;
  const { dateSig, disabledSig } = useBindings<DateInputBoundProps>(props, {
    date: props.date ?? null,
    disabled: false
  });

  const localId = useId();
  const dateFormat = format ?? "m/d/yyyy";
  const separator = getSeparatorFromFormat(dateFormat);
  const segments = getSegmentsFromFormat(dateFormat, separator, dateSig.value);
  const activeSegmentIndex = useSignal<number>(-1);

  // This flag helps maintain two behaviors when the date changes to null.
  // 1. When the date signal changes to null programmatically, we want to clear all segments.
  // 2. When the date is cleared via keyboard input on an individual segment, we leave the other segments unchanged.
  // See usage in updateSegmentsWithNewDateValue
  const isInternalSegmentClearance = useSignal<boolean>(false);

  // biome-ignore lint/style/noNonNullAssertion: valid format will always include day
  const dayOfMonthSegmentSig = segments.find((s) => s.value.type === "day")!;
  // biome-ignore lint/style/noNonNullAssertion: valid format will always include month
  const monthSegmentSig = segments.find((s) => s.value.type === "month")!;
  // biome-ignore lint/style/noNonNullAssertion: valid format will always include year
  const yearSegmentSig = segments.find((s) => s.value.type === "year")!;

  const focusNextSegment$ = $(() => {
    if (activeSegmentIndex.value >= 0 && activeSegmentIndex.value < segments.length - 1) {
      // Move to the next segment
      activeSegmentIndex.value++;
    }
  });

  const context: DateInputContext = {
    locale,
    dateSig,
    localId,
    format: dateFormat,
    disabledSig,
    separator,
    orderedSegments: segments,
    dayOfMonthSegmentSig,
    monthSegmentSig,
    yearSegmentSig,
    activeSegmentIndex,
    focusNextSegment$,
    isInternalSegmentClearance
  };

  useContextProvider(dateInputContextId, context);

  const labelSignal = useComputed$(() => {
    if (!dateSig.value) return labelStr;
    const [year, month] = dateSig.value.split("-");

    return `${labelStr} ${MONTHS_LG[locale][+month - 1]} ${year}`;
  });

  if (props.date && !regex.test(props.date)) {
    throw new Error("Invalid date format. Please use yyyy-mm-dd format.");
  }

  /**
   * Updates the segments with the new date value.
   *
   * @param date - The new date value or null
   *
   * This method is used to react to updates to the date signal, particularly those originating from outside the component,
   * to make sure the segments match the date value.
   */
  const updateSegmentsWithNewDateValue = $((date: ISODate | null) => {
    if (date !== null) {
      const [year, month, day] = date.split("-");
      if (yearSegmentSig.value.numericValue !== +year) {
        yearSegmentSig.value = {
          ...yearSegmentSig.value,
          numericValue: +year,
          displayValue: year,
          isPlaceholder: false
        };
      }
      if (monthSegmentSig.value.numericValue !== +month) {
        monthSegmentSig.value = {
          ...monthSegmentSig.value,
          numericValue: +month,
          displayValue: month,
          isPlaceholder: false
        };
      }
      if (dayOfMonthSegmentSig.value.numericValue !== +day) {
        dayOfMonthSegmentSig.value = {
          ...dayOfMonthSegmentSig.value,
          numericValue: +day,
          displayValue: day,
          isPlaceholder: false
        };
      }
    } else if (!context.isInternalSegmentClearance.value) {
      if (!yearSegmentSig.value.isPlaceholder) {
        yearSegmentSig.value = {
          ...yearSegmentSig.value,
          numericValue: undefined,
          displayValue: undefined,
          isPlaceholder: true
        };
      }
      if (!monthSegmentSig.value.isPlaceholder) {
        monthSegmentSig.value = {
          ...monthSegmentSig.value,
          numericValue: undefined,
          displayValue: undefined,
          isPlaceholder: true
        };
      }
      if (!dayOfMonthSegmentSig.value.isPlaceholder) {
        dayOfMonthSegmentSig.value = {
          ...dayOfMonthSegmentSig.value,
          numericValue: undefined,
          displayValue: undefined,
          isPlaceholder: true
        };
      }
      context.activeSegmentIndex.value = -1;
    }
    context.isInternalSegmentClearance.value = false;
  });

  useTask$(async ({ track }) => {
    const date = track(() => dateSig.value);
    await updateSegmentsWithNewDateValue(date);
    if (onDateChange$) {
      await onDateChange$(date);
    }
  });

  return (
    <Render
      fallback="div"
      data-qds-date-input-root
      data-theme="light"
      aria-label={labelSignal.value}
      {...props}
    >
      <Slot />
    </Render>
  );
});

export const DateInputRoot = withAsChild(DateInputRootBase);
