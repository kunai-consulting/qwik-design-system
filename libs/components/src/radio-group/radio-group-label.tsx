import { $, type PropsOf, Slot, component$, sync$, useContext } from "@builder.io/qwik";
import { Label } from "../label";
import { radioGroupContextId } from "./radio-group-context";

type CheckboxLabelProps = PropsOf<"label">;

/** Label component for the radio group or individual radio options */
export const RadioGroupLabel = component$((props: CheckboxLabelProps) => {
  const context = useContext(radioGroupContextId);
  const triggerId = `${context.localId}-trigger`;

  return (
    // Identifier for the radio group label element
    <Label {...props} data-qds-radio-group-label for={triggerId}>
      <Slot />
    </Label>
  );
});
