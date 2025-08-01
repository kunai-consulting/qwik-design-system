import { Checkbox } from "@kunai-consulting/qwik";
import { component$, useSignal, useStyles$ } from "@qwik.dev/core";
import { LuCheck } from "@qwikest/icons/lucide";

export default component$(() => {
  useStyles$(styles);

  const isDisabled = useSignal(true);

  return (
    <>
      <Checkbox.Root disabled={isDisabled.value}>
        <Checkbox.Trigger class="checkbox-trigger">
          <Checkbox.Indicator class="checkbox-indicator">
            <LuCheck />
          </Checkbox.Indicator>
        </Checkbox.Trigger>
      </Checkbox.Root>

      <button
        type="button"
        onClick$={() => {
          isDisabled.value = !isDisabled.value;
        }}
      >
        Toggle disabled state
      </button>
    </>
  );
});

// example styles
import styles from "./checkbox.css?inline";
