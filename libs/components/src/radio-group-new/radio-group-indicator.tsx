import {
  type PropsOf,
  Slot,
  component$,
  useComputed$,
  useContext
} from "@builder.io/qwik";
import { radioGroupContextId } from "./radio-group-context";

type PublicIndicatorProps = PropsOf<"span"> & {
  value: string;
};

export const RadioGroupIndicator = component$((props: PublicIndicatorProps) => {
  const context = useContext(radioGroupContextId);
  const { value, ...restProps } = props;

  const isChecked = useComputed$(() => context.selectedValueSig.value === value);

  return (
    <span
      {...restProps}
      data-qds-indicator
      data-state={isChecked.value ? "checked" : undefined}
      data-hidden={!isChecked.value || undefined}
      aria-hidden="true"
    >
      <Slot />
    </span>
  );
});
