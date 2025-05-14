import { component$, useStyles$ } from "@builder.io/qwik";

import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);
  return (
    <DateInput.Root class="date-input-root-row">
      <DateInput.Label>European-style date entry:</DateInput.Label>
      <DateInput.DateEntry>
        <DateInput.Day placeholder="DD" showLeadingZero={true} />
        <DateInput.Separator separator="." />
        <DateInput.Month placeholder="MM" showLeadingZero={true} />
        <DateInput.Separator separator="." />
        <DateInput.Year placeholder="YYYY" />
      </DateInput.DateEntry>
    </DateInput.Root>
  );
});

// example styles
import styles from "./date-input.css?inline";
