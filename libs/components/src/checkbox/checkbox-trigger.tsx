import { $, component$, type PropsOf, Slot, sync$, useContext } from "@builder.io/qwik";
import { checkboxContextId } from "./checkbox-context";

type CheckboxControlProps = PropsOf<"button">;

export const CheckboxTrigger = component$((props: CheckboxControlProps) => {
  const context = useContext(checkboxContextId);
  const triggerId = `${context.localId}-trigger`;
  const descriptionId = `${context.localId}-description`;

  const handleClick$ = $(() => {
    if (context.isCheckedSig.value === "mixed") {
      context.isCheckedSig.value = true;
    } else {
      context.isCheckedSig.value = !context.isCheckedSig.value;
    }
  });

  const handleKeyDownSync$ = sync$((e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  });

  return (
    <button
      id={triggerId}
      type="button"
      role="checkbox"
      aria-checked={`${context.isCheckedSig.value}`}
      aria-describedby={context.isDescription ? descriptionId : undefined}
      disabled={context.isDisabledSig.value}
      data-disabled={context.isDisabledSig.value ? "" : undefined}
      onKeyDown$={[handleKeyDownSync$, props.onKeyDown$]}
      onClick$={[handleClick$, props.onClick$]}
      data-qds-checkbox-trigger
      {...props}
    >
      <Slot />
    </button>
  );
});
