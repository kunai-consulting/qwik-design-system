import { component$, PropsOf, Slot } from "@builder.io/qwik";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";

export const ResizableHandleBase = component$<PropsOf<"button">>((props) => {
  return (
    <Render fallback="button" {...props} data-qds-handle>
      <Slot />
    </Render>
  );
});

export const ResizableHandle = withAsChild(ResizableHandleBase);
