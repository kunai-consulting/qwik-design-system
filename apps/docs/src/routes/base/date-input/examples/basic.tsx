import { component$ } from "@qwik.dev/core";

import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <DateInput.Root>
      <DateInput.Label>Enter your date of birth:</DateInput.Label>
      <DateInput.Field>
        <DateInput.Year />
        <span>-</span>
        <DateInput.Month showLeadingZero={true} />
        <span>-</span>
        <DateInput.Day showLeadingZero={true} />
        <DateInput.HiddenInput name="date-of-birth" />
      </DateInput.Field>
    </DateInput.Root>
  );
});
