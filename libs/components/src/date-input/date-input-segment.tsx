import {
  $,
  type PropsOf,
  component$,
  useComputed$,
  useContext,
  useSignal,
  useStyles$,
  useTask$
} from "@builder.io/qwik";
import type { Signal } from "@builder.io/qwik";
import { dateInputContextId } from "./date-input-context";
import styles from "./date-input-segment.css?inline";
import type { DateSegment } from "./types";

type PublicDateInputSegmentProps = PropsOf<"input"> & {
  segmentSig: Signal<DateSegment>;
  isEditable: boolean;
};

/** Segment component for the Date Input */
export const DateInputSegment = component$(
  ({ segmentSig, isEditable, ...otherProps }: PublicDateInputSegmentProps) => {
    const context = useContext(dateInputContextId);
    const inputId = `${context.localId}-trigger`;
    useStyles$(styles);

    const updateActiveDate = $(() => {
      // After a segment updates, we need to update the activeDate
      // by combining all three segments into a valid date string
      const year = context.yearSegmentSig.value.numericValue;
      const month = context.monthSegmentSig.value.numericValue;
      const day = context.dayOfMonthSegmentSig.value.numericValue;

      if (year && month && day) {
        const date = new Date(year, month - 1, day);
        const isValidDate = date.toString() !== "Invalid Date";
        if (isValidDate) {
          // Update the activeDate in yyyy-mm-dd format
          context.activeDateSig.value = `${year}-${month}-${day}`;
        } else {
          // Try updating the day of the month to the last day of the month
          const lastDayOfMonth = new Date(year, month - 1, 0).getDate();
          context.dayOfMonthSegmentSig.value = {
            ...context.dayOfMonthSegmentSig.value,
            numericValue: lastDayOfMonth,
            displayValue: `${lastDayOfMonth}`
          } as DateSegment;
        }
      } else {
        context.activeDateSig.value = null;
      }
    });
    useTask$(({ track }) => {
      track(() => segmentSig.value);
      updateActiveDate();
    });

    const updateDayOfMonthSegmentForYearAndMonth = $(
      (year: number | undefined, month: number | undefined) => {
        const currentDayOfMonthSegment = context.dayOfMonthSegmentSig.value;
        let updatedDayOfMonthSegment: DateSegment;
        if (year && month) {
          const lastDayOfMonth = new Date(year, month, 0).getDate();
          const updatedDayOfMonth =
            (currentDayOfMonthSegment.numericValue ?? -1) > lastDayOfMonth
              ? lastDayOfMonth
              : currentDayOfMonthSegment.numericValue;
          updatedDayOfMonthSegment = {
            ...currentDayOfMonthSegment,
            max: lastDayOfMonth,
            numericValue: updatedDayOfMonth,
            displayValue: updatedDayOfMonth ? `${updatedDayOfMonth}` : undefined
          };
        } else {
          updatedDayOfMonthSegment = {
            ...currentDayOfMonthSegment,
            max: 31
          };
        }
        context.dayOfMonthSegmentSig.value = updatedDayOfMonthSegment;
      }
    );

    const incrementYearValue = $((changeBy: number) => {
      const currentValue = segmentSig.value?.numericValue;
      const newValue = currentValue ? currentValue + changeBy : new Date().getFullYear();

      segmentSig.value = {
        ...segmentSig.value,
        isPlaceholder: false,
        numericValue: newValue,
        displayValue: `${newValue}`
      } as DateSegment;
      const month = context.monthSegmentSig.value.numericValue;
      updateDayOfMonthSegmentForYearAndMonth(newValue, month);
    });

    const incrementMonthValue = $((changeBy: number) => {
      const currentValue = segmentSig.value?.numericValue;
      let newValue = currentValue ? currentValue + changeBy : new Date().getMonth();
      if (newValue < segmentSig.value.min) {
        newValue = segmentSig.value.max;
      }
      if (newValue > segmentSig.value.max) {
        newValue = segmentSig.value.min;
      }
      const displayValue =
        segmentSig.value.placeholderText.length === 2 && newValue < 10
          ? `0${newValue}`
          : `${newValue}`;
      segmentSig.value = {
        ...segmentSig.value,
        isPlaceholder: false,
        numericValue: newValue,
        displayValue
      } as DateSegment;
      const year = context.yearSegmentSig.value.numericValue;
      updateDayOfMonthSegmentForYearAndMonth(year, newValue);
    });

    const incrementDayValue = $((changeBy: number) => {
      const segment = segmentSig.value;
      const currentValue = segment.numericValue;
      let newValue = currentValue ? currentValue + changeBy : new Date().getDate();
      if (newValue < segment.min) {
        newValue = segment.max;
      }
      if (newValue > segment.max) {
        newValue = segment.min;
      }
      const displayValue =
        segment.placeholderText.length === 2 && newValue < 10
          ? `0${newValue}`
          : `${newValue}`;
      segmentSig.value = {
        ...segment,
        isPlaceholder: false,
        numericValue: newValue,
        displayValue
      } as DateSegment;
    });

    const incrementValue = $(() => {
      switch (segmentSig.value.type) {
        case "year":
          incrementYearValue(1);
          break;
        case "month":
          incrementMonthValue(1);
          break;
        case "day":
          incrementDayValue(1);
          break;
      }
    });

    const decrementValue = $(() => {
      switch (segmentSig.value.type) {
        case "year":
          incrementYearValue(-1);
          break;
        case "month":
          incrementMonthValue(-1);
          break;
        case "day":
          incrementDayValue(-1);
          break;
      }
    });

    const updateSegmentWithValue = $((textValue: string) => {
      const segment = segmentSig.value;
      let numericValue = +textValue;

      if (numericValue < segment.min) {
        numericValue = segment.min;
      } else if (numericValue > segment.max) {
        numericValue = segment.max;
      }
      segmentSig.value = {
        ...segment,
        isPlaceholder: false,
        numericValue: numericValue,
        displayValue:
          segment.type !== "year" &&
          segment.placeholderText.length === 2 &&
          numericValue < 10
            ? `0${numericValue}`
            : `${numericValue}`
      } as DateSegment;

      if (segment.type === "month") {
        const year = context.yearSegmentSig.value.numericValue;
        updateDayOfMonthSegmentForYearAndMonth(year, numericValue);
      }
      if (segment.type === "year") {
        const month = context.monthSegmentSig.value.numericValue;
        updateDayOfMonthSegmentForYearAndMonth(numericValue, month);
      }
    });

    const updateSegmentToPlaceholder = $(() => {
      const segment = segmentSig.value;
      segmentSig.value = {
        ...segment,
        isPlaceholder: true,
        numericValue: undefined,
        displayValue: undefined
      } as DateSegment;
    });

    // Create a ref for this specific input
    const inputRef = useSignal<HTMLInputElement>();

    // Find index of current segment in orderedSegments
    const segmentIndex = useComputed$(() => {
      return context.orderedSegments.findIndex(
        (s) => s.value.type === segmentSig.value.type
      );
    });

    // Watch for activeSegmentIndex changes and focus this segment when it matches
    useTask$(({ track }) => {
      const activeIndex = track(() => context.activeSegmentIndex.value);
      const thisIndex = track(() => segmentIndex.value);

      if (activeIndex === thisIndex && inputRef.value) {
        // Focus on next render cycle
        setTimeout(() => {
          if (document.activeElement !== inputRef.value) {
            inputRef.value?.focus();
            inputRef.value?.select();
          }
        }, 0);
      }
    });

    // Handler to handle keydown events (arrow keys, numeric input)
    const onKeyDown$ = $((event: KeyboardEvent) => {
      // Allow navigation keys (arrows, backspace, delete, tab)
      const allowedKeys = ["ArrowLeft", "ArrowRight", "Backspace", "Delete", "Tab"];
      if (allowedKeys.includes(event.key)) {
        return;
      }

      if (event.key === "ArrowUp") {
        incrementValue();
        event.preventDefault();
        return;
      }

      if (event.key === "ArrowDown") {
        decrementValue();
        event.preventDefault();
        return;
      }

      // Allow numeric keys only
      if (!/^\d$/.test(event.key)) {
        event.preventDefault();
      }
    });

    // Process input and update our segment and date values accordingly
    const onInput$ = $((event: InputEvent) => {
      const segment = segmentSig.value;
      const target = event.target as HTMLInputElement;
      const content = target.value || "";
      const numericContent = content.replace(/\D/g, "");

      // If the format specifies leading zeros and the input is 0, allow it
      if (segment.placeholderText.length > 1 && numericContent === "0") {
        return;
      }

      if (numericContent.length > 0) {
        updateSegmentWithValue(numericContent);

        // Check if the segment is fully entered and move focus to the next segment
        const isYearFull = segment.type === "year" && numericContent.length >= 4;
        const isMonthFull =
          segment.type === "month" &&
          (numericContent.length >= 2 || +numericContent >= 2);
        const isDayFull =
          segment.type === "day" && (numericContent.length >= 2 || +numericContent >= 4);
        if (isYearFull || isMonthFull || isDayFull) {
          // Use the Qwik context function to move to the next segment
          context.activeSegmentIndex.value = segmentIndex.value;
          context.focusNextSegment$();
        }
      } else {
        updateSegmentToPlaceholder();
      }
    });

    return (
      <input
        {...otherProps}
        ref={inputRef}
        type="text"
        data-qds-date-input-segment
        data-qds-date-input-segment-placeholder={segmentSig.value.isPlaceholder}
        data-qds-date-input-segment-day={segmentSig.value.type === "day"}
        data-qds-date-input-segment-month={segmentSig.value.type === "month"}
        data-qds-date-input-segment-year={segmentSig.value.type === "year"}
        data-qds-date-input-segment-small={
          !(
            segmentSig.value.type === "year" &&
            segmentSig.value.placeholderText.length === 4
          )
        }
        data-qds-date-input-segment-large={
          segmentSig.value.type === "year" &&
          segmentSig.value.placeholderText.length === 4
        }
        value={segmentSig.value.displayValue}
        onKeyDown$={isEditable ? onKeyDown$ : undefined}
        onInput$={isEditable ? onInput$ : undefined}
        onClick$={
          isEditable
            ? $((_, element) => {
                // Update active segment index when clicked
                context.activeSegmentIndex.value = segmentIndex.value;
              })
            : undefined
        }
        placeholder={segmentSig.value.placeholderText}
        aria-label={`${segmentSig.value.type} input`}
        aria-valuemax={segmentSig.value.max}
        aria-valuemin={segmentSig.value.min}
        aria-valuenow={segmentSig.value.numericValue}
        disabled={!isEditable}
      />
    );
  }
);
