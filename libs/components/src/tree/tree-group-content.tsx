import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { Collapsible } from "@qwik-ui/headless";

export const TreeGroupContent = component$(
  (props: PropsOf<typeof Collapsible.Content>) => {
    return (
      <Collapsible.Content {...props}>
        <Slot />
      </Collapsible.Content>
    );
  }
);
