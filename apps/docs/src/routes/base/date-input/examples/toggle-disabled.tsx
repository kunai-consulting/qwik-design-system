import { component$, useSignal, useStyles$ } from "@builder.io/qwik";

import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);
  const isDisabled = useSignal(false);

  return (
    <div class="date-input-container">
      <DateInput.Root
        class="date-input-root-col"
        disabled={isDisabled.value}
        date="1998-11-01"
      >
        <DateInput.Label>My date input</DateInput.Label>
        <DateInput.DateEntry>
          <DateInput.Month />
          <DateInput.Separator separator="/" />
          <DateInput.Day />
          <DateInput.Separator separator="/" />
          <DateInput.Year />
        </DateInput.DateEntry>
      </DateInput.Root>

      <div class="date-input-button-container">
        <button
          onClick$={() => (isDisabled.value = !isDisabled.value)}
          type="button"
          class="toggle-disabled-button"
        >
          Toggle disabled
        </button>
      </div>
    </div>
  );
});

// example styles
import styles from "./date-input.css?inline";
