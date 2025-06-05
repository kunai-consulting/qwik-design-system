import { component$ } from "@builder.io/qwik";

import { Calendar } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <Calendar.Root mode="inline">
      <Calendar.Content>Inline Calendar</Calendar.Content>
    </Calendar.Root>
  );
});
