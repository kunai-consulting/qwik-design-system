import { component$ } from "@builder.io/qwik";
import { Popover } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <Popover.Root open={true}>
      <Popover.Trigger>Open Popover</Popover.Trigger>
      <Popover.Panel>Popover Panel</Popover.Panel>
    </Popover.Root>
  );
});
