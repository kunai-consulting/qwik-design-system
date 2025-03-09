import {
  type Component,
  type PropsOf,
  Slot,
  component$,
  useContext
} from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import {
  type CollapsibleTrigger,
  CollapsibleTriggerBase
} from "../collapsible/collapsible-trigger";
import { groupContextId } from "./tree-group";
import { TreeItem } from "./tree-item";

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
