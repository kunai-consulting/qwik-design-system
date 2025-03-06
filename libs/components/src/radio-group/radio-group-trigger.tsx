import {
  $,
  type PropsOf,
  Slot,
  component$,
  useComputed$,
  useContext,
  useStyles$,
  useTask$
} from "@builder.io/qwik";
import { radioGroupContextId } from "./radio-group-context";
import "./radio-group.css";
import styles from "./radio-group.css?inline";

type PublicRadioGroupControlProps = PropsOf<"button"> & {
  value: string;
  _index?: number;
};
/** Interactive trigger component that handles radio option selection */
export const RadioGroupTrigger = component$((props: PublicRadioGroupControlProps) => {
  const context = useContext(radioGroupContextId);
  const value = props.value;
  const _index = props._index;
  const triggerId = `${context.localId}-trigger`;
  const descriptionId = `${context.localId}-description`;
  const errorId = `${context.localId}-error`;
  const labelId = `${context.localId}-label-${value}`;
  useStyles$(styles);

  const isSelected = useComputed$(() => context.selectedValueSig.value === value);

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
    if (context.isDisabledSig.value) return;

    context.selectedIndexSig.value = _index ?? null;
    context.selectedValueSig.value = props.value;
    context.isErrorSig.value = false;
  });

  const handleKeyDown$ = $((event: KeyboardEvent) => {
    if ((event.key === ' ' || event.key === 'Enter') && !context.isDisabledSig.value) {
      event.preventDefault();
      handleClick$();
    }
  });

  useTask$(({ track }) => {
    track(() => context.selectedValueSig.value);
    if (context.selectedValueSig.value) {
      context.isErrorSig.value = false;
    } else {
      context.isErrorSig.value = true;
    }
  });

  return (
    <button
      type="button"
      id={triggerId}
      ref={context.triggerRef}
      role="radio"
      aria-checked={isSelected.value}
      aria-describedby={describedByLabels.value}
      aria-invalid={context.isErrorSig.value}
      aria-labelledby={labelId}
      // Indicates whether this radio trigger is disabled
      disabled={context.isDisabledSig.value}
      tabIndex={
        isSelected.value ? 0 :
          (!context.selectedValueSig.value && props._index === 0) ? 0 : -1
      }
      data-disabled={context.isDisabledSig.value ? "" : undefined}
      onClick$={[handleClick$, props.onClick$]}
      onKeyDown$={handleKeyDown$}
      // Indicates whether this radio trigger is checked
      data-checked={isSelected.value}
      data-qds-radio-group-trigger
      {...props}
    >
      <Slot />
    </button>
  );
});
