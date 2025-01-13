import {
  $,
  component$,
  type PropsOf,
  Slot,
  useComputed$,
  useContext,
  useStyles$,
  useTask$,
} from '@builder.io/qwik';
import { radioGroupContextId } from './radio-group-context';
import './radio-group.css';
import styles from './radio-group.css?inline';

type RadioGroupControlProps = PropsOf<'div'> & {
  value: string;
  _index?: number;
  name: string;
};

export const RadioGroupTrigger = component$((props: RadioGroupControlProps) => {
  const context = useContext(radioGroupContextId);
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
    return labels.join(' ') || undefined;
  });

  const handleClick$ = $(() => {
    context.selectedIndexSig.value = _index ?? null;
    context.selectedValueSig.value = props.value;
    context.isErrorSig.value = false;
  });

  const handleKeyDown$ = $((event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
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
    <div
      tabIndex={0}
      id={triggerId}
      ref={context.triggerRef}
      role="radio"
      aria-label={`radioButton ${(_index ?? 0) + 1}`}
      aria-checked={context.selectedIndexSig.value === _index}
      aria-describedby={describedByLabels ? describedByLabels.value : undefined}
      aria-invalid={context.isErrorSig.value}
      data-disabled={context.isDisabledSig.value ? '' : undefined}
      onClick$={[handleClick$, props.onClick$]}
      onKeyDown$={[handleKeyDown$, props.onKeyDown$]}
      data-checked={context.selectedIndexSig.value === _index}
      data-qds-radio-group-trigger
      {...props}
    >
      <Slot />
    </div>
  );
});
