import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { dateInputContextId } from "./date-input-context";
import { Render } from "../render/render";
type PublicDateInputDateEntryProps = PropsOf<"div">;

/** Container for the segments of the Date Input that assists with accessibility
 * by giving a target for the label, and providing a role for screen readers.
 */
export const DateInputDateEntryBase = component$(
  (props: PublicDateInputDateEntryProps) => {
    const context = useContext(dateInputContextId);
    const inputId = `${context.localId}-entry`;

    return (
      <Render
        fallback={"div"}
        {...props}
        data-qds-date-input-date-entry
        role="group"
        id={inputId}
      >
        <Slot />
      </Render>
    );
  }
);

export const DateInputDateEntry = withAsChild(DateInputDateEntryBase);
