import { $, component$, useSignal } from "@builder.io/qwik";
import { Popover } from "@kunai-consulting/qwik";

export default component$(() => {
  const isOpen = useSignal(false);

  const handleChange$ = $((open: boolean) => {
    console.log("hey", open);
    isOpen.value = open;
  });

  return (
    <>
      <Popover.Root open={isOpen.value} onChange$={handleChange$}>
        <Popover.Trigger>Open Popover</Popover.Trigger>
        <Popover.Panel>Popover Panel</Popover.Panel>
      </Popover.Root>
      <p>Is open: {isOpen.value ? "true" : "false"}</p>
      <button type="button" onClick$={() => (isOpen.value = !isOpen.value)}>
        Toggle popover
      </button>
    </>
  );
});
