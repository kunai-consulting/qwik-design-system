import {
  type Component,
  type PropsOf,
  Slot,
  component$,
  useContext
} from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { CollapsibleTrigger } from "../collapsible/collapsible-trigger";
import { itemContextId } from "./tree-item";

export const TreeItemTriggerBase: Component<PropsOf<typeof CollapsibleTrigger>> =
  component$(({ ...props }) => {
    const itemContext = useContext(itemContextId);

    return (
      <CollapsibleTrigger tabIndex={-1} {...props} aria-labelledby={itemContext?.id}>
        <Slot />
      </CollapsibleTrigger>
    );
  });

export const TreeItemTrigger = withAsChild(TreeItemTriggerBase);
