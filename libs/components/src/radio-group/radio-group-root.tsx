import {
  component$,
  useSignal,
  useContextProvider,
  Slot,
  useId,
  useTask$,
  type Signal,
  type PropsOf,
} from '@builder.io/qwik';
import { useBoundSignal } from '../../utils/bound-signal';
import {
  radioGroupContextId,
  type RadioGroupContext,
} from './radio-group-context';

export type RadioGroupRootProps = PropsOf<'div'> & {
  'bind:checked'?: Signal<boolean>;
  checked?: Signal<boolean>;
  name?: string;
  defaultValue?: string;
  onChange$?: (value: string | null) => void;
  disabled?: boolean;
  isDescription?: boolean;
  required?: boolean;
  value?: string;
};

export const RadioGroupRoot = component$((props: RadioGroupRootProps) => {
  const {
    'bind:checked': givenCheckedSig,
    checked,
    onClick$,
    onChange$,
    isDescription,
    name,
    required,
    value,
    defaultValue,
    ...rest
  } = props;

  const isCheckedSig = useBoundSignal<boolean>(
    givenCheckedSig,
    typeof checked === 'boolean' ? checked : false
  );
  const isInitialLoadSig = useSignal(true);
  const selectedValueSig = useSignal<string | null>(defaultValue || null);
  const localId = useId();
  const triggerRef = useSignal<HTMLButtonElement | undefined>(undefined);

  const isDisabledSig = useSignal(false);
  const isErrorSig = useSignal(false);

  const context: RadioGroupContext = {
    selectedValueSig,
    isDisabledSig,
    localId,
    isDescription,
    name,
    required,
    value,
    isErrorSig,
    triggerRef,
    isCheckedSig,
  };

  useContextProvider(radioGroupContextId, context);

  useTask$(async function handleChange({ track }) {
    track(() => context.selectedValueSig.value);
    if (isInitialLoadSig.value) {
      isInitialLoadSig.value = false;
      return;
    }
    await onChange$?.(context.selectedValueSig.value);
  });

  return (
    <div role="radiogroup" {...rest} data-qds-radio-group-root>
      <Slot />
    </div>
  );
});
