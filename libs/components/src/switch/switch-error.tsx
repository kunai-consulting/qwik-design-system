import { type PropsOf, Slot, component$, useContext, useTask$ } from "@qwik.dev/core";
import { Render } from "../render/render";
import { switchContextId } from "./switch-context";

/** Error message component that displays when the switch is in an error state */
export const SwitchError = component$<PropsOf<"div">>((props) => {
  const { ...restProps } = props;
  const context = useContext(switchContextId);

  const errorId = `${context.localId}-error`;

  /**
   *  So this doesn't work
   *  Please watch: https://www.youtube.com/watch?v=DKYpBIjDgHQ
   *
   * As a result, you can set aria-errormessage to the errorId without the conditional for now. The tradeoff being it may be a broken reference, but better than nothing.
   */
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
      id={errorId}
      role="alert"
      // The identifier for the switch error message element
      data-qds-switch-error
      // Controls the visibility of the error message
      data-visible={context.hasError}
      aria-hidden={!context.hasError}
    >
      <Slot />
    </Render>
  );
});
