import {
  component$,
  type PropsOf,
  Slot,
  type Signal,
  useContextProvider,
  useId,
  useTask$,
  useSignal,
  type QRL,
  useComputed$,
} from '@builder.io/qwik';
import {
  type RadioGroupContext,
  radioGroupContextId,
} from './radio-group-context';

export type RadioGroupRootProps = {
  'bind:value'?: Signal<boolean>;
  onChange$?: QRL<(checked: string) => void>;
  defaultValue?: string;
  disabled?: boolean;
  isDescription?: boolean;
  name?: string;
  required?: boolean;
  value?: string;
} & PropsOf<'div'>;

export const RadioGroupRoot = component$((props: RadioGroupRootProps) => {
  const {
    'bind:value': givenCheckedSig,
    onClick$,
    onChange$,
    isDescription,
    name,
    required,
    value,
    ...rest
  } = props;

  const selectedValueSig = useSignal<string | undefined>(undefined);
  const selectedIndexSig = useSignal<number | null>(null);
  const isInitialLoadSig = useSignal(true);
  const isDisabledSig = useComputed$(() => props.disabled);
  const isErrorSig = useSignal(false);
  const localId = useId();
  const triggerRef = useSignal<HTMLButtonElement>();

  const context: RadioGroupContext = {
    selectedValueSig,
    selectedIndexSig,
    isDisabledSig,
    localId,
    isDescription,
    name,
    required,
    value,
    isErrorSig,
    triggerRef,
  };

  useContextProvider(radioGroupContextId, context);

  useTask$(({ track }) => {
    track(() => value);
    if (value !== undefined) {
      selectedValueSig.value = value;
    }
  });

  useTask$(async function handleChange({ track }) {
    track(() => selectedValueSig.value);

    if (isInitialLoadSig.value) {
      return;
    }

    await onChange$?.(selectedValueSig.value as string);
  });

  useTask$(() => {
    isInitialLoadSig.value = false;
  });

  return (
    <div
      {...rest}
      role="radiogroup"
      data-qds-radio-group-root
      data-disabled={context.isDisabledSig.value ? '' : undefined}
      aria-disabled={context.isDisabledSig.value ? 'true' : 'false'}
      data-checked={
        context.selectedValueSig.value === props.value ? 'true' : 'false'
      }
    >
      <Slot />
    </div>
  );
});
