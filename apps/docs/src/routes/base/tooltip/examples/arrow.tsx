import { component$ } from "@builder.io/qwik";
import { Tooltip } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <div class="flex flex-col gap-8">
      <Tooltip.Root>
        <Tooltip.Trigger class="bg-qwik-blue-700 p-1">Default Arrow</Tooltip.Trigger>
        <Tooltip.Content sideOffset={10} class="w-40">
          <p>Using the default arrow component</p>
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  );
});
