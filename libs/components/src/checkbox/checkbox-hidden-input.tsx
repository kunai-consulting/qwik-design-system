import { $, type HTMLElementAttrs, component$, useContext } from "@qwik.dev/core";
import { VisuallyHidden } from "../visually-hidden/visually-hidden";
import { checkboxContextId } from "./checkbox-context";
type PublicCheckboxHiddenNativeInputProps = HTMLElementAttrs<"input">;
/** A hidden native checkbox input for form submission */
export const CheckboxHiddenInput = component$(
  (props: PublicCheckboxHiddenNativeInputProps) => {
    const context = useContext(checkboxContextId);
    // In the case where the native checkbox is checked, but the state is not, we need to update the state
    const handleChange$ = $((e: InputEvent) => {
      const target = e.target as HTMLInputElement;
      if (target.checked === context.checkedSig.value) {
        return;
      }
      context.checkedSig.value = target.checked;
    });
    return (
      <VisuallyHidden>
        <input
          type="checkbox"
          tabIndex={-1}
          checked={context.checkedSig.value === true}
          indeterminate={context.checkedSig.value === "mixed"}
          // Identifier for the hidden native checkbox input element
          data-qds-checkbox-hidden-input
          name={context.name ?? props.name ?? undefined}
          required={context.required ?? props.required ?? undefined}
          value={context.value ?? props.value ?? undefined}
          onChange$={[handleChange$, props.onChange$]}
          {...props}
        />
      </VisuallyHidden>
    );
  }
);
