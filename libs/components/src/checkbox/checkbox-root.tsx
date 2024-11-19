import {
  component$,
  type PropsOf,
  Slot,
  type Signal,
  $,
  useContextProvider,
  sync$
} from "@builder.io/qwik";
import { useBoundSignal } from "../../utils/bound-signal";
import { type CheckboxContext, checkboxContextId } from "./checkbox-context";

export type CheckboxRootProps = {
  "bind:checked"?: Signal<boolean>;
  checked?: boolean;
} & PropsOf<"div">;

export const CheckboxRoot = component$((props: CheckboxRootProps) => {
  const { "bind:checked": givenCheckedSig, checked, onClick$, ...rest } = props;

  const isCheckedSig = useBoundSignal(givenCheckedSig, checked ?? false);

  const context: CheckboxContext = {
    isCheckedSig
  };

  useContextProvider(checkboxContextId, context);

  return (
    <div
      {...rest}
      data-qds-checkbox-root
      aria-checked={context.isCheckedSig.value ? "true" : "false"}
    >
      <Slot />
    </div>
  );
});
