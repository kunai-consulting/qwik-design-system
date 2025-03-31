import {
  $,
  type PropsOf,
  Slot,
  component$,
  sync$,
  useComputed$,
  useContext,
  useOnWindow
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { checkboxContextId } from "./checkbox-context";
type PublicCheckboxControlProps = PropsOf<"button">;

/** Interactive trigger component that handles checkbox toggling */
export const CheckboxTriggerBase = component$((props: PublicCheckboxControlProps) => {
  const context = useContext(checkboxContextId);
  const triggerId = `${context.localId}-trigger`;
  const descriptionId = `${context.localId}-description`;
  const errorId = `${context.localId}-error`;
  const describedByLabels = useComputed$(() => {
    const labels = [];
    if (context.description) {
      labels.push(descriptionId);
    }
    if (context.isErrorSig.value) {
      labels.push(errorId);
    }
    return labels.join(" ") || undefined;
  });
  const handleClick$ = $(() => {
    if (context.checkedStateSig.value === "mixed") {
      context.checkedStateSig.value = true;
    } else {
      context.checkedStateSig.value = !context.checkedStateSig.value;
    }
  });

  const handleKeyDownSync$ = useOnWindow(
    "keydown",
    sync$((e: KeyboardEvent, el: HTMLButtonElement) => {
      if (e.key !== "Enter") return;
      if (!el.hasAttribute("data-qds-checkbox-trigger")) return;

      e.preventDefault();
    })
  );

  return (
    <Render
      id={triggerId}
      ref={context.triggerRef}
      type="button"
      role="checkbox"
      fallback="button"
      aria-checked={`${context.checkedStateSig.value}`}
      aria-describedby={describedByLabels ? describedByLabels.value : undefined}
      aria-invalid={context.isErrorSig.value}
      disabled={context.isDisabledSig.value}
      onClick$={[handleClick$, props.onClick$]}
      data-qds-checkbox-trigger
      {...context.dataAttributes.value}
      {...props}
    >
      <Slot />
    </Render>
  );
});

export const CheckboxTrigger = withAsChild(CheckboxTriggerBase);
