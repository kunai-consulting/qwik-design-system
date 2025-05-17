import { component$, useStyles$ } from "@builder.io/qwik";
import { Checkbox } from "@kunai-consulting/qwik";
import { LuCheck } from "@qwikest/icons/lucide";
import styles from "./checkbox.css?inline";
import { Heyo } from "./Heyo";

export default component$(() => {
  useStyles$(styles);

  return (
    <Checkbox.Root>
      <Checkbox.Trigger class="checkbox-trigger">
        <Checkbox.Indicator class="checkbox-indicator">
          <LuCheck />
        </Checkbox.Indicator>
      </Checkbox.Trigger>
      <Heyo />
    </Checkbox.Root>
  );
});
