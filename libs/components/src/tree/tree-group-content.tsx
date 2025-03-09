import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
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
