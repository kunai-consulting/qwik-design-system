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
          <RadioGroup.Label>{value}</RadioGroup.Label>
          <RadioGroup.Trigger class="radio-group-trigger">
            <RadioGroup.Indicator class="radio-group-indicator" />
          </RadioGroup.Trigger>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
});
