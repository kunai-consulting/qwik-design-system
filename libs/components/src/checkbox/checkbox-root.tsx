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
import type { QwikIntrinsicElements } from '@builder.io/qwik';

type AllowedElements = 'li' | 'div' | 'span';

export type CheckboxProps = {
  'bind:checked'?: Signal<boolean>;
  initialValue?: boolean;
} & PropsOf<'div'>;

export const CheckboxRoot = component$(
  <C extends AllowedElements = 'div'>(
    props: QwikIntrinsicElements[C] & { as?: C } & CheckboxProps
  ) => {
    const {
      'bind:checked': givenCheckedSig,
      initialValue,
      onClick$,
      as,
      ...rest
    } = props;
    const Comp = as ?? 'div';

    const checkedSignal = useBoundSignal(givenCheckedSig, initialValue);
    console.log('checkboxROOT checkedSignal ', checkedSignal.value);

    useContextProvider(CheckboxContext, checkedSignal);
    const handleKeyDownSync$ = sync$((e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
      }
    });

    const handleClick$ = $(() => {
      checkedSignal.value = !checkedSignal.value;
    });

    const handleKeyDown$ = $((e: KeyboardEvent) => {
      if (e.key === ' ') {
        checkedSignal.value = !checkedSignal.value;
      }
    });

    return (
      <>
        {/* @ts-ignore */}
        <Comp
          {...rest}
          tabIndex={0}
          role="checkbox"
          aria-checked={checkedSignal.value}
          onClick$={onClick$ || handleClick$}
          onKeyDown$={[handleKeyDownSync$, handleKeyDown$]}
          onKeyPress$={onClick$ || handleClick$}
          data-qds-checkbox-root
        >
          <Slot />
        </Comp>
      </>
    );
  }
);
