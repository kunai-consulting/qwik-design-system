import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { switchContextId } from "./switch-context";

/** Label component for the switch that can be clicked to toggle the state */
const SwitchLabelBase = component$<PropsOf<"label">>((props) => {
  const { ...restProps } = props;
  const context = useContext(switchContextId);

  return (
    <Render
      {...restProps}
      fallback="label"
      id={context.labelId}
      // The identifier for the switch label element
      data-qds-switch-label
      // Indicates whether the switch is currently checked
      data-checked={context.checked.value}
      // Indicates whether the switch is currently disabled
      data-disabled={context.disabled.value}
      onClick$={[context.toggle$, props.onClick$]}
    >
      <Slot />
    </Render>
  );
});

export const SwitchLabel = withAsChild(SwitchLabelBase);
