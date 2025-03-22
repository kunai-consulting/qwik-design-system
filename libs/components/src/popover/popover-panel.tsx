import { $, component$, type PropsOf, Slot, useContext } from "@builder.io/qwik";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";
import { popoverContextId } from "./popover-root";

export const PopoverPanelBase = component$((props: PropsOf<"div">) => {
  const context = useContext(popoverContextId);
  const panelId = `${context.localId}-panel`;

  const handleToggle$ = $(() => {
    context.isOpenSig.value = !context.isOpenSig.value;
  });

  return (
    <Render
      popover="auto"
      onToggle$={[handleToggle$, props.onToggle$]}
      id={panelId}
      ref={context.panelRef}
      fallback="div"
      {...props}
    >
      <Slot />
    </Render>
  );
});

export const PopoverPanel = withAsChild(PopoverPanelBase);
