import { component$, useContext } from "@qwik.dev/core";
import { getNextIndex } from "@kunai-consulting/qwik-utils";
import { dateInputFieldContextId } from "./date-input-field-context";
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
    const context = useContext(dateInputFieldContextId);
    const segmentSig = context.yearSegmentSig;

    return (
      <DateInputSegment
        segmentSig={segmentSig}
        placeholder={placeholder}
        showLeadingZero={showLeadingZero}
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
