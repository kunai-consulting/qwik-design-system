import {
  $,
  component$,
  type CorrectedToggleEvent,
  type PropsOf,
  Slot,
  useContext
} from "@builder.io/qwik";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";
import { popoverContextId } from "./popover-root";

export const PopoverPanelBase = component$((props: PropsOf<"div">) => {
  const context = useContext(popoverContextId);
  const panelId = `${context.localId}-panel`;

  const handleToggle$ = $((e: CorrectedToggleEvent) => {
    context.isOpenSig.value = e.newState === "open";

    if (context.canExternallyChangeSig.value === false) {
      context.canExternallyChangeSig.value = true;
    }
  });

  return (
    <Render
      onToggle$={[handleToggle$, props.onToggle$]}
      popover="auto"
      id={panelId}
      ref={context.panelRef}
      data-qds-popover-panel
      fallback="div"
      {...props}
    >
      <Slot />
    </Render>
  );
});

export const PopoverPanel = withAsChild(PopoverPanelBase);
