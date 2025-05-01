import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export const ToasterItemTitleBase = component$((props: PropsOf<"div">) => {
  return (
    <Render {...props} fallback="div" data-qds-toaster-item-title>
      <Slot />
    </Render>
  );
});

export const ToasterItemTitle = withAsChild(ToasterItemTitleBase);
