import { type PropsOf, Slot, component$, useContext, useTask$ } from "@builder.io/qwik";
import { radioGroupContextId } from "./radio-group-context";

type RadioGroupErrorMessageProps = PropsOf<"div">;

export const RadioGroupErrorMessage = component$(
  (props: RadioGroupErrorMessageProps) => {
    const context = useContext(radioGroupContextId);
    const errorId = `${context.localId}-error`;

    return (
      <div
        id={errorId}
        data-qds-radio-group-error-message
        {...props}
        data-visible={context.isErrorSig.value === true}
      >
        {context.isErrorSig.value === true && <Slot />}
      </div>
    );
  }
);
