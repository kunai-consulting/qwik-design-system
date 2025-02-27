import { component$, type PropsOf, Slot, type Component } from "@builder.io/qwik";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";
import { Collapsible } from "@qwik-ui/headless";

export const TreeGroup: Component<PropsOf<typeof Collapsible.Root>> = component$(
  (props) => {
    return (
      <Collapsible.Root {...props}>
        <Slot />
      </Collapsible.Root>
    );
  }
);
