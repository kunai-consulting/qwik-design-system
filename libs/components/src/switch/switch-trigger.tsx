import {
  $,
  type PropsOf,
  Slot,
  component$,
  useContext,
  useSignal
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { switchContextId } from "./switch-context";

/** Interactive element that toggles the switch state */
const SwitchTriggerBase = component$<PropsOf<"button">>((props) => {
  const { ...restProps } = props;
  const context = useContext(switchContextId);
  const triggerRef = useSignal<HTMLButtonElement>();

  const handleKeyDown$ = $((event: KeyboardEvent) => {
    if (event.key === " " || event.key === "Enter") {
      context.toggle$();
    }
  });

  return (
    <Render
      {...restProps}
      fallback="button"
      ref={triggerRef}
      id={context.triggerId}
      type="button"
      disabled={context.disabled.value}
      data-qds-switch-trigger
      // Indicates whether the switch is currently checked
      data-checked={context.checked.value}
      // Indicates whether the switch is currently disabled
      data-disabled={context.disabled.value ? "" : undefined}
      onClick$={[context.toggle$, props.onClick$]}
      onKeyDown$={[handleKeyDown$, props.onKeyDown$]}
      aria-labelledby={context.labelId}
      aria-describedby={context.descriptionId}
      aria-invalid={context.hasErrorMessage.value}
    >
      <Slot />
    </Render>
  );
});

export const SwitchTrigger = withAsChild(SwitchTriggerBase);
