import { component$, useContext } from "@qwik.dev/core";
import { dateInputFieldContextId } from "./date-input-field-context";
import { DateInputSegment } from "./date-input-segment";
import type { PublicDateInputSegmentProps } from "./types";

/**
 * Day segment component for the Date Input.
 * Handles day values from 1-31 (based on month and year).
 */
export const DateInputDay = component$(
  ({
    placeholder = "dd",
    showLeadingZero = false,
    ...otherProps
  }: PublicDateInputSegmentProps) => {
    const context = useContext(dateInputFieldContextId);
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
