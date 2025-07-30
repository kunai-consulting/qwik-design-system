import { type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { Render } from "../render/render";
import { radioGroupContextId } from "./radio-group-context";

type PublicLabelProps = PropsOf<"span">;

export const RadioGroupLabel = component$((props: PublicLabelProps) => {
  const context = useContext(radioGroupContextId);
  const labelId = `${context.localId}-label`;

  return (
    <Render {...props} id={labelId} data-qds-radio-group-label fallback="span">
      <Slot />
    </Render>
  );
});
