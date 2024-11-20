import { $, component$, type PropsOf, Slot, sync$, useContext } from "@builder.io/qwik";
import { checkboxContextId } from "./checkbox-context";
import { Label } from "../label";

type CheckboxLabelProps = PropsOf<"label">;

export const CheckboxLabel = component$((props: CheckboxLabelProps) => {
  const context = useContext(checkboxContextId);
  const triggerId = `${context.localId}-trigger`;

  return (
    <Label {...props} data-qds-checkbox-label for={triggerId}>
      <Slot />
    </Label>
  );
});
