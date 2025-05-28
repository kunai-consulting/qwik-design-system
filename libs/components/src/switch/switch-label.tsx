import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { LabelBase } from "../label/label";
import { switchContextId } from "./switch-context";
type PublicCheckboxLabelProps = PropsOf<typeof LabelBase>;

/** Label component for the switch that can be clicked to toggle the state */
const SwitchLabelBase = component$((props: PublicCheckboxLabelProps) => {
  const context = useContext(switchContextId);
  const labelId = `${context.localId}-label`;
  const triggerId = `${context.localId}-trigger`;

  return (
    <LabelBase
      {...props}
      id={labelId}
      // The identifier for the switch label element
      data-qds-switch-label
      for={triggerId}
    >
      <Slot />
    </LabelBase>
  );
});

export const SwitchLabel = withAsChild(SwitchLabelBase);
