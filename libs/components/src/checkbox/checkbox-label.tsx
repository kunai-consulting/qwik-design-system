import { type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { LabelBase } from "../label/label";
import { checkboxContextId } from "./checkbox-context";
type PublicCheckboxLabelProps = PropsOf<typeof LabelBase>;
/** Label component for the checkbox */
export const CheckboxLabel = component$((props: PublicCheckboxLabelProps) => {
  const context = useContext(checkboxContextId);
  const triggerId = `${context.localId}-trigger`;
  return (
    // Identifier for the checkbox label element
    <LabelBase {...props} data-qds-checkbox-label for={triggerId}>
      <Slot />
    </LabelBase>
  );
});
