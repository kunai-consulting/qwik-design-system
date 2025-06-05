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
      <DateInput.Root class="date-input-root-col">
        <DateInput.Label>My date input</DateInput.Label>
        <DateInput.Entry onChange$={handleChange$} separator="/">
          <DateInput.Month />
          <DateInput.Day />
          <DateInput.Year />
          <DateInput.HiddenInput name="date" value={selectedDate.value} />
        </DateInput.Entry>
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
