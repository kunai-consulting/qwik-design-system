import { Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export const ToasterItemTitleBase = component$(() => {
  return (
    <Render data-qds-toaster-item-title fallback="div">
      <Slot />
    </Render>
  );
});

export const ToasterItemTitle = withAsChild(ToasterItemTitleBase);
