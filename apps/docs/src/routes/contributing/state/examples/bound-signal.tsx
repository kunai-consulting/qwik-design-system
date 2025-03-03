import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Checkbox } from "@kunai-consulting/qwik";
import { LuCheck } from "@qwikest/icons/lucide";

export default component$(() => {
  useStyles$(styles);

  const isChecked = useSignal(false);

  return (
    <>
      <Checkbox.Root bind:checked={isChecked}>
        <Checkbox.Trigger class="checkbox-trigger">
          <Checkbox.Indicator class="checkbox-indicator">
            <LuCheck />
          </Checkbox.Indicator>
        </Checkbox.Trigger>
      </Checkbox.Root>

      <p>Checked: {isChecked.value ? "true" : "false"}</p>

      <button
        type="button"
        onClick$={() => {
          isChecked.value = true;
        }}
      >
        I check the checkbox above
      </button>
    </>
  );
});

// example styles
import styles from "./checkbox.css?inline";
