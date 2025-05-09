import { component$, useStyles$ } from "@builder.io/qwik";

import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);
  return (
    <DateInput.Root class="date-input-root-row" format="dd-mm-yyyy">
      <DateInput.Label>Day-first date entry:</DateInput.Label>
      <DateInput.DateEntry />
    </DateInput.Root>
  );
});

// example styles
import styles from "./date-input.css?inline";
