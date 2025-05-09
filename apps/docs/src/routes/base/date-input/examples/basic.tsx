import { component$ } from "@builder.io/qwik";

import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <DateInput.Root format="yyyy-mm-dd">
      <DateInput.Label>Enter your date of birth:</DateInput.Label>
      <DateInput.DateEntry />
      <DateInput.HiddenInput name="date-of-birth" />
    </DateInput.Root>
  );
});
