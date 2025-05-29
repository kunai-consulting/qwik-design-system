import { component$ } from "@builder.io/qwik";

import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <DateInput.Root>
      <DateInput.Label>Enter your date of birth:</DateInput.Label>
      <DateInput.Entry>
        <DateInput.Year />
        <DateInput.Separator separator="-" />
        <DateInput.Month showLeadingZero={true} />
        <DateInput.Separator separator="-" />
        <DateInput.Day showLeadingZero={true} />
        <DateInput.HiddenInput name="date-of-birth" />
      </DateInput.Entry>
    </DateInput.Root>
  );
});
