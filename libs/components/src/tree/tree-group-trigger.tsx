import {
  type Component,
  type PropsOf,
  Slot,
  component$,
  useContext
} from "@builder.io/qwik";
import {
  type CollapsibleTrigger,
  CollapsibleTriggerBase
} from "../collapsible/collapsible-trigger";
import { TreeItem } from "./tree-item";
import { withAsChild } from "../as-child/as-child";
import { groupContextId } from "./tree-group";

export const TreeGroupTriggerBase: Component<PropsOf<typeof CollapsibleTrigger>> =
  component$(({ ...props }) => {
    const groupContext = useContext(groupContextId);

    console.log("GROUP CONTEXT: ", groupContext);

    return (
      <TreeItem asChild groupTrigger groupId={groupContext?.id}>
        {/* When using asChild internally, you must always use asChild on the base, which is a component$ comp, not the inlne comp */}
        <CollapsibleTriggerBase {...props}>
          <Slot />
        </CollapsibleTriggerBase>
      </TreeItem>
    );
  });

export const TreeGroupTrigger = withAsChild(TreeGroupTriggerBase);
