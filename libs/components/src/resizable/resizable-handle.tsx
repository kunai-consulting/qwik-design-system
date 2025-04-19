import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export const ResizableHandleBase = component$<PropsOf<"button">>((props) => {
  return (
    <Render fallback="button" {...props} data-qds-resizable-handle>
      <Slot />
    </Render>
  );
});

export const ResizableHandle = withAsChild(ResizableHandleBase);
