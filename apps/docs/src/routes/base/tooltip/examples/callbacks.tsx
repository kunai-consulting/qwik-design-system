import { component$, useSignal } from "@builder.io/qwik";
import { Tooltip } from "@kunai-consulting/qwik";

export default component$(() => {
  const isOpen = useSignal(false);

  return (
    <div class="flex gap-4 items-center justify-center">
      <div>
        <Tooltip.Root bind:open={isOpen}>
          <Tooltip.Trigger class="bg-qwik-blue-700 p-1">
            Controlled tooltip - {isOpen.value ? "open" : "closed"}
          </Tooltip.Trigger>
          <Tooltip.Content>This tooltip is controlled by the open state</Tooltip.Content>
        </Tooltip.Root>
      </div>

      <Tooltip.Root
        onOpenChange$={(open) => {
          console.log("Uncontrolled tooltip is now:", open ? "open" : "closed");
        }}
      >
        <Tooltip.Trigger class="bg-qwik-blue-700 p-1">
          Uncontrolled tooltip
        </Tooltip.Trigger>
        <Tooltip.Content>
          This tooltip is uncontrolled but still has callbacks
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  );
});
