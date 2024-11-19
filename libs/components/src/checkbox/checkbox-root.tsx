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
import { CheckboxContext, checkboxContextId } from './checkbox-context';

export type CheckboxRootProps = {
  'bind:checked'?: Signal<boolean>;
  checked?: boolean;
} & PropsOf<'div'>;

export const CheckboxRoot = component$((
    props: CheckboxRootProps
  ) => {
    const {
      'bind:checked': givenCheckedSig,
      checked,
      onClick$,
      ...rest
    } = props;

    const isCheckedSig = useBoundSignal(givenCheckedSig, checked ?? false);

    const handleClick$ = $(() => {
      isCheckedSig.value = !isCheckedSig.value;
    });

    const handleKeyDownSync$ = sync$((e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
      }
    });

    const handleKeyDown$ = $((e: KeyboardEvent) => {
      if (e.key === ' ') {
        isCheckedSig.value = !isCheckedSig.value;
      }
    });

    const context: CheckboxContext = {
      isCheckedSig,
    }

    useContextProvider(checkboxContextId, context);

    return (
      <div
      {...rest}
      tabIndex={0}
      role="checkbox"
      aria-checked={isCheckedSig.value}
      onClick$={handleClick$}
      onKeyDown$={[handleKeyDownSync$, handleKeyDown$]}
      data-qds-checkbox-root
    >
      <Slot />
    </div>
    );
  }
);
