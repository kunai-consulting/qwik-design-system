import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export const TreeItemBase = component$((props: PropsOf<"div">) => {
  console.log("PROPS: ", props);

  return (
    <Render role="treeitem" fallback="div" {...props}>
      <Slot />
    </Render>
  );
});

export const TreeItem = withAsChild(TreeItemBase, true);
