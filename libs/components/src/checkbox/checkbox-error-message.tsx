import { component$, Slot, useContext, useTask$, type PropsOf } from "@builder.io/qwik";
import { checkboxContextId } from "./checkbox-context";

type CheckboxErrorMessageProps = PropsOf<"div">;

export const CheckboxErrorMessage = component$((props: CheckboxErrorMessageProps) => {
  const context = useContext(checkboxContextId);
  const errorId = `${context.localId}-error`;

  useTask$(({ cleanup }) => {
    context.isErrorSig.value = true;

    cleanup(() => {
      context.isErrorSig.value = false;
    });
  });

  return (
    <div id={errorId} data-qds-checkbox-error-message {...props}>
      <Slot />
    </div>
  );
});
