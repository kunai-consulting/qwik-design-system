import { type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { Render } from "../render/render";
import { dateInputContextId } from "./date-input-context";
type PublicDateInputLabelProps = PropsOf<"div">;

/** Label component for the Date Input */
export const DateInputLabel = component$((props: PublicDateInputLabelProps) => {
  const context = useContext(dateInputContextId);
  const id = `${context.localId}-label`;
  return (
    // Identifier for the Date Input label element
    <Render fallback="div" {...props} data-qds-date-input-label id={id}>
      <Slot />
    </Render>
  );
});
