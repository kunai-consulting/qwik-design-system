import { component$ } from "@builder.io/qwik";

import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <DateInput.Root class="w-full flex gap-2 max-w-[300px]" format="yyyy-mm-dd">
      <DateInput.Label class="flex items-center">
        Enter your date of birth:
      </DateInput.Label>
      <DateInput.DateEntry />
      <DateInput.HiddenInput name="date-of-birth" />
    </DateInput.Root>
  );
});
