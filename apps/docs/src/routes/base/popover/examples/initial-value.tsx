import { component$ } from "@qwik.dev/core";
import { Popover } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <Popover.Root open={true}>
      <Popover.Trigger class="popover-trigger">Open Popover</Popover.Trigger>
      <Popover.Content class="popover-content">Popover Panel</Popover.Content>
    </Popover.Root>
  );
});
