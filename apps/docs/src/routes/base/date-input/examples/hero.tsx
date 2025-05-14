import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";

import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);
  const selectedDate = useSignal<DateInput.ISODate | null>(null);
  const handleChange$ = $((date: DateInput.ISODate | null) => {
    selectedDate.value = date;
  });

  return (
    <div class="date-input-container">
      <DateInput.Root class="date-input-root-col" onChange$={handleChange$}>
        <DateInput.Label>My date input</DateInput.Label>
        <DateInput.DateEntry>
          <DateInput.Month />
          <DateInput.Separator separator="/" />
          <DateInput.Day />
          <DateInput.Separator separator="/" />
          <DateInput.Year />
        </DateInput.DateEntry>

        <DateInput.HiddenInput name="date" value={selectedDate.value} />
      </DateInput.Root>

      <div>
        <p>
          Selected date: <span class="external-value">{selectedDate.value}</span>
        </p>
      </div>
    </div>
  );
});

// example styles
import styles from "./date-input.css?inline";
