import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Checkbox } from "@kunai-consulting/qwik-components";
import { LuCheck } from "@qwikest/icons/lucide";

export default component$(() => {
  useStyles$(styles);

  const numChanges = useSignal(0);
  const isChecked = useSignal(false);
  const handleChange$ = $((checked: boolean) => {
    numChanges.value++;
    isChecked.value = checked;
  });

  return (
    <>
      <Checkbox.Root onChange$={handleChange$}>
        <Checkbox.Trigger class="checkbox-trigger">
          <Checkbox.Indicator class="checkbox-indicator">
            <LuCheck />
          </Checkbox.Indicator>
        </Checkbox.Trigger>
      </Checkbox.Root>
      <p>Times changed: {numChanges.value}</p>
      <section>New value: {isChecked.value ? "true" : "false"}</section>
    </>
  );
});

// example styles
import styles from "./checkbox.css?inline";
