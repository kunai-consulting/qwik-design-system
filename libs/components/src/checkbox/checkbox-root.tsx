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
  'bind:checked': Signal<boolean>;
  initialValue?: boolean;
} & PropsOf<'div'>;

export const CheckboxRoot = component$<CheckboxProps>(
  ({ 'bind:checked': givenCheckedSig, initialValue, onClick$, ...props }) => {
    const checkedSignal = useBoundSignal(givenCheckedSig, initialValue);

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
        givenCheckedSig.value = !givenCheckedSig.value;
      }
    });

    return (
      <div
        {...props}
        tabIndex={0}
        role="checkbox"
        aria-checked={checkedSignal.value}
        onClick$={onClick$ || handleClick}
        onKeyDown$={[handleKeyDownSync$, handleKeyDown$]}
        onKeyPress$={handleClick}
      >
        <Slot />
      </div>
    );
  }
);
