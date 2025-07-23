import { type HTMLElementAttrs, Slot, component$, useContext } from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { radioGroupItemContextId } from "./radio-group-item";

type PublicLabelProps = HTMLElementAttrs<"span">;

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
