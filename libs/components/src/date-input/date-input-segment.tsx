import {
  $,
  component$,
  sync$,
  useComputed$,
  useContext,
  useSignal,
  useStyles$,
  useTask$
} from "@builder.io/qwik";
import type { Signal } from "@builder.io/qwik";
import type { DayOfMonth, Month } from "../calendar/types";
import { dateInputContextId } from "./date-input-context";
import styles from "./date-input-segment.css?inline";
import type { DateSegment } from "./types";
import type { PublicDateInputSegmentProps } from "./types";
import { getLastDayOfMonth, getTwoDigitPaddedValue } from "./utils";

type DateInputSegmentProps = PublicDateInputSegmentProps & {
  segmentSig: Signal<DateSegment>;
  isEditable: boolean;
  maxLength: number;
  placeholder: string;
};

/** Segment component for the Date Input */
export const DateInputSegment = component$(
  ({
    segmentSig,
    isEditable,
    showLeadingZero,
    placeholder,
    maxLength,
    _index,
    ...otherProps
  }: DateInputSegmentProps) => {
    const context = useContext(dateInputContextId);
    const inputId = `${context.localId}-segment-${segmentSig.value.type}`;
    const index = _index ?? -1;
    const inputRef = useSignal<HTMLInputElement>();

    useStyles$(styles);

    useTask$(() => {
      console.log("Segment index", _index);
      context.segmentRefs.value[index] = inputRef;
    });

    const updateActiveDate = $(() => {
      // After a segment updates, we need to update the active date
      // by combining all three segments into a valid date string
      const year = context.yearSegmentSig.value.numericValue;
      const month = getTwoDigitPaddedValue(context.monthSegmentSig.value.numericValue) as
        | Month
        | undefined;
      const day = getTwoDigitPaddedValue(
        context.dayOfMonthSegmentSig.value.numericValue
      ) as DayOfMonth | undefined;

      if (year && month && day) {
        context.dateSig.value = `${year}-${month}-${day}`;
      } else {
        context.dateSig.value = null;
      }
    });

    // Initialize the placeholder text based on the props
    useTask$(function initializePlaceholderText() {
      segmentSig.value = {
        ...segmentSig.value,
        placeholderText: placeholder
      };
    });

    useTask$(async ({ track }) => {
      track(() => segmentSig.value);
      await updateActiveDate();
    });

    /**
     * Updates the max value of the day segment based on the year and month.
     * If the current value is greater than the max, it updates the value of the day segment to the max value.
     * If we do not have both a month and a year, the max is simply set to 31.
     *
     * For example, if the date is set to 2024-03-30, and the month is changed to 2,
     * the day segment's max and value will be updated to 29.
     */
    const updateDayOfMonthSegmentForYearAndMonth = $(
      (year: number | undefined, month: number | undefined) => {
        const currentDayOfMonthSegment = context.dayOfMonthSegmentSig.value;

        if (year && month) {
          const lastDayOfMonth = getLastDayOfMonth(year, month);

          // If the current day value is greater than the last day of the new month,
          // update the max and the value to the last day of the month
          if ((currentDayOfMonthSegment.numericValue ?? -1) > lastDayOfMonth) {
            context.dayOfMonthSegmentSig.value = {
              ...currentDayOfMonthSegment,
              max: lastDayOfMonth,
              numericValue: lastDayOfMonth,
              isoValue: getTwoDigitPaddedValue(lastDayOfMonth)
            };
            return;
          }

          // Otherwise, update the max if it has changed
          if (currentDayOfMonthSegment.max !== lastDayOfMonth) {
            context.dayOfMonthSegmentSig.value = {
              ...currentDayOfMonthSegment,
              max: lastDayOfMonth
            };
          }
          return;
        }

        // Not enough info, so let the user enter up to 31
        context.dayOfMonthSegmentSig.value = {
          ...currentDayOfMonthSegment,
          max: 31
        };
      }
    );

    const incrementYearValue = $(async (changeBy: number) => {
      const currentValue = segmentSig.value?.numericValue;
      const newValue = currentValue ? currentValue + changeBy : new Date().getFullYear();

      segmentSig.value = {
        ...segmentSig.value,
        isPlaceholder: false,
        numericValue: newValue,
        isoValue: `${newValue}`
      } as DateSegment;
      const month = context.monthSegmentSig.value.numericValue;
      await updateDayOfMonthSegmentForYearAndMonth(newValue, month);
    });

    const incrementMonthValue = $(async (changeBy: number) => {
      const segment = segmentSig.value;
      const currentValue = segment?.numericValue;
      let newValue = currentValue ? currentValue + changeBy : new Date().getMonth() + 1; // +1 because months are 0-indexed
      if (newValue < segment.min) {
        newValue = segment.max;
      }
      if (newValue > segment.max) {
        newValue = segment.min;
      }
      const isoValue = getTwoDigitPaddedValue(newValue);
      segmentSig.value = {
        ...segment,
        isPlaceholder: false,
        numericValue: newValue,
        isoValue
      };
      const year = context.yearSegmentSig.value.numericValue;
      await updateDayOfMonthSegmentForYearAndMonth(year, newValue);
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
      const isoValue = getTwoDigitPaddedValue(newValue);
      segmentSig.value = {
        ...segment,
        isPlaceholder: false,
        numericValue: newValue,
        isoValue
      };
    });

    const incrementValue = $(async () => {
      switch (segmentSig.value.type) {
        case "year":
          await incrementYearValue(1);
          break;
        case "month":
          await incrementMonthValue(1);
          break;
        case "day":
          await incrementDayValue(1);
          break;
      }
    });

    const decrementValue = $(async () => {
      switch (segmentSig.value.type) {
        case "year":
          await incrementYearValue(-1);
          break;
        case "month":
          await incrementMonthValue(-1);
          break;
        case "day":
          await incrementDayValue(-1);
          break;
      }
    });

    const updateSegmentWithValue = $(async (textValue: string) => {
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
        numericValue,
        isoValue:
          segment.type !== "year"
            ? getTwoDigitPaddedValue(numericValue)
            : `${numericValue}`
      };

      if (segment.type === "month") {
        const year = context.yearSegmentSig.value.numericValue;
        await updateDayOfMonthSegmentForYearAndMonth(year, numericValue);
      }
      if (segment.type === "year") {
        const month = context.monthSegmentSig.value.numericValue;
        await updateDayOfMonthSegmentForYearAndMonth(numericValue, month);
      }
    });

    const updateSegmentToPlaceholder = $(() => {
      const segment = segmentSig.value;
      context.isInternalSegmentClearance.value = true;
      segmentSig.value = {
        ...segment,
        isPlaceholder: true,
        numericValue: undefined,
        isoValue: undefined
      };
    });

    const focusNextSegment = $(() => {
      console.log("Attempting to focus next segment");
      const nextSegment = context.segmentRefs.value[index + 1]?.value;
      if (nextSegment) {
        nextSegment.focus();
      }
    });

    const focusPreviousSegment = $(() => {
      console.log("Attempting to focus previous segment");
      const previousSegment = context.segmentRefs.value[index - 1]?.value;
      if (previousSegment) {
        previousSegment.focus();
      }
    });

    // Our own custom key handlers
    const onKeyDown$ = $(async (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        await incrementValue();
        return;
      }

      if (event.key === "ArrowDown") {
        await decrementValue();
        return;
      }

      // Handle left/right arrow keys for navigation between segments
      if (event.key === "ArrowRight" && inputRef.value) {
        const input = inputRef.value;
        // If cursor is at the end, move to next segment
        if (input.selectionStart === input.value.length) {
          await focusNextSegment();
        }
        return;
      }

      if (event.key === "ArrowLeft" && inputRef.value) {
        const input = inputRef.value;
        // If cursor is at the beginning, move to previous segment
        if (input.selectionStart === 0) {
          await focusPreviousSegment();
        }
      }
    });

    // Use sync$ to filter keyboard events
    const onKeyDownSync$ = sync$((event: KeyboardEvent) => {
      // Allow navigation keys (arrows, backspace, delete, tab)
      const allowedKeys = ["ArrowLeft", "ArrowRight", "Backspace", "Delete", "Tab"];
      if (allowedKeys.includes(event.key)) {
        return;
      }

      // Allow numeric keys only
      if (!/^\d$/.test(event.key)) {
        event.preventDefault();
      }

      // Special handling for leading zeros
      const target = event.target as HTMLInputElement;
      const value = target.value; // The value before the keypress
      if (value[0] === "0" && value.length === 2) {
        target.value = value.slice(1);
        return;
      }
      const maxLen = target.maxLength - 1;
      const hasSelection = target.selectionStart !== target.selectionEnd;
      if (value.length >= maxLen && !hasSelection) {
        event.preventDefault();
      }
    });

    // Process input and update our segment and date values accordingly
    const onInput$ = $(async (event: InputEvent) => {
      const segment = segmentSig.value;
      const target = event.target as HTMLInputElement;
      const content = target.value || "";
      const numericContent = content.replace(/\D/g, "");

      // If the format specifies leading zeros and the input is 0, allow it
      if (segment.placeholderText.length > 1 && numericContent === "0") {
        return;
      }

      if (numericContent.length > 0) {
        await updateSegmentWithValue(numericContent);

        // Check if the segment is fully entered and move focus to the next segment
        const isYearFull = segment.type === "year" && numericContent.length >= 4;
        const isMonthFull =
          segment.type === "month" &&
          (numericContent.length >= 2 || +numericContent >= 2);
        const isDayFull =
          segment.type === "day" && (numericContent.length >= 2 || +numericContent >= 4);
        if (isYearFull || isMonthFull || isDayFull) {
          await focusNextSegment();
        }
      } else {
        await updateSegmentToPlaceholder();
      }
    });

    const displayValueSig = useComputed$(() => {
      if (showLeadingZero && segmentSig.value.isoValue) {
        return segmentSig.value.isoValue;
      }
      return `${segmentSig.value.numericValue ?? ""}`;
    });

    const usePlaceholderWidth = useComputed$(() => {
      return !displayValueSig.value.length;
    });

    return (
      <>
        <div class="qds-date-input-segment-container">
          <span
            class={[
              "qds-date-input-width-measurement",
              usePlaceholderWidth.value
                ? "qds-date-input-width-measurement-placeholder"
                : ""
            ]}
            aria-hidden="true"
          >
            {usePlaceholderWidth.value
              ? segmentSig.value.placeholderText
              : displayValueSig.value}
          </span>

          <input
            {...otherProps}
            ref={inputRef}
            id={inputId}
            type="text"
            data-qds-date-input-segment
            data-qds-date-input-segment-placeholder={segmentSig.value.isPlaceholder}
            data-qds-date-input-segment-day={segmentSig.value.type === "day"}
            data-qds-date-input-segment-month={segmentSig.value.type === "month"}
            data-qds-date-input-segment-year={segmentSig.value.type === "year"}
            data-qds-date-input-segment-index={_index}
            value={displayValueSig.value}
            onKeyDown$={
              isEditable ? [onKeyDownSync$, onKeyDown$, otherProps.onKeyDown$] : undefined
            }
            onInput$={isEditable ? [onInput$, otherProps.onInput$] : undefined}
            stoppropagation:change
            placeholder={segmentSig.value.placeholderText}
            aria-label={`${segmentSig.value.type} input`}
            aria-valuemax={segmentSig.value.max}
            aria-valuemin={segmentSig.value.min}
            aria-valuenow={segmentSig.value.numericValue}
            disabled={context.disabledSig.value}
            maxLength={maxLength + 1}
          />
        </div>
      </>
    );
  }
);

// export function DateInputSegment(props: DateInputSegmentProps) {
//   const index = getNextIndex(`${props.localId}-segment`);

//   props._index = index;

//   return <DateInputSegmentBase {...props} />
// }

// Component -> Generic type
// type -> union type between "day" | "month" | "year"

// export const GetSegmentType = (Component, type) => {
//   function DateInputSegment(props) {
//     const index = getNextIndex(`${props.localId}-segment`);

//     props._index = index;

//     return <DateInputSegmentBase {...props} />
//   }

//   return DateInputSegment;
// }

// export const DateInputDay = GetSegmentType(DateInputDayBase, "day")
