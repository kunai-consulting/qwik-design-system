import { component$ } from "@builder.io/qwik";

import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <DateInput.Root>
      <DateInput.Label>Enter your date of birth:</DateInput.Label>
      <DateInput.DateEntry>
        <DateInput.Month placeholder="Month" />
        <DateInput.Separator separator="/" />
        <DateInput.Day placeholder="Day" />
        <DateInput.Separator separator="/" />
        <DateInput.Year placeholder="Year" />
      </DateInput.DateEntry>
    </DateInput.Root>
  );
});
