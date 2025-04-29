import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { LabelBase } from "../label/label";
import { dateInputContextId } from "./date-input-context";
type PublicDateInputLabelProps = PropsOf<typeof LabelBase>;

/** Label component for the Date Input */
export const DateInputLabelBase = component$((props: PublicDateInputLabelProps) => {
  const context = useContext(dateInputContextId);
  const inputId = `${context.localId}-entry`;
  return (
    // Identifier for the Date Input label element
    <LabelBase {...props} data-qds-date-input-label for={inputId}>
      <Slot />
    </LabelBase>
  );
});

export const DateInputLabel = withAsChild(DateInputLabelBase);
