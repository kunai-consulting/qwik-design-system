import { component$ } from "@builder.io/qwik";
import { Popover } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <Popover.Root open={true}>
      <Popover.Anchor>Open Popover</Popover.Anchor>
      <Popover.Content>Popover Panel</Popover.Content>
    </Popover.Root>
  );
});
