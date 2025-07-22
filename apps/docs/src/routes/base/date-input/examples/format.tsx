import { component$, useStyles$ } from "@qwik.dev/core";

import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);
  return (
    <DateInput.Root class="date-input-root-row">
      <DateInput.Label>European-style date entry:</DateInput.Label>
      <DateInput.Field separator=".">
        <DateInput.Day placeholder="DD" showLeadingZero={true} />
        <DateInput.Month placeholder="MM" showLeadingZero={true} />
        <DateInput.Year placeholder="YYYY" />
      </DateInput.Field>
    </DateInput.Root>
  );
});

// example styles
import styles from "./date-input.css?inline";
