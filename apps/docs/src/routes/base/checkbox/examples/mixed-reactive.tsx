import { component$, useSignal, useStyles$ } from "@qwik.dev/core";
import { Checkbox } from "@kunai-consulting/qwik";
import { LuCheck, LuMinus } from "@qwikest/icons/lucide";

export default component$(() => {
  useStyles$(styles);

  const isChecked = useSignal<boolean | "mixed">(false);

  return (
    <>
      <Checkbox.Root bind:checked={isChecked}>
        <Checkbox.Trigger class="checkbox-trigger">
          <Checkbox.Indicator class="checkbox-indicator">
            {isChecked.value === "mixed" ? <LuMinus /> : <LuCheck />}
          </Checkbox.Indicator>
        </Checkbox.Trigger>
      </Checkbox.Root>

      <button
        type="button"
        onClick$={() => {
          isChecked.value = "mixed";
        }}
      >
        Make the checkbox mixed
      </button>
    </>
  );
});

// example styles
import styles from "./checkbox.css?inline";
