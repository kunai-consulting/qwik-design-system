import { Collapsible } from "@qwik-ui/headless";
import { component$ } from "@qwik.dev/core";

export default component$(() => (
  <Collapsible.Root>
    <Collapsible.Trigger>Button</Collapsible.Trigger>
    <Collapsible.Content>Content</Collapsible.Content>
  </Collapsible.Root>
));
