import { $, type PropsOf, Slot, component$, useContext, useSignal } from "@qwik.dev/core";
import { Render } from "../render/render";
import { switchContextId } from "./switch-context";

/** Interactive element that toggles the switch state */
export const SwitchTrigger = component$<PropsOf<"button">>((props) => {
  const { ...restProps } = props;
  const context = useContext(switchContextId);
  const triggerRef = useSignal<HTMLButtonElement>();
  const labelId = `${context.localId}-label`;
  const descriptionId = `${context.localId}-description`;
  const triggerId = `${context.localId}-trigger`;

  const handleToggle$ = $(() => {
    if (context.disabled.value) return;

    context.checked.value = !context.checked.value;
  });

  return (
    <Render
      {...restProps}
      fallback="button"
      internalRef={triggerRef}
      id={triggerId}
      type="button"
      disabled={context.disabled.value}
      data-qds-switch-trigger
      // Indicates whether the switch is currently checked
      data-checked={context.checked.value}
      // Indicates whether the switch is currently disabled
      data-disabled={context.disabled.value ? "" : undefined}
      onClick$={[handleToggle$, props.onClick$]}
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
      aria-invalid={context.hasErrorMessage.value}
    >
      <Slot />
    </Render>
  );
});
