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
import { radioGroupItemContextId } from './radio-group-item';

type RadioGroupControlProps = PropsOf<'button'> & {
  value: string;
  _index?: number;
};

export const RadioGroupTrigger = component$((props: RadioGroupControlProps) => {
  const context = useContext(radioGroupContextId);
  const itemContext = useContext(radioGroupItemContextId);
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

  // Multiple instances of buttons, each one gets focus

  // Each button should have an event for keyboard navigation

  // Based off orientation

  /**
   *  If it is a horizontal radio group
   * 
   * GIVEN a horizontal radio group
   * WHEN the user presses the right arrow key
   * THEN the next button should be focused
   * 
   * GIVEN a vertical radio group
   * WHEN the user presses the down arrow key
   * THEN the next button should be focused
   *  
   * IF MY ITEM HAS FOCUS AND THEY PRESS THE NEXT NAVIGATION KEY, THE WE SHOULD FOCUS THE NEXT ITEM INDEX
   * 
   * COLLECT THE TRIGGER REFS IN AN ARRAY, focus next trigger ref in the array
   *  
   */

  // const handleKeyDown$ = $((e: KeyboardEvent) => {
  //   if (e.key === 'ArrowDown' && itemContext.index) { 
  //     context.triggerRefs.value[itemContext.index + 1]?.focus();
  //   }
  // })

  return (
    <button
      tabIndex={0}
      id={triggerId}
      ref={itemContext.triggerRef}
      role="radio"
      aria-label={`radioButton ${value}`}
      aria-checked={context.selectedValueSig.value === value}
      aria-describedby={describedByLabels ? describedByLabels.value : undefined}
      aria-invalid={context.isErrorSig.value}
      data-disabled={context.isDisabledSig.value ? '' : undefined}
      onClick$={[handleClick$, props.onClick$]}
      data-checked={context.selectedValueSig.value === value}
      data-qds-radio-group-trigger
      {...props}
    >
      <Slot />
    </button>
  );
});
