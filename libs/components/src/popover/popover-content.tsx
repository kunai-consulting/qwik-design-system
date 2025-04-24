import {
  $,
  type CorrectedToggleEvent,
  type PropsOf,
  Slot,
  component$,
  useContext
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { popoverContextId } from "./popover-root";

export const PopoverContentBase = component$((props: PropsOf<"div">) => {
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
      hidden={context.isHiddenSig.value}
      onToggle$={[handleToggle$, props.onToggle$]}
      popover="auto"
      id={panelId}
      internalRef={context.contentRef}
      fallback="div"
      data-qds-popover-content
      {...props}
    >
      <Slot />
    </Render>
  );
});

export const PopoverContent = withAsChild(PopoverContentBase);
