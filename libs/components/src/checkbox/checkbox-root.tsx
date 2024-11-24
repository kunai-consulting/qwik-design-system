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
  JSXNode
} from "@builder.io/qwik";
import { useBoundSignal } from "../../utils/bound-signal";
import { type CheckboxContext, checkboxContextId } from "./checkbox-context";

export type CheckboxRootProps<T extends boolean | "mixed" = boolean> = {
  "bind:checked"?: Signal<boolean | "mixed">;
  checked?: T;
  onChange$?: QRL<(checked: T) => void>;
  disabled?: boolean;
  isDescription?: boolean;
  name?: string;
  required?: boolean;
  value?: string;
} & PropsOf<"div">;

export const CheckboxRoot = component$((props: CheckboxRootProps) => {
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

  const isCheckedSig = useBoundSignal<boolean | "mixed">(
    givenCheckedSig,
    checked ?? false
  );
  const isInitialLoadSig = useSignal(true);
  const isDisabledSig = useComputed$(() => props.disabled);
  const localId = useId();

  const context: CheckboxContext = {
    isCheckedSig,
    isDisabledSig,
    localId,
    isDescription,
    name,
    required,
    value
  };

  useContextProvider(checkboxContextId, context);

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
      data-qds-checkbox-root
      data-disabled={context.isDisabledSig.value ? "" : undefined}
      aria-disabled={context.isDisabledSig.value ? "true" : "false"}
      data-checked={context.isCheckedSig.value ? "" : undefined}
      data-mixed={context.isCheckedSig.value === "mixed" ? "" : undefined}
    >
      <Slot />
    </div>
  );
});
