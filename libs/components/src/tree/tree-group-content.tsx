import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { CollapsibleContent } from "../collapsible/collapsible-content";
import { withAsChild } from "../as-child/as-child";

export const TreeGroupContentBase = component$(
  (props: PropsOf<typeof CollapsibleContent>) => {
    return (
      <CollapsibleContent {...props}>
        <Slot />
      </CollapsibleContent>
    );
  }
);

export const TreeGroupContent = withAsChild(TreeGroupContentBase, (props) => {
  globalThis.treeItemCount = 0;

  return props;
});
