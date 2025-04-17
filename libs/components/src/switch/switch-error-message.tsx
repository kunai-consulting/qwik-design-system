import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { switchContextId } from "./switch-context";

const SwitchErrorMessageBase = component$<PropsOf<"div">>((props) => {
  const { ...restProps } = props;
  const context = useContext(switchContextId);

  return (
    <Render
      {...restProps}
      fallback="div"
      id={context.errorId}
      role="alert"
      data-qds-switch-error-message
      data-visible={context.isError}
      aria-hidden={!context.isError}
    >
      <Slot />
    </Render>
  );
});

export const SwitchErrorMessage = withAsChild(SwitchErrorMessageBase);
