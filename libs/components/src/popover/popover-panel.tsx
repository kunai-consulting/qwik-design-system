import { component$, PropsOf, Slot, useContext } from "@builder.io/qwik";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";
import { popoverContextId } from "./popover-root";

export const PopoverPanelBase = component$((props: PropsOf<'div'>) => {
  const context = useContext(popoverContextId);

  return (
    <Render ref={context.panelRef} fallback="div" {...props}>
      <Slot />
    </Render>
  )
})

export const PopoverPanel = withAsChild(PopoverPanelBase);