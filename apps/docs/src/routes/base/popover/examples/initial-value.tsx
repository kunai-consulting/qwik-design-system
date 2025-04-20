import { component$ } from "@builder.io/qwik";
import { Popover } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <Popover.Root open={true}>
      <Popover.Anchor class="popover-anchor">Open Popover</Popover.Anchor>
      <Popover.Content class="popover-content">Popover Panel</Popover.Content>
    </Popover.Root>
  );
});
