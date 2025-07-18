import { component$, useSignal, useStyles$ } from "@builder.io/qwik";

import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);
  const isDisabled = useSignal(false);

  return (
    <div class="date-input-container">
      <DateInput.Root class="date-input-root-col">
        <DateInput.Label>My date input</DateInput.Label>
        <DateInput.Field disabled={isDisabled.value} date="1998-11-01" separator="/">
          <DateInput.Month />
          <DateInput.Day />
          <DateInput.Year />
        </DateInput.Field>
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
