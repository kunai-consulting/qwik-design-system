import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { radioGroupContextId } from "./radio-group-context";
import { radioGroupItemContextId } from "./radio-group-item";

type PublicLabelProps = PropsOf<"span">;

const ItemLabelBase = component$((props: PublicLabelProps) => {
  const itemContext = useContext(radioGroupItemContextId);
  const itemLabelId = `${itemContext.itemId}-label`;

  return (
    <Render {...props} id={itemLabelId} data-qds-radio-group-label fallback="span">
      <Slot />
    </Render>
  );
});

export const RadioGroupItemLabel = withAsChild(ItemLabelBase);
