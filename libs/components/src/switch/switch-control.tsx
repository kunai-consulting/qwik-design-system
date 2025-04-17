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

const SwitchControlBase = component$<PropsOf<"button">>((props) => {
  const { ...restProps } = props;
  const context = useContext(switchContextId);
  const controlRef = useSignal<HTMLButtonElement>();

  const handleKeyDown$ = $((event: KeyboardEvent) => {
    if (event.key === " " || event.key === "Enter") {
      context.toggle$();
    }
  });

  return (
    <Render
      {...restProps}
      fallback="button"
      ref={controlRef}
      id={context.controlId}
      type="button"
      disabled={context.disabled.value}
      data-qds-switch-control
      data-checked={context.checked.value}
      data-disabled={context.disabled.value ? "" : undefined}
      onClick$={[context.toggle$, props.onClick$]}
      onKeyDown$={[handleKeyDown$, props.onKeyDown$]}
      aria-labelledby={context.labelId}
      aria-describedby={context.descriptionId}
      aria-invalid={context.isError}
    >
      <Slot />
    </Render>
  );
});

export const SwitchControl = withAsChild(SwitchControlBase);
