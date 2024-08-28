import {
  component$,
  type PropsOf,
  Slot,
  type Signal,
  $,
  useContextProvider,
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
  const handleClick = $(() => {
    checkedSignal.value = !checkedSignal.value;
  });
  return (
    <div
      {...props}
      tabIndex={0}
      role="checkbox"
      aria-checked={checkedSignal.value}
      onClick$={handleClick}
    >
      <Slot />
    </div>
  );
});
