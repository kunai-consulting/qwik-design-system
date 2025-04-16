import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { switchContextId } from "./switch-context";

const SwitchDescriptionBase = component$<PropsOf<"div">>((props) => {
  const { ...restProps } = props;
  const context = useContext(switchContextId);

  return (
    <Render
      {...restProps}
      fallback="div"
      data-qds-switch-description
      data-checked={context.checked.value}
      data-disabled={context.disabled.value}
    >
      <Slot />
    </Render>
  );
});

export const SwitchDescription = withAsChild(SwitchDescriptionBase);
