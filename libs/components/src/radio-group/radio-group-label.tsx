import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { Label } from "../label";
import { radioGroupContextId } from "./radio-group-context";

type RadioGroupLabelProps = PropsOf<"label">;

/** Label component for the radio group or individual radio options */
export const RadioGroupLabel = component$((props: RadioGroupLabelProps) => {
  const context = useContext(radioGroupContextId);
  const labelId = `${context.localId}-label`;

  return (
    // Identifier for the radio group label element
    <Label
      {...props}
      id={labelId}
      data-qds-radio-group-label
      for={context.triggerRef.value?.id}
    >
      <Slot />
    </Label>
  );
});
