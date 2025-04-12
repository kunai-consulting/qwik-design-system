import { component$, useSignal } from "@builder.io/qwik";
import { Popover } from "@kunai-consulting/qwik";

export default component$(() => {
  const isOpen = useSignal(false);

  return (
    <>
      <Popover.Root
        open={isOpen.value}
        onChange$={(open: boolean) => {
          console.log("hey", open);
          isOpen.value = open;
        }}
      >
        <Popover.Anchor>Open Popover</Popover.Anchor>
        <Popover.Content>Popover Panel</Popover.Content>
      </Popover.Root>
      <p>Is open: {isOpen.value ? "true" : "false"}</p>
    </>
  );
});
