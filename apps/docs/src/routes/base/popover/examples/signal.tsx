import { Popover } from "@kunai-consulting/qwik";
import { component$, useSignal } from "@qwik.dev/core";

export default component$(() => {
  const isOpen = useSignal(false);

  return (
    <>
      <p>Is open: {isOpen.value ? "true" : "false"}</p>
      <button type="button" onClick$={() => (isOpen.value = !isOpen.value)}>
        Toggle popover
      </button>
      <Popover.Root bind:open={isOpen}>
        <Popover.Trigger class="popover-trigger">Open Popover</Popover.Trigger>
        <Popover.Content class="popover-content">Popover Panel</Popover.Content>
      </Popover.Root>
    </>
  );
});
