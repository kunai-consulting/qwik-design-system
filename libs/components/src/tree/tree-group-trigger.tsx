import { type Component, type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { CollapsibleTrigger } from "../collapsible/collapsible-trigger";

export const TreeGroupTrigger: Component<PropsOf<typeof CollapsibleTrigger>> = component$(
  ({ ...props }) => {
    return (
      <CollapsibleTrigger {...props}>
        <Slot />
      </CollapsibleTrigger>
    );
  }
);
