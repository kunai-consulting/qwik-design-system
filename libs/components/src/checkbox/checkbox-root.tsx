import {
  component$,
  type PropsOf,
  Slot,
  type Signal,
  $,
  useContextProvider,
  sync$,
  useId
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
  const localId = useId();

  const context: CheckboxContext = {
    isCheckedSig,
    localId
  };

  useContextProvider(checkboxContextId, context);

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
