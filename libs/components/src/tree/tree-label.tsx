import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export const TreeLabelBase = component$((props: PropsOf<"span">) => {
  return (
    <Render fallback="span" {...props}>
      <Slot />
    </Render>
  );
});

export const TreeLabel = withAsChild(TreeLabelBase);
