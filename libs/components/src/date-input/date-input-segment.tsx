import {
  type PropsOf,
  component$,
  useContext,
  $,
  useVisibleTask$,
  useSignal
} from "@builder.io/qwik";
import { dateInputContextId } from "./date-input-context";
import type { DateSegment } from "./types";
import type { Signal } from "@builder.io/qwik";

type PublicDateInputSegmentProps = PropsOf<"span"> & {
  segmentSig: Signal<DateSegment>;
  isEditable: boolean;
};

/** Segment component for the Date Input */
export const DateInputSegment = component$(
  ({ segmentSig, isEditable, ...otherProps }: PublicDateInputSegmentProps) => {
    const context = useContext(dateInputContextId);
    const inputId = `${context.localId}-trigger`;

    const incrementYearValue = $((changeBy: number) => {
      const currentValue = segmentSig.value?.numericValue;
      const newValue = currentValue ? currentValue + changeBy : new Date().getFullYear();

      segmentSig.value = {
        ...segmentSig.value,
        isPlaceholder: false,
        numericValue: newValue,
        displayValue: `${newValue}`
      } as DateSegment;
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
        ...segmentSig.value,
        isPlaceholder: false,
        numericValue: numericValue,
        displayValue:
          segment.type !== "year" &&
          segment.placeholderText.length === 2 &&
          numericValue < 10
            ? `0${numericValue}`
            : `${numericValue}`
      } as DateSegment;
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

    const updateActiveDate = $(() => {
      // const segment = segmentSig.value;
      // activeDate.value = `${yearToRender.value}-${monthToRender.value}-${segment.numericValue}`;
    });

    // Get a reference to the span to manually sync content with Qwik state
    const spanRef = useSignal<HTMLSpanElement>();

    // Force synchronization between segment state and DOM
    useVisibleTask$(({ track }) => {
      // Track changes to the placeholder state and value
      track(() => segmentSig.value.isPlaceholder);
      track(() => segmentSig.value.numericValue);

      if (!spanRef.value) return;

      // Qwik struggles with contentEditable spans, so we need to manually sync here
      // to make sure we always show the correct content
      if (segmentSig.value.isPlaceholder) {
        spanRef.value.textContent = segmentSig.value.placeholderText;
      } else if (segmentSig.value.numericValue !== undefined) {
        // Set the text content to the value when not in placeholder state
        spanRef.value.textContent = String(segmentSig.value.displayValue);
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

    // Handler to ensure we update our segment and date values properly
    const onInput$ = $((event: InputEvent) => {
      const target = event.target as HTMLSpanElement;
      const content = target.textContent || "";
      const numericContent = content.replace(/\D/g, "");

      if (numericContent.length > 0) {
        updateSegmentWithValue(numericContent);
      } else {
        updateSegmentToPlaceholder();

        // Ensure the textContent is cleared if we're setting placeholder state
        // This prevents any lingering content from staying in the contentEditable span
        if (target.textContent !== "") {
          target.textContent = "";
        }
      }

      event.preventDefault();
    });

    return (
      <span
        {...otherProps}
        ref={spanRef}
        data-qds-date-input-segment
        data-placeholder={segmentSig.value.isPlaceholder}
        data-type={segmentSig.value.type}
        contentEditable={isEditable ? "true" : "false"}
        inputMode="numeric"
        tabIndex={0}
        role="spinbutton"
        aria-valuemax={segmentSig.value.max}
        aria-valuemin={segmentSig.value.min}
        aria-valuenow={segmentSig.value.numericValue}
        onKeyDown$={isEditable ? onKeyDown$ : undefined}
        onInput$={isEditable ? onInput$ : undefined}
      >
        {segmentSig.value.isPlaceholder
          ? segmentSig.value.placeholderText
          : segmentSig.value.displayValue}
      </span>
    );
  }
);
