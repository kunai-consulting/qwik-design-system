import {
  $,
  component$,
  sync$,
  useComputed$,
  useConstant,
  useContext,
  useSignal,
  useStyles$,
  useTask$
} from "@qwik.dev/core";
import type { Signal } from "@qwik.dev/core";
import type { DayOfMonth, Month } from "../calendar/types";
import { MAX_DAY } from "./constants";
import { dateInputContextId } from "./date-input-context";
import { dateInputFieldContextId } from "./date-input-field-context";
import styles from "./date-input-segment.css?inline";
import type { DateSegment, DateSegmentType } from "./types";
import type { PublicDateInputSegmentProps } from "./types";
import { getLastDayOfMonth, getTwoDigitPaddedValue } from "./utils";

type DateInputSegmentProps = PublicDateInputSegmentProps & {
  segmentSig: Signal<DateSegment>;
  placeholder: string;
};

/** Segment component for the Date Input */
export const DateInputSegment = component$(
  ({
    segmentSig,
    showLeadingZero,
    placeholder,
    ...otherProps
  }: DateInputSegmentProps) => {
    const rootContext = useContext(dateInputContextId);
    const context = useContext(dateInputFieldContextId);
    const inputId = `${context.fieldId}-segment-${segmentSig.value.type}`;
    const index = useConstant(() => {
      const currIndex = rootContext.currSegmentIndex;
      rootContext.currSegmentIndex++;
      return currIndex;
    });
    // Show the separator if there is a separator in the context and the index is not the last segment in a group of 3
    const showSeparator = context.separator && index % 3 < 2;
    const inputRef = useSignal<HTMLInputElement>();

    useStyles$(styles);

    useTask$(() => {
      rootContext.segmentRefs.value[index] = inputRef;
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
          max: MAX_DAY
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

    const isSegmentFull = $((type: DateSegmentType, numericValue?: number) => {
      if (!numericValue) {
        return false;
      }
      switch (type) {
        case "year":
          return numericValue.toString().length >= 4;
        case "month":
          return numericValue.toString().length >= 2 || numericValue >= 2;
        case "day":
          return numericValue.toString().length >= 2 || numericValue >= 4;
      }
    });

    const focusNextSegment = $(async () => {
      const nextSegment = rootContext.segmentRefs.value[index + 1]?.value;
      if (nextSegment) {
        nextSegment.focus();
        nextSegment.select();
      }
    });

    const focusPreviousSegment = $(async () => {
      const previousSegment = rootContext.segmentRefs.value[index - 1]?.value;
      if (previousSegment) {
        previousSegment.focus();
        previousSegment.select();
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

      if (await isSegmentFull(segment.type, numericValue)) {
        await focusNextSegment();
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
        await focusNextSegment();
        return;
      }

      if (event.key === "ArrowLeft" && inputRef.value) {
        await focusPreviousSegment();
      }

      if (
        event.key === "Backspace" &&
        inputRef.value &&
        inputRef.value.value.length === 0
      ) {
        await focusPreviousSegment();
      }
    });

    // Use sync$ method to control input
    const onKeyDownSync$ = sync$((event: KeyboardEvent) => {
      // Allow navigation keys (arrows, backspace, delete, tab)
      const allowedKeys = ["ArrowLeft", "ArrowRight", "Backspace", "Delete", "Tab"];
      if (allowedKeys.includes(event.key)) {
        return;
      }

      // Allow key combinations with modifier keys (Cmd, Ctrl, Alt, Shift)
      if (event.metaKey || event.ctrlKey) {
        return;
      }

      // Block non-numeric keys
      if (!/^\d$/.test(event.key)) {
        event.preventDefault();
        return;
      }

      // At this point, we know it's a numeric key
      const inputElement = event.target as HTMLInputElement;
      // Remove leading zero if present (e.g., "01" -> "1")
      const currentValue = inputElement.value.replace(/^0/, "");
      const newDigit = event.key;
      const segmentType: DateSegmentType = inputElement.attributes.getNamedItem(
        "data-qds-date-input-segment-year"
      )
        ? "year"
        : inputElement.attributes.getNamedItem("data-qds-date-input-segment-month")
          ? "month"
          : "day";

      let replaceExistingValue = false;
      let newValue = currentValue + newDigit;

      // Logic specific to each segment type
      switch (segmentType) {
        case "month": {
          // For month: handle 1-12 range
          const monthVal = Number.parseInt(newValue, 10);
          if (currentValue === "1" && Number.parseInt(newDigit, 10) > 2) {
            // 13-19 are invalid, replace with just the new digit
            replaceExistingValue = true;
            newValue = newDigit;
          } else if (monthVal > 12 || currentValue.length >= 2) {
            replaceExistingValue = true;
            newValue = newDigit;
          }
          break;
        }

        case "day": {
          // For day: handle 1-31 range
          const dayVal = Number.parseInt(newValue, 10);
          if (currentValue === "3" && Number.parseInt(newDigit, 10) > 1) {
            // 32-39 are invalid, replace with just the new digit
            replaceExistingValue = true;
            newValue = newDigit;
          } else if (dayVal > 31 || currentValue.length >= 2) {
            // Over max or already has 2 digits
            replaceExistingValue = true;
            newValue = newDigit;
          }
          break;
        }

        case "year": {
          // For year: allow building up to 4 digits
          if (currentValue.length >= 4) {
            // Already at max length for year, replace
            replaceExistingValue = true;
            newValue = newDigit;
          }
          break;
        }
      }

      // Apply our decision - either let default happen or replace the existing value
      if (replaceExistingValue) {
        // Prevent default behavior (which would append)
        event.preventDefault();

        // Set new value directly
        inputElement.value = newValue;

        // Create and dispatch an InputEvent with our data
        const inputEvent = new InputEvent("input", {
          bubbles: true,
          cancelable: false,
          data: newDigit,
          inputType: "insertText"
        });
        inputElement.dispatchEvent(inputEvent);
      }
      // Otherwise let the default append behavior happen
    });

    const onPasteSync$ = sync$((event: ClipboardEvent) => {
      const pastedText = event.clipboardData?.getData("text") || "";
      if (!/^\d+$/.test(pastedText)) {
        event.preventDefault();
        return;
      }
    });

    // Process input and update our segment and date values accordingly
    const onInput$ = $(async (event: InputEvent) => {
      const target = event.target as HTMLInputElement;
      const currentValue = target.value;

      if (showLeadingZero && currentValue === "0") {
        return;
      }

      if (currentValue.length > 0) {
        await updateSegmentWithValue(currentValue);
        await updateActiveDate();
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

    return (
      <>
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
          data-qds-date-input-segment-index={index}
          value={displayValueSig.value}
          onKeyDown$={[onKeyDownSync$, onKeyDown$, otherProps.onKeyDown$]}
          onInput$={[onInput$, otherProps.onInput$]}
          onPaste$={[onPasteSync$, otherProps.onPaste$]}
          stoppropagation:change
          placeholder={segmentSig.value.placeholderText}
          aria-label={`${segmentSig.value.type} input`}
          aria-valuemax={segmentSig.value.max}
          aria-valuemin={segmentSig.value.min}
          aria-valuenow={segmentSig.value.numericValue}
          disabled={context.disabledSig.value}
          maxLength={segmentSig.value.maxLength + 1}
          inputMode="numeric"
        />
        {showSeparator && context.separator}
      </>
    );
  }
);
