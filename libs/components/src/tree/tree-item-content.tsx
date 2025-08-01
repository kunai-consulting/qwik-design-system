import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { CollapsibleContent } from "../collapsible/collapsible-content";

export const TreeItemContentBase = component$(
  (props: PropsOf<typeof CollapsibleContent>) => {
    return (
      <CollapsibleContent {...props}>
        <Slot />
      </CollapsibleContent>
    );
  }
);

export const TreeItemContent = withAsChild(TreeItemContentBase);
