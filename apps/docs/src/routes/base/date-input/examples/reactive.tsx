import { component$, useSignal } from "@builder.io/qwik";
import { useStyles$ } from "@builder.io/qwik";
import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);
  const boundDate = useSignal<DateInput.ISODate | null>("1999-12-31");

  return (
    <div class="date-input-container">
      <DateInput.Root class="date-input-root-col" bind:date={boundDate}>
        <DateInput.Label>Party like it's:</DateInput.Label>
        <DateInput.DateEntry />
      </DateInput.Root>
      <p>
        Bound date: <span class="external-value">{boundDate.value}</span>
      </p>
      <div class="date-input-button-container">
        <button
          onClick$={() => (boundDate.value = "2099-12-31")}
          type="button"
          class="set-value-button"
        >
          Set to 2099-12-31
        </button>
        <button
          onClick$={() => (boundDate.value = null)}
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
