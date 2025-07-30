import { VisuallyHidden } from "@qwik-ui/headless";
// no-as-child
import { $, type PropsOf, component$, useContext } from "@qwik.dev/core";
import { radioGroupContextId } from "./radio-group-context";
import { radioGroupItemContextId } from "./radio-group-item";

type PublicHiddenInputProps = Omit<
  PropsOf<"input">,
  "type" | "checked" | "form" | "style"
>;

export const RadioGroupHiddenInput = component$((props: PublicHiddenInputProps) => {
  const context = useContext(radioGroupContextId);
  const itemContext = useContext(radioGroupItemContextId);
  const { onChange$, required, ...restProps } = props;
  const value = itemContext.itemValue;

  const handleChange$ = $(() => {
    if (!context.isDisabledSig.value) {
      context.selectedValueSig.value = value ? String(value) : undefined;
      context.isErrorSig.value = false;
    }
  });

  return (
    <VisuallyHidden>
      <input
        {...restProps}
        type="radio"
        tabIndex={-1}
        checked={context.selectedValueSig.value === value}
        data-qds-radio-group-hidden-input
        required={context.required ?? required ?? undefined}
        value={value ?? ""}
        name={context.localId}
        disabled={context.isDisabledSig.value}
        onChange$={[handleChange$, onChange$]}
      />
    </VisuallyHidden>
  );
});
