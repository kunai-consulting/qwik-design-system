import { type Component, type PropsOf, Slot, component$ } from "@builder.io/qwik";
import {
  type CollapsibleTrigger,
  CollapsibleTriggerBase
} from "../collapsible/collapsible-trigger";
import { TreeItem } from "./tree-item";
import { withAsChild } from "../as-child/as-child";

export const TreeGroupTriggerBase: Component<PropsOf<typeof CollapsibleTrigger>> =
  component$(({ ...props }) => {
    return (
      <TreeItem asChild>
        {/* When using asChild internally, you must always use asChild on the base, which is a component$ comp, not the inlne comp */}
        <CollapsibleTriggerBase {...props}>
          <Slot />
        </CollapsibleTriggerBase>
      </TreeItem>
    );
  });

export const TreeGroupTrigger = withAsChild(TreeGroupTriggerBase);
