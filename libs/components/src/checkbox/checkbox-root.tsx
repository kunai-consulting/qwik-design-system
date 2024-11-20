import {
  component$,
  type PropsOf,
  Slot,
  type Signal,
  useContextProvider,
  useId,
  useTask$,
  useSignal,
  type QRL
} from "@builder.io/qwik";
import { useBoundSignal } from "../../utils/bound-signal";
import { type CheckboxContext, checkboxContextId } from "./checkbox-context";

export type CheckboxRootProps = {
  "bind:checked"?: Signal<boolean>;
  checked?: boolean;
  onChange$?: QRL<(checked: boolean) => Promise<void>>;
} & PropsOf<"div">;

export const CheckboxRoot = component$((props: CheckboxRootProps) => {
  const {
    "bind:checked": givenCheckedSig,
    checked,
    onClick$,
    onChange$,
    ...rest
  } = props;

  const isCheckedSig = useBoundSignal(givenCheckedSig, checked ?? false);
  const isInitialLoadSig = useSignal(true);
  const localId = useId();

  const context: CheckboxContext = {
    isCheckedSig,
    localId
  };

  useContextProvider(checkboxContextId, context);

  useTask$(async ({ track }) => {
    track(() => isCheckedSig.value);

    if (isInitialLoadSig.value) {
      return;
    }

    await onChange$?.(isCheckedSig.value);
  });

  useTask$(() => {
    isInitialLoadSig.value = false;
  });

  return (
    <div
      {...rest}
      data-qds-checkbox-root
      data-checked={context.isCheckedSig.value ? "" : undefined}
    >
      <Slot />
    </div>
  );
});
