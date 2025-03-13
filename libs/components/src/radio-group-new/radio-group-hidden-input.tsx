import {
  component$,
  useContext,
  $,
  type PropsOf
} from "@builder.io/qwik";
import { radioGroupContextId } from "./radio-group-context";

type PublicHiddenInputProps = Omit<
  PropsOf<"input">,
  "type" | "checked" | "form" | "style"
> & {
  _index?: number | null;
};

export const RadioGroupHiddenInput = component$((props: PublicHiddenInputProps) => {
  const context = useContext(radioGroupContextId);
  const { _index, value, onChange$, required, ...restProps } = props;

  const handleChange$ = $(() => {
    if (!context.isDisabledSig.value) {
      context.selectedValueSig.value = value ? String(value) : undefined;
      context.isErrorSig.value = false;
    }
  });

  return (
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
      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
    />
  );
});
