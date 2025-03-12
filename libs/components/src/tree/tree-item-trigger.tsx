import {
  type Component,
  type PropsOf,
  Slot,
  component$,
  useContext
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import {
  type CollapsibleTrigger,
  CollapsibleTriggerBase
} from "../collapsible/collapsible-trigger";

export const TreeItemTriggerBase: Component<PropsOf<typeof CollapsibleTrigger>> =
  component$(({ ...props }) => {
    return (
      <CollapsibleTriggerBase {...props}>
        <Slot />
      </CollapsibleTriggerBase>
    );
  });

export const TreeItemTrigger = withAsChild(TreeItemTriggerBase);
