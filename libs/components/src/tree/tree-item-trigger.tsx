import {
  type Component,
  type PropsOf,
  Slot,
  component$,
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { CollapsibleTrigger } from "../collapsible/collapsible-trigger";

export const TreeItemTriggerBase: Component<
  PropsOf<typeof CollapsibleTrigger>
> = component$(({ ...props }) => {
  return (
    <CollapsibleTrigger tabIndex={-1} {...props}>
      <Slot />
    </CollapsibleTrigger>
  );
});

export const TreeItemTrigger = withAsChild(TreeItemTriggerBase);
