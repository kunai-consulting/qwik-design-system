import { component$, useContext } from "@builder.io/qwik";
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
