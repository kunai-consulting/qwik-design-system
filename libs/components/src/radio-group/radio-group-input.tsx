import {
  component$,
  useContext,
  useComputed$,
  type PropsOf,
  $,
  sync$,
} from '@builder.io/qwik';
import { radioGroupContextId } from './radio-group-context';

type RadioGroupInputProps = PropsOf<'input'> & { value: string };

export const RadioGroupInput = component$<RadioGroupInputProps>(
  ({ value, ...props }) => {
    const context = useContext(radioGroupContextId);
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
      return labels.join(' ') || undefined;
    });

    const handleClick$ = $(() => {
      if (context.selectedValueSig.value !== value) {
        context.selectedValueSig.value = value;
      }
    });

    return (
      <input
        type="radio"
        role="radio"
        checked={context.selectedValueSig.value === value}
        aria-checked={context.selectedValueSig.value === value}
        data-checked={context.selectedValueSig.value === value}
        data-qds-radio-group-input
        aria-invalid={context.isErrorSig.value}
        data-disabled={context.isDisabledSig.value ? '' : undefined}
        name={props.name ?? undefined}
        value={context.selectedValueSig.value}
        aria-describedby={
          describedByLabels ? describedByLabels.value : undefined
        }
        onClick$={[handleClick$]}
        {...props}
      />
    );
  }
);
