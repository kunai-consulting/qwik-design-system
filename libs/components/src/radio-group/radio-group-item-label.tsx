import { type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { Render } from "../render/render";
import { radioGroupItemContextId } from "./radio-group-item";

type PublicLabelProps = PropsOf<"span">;

export const RadioGroupItemLabel = component$((props: PublicLabelProps) => {
  const itemContext = useContext(radioGroupItemContextId);
  const itemLabelId = `${itemContext.itemId}-label`;

  return (
    <Render {...props} id={itemLabelId} data-qds-radio-group-label fallback="span">
      <Slot />
    </Render>
  );
});
