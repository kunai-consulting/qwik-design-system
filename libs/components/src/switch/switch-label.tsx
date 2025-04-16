import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { switchContextId } from "./switch-context";

const SwitchLabelBase = component$<PropsOf<"label">>((props) => {
  const { ...restProps } = props;
  const context = useContext(switchContextId);

  return (
    <Render
      {...restProps}
      fallback="label"
      data-qds-switch-label
      data-checked={context.checked.value}
      data-disabled={context.disabled.value}
      onClick$={context.toggle$}
    >
      <Slot />
    </Render>
  );
});

export const SwitchLabel = withAsChild(SwitchLabelBase);
