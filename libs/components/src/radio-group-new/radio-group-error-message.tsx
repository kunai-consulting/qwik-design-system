import {
  component$,
  useContext,
  type PropsOf,
  Slot
} from "@builder.io/qwik";
import { radioGroupContextId } from "./radio-group-context";

type PublicErrorMessageProps = PropsOf<"div">;

export const RadioGroupErrorMessage = component$((props: PublicErrorMessageProps) => {
  const context = useContext(radioGroupContextId);
  const errorId = `${context.localId}-error`;

  return (
    <div
      {...props}
      id={errorId}
      data-qds-radio-group-error-message
      data-visible={context.isErrorSig.value}
      aria-hidden={!context.isErrorSig.value}
    >
      {context.isErrorSig.value && <Slot />}
    </div>
  );
});
