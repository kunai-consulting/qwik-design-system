import { type HTMLElementAttrs, Slot, component$, useContext, useTask$ } from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { checkboxContextId } from "./checkbox-context";
type PublicCheckboxErrorProps = HTMLElementAttrs<"div">;
/** A component that displays error messages for a checkbox */
export const CheckboxErrorBase = component$((props: PublicCheckboxErrorProps) => {
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
    <Render fallback="div" id={errorId} data-qds-checkbox-error {...props}>
      <Slot />
    </Render>
  );
});

export const CheckboxError = withAsChild(CheckboxErrorBase);
