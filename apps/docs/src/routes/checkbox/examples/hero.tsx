import { component$, useStyles$ } from "@builder.io/qwik";
import { Checkbox } from "@kunai-consulting/qwik-components";

export default component$(() => {
  useStyles$(styles);

  return (
    <Checkbox.Root class="checkbox-root">
      <Checkbox.Indicator>✅</Checkbox.Indicator>
    </Checkbox.Root>
  );
});

// internal
import styles from "./checkbox.css?inline";
