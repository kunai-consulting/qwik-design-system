import { $, component$, useContext, type PropsOf } from "@builder.io/qwik";
import { VisuallyHidden } from "../visually-hidden/visually-hidden";
import { checkboxContextId } from "./checkbox-context";

type CheckboxHiddenNativeInputProps = PropsOf<"input">;

export const CheckboxHiddenNativeInput = component$(
  (props: CheckboxHiddenNativeInputProps) => {
    const context = useContext(checkboxContextId);

    // In the case where the native checkbox is checked, but the state is not, we need to update the state
    const handleChange$ = $((e: InputEvent) => {
      const target = e.target as HTMLInputElement;
      if (target.checked === context.isCheckedSig.value) {
        return;
      }

      context.isCheckedSig.value = target.checked;
    });

    return (
      <VisuallyHidden>
        <input
          type="checkbox"
          tabIndex={-1}
          checked={context.isCheckedSig.value === true}
          indeterminate={context.isCheckedSig.value === "mixed"}
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
