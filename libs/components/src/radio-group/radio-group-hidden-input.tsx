import { $, type PropsOf, component$, useContext } from "@qwik.dev/core";
import { VisuallyHidden } from "../visually-hidden/visually-hidden";
import { radioGroupContextId } from "./radio-group-context";

type RadioGroupHiddenNativeInputProps = PropsOf<"input"> & {
  _index?: number | null;
};

/** Hidden native radio input for form submission and accessibility */
export const RadioGroupHiddenNativeInput = component$(
  (props: RadioGroupHiddenNativeInputProps) => {
    const context = useContext(radioGroupContextId);
    const _index = props._index;

    const handleChange$ = $(() => {
      context.selectedIndexSig.value = _index ?? null;
    });

    return (
      <VisuallyHidden>
        <input
          type="radio"
          tabIndex={-1}
          checked={context.selectedIndexSig.value === _index}
          // Identifier for the hidden native radio input element
          data-qds-radio-group-hidden-input
          required={context.required ?? props.required ?? undefined}
          value={context.value ?? props.value ?? undefined}
          onChange$={[handleChange$, props.onChange$]}
          {...props}
        />
      </VisuallyHidden>
    );
  }
);
