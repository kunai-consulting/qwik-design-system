import { Checkbox } from "@kunai-consulting/qwik";
import { component$, useStyles$ } from "@qwik.dev/core";
import { LuCheck } from "@qwikest/icons/lucide";

export default component$(() => {
  useStyles$(styles);

  return (
    <Checkbox.Root class="checkbox-root">
      <Checkbox.Trigger class="checkbox-trigger">
        <Checkbox.Indicator class="checkbox-indicator">
          <LuCheck />
        </Checkbox.Indicator>
      </Checkbox.Trigger>
      <Checkbox.Label>Checkbox Label</Checkbox.Label>
    </Checkbox.Root>
  );
});

// example styles
import styles from "./checkbox.css?inline";
