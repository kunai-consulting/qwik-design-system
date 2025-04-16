import { type PropsOf, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { switchContextId } from "./switch-context";

const SwitchThumbBase = component$<PropsOf<"div">>((props) => {
  const { ...restProps } = props;
  const context = useContext(switchContextId);

  return (
    <Render
      {...restProps}
      fallback="div"
      data-qds-switch-thumb
      data-checked={context.checked.value}
      data-disabled={context.disabled.value}
    />
  );
});

export const SwitchThumb = withAsChild(SwitchThumbBase);
