import { type PropsOf, Slot, component$, useContext, useTask$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { switchContextId } from "./switch-context";

/** Error message component that displays when the switch is in an error state */
const SwitchErrorMessageBase = component$<PropsOf<"div">>((props) => {
  const { ...restProps } = props;
  const context = useContext(switchContextId);

  useTask$(() => {
    context.hasErrorMessage.value = true;
    return () => {
      context.hasErrorMessage.value = false;
    };
  });

  return (
    <Render
      {...restProps}
      fallback="div"
      id={context.errorId}
      role="alert"
      // The identifier for the switch error message element
      data-qds-switch-error-message
      // Controls the visibility of the error message
      data-visible={context.hasError}
      aria-hidden={!context.hasError}
    >
      <Slot />
    </Render>
  );
});

export const SwitchErrorMessage = withAsChild(SwitchErrorMessageBase);
