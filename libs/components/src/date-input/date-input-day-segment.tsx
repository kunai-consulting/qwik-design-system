import {
  $,
  type PropsOf,
  component$,
  sync$,
  useComputed$,
  useContext,
  useSignal,
  useStyles$,
  useTask$,
  useVisibleTask$
} from "@builder.io/qwik";
import type { DayOfMonth, Month } from "../calendar/types";
import { dateInputContextId } from "./date-input-context";
import styles from "./date-input-segment.css?inline";
import { getLastDayOfMonth, getTwoDigitPaddedValue } from "./utils";
import type { PublicDateInputSegmentProps } from "./types";
// import { DateInputSegment } from "./date-input-segment";

export type PublicDateInputDaySegmentProps = PropsOf<"input"> & {
  /** Optional placeholder text. Default: "dd" */
  placeholder?: string;
  showLeadingZero?: boolean;
};

/**
 * Day segment component for the Date Input.
 * Handles day values from 1-31 (based on month and year).
 */
export const DateInputDaySegment = component$(
  ({
    placeholder = "dd",
    showLeadingZero = false,
    ...otherProps
  }: PublicDateInputSegmentProps) => {
    const context = useContext(dateInputContextId);
    const inputId = `${context.localId}-day-segment`;
    useStyles$(styles);
    const inputRef = useSignal<HTMLInputElement>();

    // Register this segment with the focus management system
    useVisibleTask$(({ track }) => {
      track(() => inputRef.value);
      track(() => context.disabledSig.value);

      if (inputRef.value && !context.disabledSig.value) {
        context.registerFocusableSegment$(inputRef.value, "day");
      }
    });

    const segmentSig = context.dayOfMonthSegmentSig;

    // task for initial setup
    // update the placeholder text based on the props
    useTask$(() => {
      segmentSig.value = {
        ...segmentSig.value,
        placeholderText: placeholder
      };
    });

    // If we have a value in the context, update our local segment
    useTask$(({ track }) => {
      track(() => context.dateSig.value);

      if (context.dateSig.value) {
        const [, , day] = context.dateSig.value.split("-");
        const numericValue = Number.parseInt(day, 10);

        if (!Number.isNaN(numericValue)) {
          segmentSig.value = {
            ...segmentSig.value,
            numericValue,
            isoValue: getTwoDigitPaddedValue(numericValue),
            isPlaceholder: false
          };
        }
      }
    });

    // TODO: do I need this here? Is this the right place?
    // Update max day based on month and year
    useTask$(({ track }) => {
      const year = track(() => context.yearSegmentSig?.value?.numericValue);
      const month = track(() => context.monthSegmentSig?.value?.numericValue);

      if (year && month) {
        const lastDayOfMonth = getLastDayOfMonth(year, month);

        if (segmentSig.value.max !== lastDayOfMonth) {
          segmentSig.value = {
            ...segmentSig.value,
            max: lastDayOfMonth
          };

          // If current value exceeds new max, adjust it
          if ((segmentSig.value.numericValue || 0) > lastDayOfMonth) {
            segmentSig.value = {
              ...segmentSig.value,
              numericValue: lastDayOfMonth,
              isoValue: getTwoDigitPaddedValue(lastDayOfMonth),
              isPlaceholder: false
            };
          }
        }
      }
    });

    const updateActiveDate = $(() => {
      // After a segment updates, we need to update the active date
      // by combining all three segments into a valid date string
      const year = context.yearSegmentSig.value.numericValue;
      const month = context.monthSegmentSig.value.isoValue as Month;
      const day = context.dayOfMonthSegmentSig.value.isoValue as DayOfMonth;

      if (year && month && day) {
        context.dateSig.value = `${year}-${month}-${day}`;
      } else {
        context.dateSig.value = null;
      }
    });

    // Update the date in context when this segment changes
    useTask$(async ({ track }) => {
      track(() => segmentSig.value);
      await updateActiveDate();
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
        isoValue: getTwoDigitPaddedValue(numericValue)
      };
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
        await incrementDayValue(1);
        return;
      }

      if (event.key === "ArrowDown") {
        await incrementDayValue(-1);
        return;
      }

      // Handle left/right arrow keys for navigation between segments
      if (event.key === "ArrowRight" && inputRef.value) {
        const input = inputRef.value as HTMLInputElement;
        // If cursor is at the end, move to next segment
        if (input.selectionStart === input.value.length) {
          await context.focusNextSegment$(inputRef.value);
        }
        return;
      }

      if (event.key === "ArrowLeft" && inputRef.value) {
        const input = inputRef.value as HTMLInputElement;
        // If cursor is at the beginning, move to previous segment
        if (input.selectionStart === 0) {
          await context.focusPreviousSegment$(inputRef.value);
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

      // Make sure we don't allow more than the max digits
      const value = (event.target as HTMLInputElement).value; // The value before the keypress
      if (value.length === 2 && value[0] !== "0") {
        event.preventDefault();
      }
    });

    // Process input and update our segment and date values accordingly
    const onInput$ = $(async (event: InputEvent) => {
      const segment = segmentSig.value;
      const target = event.target as HTMLInputElement;
      const content = target.value || "";
      const numericContent = content.replace(/\D/g, "").replace(/^0/, "").substring(0, 2);

      // If the format specifies leading zeros and the input is 0, allow it
      if (segment.placeholderText.length > 1 && numericContent === "0") {
        return;
      }

      if (numericContent.length > 0) {
        await updateSegmentWithValue(numericContent);

        // Check if the segment is fully entered and move focus to the next segment
        const isDayComplete =
          // Day is complete if:
          // 1. Two digits have been entered, or
          // 2. A single digit > 3 has been entered (since days can only start with 0, 1, 2, or 3)
          numericContent.length === 2 ||
          (numericContent.length === 1 && +numericContent > 3);

        // Move focus to next segment if day is complete and we have a valid input reference
        if (isDayComplete && inputRef.value) {
          await context.focusNextSegment$(inputRef.value);
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
        <span class="qds-date-input-segment-container">
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
            data-qds-date-input-segment-day
            value={displayValueSig.value}
            onKeyDown$={
              !context.disabledSig.value
                ? [onKeyDownSync$, onKeyDown$, otherProps.onKeyDown$]
                : undefined
            }
            onInput$={
              !context.disabledSig.value ? [onInput$, otherProps.onInput$] : undefined
            }
            stoppropagation:change
            placeholder={segmentSig.value.placeholderText}
            aria-label={`${segmentSig.value.type} input`}
            aria-valuemax={segmentSig.value.max}
            aria-valuemin={segmentSig.value.min}
            aria-valuenow={segmentSig.value.numericValue}
            disabled={context.disabledSig.value}
            maxLength={2}
          />
        </span>
      </>
    );
  }
);
