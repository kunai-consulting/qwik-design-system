import { type PropsOf, Slot, component$, useContext, useTask$ } from "@qwik.dev/core";
import { checkboxContextId } from "./checkbox-context";
type PublicCheckboxErrorMessageProps = PropsOf<"div">;
/** A component that displays error messages for a checkbox */
export const CheckboxErrorMessage = component$(
  (props: PublicCheckboxErrorMessageProps) => {
    const context = useContext(checkboxContextId);
    const errorId = `${context.localId}-error`;
    useTask$(({ cleanup }) => {
      context.isErrorSig.value = true;
      cleanup(() => {
        context.isErrorSig.value = false;
      });
    });
    return (
      // Identifier for the checkbox error message element
      <div id={errorId} data-qds-checkbox-error-message {...props}>
        <Slot />
      </div>
    );
  }
);
