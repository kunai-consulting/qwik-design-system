// no-as-child
import { $, type PropsOf, component$, useContext } from "@qwik.dev/core";
import { VisuallyHidden } from "@qwik-ui/headless";
import { switchContextId } from "./switch-context";

type PublicHiddenInputProps = Omit<
  PropsOf<"input">,
  "type" | "checked" | "form" | "style"
>;
/**
 * Hidden input component that maintains form control functionality.
 * Uses checkbox type as Switch represents a boolean state (on/off)
 * according to WAI-ARIA switch pattern.
 */
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
