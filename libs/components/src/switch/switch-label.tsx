import { type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Label } from "../label/label";
import { switchContextId } from "./switch-context";
type PublicCheckboxLabelProps = PropsOf<typeof Label>;

/** Label component for the switch that can be clicked to toggle the state */
const SwitchLabelBase = component$((props: PublicCheckboxLabelProps) => {
  const context = useContext(switchContextId);
  const labelId = `${context.localId}-label`;
  const triggerId = `${context.localId}-trigger`;

  return (
    <Label
      {...props}
      id={labelId}
      // The identifier for the switch label element
      data-qds-switch-label
      for={triggerId}
    >
      <Slot />
    </Label>
  );
});

export const SwitchLabel = withAsChild(SwitchLabelBase);
