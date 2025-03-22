import {
  type PropsOf,
  Slot,
  component$,
  useComputed$,
  useContext
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { radioGroupContextId } from "./radio-group-context";

type PublicIndicatorProps = PropsOf<"span">;

export const RadioGroupIndicatorBase = component$((props: PublicIndicatorProps) => {
  const context = useContext(radioGroupContextId);
  const { ...restProps } = props;

  const isChecked = useComputed$(
    () => context.selectedValueSig.value === context.itemValue
  );

  return (
    <Render
      fallback="span"
      {...restProps}
      data-qds-indicator
      data-checked={isChecked.value || undefined}
      data-hidden={!isChecked.value || undefined}
      aria-hidden="true"
    >
      <Slot />
    </Render>
  );
});

export const RadioGroupIndicator = withAsChild(RadioGroupIndicatorBase);
