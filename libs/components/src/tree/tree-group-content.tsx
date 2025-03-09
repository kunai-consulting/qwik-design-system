import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { CollapsibleContent } from "../collapsible/collapsible-content";

export const TreeGroupContent = component$(
  (props: PropsOf<typeof CollapsibleContent>) => {
    return (
      <CollapsibleContent {...props}>
        <Slot />
      </CollapsibleContent>
    );
  }
);
