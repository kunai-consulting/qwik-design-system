import { type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { Render } from "../render/render";
import { popoverContextId } from "./popover-root";

export const PopoverTrigger = component$((props: PropsOf<"button">) => {
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
