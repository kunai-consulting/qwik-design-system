import {
  component$,
  type PropsOf,
  Slot,
  type Signal,
  $,
  useContextProvider,
  sync$,
} from '@builder.io/qwik';
import { useBoundSignal } from '../../utils/bound-signal';
import { CheckboxContext } from './checkbox-context';

export type CheckboxProps = {
  bindChecked: Signal<boolean>;
  initialValue?: boolean;
} & PropsOf<'div'>;

export const CheckboxRoot = component$<CheckboxProps>((props) => {
  const checkedSignal = useBoundSignal(props.bindChecked, props.initialValue);
  useContextProvider(CheckboxContext, checkedSignal);

  const handleKeyDownSync$ = sync$((e: KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
    }
  });
  const handleClick = $(() => {
    checkedSignal.value = !checkedSignal.value;
  });
  const handleKeyDown$ = $((e: KeyboardEvent) => {
    if (e.key === ' ') {
      props.bindChecked.value = !props.bindChecked.value;
    }
  });

  return (
    <div
      {...props}
      tabIndex={0}
      role="checkbox"
      aria-checked={checkedSignal.value}
      onClick$={handleClick}
      onKeyDown$={[handleKeyDownSync$, handleKeyDown$]}
      onKeyPress$={handleClick}
    >
      <Slot />
    </div>
  );
});
