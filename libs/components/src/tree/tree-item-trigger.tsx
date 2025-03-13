import {
  type Component,
  type PropsOf,
  Slot,
  component$,
  useContext
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { CollapsibleTrigger } from "../collapsible/collapsible-trigger";

export const TreeItemTriggerBase: Component<PropsOf<typeof CollapsibleTrigger>> =
  component$(({ ...props }) => {
    return (
      <CollapsibleTrigger {...props} asChild>
        <div>
          <Slot />
        </div>
      </CollapsibleTrigger>
    );
  });

export const TreeItemTrigger = withAsChild(TreeItemTriggerBase);
