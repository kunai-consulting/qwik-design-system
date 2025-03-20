import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { RadioGroup } from "@kunai-consulting/qwik";
import styles from "./radio-group-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  const currentValue = useSignal("option1");

  return (
    <RadioGroup.Root
      value={currentValue.value}
      onValueChange$={(value: string) => {
        currentValue.value = value;
        console.log("Selected:", value);
      }}
      class="radio-group-root"
    >
      <RadioGroup.Label>Choose option</RadioGroup.Label>

      <RadioGroup.Item value="option1" class="radio-group-item">
        <RadioGroup.Trigger value="option1" class="radio-group-trigger">
          <RadioGroup.Indicator value="option1" class="radio-group-indicator" />
        </RadioGroup.Trigger>
        <RadioGroup.Label>Option 1</RadioGroup.Label>
      </RadioGroup.Item>

      <RadioGroup.Item value="option2" class="radio-group-item">
        <RadioGroup.Trigger value="option2" class="radio-group-trigger">
          <RadioGroup.Indicator value="option2" class="radio-group-indicator" />
        </RadioGroup.Trigger>
        <RadioGroup.Label>Option 2</RadioGroup.Label>
      </RadioGroup.Item>
    </RadioGroup.Root>
  );
});
