import { component$ } from "@qwik.dev/core";
import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <DateInput.Root>
      <DateInput.Label>Permanently Disabled</DateInput.Label>
      <DateInput.Field date="2000-12-25" disabled={true} separator="/">
        <DateInput.Month />
        <DateInput.Day />
        <DateInput.Year />
      </DateInput.Field>
    </DateInput.Root>
  );
});
