import { component$, PropsOf, Slot, useContext } from "@builder.io/qwik";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";
import { popoverContextId } from "./popover-root";

export const PopoverTriggerBase = component$((props: PropsOf<'button'>) => {
  const context = useContext(popoverContextId);

  return (
    <Render ref={context.triggerRef} fallback="button" {...props}>
      <Slot />
    </Render>
  )
})

export const PopoverTrigger = withAsChild(PopoverTriggerBase);