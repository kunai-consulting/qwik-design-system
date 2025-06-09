import { component$ } from "@builder.io/qwik";
import { Tooltip } from "@kunai-consulting/qwik";

export default component$(() => (
  <Tooltip.Root>
    <Tooltip.Trigger class="bg-qwik-blue-700 p-1">Hover or focus me</Tooltip.Trigger>
    <Tooltip.Content sideOffset={10}>
      <p>This is a tooltip!</p>
      <Tooltip.Arrow />
    </Tooltip.Content>
  </Tooltip.Root>
));
