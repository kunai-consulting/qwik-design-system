import { component$, useStyles$ } from "@builder.io/qwik";
import { RadioGroup } from "@kunai-consulting/qwik";
import styles from "./radio-group-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <RadioGroup.Root class="radio-group-root">
      <RadioGroup.Label>Choose option</RadioGroup.Label>

      <RadioGroup.Item value="option1" class="radio-group-item">
        <RadioGroup.Label>Option 1</RadioGroup.Label>
        <RadioGroup.Trigger value="option1" class="radio-group-trigger">
          <RadioGroup.Indicator value="option1" class="radio-group-indicator" />
        </RadioGroup.Trigger>
      </RadioGroup.Item>

      <RadioGroup.Item value="option2" class="radio-group-item">
        <RadioGroup.Label>Option 2</RadioGroup.Label>
        <RadioGroup.Trigger value="option2" class="radio-group-trigger">
          <RadioGroup.Indicator value="option2" class="radio-group-indicator" />
        </RadioGroup.Trigger>
      </RadioGroup.Item>
    </RadioGroup.Root>
  );
});
