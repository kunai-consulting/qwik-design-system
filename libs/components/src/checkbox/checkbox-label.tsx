import { type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { Label } from "../label/label";
import { checkboxContextId } from "./checkbox-context";
type PublicCheckboxLabelProps = PropsOf<typeof Label>;
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
