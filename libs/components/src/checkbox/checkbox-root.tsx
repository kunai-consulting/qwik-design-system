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
  useComputed$
} from "@builder.io/qwik";
import { useBoundSignal } from "../../utils/bound-signal";
import { type CheckboxContext, checkboxContextId } from "./checkbox-context";

export type CheckboxRootProps<T extends boolean | "mixed" = boolean> = {
  "bind:checked"?: Signal<boolean | "mixed">;
  checked?: T;
  onChange$?: QRL<(checked: T) => void>;
  disabled?: boolean;
} & PropsOf<"div">;

export const CheckboxRoot = component$((props: CheckboxRootProps) => {
  const {
    "bind:checked": givenCheckedSig,
    checked,
    onClick$,
    onChange$,
    ...rest
  } = props;

  const isCheckedSig = useBoundSignal<boolean | "mixed">(givenCheckedSig, checked);
  const isInitialLoadSig = useSignal(true);
  const isDisabledSig = useComputed$(() => props.disabled);
  const isMixedSig = useComputed$(() => isCheckedSig.value === "mixed");
  const localId = useId();

  const context: CheckboxContext = {
    isCheckedSig,
    isDisabledSig,
    isMixedSig,
    localId
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
      data-mixed={context.isMixedSig.value ? "" : undefined}
    >
      <Slot />
    </div>
  );
});
