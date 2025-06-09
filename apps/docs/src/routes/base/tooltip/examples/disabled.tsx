import { component$ } from "@builder.io/qwik";
import { Tooltip } from "@kunai-consulting/qwik";

export default component$(() => (
  <Tooltip.Root disabled>
    <Tooltip.Trigger class="bg-qwik-blue-700 p-1">Hover me (disabled)</Tooltip.Trigger>
    <Tooltip.Content>This tooltip is disabled</Tooltip.Content>
  </Tooltip.Root>
));
