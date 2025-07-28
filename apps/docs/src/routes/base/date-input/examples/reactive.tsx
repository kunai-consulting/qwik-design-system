import { component$, useSignal } from "@qwik.dev/core";
import { useStyles$ } from "@qwik.dev/core";
import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);
  const selectedDate = useSignal<DateInput.ISODate | null>("1999-12-31");

  return (
    <div class="date-input-container">
      <DateInput.Root class="date-input-root-col">
        <DateInput.Label>Party like it's:</DateInput.Label>
        <DateInput.Field bind:date={selectedDate}>
          <DateInput.Month />
          <span>/</span>
          <DateInput.Day />
          <span>/</span>
          <DateInput.Year />
        </DateInput.Field>
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
