import { type Component, type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { CollapsibleTrigger } from "../collapsible/collapsible-trigger";
import { TreeItem } from "./tree-item";

export const TreeGroupTrigger: Component<PropsOf<typeof CollapsibleTrigger>> = component$(
  ({ ...props }) => {
    return (
      <TreeItem asChild>
        <CollapsibleTrigger {...props}>
          <Slot />
        </CollapsibleTrigger>
      </TreeItem>
    );
  }
);
