import { $, component$, useSignal, useStyles$ } from "@qwik.dev/core";
import { Checkbox } from "@kunai-consulting/qwik";
import { LuCheck } from "@qwikest/icons/lucide";

export default component$(() => {
  useStyles$(styles);

  const isChecked = useSignal(false);

  const toggleChecked$ = $((checked: boolean) => {
    isChecked.value = checked;
  });

  return (
    <>
      <Checkbox.Root checked={isChecked.value} onChange$={toggleChecked$}>
        <Checkbox.Trigger class="checkbox-trigger">
          <Checkbox.Indicator class="checkbox-indicator">
            <LuCheck />
          </Checkbox.Indicator>
        </Checkbox.Trigger>
      </Checkbox.Root>

      <p>Checked: {isChecked.value ? "true" : "false"}</p>
    </>
  );
});

// example styles
import styles from "./checkbox.css?inline";
