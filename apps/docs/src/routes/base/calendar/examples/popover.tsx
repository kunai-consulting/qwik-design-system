import { component$ } from "@builder.io/qwik";

import { Calendar } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <Calendar.Root mode="popover">
      <Calendar.Trigger>Trigger</Calendar.Trigger>
      <Calendar.Content>Popover Calendar</Calendar.Content>
    </Calendar.Root>
  );
});
