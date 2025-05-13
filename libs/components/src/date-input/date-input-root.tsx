import {
  $,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  component$,
  useComputed$,
  useContextProvider,
  useId,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import {
  type BindableProps,
  resetIndexes,
  useBindings
} from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { ARIA_LABELS, MONTHS_LG } from "../calendar/constants";
import type { ISODate, Locale } from "../calendar/types";
import { Render } from "../render/render";
import type { DateInputContext } from "./date-input-context";
import { dateInputContextId } from "./date-input-context";
import { getInitialSegments } from "./utils";

export type PublicDateInputRootProps = Omit<PropsOf<"div">, "onChange$"> & {
  /** The locale used for formatting dates and text */
  locale?: Locale;
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
  const { onChange$, ...rest } = props;
  const isInitialLoadSig = useSignal(true);
  const locale = props.locale || "en";
  const labelStr = props["aria-label"] ?? ARIA_LABELS[locale].root;
  const { dateSig, disabledSig } = useBindings<DateInputBoundProps>(props, {
    date: props.date ?? null,
    disabled: false
  });

  const localId = useId();
  const { dayOfMonthSegment, monthSegment, yearSegment } = getInitialSegments(
    dateSig.value
  );
  const dayOfMonthSegmentSig = useSignal(dayOfMonthSegment);
  const monthSegmentSig = useSignal(monthSegment);
  const yearSegmentSig = useSignal(yearSegment);

  // Focus management signals and methods
  const segmentRefs = useSignal<Signal<HTMLInputElement | undefined>[]>([]);

  // This flag helps maintain two behaviors when the date changes to null.
  // 1. When the date signal changes to null programmatically, we want to clear all segments.
  // 2. When the date is cleared via keyboard input on an individual segment, we leave the other segments unchanged.
  // See usage in updateSegmentsWithNewDateValue
  const isInternalSegmentClearance = useSignal<boolean>(false);

  const context: DateInputContext = {
    locale,
    dateSig,
    localId,
    disabledSig,
    dayOfMonthSegmentSig,
    monthSegmentSig,
    yearSegmentSig,
    isInternalSegmentClearance,
    segmentRefs
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
    console.log("updateSegmentsWithNewDateValue", date);
    if (date !== null) {
      const [year, month, day] = date.split("-");
      if (yearSegmentSig.value.numericValue !== +year) {
        yearSegmentSig.value = {
          ...yearSegmentSig.value,
          numericValue: +year,
          isoValue: year,
          isPlaceholder: false
        };
      }
      if (monthSegmentSig.value.numericValue !== +month) {
        monthSegmentSig.value = {
          ...monthSegmentSig.value,
          numericValue: +month,
          isoValue: month,
          isPlaceholder: false
        };
      }
      if (dayOfMonthSegmentSig.value.numericValue !== +day) {
        dayOfMonthSegmentSig.value = {
          ...dayOfMonthSegmentSig.value,
          numericValue: +day,
          isoValue: day,
          isPlaceholder: false
        };
      }
    } else if (!context.isInternalSegmentClearance.value) {
      if (!yearSegmentSig.value.isPlaceholder) {
        yearSegmentSig.value = {
          ...yearSegmentSig.value,
          numericValue: undefined,
          isoValue: undefined,
          isPlaceholder: true
        };
      }
      if (!monthSegmentSig.value.isPlaceholder) {
        monthSegmentSig.value = {
          ...monthSegmentSig.value,
          numericValue: undefined,
          isoValue: undefined,
          isPlaceholder: true
        };
      }
      if (!dayOfMonthSegmentSig.value.isPlaceholder) {
        dayOfMonthSegmentSig.value = {
          ...dayOfMonthSegmentSig.value,
          numericValue: undefined,
          isoValue: undefined,
          isPlaceholder: true
        };
      }
    }
    context.isInternalSegmentClearance.value = false;
  });

  useTask$(async ({ track, cleanup }) => {
    const date = track(() => dateSig.value);
    await updateSegmentsWithNewDateValue(date);
    if (!isInitialLoadSig.value && onChange$) {
      await onChange$(date);
    }
    cleanup(() => {
      isInitialLoadSig.value = false;
    });
  });

  return (
    <Render
      fallback="div"
      data-qds-date-input-root
      data-theme="light"
      aria-label={labelSignal.value}
      {...rest}
    >
      <Slot />
    </Render>
  );
});

export const DateInputRoot = withAsChild(DateInputRootBase, (props) => {
  resetIndexes("date-input-segment");
  return props;
});
