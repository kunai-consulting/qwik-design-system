import { component$, useContext } from "@builder.io/qwik";
import { getNextIndex } from "@kunai-consulting/qwik-utils";
import { dateInputDateEntryContextId } from "./date-input-date-entry-context";
import { DateInputSegment } from "./date-input-segment";
import type { PublicDateInputSegmentProps } from "./types";

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
    const context = useContext(dateInputDateEntryContextId);
    const segmentSig = context.dayOfMonthSegmentSig;

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

export function DateInputDay(props: PublicDateInputSegmentProps) {
  const index = getNextIndex("date-input-segment");
  props._index = index;
  return <DateInputDayBase {...props} />;
}
