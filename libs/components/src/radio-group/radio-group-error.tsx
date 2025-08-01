import { type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { Render } from "../render/render";
import { radioGroupContextId } from "./radio-group-context";

type PublicErrorProps = PropsOf<"div">;

export const RadioGroupError = component$((props: PublicErrorProps) => {
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
