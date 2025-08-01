import { type PropsOf, component$, useContext } from "@qwik.dev/core";
import { Render } from "../render/render";
import { switchContextId } from "./switch-context";

/** Visual indicator that moves to show the switch state */
export const SwitchThumb = component$<PropsOf<"span">>((props) => {
  const { ...restProps } = props;
  const context = useContext(switchContextId);

  return (
    <Render
      {...restProps}
      fallback="span"
      data-qds-switch-thumb
      // Indicates whether the switch is currently checked
      data-checked={context.checked.value}
      // Indicates whether the switch is currently disabled
      data-disabled={context.disabled.value}
    />
  );
});
