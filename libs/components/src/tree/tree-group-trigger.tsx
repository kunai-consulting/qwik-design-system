import { type Component, type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { Collapsible } from "@qwik-ui/headless";

export const TreeGroupTrigger: Component<PropsOf<typeof Collapsible.Trigger>> =
  component$(({ ...props }) => {
    return (
      <Collapsible.Trigger {...props}>
        <Slot />
      </Collapsible.Trigger>
    );
  });
