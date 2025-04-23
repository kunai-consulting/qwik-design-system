import { component$, useSignal } from "@builder.io/qwik";
import { Popover } from "@kunai-consulting/qwik";

export default component$(() => {
  const isOpen = useSignal(false);

  return (
    <>
      <p>Is open: {isOpen.value ? "true" : "false"}</p>
      <button type="button" onClick$={() => (isOpen.value = !isOpen.value)}>
        Toggle popover
      </button>
      <Popover.Root bind:open={isOpen}>
        <Popover.Anchor class="popover-anchor">Open Popover</Popover.Anchor>
        <Popover.Content class="popover-content">Popover Panel</Popover.Content>
      </Popover.Root>
    </>
  );
});
