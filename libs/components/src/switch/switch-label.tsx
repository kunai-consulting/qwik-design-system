import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { LabelBase } from "../label/label";
import { switchContextId } from "./switch-context";
type PublicCheckboxLabelProps = PropsOf<typeof LabelBase>;

/** Label component for the switch that can be clicked to toggle the state */
const SwitchLabelBase = component$((props: PublicCheckboxLabelProps) => {
  const context = useContext(switchContextId);
  return (
    <LabelBase
      {...props}
      id={context.labelId}
      // The identifier for the switch label element
      data-qds-switch-label
      for={context.triggerId}
    >
      <Slot />
    </LabelBase>
  );
});

export const SwitchLabel = withAsChild(SwitchLabelBase);
