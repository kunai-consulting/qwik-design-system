import { Checkbox } from "@kunai-consulting/qwik";
import { component$, useSignal, useStyles$ } from "@qwik.dev/core";
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
