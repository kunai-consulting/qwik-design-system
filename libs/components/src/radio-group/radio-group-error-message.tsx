import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { radioGroupContextId } from "./radio-group-context";

type PublicErrorMessageProps = PropsOf<"div">;

export const RadioGroupErrorMessageBase = component$((props: PublicErrorMessageProps) => {
  const context = useContext(radioGroupContextId);
  const errorId = `${context.localId}-error`;

  return (
    <Render
      fallback="div"
      {...props}
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
