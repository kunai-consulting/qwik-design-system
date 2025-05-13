import { component$, useSignal } from "@builder.io/qwik";
import { useStyles$ } from "@builder.io/qwik";
import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);
  const selectedDate = useSignal<DateInput.ISODate | null>("1999-12-31");

  return (
    <div class="date-input-container">
      <DateInput.Root class="date-input-root-col" bind:date={selectedDate}>
        <DateInput.Label>Party like it's:</DateInput.Label>
        <DateInput.DateEntry>
          <DateInput.Month />
          <DateInput.Separator separator="/" />
          <DateInput.Day />
          <DateInput.Separator separator="/" />
          <DateInput.Year />
        </DateInput.DateEntry>
      </DateInput.Root>
      <p>
        Bound date: <span class="external-value">{selectedDate.value}</span>
      </p>
      <div class="date-input-button-container">
        <button
          onClick$={() => (selectedDate.value = "2099-12-31")}
          type="button"
          class="set-value-button"
        >
          Set to 2099-12-31
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
