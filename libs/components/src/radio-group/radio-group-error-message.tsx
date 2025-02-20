import { type PropsOf, Slot, component$, useContext, useTask$ } from "@qwik.dev/core";
import { radioGroupContextId } from "./radio-group-context";

type RadioGroupErrorMessageProps = PropsOf<"div">;

/** Displays error message when radio group validation fails */
export const RadioGroupErrorMessage = component$((props: RadioGroupErrorMessageProps) => {
  const context = useContext(radioGroupContextId);
  const errorId = `${context.localId}-error`;

  return (
    <div
      id={errorId}
      // Identifier for the radio group error message container
      data-qds-radio-group-error-message
      {...props}
      // Indicates whether the error message is currently visible
      data-visible={context.isErrorSig.value === true}
    >
      {context.isErrorSig.value === true && <Slot />}
    </div>
  );
});
