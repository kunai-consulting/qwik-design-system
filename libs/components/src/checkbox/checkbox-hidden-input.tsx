import { $, type PropsOf, component$, useContext } from "@builder.io/qwik";
import { VisuallyHidden } from "../visually-hidden/visually-hidden";
import { checkboxContextId } from "./checkbox-context";
type PublicCheckboxHiddenNativeInputProps = PropsOf<"input">;
/** A hidden native checkbox input for form submission */
export const CheckboxHiddenInput = component$(
  (props: PublicCheckboxHiddenNativeInputProps) => {
    const context = useContext(checkboxContextId);
    // In the case where the native checkbox is checked, but the state is not, we need to update the state
    const handleChange$ = $((e: InputEvent) => {
      const target = e.target as HTMLInputElement;
      if (target.checked === context.checkedStateSig.value) {
        return;
      }
      context.checkedStateSig.value = target.checked;
    });
    return (
      <VisuallyHidden>
        <input
          type="checkbox"
          tabIndex={-1}
          checked={context.checkedStateSig.value === true}
          indeterminate={context.checkedStateSig.value === "mixed"}
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
