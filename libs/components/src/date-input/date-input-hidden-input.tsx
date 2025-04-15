import { $, type PropsOf, component$, useContext } from "@builder.io/qwik";
import { VisuallyHidden } from "../visually-hidden/visually-hidden";
import { dateInputContextId } from "./date-input-context";
type PublicDateInputHiddenNativeInputProps = PropsOf<"input">;

/** A hidden native text input for form submission */
export const DateInputHiddenInput = component$(
  (props: PublicDateInputHiddenNativeInputProps) => {
    const context = useContext(dateInputContextId);
    // In the case where the native checkbox is checked, but the state is not, we need to update the state
    const handleChange$ = $((e: InputEvent) => {
      const target = e.target as HTMLInputElement;
      // if (target.checked === context.checkedStateSig.value) {
      //   return;
      // }
      // context.checkedStateSig.value = target.checked;
    });
    return (
      <VisuallyHidden>
        <input
          type="text"
          tabIndex={-1}
          data-qds-date-input-hidden-input
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
