import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { radioGroupContextId } from "./radio-group-context";

type PublicLabelProps = PropsOf<"span">;

export const RadioGroupLabelBase = component$((props: PublicLabelProps) => {
  const context = useContext(radioGroupContextId);
  const labelId = `${context.localId}-label`;

  return (
    <Render {...props} id={labelId} data-qds-radio-group-label fallback="span">
      <Slot />
    </Render>
  );
});

export const RadioGroupItemLabel = withAsChild(RadioGroupLabelBase);
