// no-as-child
import { type PropsOf, component$, useContext } from "@qwik.dev/core";
import { VisuallyHidden } from "../visually-hidden/visually-hidden";
import { radioGroupContextId } from "./radio-group-context";

type PublicHiddenInputProps = Omit<
  PropsOf<"input">,
  "type" | "checked" | "form" | "style"
>;

export const RadioGroupHiddenInput = component$((props: PublicHiddenInputProps) => {
  const context = useContext(radioGroupContextId);
  const { required, ...restProps } = props;

  return (
    <VisuallyHidden>
      <input
        {...restProps}
        type="radio"
        tabIndex={-1}
        value={context.selectedValueSig.value}
        data-qds-radio-group-hidden-input
        required={context.required ?? required ?? undefined}
        checked={context.selectedValueSig.value !== undefined}
        name={context.localId}
        disabled={context.isDisabledSig.value}
      />
    </VisuallyHidden>
  );
});
