import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { popoverContextId } from "./popover-root";

export const PopoverTriggerBase = component$((props: PropsOf<"button">) => {
  const context = useContext(popoverContextId);
  const panelId = `${context.localId}-panel`;

  return (
    <Render
      internalRef={context.triggerRef}
      popovertarget={panelId}
      data-qds-popover-trigger
      fallback="button"
      {...props}
    >
      <Slot />
    </Render>
  );
});

export const PopoverTrigger = withAsChild(PopoverTriggerBase);
