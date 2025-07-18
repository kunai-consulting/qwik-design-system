import { $, component$, useSignal } from "@builder.io/qwik";
import { useStyles$ } from "@builder.io/qwik";
import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);
  const selectedDate = useSignal<DateInput.ISODate | null>("2021-01-01");
  const handleChange$ = $((date: DateInput.ISODate | null) => {
    selectedDate.value = date;
  });

  return (
    <div class="date-input-container">
      <DateInput.Root class="date-input-root-col">
        <DateInput.Label>Choose your date:</DateInput.Label>
        <DateInput.Field
          date={selectedDate.value}
          onChange$={handleChange$}
          separator="/"
        >
          <DateInput.Month showLeadingZero />
          <DateInput.Day showLeadingZero />
          <DateInput.Year />
        </DateInput.Field>
      </DateInput.Root>

      <p>
        Selected date: <span class="external-value">{selectedDate.value}</span>
      </p>

      <div class="date-input-button-container">
        <button
          onClick$={() => {
            const date = new Date().toISOString().split("T")[0] as DateInput.ISODate;
            selectedDate.value = date;
          }}
          type="button"
          class="set-value-button"
        >
          Set to today
        </button>
        <button
          onClick$={() => (selectedDate.value = null)}
          type="button"
          class="set-null-button"
        >
          Clear
        </button>
      </div>
    </div>
  );
});

// example styles
import styles from "./date-input.css?inline";
