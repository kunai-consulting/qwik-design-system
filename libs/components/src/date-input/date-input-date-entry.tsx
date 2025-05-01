import { type PropsOf, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { dateInputContextId } from "./date-input-context";
import { DateInputSegment } from "./date-input-segment";
type PublicDateInputDateEntryProps = PropsOf<"div"> & {
  value?: string;
};

/** Date entry component for the Date Input */
export const DateInputDateEntryBase = component$(
  (props: PublicDateInputDateEntryProps) => {
    const context = useContext(dateInputContextId);
    const inputId = `${context.localId}-entry`;
    return (
      <div {...props} data-qds-date-input-date-entry role="group" id={inputId}>
        {context.orderedSegments.map((segmentSig, index) => (
          <span key={inputId + segmentSig.value.type}>
            <DateInputSegment segmentSig={segmentSig} isEditable={true} />
            {index !== context.orderedSegments.length - 1 && (
              <span data-qds-date-input-separator>{context.separator}</span>
            )}
          </span>
        ))}
      </div>
    );
  }
);

export const DateInputDateEntry = withAsChild(DateInputDateEntryBase);
