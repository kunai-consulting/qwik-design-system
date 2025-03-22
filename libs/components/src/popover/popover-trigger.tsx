import { $, component$, type PropsOf, Slot, useContext } from "@builder.io/qwik";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";
import { popoverContextId } from "./popover-root";

export const PopoverTriggerBase = component$((props: PropsOf<"button">) => {
  const context = useContext(popoverContextId);
  const panelId = `${context.localId}-panel`;

  return (
    <Render
      onClick$={[
        $(() => {
          context.isExternalToggleSig.value = false;
        }),
        props.onClick$
      ]}
      ref={context.triggerRef}
      popovertarget={panelId}
      fallback="button"
      {...props}
    >
      <Slot />
    </Render>
  );
});

export const PopoverTrigger = withAsChild(PopoverTriggerBase);
