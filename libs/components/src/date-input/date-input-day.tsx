import { component$, useContext, useTask$ } from "@builder.io/qwik";
import { getNextIndex } from "@kunai-consulting/qwik-utils";
import { dateInputContextId } from "./date-input-context";
import { DateInputSegment } from "./date-input-segment";
import type { PublicDateInputSegmentProps } from "./types";
import { getTwoDigitPaddedValue } from "./utils";

/**
 * Day segment component for the Date Input.
 * Handles day values from 1-31 (based on month and year).
 */
export const DateInputDayBase = component$(
  ({
    placeholder = "dd",
    showLeadingZero = false,
    ...otherProps
  }: PublicDateInputSegmentProps) => {
    const context = useContext(dateInputContextId);
    const segmentSig = context.dayOfMonthSegmentSig;

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

    return (
      <DateInputSegment
        segmentSig={segmentSig}
        placeholder={placeholder}
        isEditable={!context.disabledSig.value}
        showLeadingZero={showLeadingZero}
        maxLength={2}
        {...otherProps}
      />
    );
  }
);

export function DateInputDay(props: PublicDateInputSegmentProps) {
  const index = getNextIndex("date-input-segment");
  props._index = index;
  return <DateInputDayBase {...props} />;
}
