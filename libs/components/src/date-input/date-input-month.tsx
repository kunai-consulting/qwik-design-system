import { component$, useContext, useTask$ } from "@builder.io/qwik";
import { getNextIndex } from "@kunai-consulting/qwik-utils";
import { dateInputContextId } from "./date-input-context";
import { DateInputSegment } from "./date-input-segment";
import type { PublicDateInputSegmentProps } from "./types";
import { getTwoDigitPaddedValue } from "./utils";

/**
 * Month segment component for the Date Input.
 * Handles month values from 1-12.
 */
export const DateInputMonthBase = component$(
  ({
    placeholder = "mm",
    showLeadingZero = false,
    ...otherProps
  }: PublicDateInputSegmentProps) => {
    const context = useContext(dateInputContextId);

    const segmentSig = context.monthSegmentSig;

    // If we have a value in the context, update our local segment
    useTask$(({ track }) => {
      track(() => context.dateSig.value);

      if (context.dateSig.value) {
        const [, month] = context.dateSig.value.split("-");
        const numericValue = Number.parseInt(month, 10);

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

export function DateInputMonth(props: PublicDateInputSegmentProps) {
  const index = getNextIndex("date-input-segment");
  props._index = index;
  return <DateInputMonthBase {...props} />;
}
