import {
  JSXNode,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  component$,
  useComputed$,
  useContextProvider,
  useId,
  useSignal,
  useTask$,
} from '@builder.io/qwik';
import {
  type RadioGroupContext,
  radioGroupContextId,
} from './radio-group-context';
import { findComponent, processChildren } from '../../utils/inline-component';
import { RadioGroupItem } from './radio-group-item';

export type RadioGroupRootProps = {
  'bind:value'?: Signal<boolean>;
  onChange$?: QRL<(checked: string) => void>;
  defaultValue?: string;
  disabled?: boolean;
  isDescription?: boolean;
  name?: string;
  required?: boolean;
  value?: string;
} & PropsOf<"div">;

export const RadioGroupRoot = ({ children, ...props }: RadioGroupRootProps) => {
  let currItemIndex = 0;

  findComponent(RadioGroupItem, (itemProps) => {
    itemProps._index = currItemIndex;
    currItemIndex++;
  });

  processChildren(children);

  return (
    <RadioGroupBase {...props}>
      {children}
    </RadioGroupBase>
  );
};

export const RadioGroupBase = component$((props: RadioGroupRootProps) => {
  const {
    'bind:value': givenCheckedSig,
    onClick$,
    onChange$,
    isDescription,
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

  const context: RadioGroupContext = {
    selectedValueSig,
    selectedIndexSig,
    isDisabledSig,
    localId,
    isDescription,
    required,
    value,
    isErrorSig,
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
