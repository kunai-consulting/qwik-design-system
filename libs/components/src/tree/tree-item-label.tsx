import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export const TreeItemLabelBase = component$((props: PropsOf<"span">) => {
  return (
    <Render fallback="span" tabIndex={-1} {...props}>
      <Slot />
    </Render>
  );
});

export const TreeItemLabel = withAsChild(TreeItemLabelBase);
