import { type HTMLElementAttrs, Slot, component$, useContext } from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { radioGroupContextId } from "./radio-group-context";

type PublicLabelProps = HTMLElementAttrs<"span">;

export const RadioGroupLabelBase = component$((props: PublicLabelProps) => {
  const context = useContext(radioGroupContextId);
  const labelId = `${context.localId}-label`;

  return (
    <Render {...props} id={labelId} data-qds-radio-group-label fallback="span">
      <Slot />
    </Render>
  );
});

export const RadioGroupLabel = withAsChild(RadioGroupLabelBase);
