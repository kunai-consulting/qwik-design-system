import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { switchContextId } from "./switch-context";

/** Description component for a switch that provides additional context */
const SwitchDescriptionBase = component$<PropsOf<"div">>((props) => {
  const { ...restProps } = props;
  const context = useContext(switchContextId);
  const descriptionId = `${context.localId}-description`;

  return (
    <Render
      {...restProps}
      fallback="div"
      id={descriptionId}
      // The identifier for the switch description element
      data-qds-switch-description
      // Indicates whether the switch is currently checked
      data-checked={context.checked.value}
      // Indicates whether the switch is currently disabled
      data-disabled={context.disabled.value}
    >
      <Slot />
    </Render>
  );
});

export const SwitchDescription = withAsChild(SwitchDescriptionBase);
