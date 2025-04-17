// no-as-child
import { $, type PropsOf, component$, useContext } from "@builder.io/qwik";
import { VisuallyHidden } from "@qwik-ui/headless";
import { switchContextId } from "./switch-context";

type PublicHiddenInputProps = Omit<
  PropsOf<"input">,
  "type" | "checked" | "form" | "style"
>;

export const SwitchHiddenInput = component$((props: PublicHiddenInputProps) => {
  const context = useContext(switchContextId);
  const { onChange$, required, ...restProps } = props;

  const handleChange$ = $(() => {
    if (!context.disabled.value) {
      context.checked.value = !context.checked.value;
    }
  });

  return (
    <VisuallyHidden>
      <input
        {...restProps}
        type="checkbox"
        tabIndex={-1}
        checked={context.checked.value}
        data-qds-switch-hidden-input
        required={context.required.value ?? required ?? undefined}
        value={context.value?.value ?? ""}
        name={context.name?.value}
        disabled={context.disabled.value}
        onChange$={[handleChange$, onChange$]}
      />
    </VisuallyHidden>
  );
});
