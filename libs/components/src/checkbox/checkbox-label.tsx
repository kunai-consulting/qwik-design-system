import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { Label } from "../label";
import { checkboxContextId } from "./checkbox-context";
type PublicCheckboxLabelProps = PropsOf<"label">;
/** Label component for the checkbox */
export const CheckboxLabel = component$((props: PublicCheckboxLabelProps) => {
  const context = useContext(checkboxContextId);
  const triggerId = `${context.localId}-trigger`;
  return (
    // Identifier for the checkbox label element
    <Label {...props} data-qds-checkbox-label for={triggerId}>
      <Slot />
    </Label>
  );
});
