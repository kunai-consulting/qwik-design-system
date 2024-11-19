import { component$, useStyles$ } from "@builder.io/qwik";
import { Checkbox } from "@kunai-consulting/qwik-components";

export default component$(() => {
  useStyles$(styles);

  return (
    <Checkbox.Root>
      <Checkbox.Trigger class="checkbox-trigger">
        <Checkbox.Indicator>✅</Checkbox.Indicator>
      </Checkbox.Trigger>
    </Checkbox.Root>
  );
});

// internal
import styles from "./checkbox.css?inline";
