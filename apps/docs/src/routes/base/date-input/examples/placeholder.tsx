import { component$ } from "@builder.io/qwik";

import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <DateInput.Root>
      <DateInput.Label>Enter your date of birth:</DateInput.Label>
      <DateInput.Entry>
        <DateInput.Month placeholder="Month" />
        <span>/</span>
        <DateInput.Day placeholder="Day" />
        <span>/</span>
        <DateInput.Year placeholder="Year" />
      </DateInput.Entry>
    </DateInput.Root>
  );
});
