import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { radioGroupContextId } from "./radio-group-context";

type PublicErrorProps = PropsOf<"div">;

export const RadioGroupErrorBase = component$((props: PublicErrorProps) => {
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

export const RadioGroupError = withAsChild(RadioGroupErrorBase);
