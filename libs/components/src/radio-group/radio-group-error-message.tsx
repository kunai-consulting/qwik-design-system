import { type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { radioGroupContextId } from "./radio-group-context";

type PublicErrorMessageProps = PropsOf<"div">;

export const RadioGroupErrorMessageBase = component$((props: PublicErrorMessageProps) => {
  const context = useContext(radioGroupContextId);
  const errorId = `${context.localId}-error`;

  return (
    <Render
      {...props}
      fallback="div"
      id={errorId}
      data-qds-radio-group-error-message
      data-visible={context.isErrorSig.value}
      aria-hidden={!context.isErrorSig.value}
    >
      <Slot />
    </Render>
  );
});

export const RadioGroupErrorMessage = withAsChild(RadioGroupErrorMessageBase);
