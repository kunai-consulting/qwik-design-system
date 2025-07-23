import { type HTMLElementAttrs, component$, useContext } from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { switchContextId } from "./switch-context";

/** Visual indicator that moves to show the switch state */
const SwitchThumbBase = component$<HTMLElementAttrs<"div">>((props) => {
  const { ...restProps } = props;
  const context = useContext(switchContextId);

  return (
    <Render
      {...restProps}
      fallback="div"
      data-qds-switch-thumb
      // Indicates whether the switch is currently checked
      data-checked={context.checked.value}
      // Indicates whether the switch is currently disabled
      data-disabled={context.disabled.value}
    />
  );
});

export const SwitchThumb = withAsChild(SwitchThumbBase);
