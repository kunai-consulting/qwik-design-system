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
import type { ISODate } from "../calendar/types";
import { dateInputContextId } from "./date-input-context";
import styles from "./date-input-segment.css?inline";
import { DateInputSegment } from "./date-input-segment";

export type PublicDateInputYearProps = PropsOf<"input"> & {
  /** Optional placeholder text. Default: "yyyy" */
  placeholder?: string;
  showLeadingZero?: boolean;
};

/**
 * Year segment component for the Date Input.
 * Handles 4-digit year values.
 */
export const DateInputYear = component$(
  ({ placeholder = "yyyy", showLeadingZero = false, ...otherProps }: PublicDateInputYearProps) => {
    const context = useContext(dateInputContextId);
    const inputId = `${context.localId}-year-segment`;
    useStyles$(styles);
    const inputRef = useSignal<HTMLInputElement>();

    // Register this segment with the focus management system
    useVisibleTask$(({ track }) => {
      track(() => inputRef.value);
      track(() => context.disabledSig.value);

      if (inputRef.value && !context.disabledSig.value) {
        context.registerFocusableSegment$(inputRef.value, "year");
      }
    });

    const segmentSig = context.yearSegmentSig;

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
        const [year] = context.dateSig.value.split("-");
        const numericValue = Number.parseInt(year, 10);

        if (!Number.isNaN(numericValue)) {
          segmentSig.value = {
            ...segmentSig.value,
            numericValue,
            isoValue: year,
            isPlaceholder: false
          };
        }
      }
    });

    const updateActiveDate = $(() => {
      // After a segment updates, we need to update the active date
      // by combining all three segments into a valid date string
      const year = context.yearSegmentSig.value.numericValue;
      const month = context.monthSegmentSig.value.isoValue;
      const day = context.dayOfMonthSegmentSig.value.isoValue;

      if (year && month && day) {
        // Using regex validation to ensure we're creating a valid ISODate format
        const isoDate = `${year}-${month}-${day}`;
        if (/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(isoDate)) {
          context.dateSig.value = isoDate as ISODate;
        }
      } else {
        context.dateSig.value = null;
      }
    });

    // Update the date in context when this segment changes
    useTask$(async ({ track }) => {
      track(() => segmentSig.value);
      await updateActiveDate();
    });

    const incrementYearValue = $((changeBy: number) => {
      const segment = segmentSig.value;
      const currentValue = segment.numericValue;
      let newValue = currentValue ? currentValue + changeBy : new Date().getFullYear();
      if (newValue < segment.min) {
        newValue = segment.max;
      }
      if (newValue > segment.max) {
        newValue = segment.min;
      }

      segmentSig.value = {
        ...segment,
        isPlaceholder: false,
        numericValue: newValue,
        isoValue: `${newValue}`
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
        isoValue: `${numericValue}`
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
        await incrementYearValue(1);
        return;
      }

      if (event.key === "ArrowDown") {
        await incrementYearValue(-1);
        return;
      }

      // Handle left/right arrow keys for navigation between segments
      if (event.key === "ArrowRight" && inputRef.value) {
        const input = inputRef.value as HTMLInputElement;
        // If cursor is at the end, move to next segment
        if (input.selectionStart === input.value.length) {
          event.preventDefault();
          await context.focusNextSegment$(inputRef.value);
        }
        return;
      }

      if (event.key === "ArrowLeft" && inputRef.value) {
        const input = inputRef.value as HTMLInputElement;
        // If cursor is at the beginning, move to previous segment
        if (input.selectionStart === 0) {
          event.preventDefault();
          await context.focusPreviousSegment$(inputRef.value);
        }
        return;
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
    });

    // Process input and update our segment and date values accordingly
    const onInput$ = $(async (event: InputEvent) => {
      const target = event.target as HTMLInputElement;
      const content = target.value || "";
      const numericContent = content.replace(/\D/g, "");

      if (numericContent.length > 0) {
        await updateSegmentWithValue(numericContent);

        // Check if the year is fully entered (4 digits) and move focus to the next segment
        const isYearComplete = numericContent.length === 4;

        // Move focus to next segment if year is complete and we have a valid input reference
        if (isYearComplete && inputRef.value) {
          await context.focusNextSegment$(inputRef.value);
        }
      } else {
        await updateSegmentToPlaceholder();
      }
    });

    const usePlaceholderWidth = useComputed$(() => {
      return (
        segmentSig.value.placeholderText.length > (segmentSig.value.isoValue?.length ?? 0)
      );
    });

    return (
      <DateInputSegment
        segmentSig={segmentSig}
        localId={context.localId}
        isEditable={!context.disabledSig.value}
        showLeadingZero={showLeadingZero}
        maxLength={4}
      />
    );
  }
);
