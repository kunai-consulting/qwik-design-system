import {
  $,
  type PropsOf,
  Slot,
  component$,
  useComputed$,
  useContext,
  useStyles$,
  useTask$
} from "@qwik.dev/core";
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
  useStyles$(styles);

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
    context.selectedIndexSig.value = _index ?? null;
    context.selectedValueSig.value = props.value;
    context.isErrorSig.value = false;
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
      tabIndex={0}
      id={triggerId}
      ref={context.triggerRef}
      role="radio"
      aria-label={`radioButton ${value}`}
      aria-checked={context.selectedValueSig.value === value}
      aria-describedby={describedByLabels ? describedByLabels.value : undefined}
      aria-invalid={context.isErrorSig.value}
      // Indicates whether this radio trigger is disabled
      data-disabled={context.isDisabledSig.value ? "" : undefined}
      onClick$={[handleClick$, props.onClick$]}
      // Indicates whether this radio trigger is checked
      data-checked={context.selectedValueSig.value === value}
      // Identifier for the radio group trigger button
      data-qds-radio-group-trigger
      {...props}
    >
      <Slot />
    </button>
  );
});
