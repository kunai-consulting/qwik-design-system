import { component$, useSignal } from "@qwik.dev/core";
import { Popover } from "@kunai-consulting/qwik";

export default component$(() => {
  const isOpen = useSignal(false);

  return (
    <>
      <p>Is open: {isOpen.value ? "true" : "false"}</p>
      <Popover.Root
        open={isOpen.value}
        onChange$={(open: boolean) => {
          console.log("hey", open);
          isOpen.value = open;
        }}
      >
        <Popover.Trigger class="popover-trigger">Open Popover</Popover.Trigger>
        <Popover.Content class="popover-content">Popover Panel</Popover.Content>
      </Popover.Root>
    </>
  );
});
