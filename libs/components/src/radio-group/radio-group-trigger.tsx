import {
  $,
  type PropsOf,
  Slot,
  component$,
  sync$,
  useComputed$,
  useContext
} from "@builder.io/qwik";
import { radioGroupContextId } from "./radio-group-context";

type RadioGroupControlProps = PropsOf<"button">;

export const RadioGroupTrigger = component$((props: RadioGroupControlProps) => {
  const context = useContext(radioGroupContextId);
  const triggerId = `${context.localId}-trigger`;
  const descriptionId = `${context.localId}-description`;
  const errorId = `${context.localId}-error`;

  const describedByLabels = useComputed$(() => {
    const labels = [];
    if (context.isDescription) {
      labels.push(descriptionId);
    }
    if (context.isErrorSig.value) {
      labels.push(errorId);
    }
    return labels.join(" ") || undefined;
  });

  const handleClick$ = $(() => {
    context.isCheckedSig.value = !context.isCheckedSig.value;
  });

  const handleKeyDownSync$ = sync$((e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  });

  return (
    <button
      id={triggerId}
      ref={context.triggerRef}
      type="button"
      role="radio"
      aria-checked={`${context.isCheckedSig.value}`}
      aria-describedby={describedByLabels ? describedByLabels.value : undefined}
      aria-invalid={context.isErrorSig.value}
      disabled={context.isDisabledSig.value}
      data-disabled={context.isDisabledSig.value ? "" : undefined}
      onKeyDown$={[handleKeyDownSync$, props.onKeyDown$]}
      onClick$={[handleClick$, props.onClick$]}
      data-checked={context.isCheckedSig.value ? "" : undefined}
      data-qds-radio-group-trigger
      {...props}
    >
      <Slot />
    </button>
  );
});
