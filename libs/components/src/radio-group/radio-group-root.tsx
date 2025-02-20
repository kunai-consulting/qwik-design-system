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
  useTask$
} from "@qwik.dev/core";
import { type RadioGroupContext, radioGroupContextId } from "./radio-group-context";
export type PublicRadioGroupRootProps = {
  "bind:value"?: Signal<boolean>;
  /** Event handler for when the radio group selection changes */
  onChange$?: QRL<(checked: string) => void>;
  /** Initial value of the radio group when first rendered */
  defaultValue?: string;
  /** Whether the radio group is disabled */
  disabled?: boolean;
  /** Whether the radio group has a description */
  isDescription?: boolean;
  /** Name attribute for the hidden radio input */
  name?: string;
  /** Whether the radio group is required */
  required?: boolean;
  /** The current value of the radio group */
  value?: string;
} & PropsOf<"div">;
/** Root component that manages the radio group's state and behavior */
export const RadioGroupRoot = component$((props: PublicRadioGroupRootProps) => {
  const {
    "bind:value": givenCheckedSig,
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
  const triggerRef = useSignal<HTMLButtonElement>();

  const context: RadioGroupContext = {
    selectedValueSig,
    selectedIndexSig,
    isDisabledSig,
    localId,
    isDescription,
    required,
    value,
    isErrorSig,
    triggerRef
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
      // Identifier for the root radio group container
      data-qds-radio-group-root
      // Indicates whether the radio group is disabled
      data-disabled={context.isDisabledSig.value ? "" : undefined}
      aria-disabled={context.isDisabledSig.value ? "true" : "false"}
      // Indicates whether the radio group has a selected value
      data-checked={context.selectedValueSig.value === props.value ? "true" : "false"}
    >
      <Slot />
    </div>
  );
});
