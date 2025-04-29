import { component$ } from "@builder.io/qwik";

import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <DateInput.Root class="w-full flex gap-2 max-w-[300px]" format="dd-mm-yyyy">
      <DateInput.Label class="flex items-center">Day-first date entry:</DateInput.Label>
      <DateInput.DateEntry />
    </DateInput.Root>
  );
});
