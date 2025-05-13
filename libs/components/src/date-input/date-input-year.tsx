import { component$, useContext, useTask$ } from "@builder.io/qwik";
import { getNextIndex } from "@kunai-consulting/qwik-utils";
import { dateInputContextId } from "./date-input-context";
import { DateInputSegment } from "./date-input-segment";
import type { PublicDateInputSegmentProps } from "./types";

/**
 * Year segment component for the Date Input.
 * Handles 4-digit year values.
 */
export const DateInputYearBase = component$(
  ({
    placeholder = "yyyy",
    showLeadingZero = false,
    ...otherProps
  }: PublicDateInputSegmentProps) => {
    const context = useContext(dateInputContextId);

    const segmentSig = context.yearSegmentSig;

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

    return (
      <DateInputSegment
        segmentSig={segmentSig}
        placeholder={placeholder}
        isEditable={!context.disabledSig.value}
        showLeadingZero={showLeadingZero}
        maxLength={4}
        {...otherProps}
      />
    );
  }
);

export function DateInputYear(props: PublicDateInputSegmentProps) {
  const index = getNextIndex("date-input-segment");
  props._index = index;
  return <DateInputYearBase {...props} />;
}
