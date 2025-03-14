import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { radioGroupContextId } from "./radio-group-context";

type PublicLabelProps = PropsOf<"label">;

export const RadioGroupLabel = component$((props: PublicLabelProps) => {
  const context = useContext(radioGroupContextId);
  const labelId = `${context.localId}-label`;

  return (
    <label {...props} id={labelId} data-qds-radio-group-label>
      <Slot />
    </label>
  );
});
