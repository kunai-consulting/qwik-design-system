import { component$ } from "@builder.io/qwik";
import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <DateInput.Root disabled={true} date="2000-12-25">
      <DateInput.Label>Permanently Disabled</DateInput.Label>
      <DateInput.DateEntry>
        <DateInput.Month />
        <DateInput.Separator separator="/" />
        <DateInput.Day />
        <DateInput.Separator separator="/" />
        <DateInput.Year />
      </DateInput.DateEntry>
    </DateInput.Root>
  );
});
