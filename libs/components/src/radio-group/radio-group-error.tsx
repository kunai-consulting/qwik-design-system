import { type HTMLElementAttrs, Slot, component$, useContext } from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { radioGroupContextId } from "./radio-group-context";

type PublicErrorProps = HTMLElementAttrs<"div">;

export const RadioGroupErrorBase = component$((props: PublicErrorProps) => {
  const context = useContext(radioGroupContextId);
  const errorId = `${context.localId}-error`;

  return (
    <Render
      {...props}
      fallback="div"
      id={errorId}
      data-qds-radio-group-error
      data-visible={context.isErrorSig.value}
      aria-hidden={!context.isErrorSig.value}
    >
      <Slot />
    </Render>
  );
});

export const RadioGroupError = withAsChild(RadioGroupErrorBase);
