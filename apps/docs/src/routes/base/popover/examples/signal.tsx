import { component$, useSignal } from "@builder.io/qwik";
import { Popover } from "@kunai-consulting/qwik";

export default component$(() => {
  const isOpen = useSignal(false);

  return (
    <>
      <Popover.Root bind:open={isOpen}>
        <Popover.Trigger>Open Popover</Popover.Trigger>
        <Popover.Panel>Popover Panel</Popover.Panel>
      </Popover.Root>
      <p>Is open: {isOpen.value ? "true" : "false"}</p>
    </>
  );
});
