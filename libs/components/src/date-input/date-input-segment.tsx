import {
  $,
  type PropsOf,
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
import { getDisplayValue, getLastDayOfMonth } from "./utils";

type PublicDateInputSegmentProps = PropsOf<"input"> & {
  segmentSig: Signal<DateSegment>;
  isEditable: boolean;
};

/** Segment component for the Date Input */
export const DateInputSegment = component$(
  ({ segmentSig, isEditable, ...otherProps }: PublicDateInputSegmentProps) => {
    const context = useContext(dateInputContextId);
    const inputId = `${context.localId}-segment-${segmentSig.value.type}`;
    useStyles$(styles);

    const updateActiveDate = $(() => {
      // After a segment updates, we need to update the active date
      // by combining all three segments into a valid date string
      const year = context.yearSegmentSig.value.numericValue;
      const month = context.monthSegmentSig.value.displayValue as Month | undefined;
      const day = context.dayOfMonthSegmentSig.value.displayValue as
        | DayOfMonth
        | undefined;

      if (year && month && day) {
        context.dateSig.value = `${year}-${month}-${day}`;
      } else {
        context.dateSig.value = null;
      }
    });

    useTask$(async ({ track }) => {
      track(() => segmentSig.value);
      await updateActiveDate();
    });

    // The index of the current segment in orderedSegments
    const segmentIndexSig = useComputed$(() => {
      return context.orderedSegments.findIndex(
        (s) => s.value.type === segmentSig.value.type
      );
    });

    const segmentLengthSig = useComputed$(() => {
      const placeholderLength = segmentSig.value.placeholderText.length;
      return placeholderLength < 2 ? 2 : placeholderLength;
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
              displayValue: getDisplayValue(
                lastDayOfMonth,
                currentDayOfMonthSegment.placeholderText
              )
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
        displayValue: `${newValue}`
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
      const displayValue = getDisplayValue(newValue, segment.placeholderText);
      segmentSig.value = {
        ...segment,
        isPlaceholder: false,
        numericValue: newValue,
        displayValue
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
      const displayValue = getDisplayValue(newValue, segment.placeholderText);
      segmentSig.value = {
        ...segment,
        isPlaceholder: false,
        numericValue: newValue,
        displayValue
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
      context.activeSegmentIndex.value = segmentIndexSig.value;
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
      context.activeSegmentIndex.value = segmentIndexSig.value;
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
        displayValue:
          segment.type !== "year"
            ? getDisplayValue(numericValue, segment.placeholderText)
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
        displayValue: undefined
      };
    });

    // Create a ref for this specific input
    const inputRef = useSignal<HTMLInputElement>();

    // Watch for activeSegmentIndex changes and focus this segment when it matches
    useTask$(({ track }) => {
      const activeIndex = track(() => context.activeSegmentIndex.value);
      const thisIndex = track(() => segmentIndexSig.value);

      if (activeIndex === thisIndex && inputRef.value) {
        if (document.activeElement !== inputRef.value) {
          inputRef.value?.focus();
          inputRef.value?.select();
        }
      }
    });

    // Handler to handle keydown events (arrow keys, numeric input)
    const onKeyDownSync$ = sync$(async (event: KeyboardEvent) => {
      // Allow navigation keys (arrows, backspace, delete, tab)
      const allowedKeys = ["ArrowLeft", "ArrowRight", "Backspace", "Delete", "Tab"];
      if (allowedKeys.includes(event.key)) {
        return;
      }

      if (event.key === "ArrowUp") {
        await incrementValue();
        event.preventDefault();
        return;
      }

      if (event.key === "ArrowDown") {
        await decrementValue();
        event.preventDefault();
        return;
      }

      // Allow numeric keys only
      if (!/^\d$/.test(event.key)) {
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
          // Use the context function to move to the next segment
          context.activeSegmentIndex.value = segmentIndexSig.value;
          await context.focusNextSegment$();
        }
      } else {
        await updateSegmentToPlaceholder();
      }
    });

    const onClick$ = $(() => {
      context.activeSegmentIndex.value = segmentIndexSig.value;
    });

    const usePlaceholderWidth = useComputed$(() => {
      return (
        segmentSig.value.placeholderText.length >
        (segmentSig.value.displayValue?.length ?? 0)
      );
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
              : segmentSig.value.displayValue}
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
            value={segmentSig.value.displayValue}
            onKeyDown$={isEditable ? [onKeyDownSync$, otherProps.onKeyDown$] : undefined}
            onInput$={isEditable ? [onInput$, otherProps.onInput$] : undefined}
            onClick$={isEditable ? [onClick$, otherProps.onClick$] : undefined}
            stoppropagation:change
            placeholder={segmentSig.value.placeholderText}
            aria-label={`${segmentSig.value.type} input`}
            aria-valuemax={segmentSig.value.max}
            aria-valuemin={segmentSig.value.min}
            aria-valuenow={segmentSig.value.numericValue}
            disabled={!isEditable}
            maxLength={segmentLengthSig.value}
          />
        </div>
      </>
    );
  }
);
