import { component$ } from "@builder.io/qwik";
import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <DateInput.Root>
      <DateInput.Label>Permanently Disabled</DateInput.Label>
      <DateInput.Entry date="2000-12-25" disabled={true}>
        <DateInput.Month />
        <DateInput.Separator separator="/" />
        <DateInput.Day />
        <DateInput.Separator separator="/" />
        <DateInput.Year />
      </DateInput.Entry>
    </DateInput.Root>
  );
});
