import { component$, useStyles$ } from "@qwik.dev/core";
import { RadioGroup } from "@kunai-consulting/qwik";
import styles from "./radio-group-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <RadioGroup.Root class="radio-group-root">
      <RadioGroup.Label>Choose option</RadioGroup.Label>

      {["Option 1", "Option 2"].map((value) => (
        <RadioGroup.Item value={value} key={value} class="radio-group-item">
          <RadioGroup.ItemLabel>{value}</RadioGroup.ItemLabel>
          <RadioGroup.ItemTrigger class="radio-group-trigger">
            <RadioGroup.ItemIndicator class="radio-group-indicator" />
          </RadioGroup.ItemTrigger>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
});
