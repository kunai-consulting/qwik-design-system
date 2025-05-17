import { component$, useContext } from "@builder.io/qwik";
import { getNextIndex } from "@kunai-consulting/qwik-utils";
import { dateInputContextId } from "./date-input-context";
import { DateInputSegment } from "./date-input-segment";
import type { PublicDateInputSegmentProps } from "./types";

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

export function DateInputMonth(props: PublicDateInputSegmentProps) {
  const index = getNextIndex("date-input-segment");
  props._index = index;
  return <DateInputMonthBase {...props} />;
}
