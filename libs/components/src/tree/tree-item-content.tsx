import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { CollapsibleContentBase } from "../collapsible/collapsible-content";

export const TreeItemContentBase = component$(
  (props: PropsOf<typeof CollapsibleContentBase>) => {
    return (
      <CollapsibleContentBase {...props}>
        <Slot />
      </CollapsibleContentBase>
    );
  }
);

export const TreeItemContent = withAsChild(TreeItemContentBase);
