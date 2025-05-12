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
  useTask$,
  isBrowser,
  type Signal
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
  const focusableSegments = useSignal<HTMLInputElement[]>([]);
  const segmentRefs = useSignal<Signal<HTMLInputElement | undefined>[]>([]);

  // Sort segments based on their position in the DOM to ensure consistent tab order
  const sortFocusableSegmentsByDOMOrder = $(() => {
    if (focusableSegments.value.length <= 1) return;

    // Sort elements based on their position in the DOM
    const sortedSegments = [...focusableSegments.value].sort((a, b) => {
      // Use compareDocumentPosition to determine relative position
      const position = a.compareDocumentPosition(b);

      // If b follows a in the document
      if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
        return -1;
      }
      // If b precedes a in the document
      if (position & Node.DOCUMENT_POSITION_PRECEDING) {
        return 1;
      }
      // Elements are the same or not comparable
      return 0;
    });

    focusableSegments.value = sortedSegments;
    console.log("Sorted segments by DOM order");
  });

  const registerFocusableSegment$ = $(
    (element: HTMLInputElement, type: "day" | "month" | "year") => {
      // Skip if we're on the server
      if (!isBrowser) return;

      // Check if already registered
      if (!focusableSegments.value.includes(element)) {
        // Add to array
        console.log("Adding element to focusable segments");
        focusableSegments.value = [...focusableSegments.value, element];

        // Sort the segments to ensure proper navigation order
        sortFocusableSegmentsByDOMOrder();

        console.log("Current focusable segments:", focusableSegments.value.length);
      }
    }
  );

  const focusNextSegment$ = $((currentElement: HTMLInputElement) => {
    // Skip if we're on the server
    if (!isBrowser) return;

    console.log("moveFocusToNextSegment$", currentElement);
    console.log("Current focusable segments:", focusableSegments.value.length);

    const currentIndex = focusableSegments.value.indexOf(currentElement);
    console.log("Current index:", currentIndex);

    if (currentIndex >= 0 && currentIndex < focusableSegments.value.length - 1) {
      const nextElement = focusableSegments.value[currentIndex + 1];
      console.log("Moving focus to next element", nextElement);
      nextElement.focus();
      nextElement.select();
    }
  });

  const focusPreviousSegment$ = $((currentElement: HTMLInputElement) => {
    // Skip if we're on the server
    if (!isBrowser) return;

    console.log("focusPreviousSegment$", currentElement);
    console.log("Current focusable segments:", focusableSegments.value.length);

    const currentIndex = focusableSegments.value.indexOf(currentElement);
    console.log("Current index:", currentIndex);

    if (currentIndex > 0) {
      const prevElement = focusableSegments.value[currentIndex - 1];
      console.log("Moving focus to previous element", prevElement);
      prevElement.focus();
    }
  });

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
    focusNextSegment$,
    focusPreviousSegment$,
    focusableSegments,
    registerFocusableSegment$,
    isInternalSegmentClearance,
    segmentRefs,
    // TODO: remove these deprecated properties
    orderedSegments: [],
    activeSegmentIndex: useSignal(-1)
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
  resetIndexes("date-input-segment-type");
  return props;
});
