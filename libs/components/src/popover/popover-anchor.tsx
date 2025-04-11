import {
  type PropsOf,
  Slot,
  component$,
  useContext,
  useVisibleTask$
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { popoverContextId } from "./popover-root";

export const PopoverAnchorBase = component$((props: PropsOf<"button">) => {
  const context = useContext(popoverContextId);
  const panelId = `${context.localId}-panel`;

  useVisibleTask$(() => {
    console.log("anchor inside", context.anchorRef.value);
  });

  return (
    <Render
      ref={context.anchorRef}
      externalRef={props.ref}
      popovertarget={panelId}
      data-qds-popover-anchor
      fallback="button"
      {...props}
    >
      <Slot />
    </Render>
  );
});

export const PopoverAnchor = withAsChild(PopoverAnchorBase);
