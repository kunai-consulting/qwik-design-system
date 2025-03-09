import { $, type PropsOf, component$, useContext } from "@builder.io/qwik";
import { VisuallyHidden } from "../visually-hidden/visually-hidden";
import { radioGroupContextId } from "./radio-group-context";

type RadioGroupHiddenNativeInputProps = Omit<
  PropsOf<"input">,
  "type" | "checked" | "form"
> & {
  _index?: number | null;
};

/** Hidden native radio input for form submission and accessibility */
export const RadioGroupHiddenNativeInput = component$(
  (props: RadioGroupHiddenNativeInputProps) => {
    const context = useContext(radioGroupContextId);
    const _index = props._index;

    const handleChange$ = $(() => {
      if (!context.isDisabledSig.value) {
        context.selectedIndexSig.value = _index ?? null;
        context.selectedValueSig.value = props.value ? String(props.value) : undefined;
        context.isErrorSig.value = false;
      }
    });

    const { onChange$, required, value, ...restProps } = props;

    return (
      <VisuallyHidden>
        <input
          {...restProps}
          type="radio"
          tabIndex={-1}
          checked={context.selectedIndexSig.value === _index}
          // Identifier for the hidden native radio input element
          data-qds-radio-group-hidden-input
          required={context.required ?? required ?? undefined}
          value={context.value ?? ""}
          name={context.localId}
          disabled={context.isDisabledSig.value}
          onChange$={[handleChange$, onChange$]}
        />
      </VisuallyHidden>
    );
  }
);
