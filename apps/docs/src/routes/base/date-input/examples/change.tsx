import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";

import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);
  const selectedDate = useSignal<DateInput.ISODate | null>();
  const numChanges = useSignal(0);
  const handleChange$ = $((date: DateInput.ISODate | null) => {
    numChanges.value++;
    selectedDate.value = date;
  });

  return (
    <div class="date-input-container">
      <DateInput.Root class="date-input-root-col">
        <DateInput.Label>My date input</DateInput.Label>
        <DateInput.Entry onChange$={handleChange$}>
          <DateInput.Month />
          <DateInput.Separator separator="/" />
          <DateInput.Day />
          <DateInput.Separator separator="/" />
          <DateInput.Year />
        </DateInput.Entry>
      </DateInput.Root>

      <div>
        <p>Selected date: {selectedDate.value}</p>
        <p>Times changed: {numChanges.value}</p>
      </div>
    </div>
  );
});

// example styles
import styles from "./date-input.css?inline";
