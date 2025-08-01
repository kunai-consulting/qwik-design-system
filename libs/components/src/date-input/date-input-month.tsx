import { component$, useContext } from "@qwik.dev/core";
import { dateInputFieldContextId } from "./date-input-field-context";
import { DateInputSegment } from "./date-input-segment";
import type { PublicDateInputSegmentProps } from "./types";

/**
 * Month segment component for the Date Input.
 * Handles month values from 1-12.
 */
export const DateInputMonth = component$(
  ({
    placeholder = "mm",
    showLeadingZero = false,
    ...otherProps
  }: PublicDateInputSegmentProps) => {
    const context = useContext(dateInputFieldContextId);
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
