import { type Component, type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { Collapsible } from "@qwik-ui/headless";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export const TreeGroup: Component<PropsOf<typeof Collapsible.Root>> = component$(
  (props) => {
    return (
      <Collapsible.Root {...props}>
        <Slot />
      </Collapsible.Root>
    );
  }
);
