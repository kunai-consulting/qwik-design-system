import { type HTMLElementAttrs, Slot, component$, useContext } from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { radioGroupItemContextId } from "./radio-group-item";

type PublicIndicatorProps = HTMLElementAttrs<"span">;

const ItemIndicatorBase = component$((props: PublicIndicatorProps) => {
  const itemContext = useContext(radioGroupItemContextId);

  return (
    <Render
      {...props}
      fallback="span"
      data-qds-indicator
      data-checked={itemContext.isSelectedSig.value}
      data-hidden={!itemContext.isSelectedSig.value}
      aria-hidden="true"
    >
      <Slot />
    </Render>
  );
});

export const RadioGroupItemIndicator = withAsChild(ItemIndicatorBase);
