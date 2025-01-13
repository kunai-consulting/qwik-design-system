import {
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
} from "@builder.io/qwik";
import { useBoundSignal } from "../../utils/bound-signal";
import { type RadioGroupContext, radioGroupContextId } from "./radio-group-context";

export type RadioGroupRootProps<T extends boolean> = {
  "bind:checked"?: Signal<boolean>;
  checked?: T;
  onChange$?: QRL<(checked: T) => void>;
  disabled?: boolean;
  isDescription?: boolean;
  name?: string;
  required?: boolean;
  value?: string;
} & PropsOf<"div">;

export const RadioGroupRoot = component$((props: RadioGroupRootProps<boolean>) => {
  const {
    "bind:checked": givenCheckedSig,
    checked,
    onClick$,
    onChange$,
    isDescription,
    name,
    required,
    value,
    ...rest
  } = props;

  const isCheckedSig = useBoundSignal<boolean>(givenCheckedSig, checked ?? false);
  const isInitialLoadSig = useSignal(true);
  const isDisabledSig = useComputed$(() => props.disabled);
  const isErrorSig = useSignal(false);
  const localId = useId();
  const triggerRef = useSignal<HTMLButtonElement>();

  const context: RadioGroupContext = {
    isCheckedSig,
    isDisabledSig,
    localId,
    isDescription,
    name,
    required,
    value,
    isErrorSig,
    triggerRef
  };

  useContextProvider(radioGroupContextId, context);

  useTask$(async function handleChange({ track }) {
    track(() => isCheckedSig.value);

    if (isInitialLoadSig.value) {
      return;
    }

    await onChange$?.(isCheckedSig.value as boolean);
  });

  useTask$(() => {
    isInitialLoadSig.value = false;
  });

  return (
    <div
      {...rest}
      data-qds-radio-group-root
      data-disabled={context.isDisabledSig.value ? "" : undefined}
      aria-disabled={context.isDisabledSig.value ? "true" : "false"}
      data-checked={context.isCheckedSig.value ? "" : undefined}
    >
      <Slot />
    </div>
  );
});
