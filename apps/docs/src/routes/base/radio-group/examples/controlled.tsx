import { component$, useSignal } from "@builder.io/qwik";
import { RadioGroup } from "@kunai-consulting/qwik";

export default component$(() => {
  const currentValue = useSignal("option1");

  return (
    <RadioGroup.Root
      value={currentValue.value}
      onChange$={(value: string) => {
        currentValue.value = value;
        console.log("Selected:", value);
      }}
      class="radio-group-root"
    >
      <RadioGroup.Label>Choose option</RadioGroup.Label>

      <RadioGroup.Item value="option1" class="radio-group-item">
        <RadioGroup.Trigger value="option1" _index={0} class="radio-group-trigger">
          <RadioGroup.Indicator value="option1" class="radio-group-indicator" />
        </RadioGroup.Trigger>
        <RadioGroup.Label>Option 1</RadioGroup.Label>
      </RadioGroup.Item>

      <RadioGroup.Item value="option2" class="radio-group-item">
        <RadioGroup.Trigger value="option2" _index={1} class="radio-group-trigger">
          <RadioGroup.Indicator value="option2" class="radio-group-indicator" />
        </RadioGroup.Trigger>
        <RadioGroup.Label>Option 2</RadioGroup.Label>
      </RadioGroup.Item>
    </RadioGroup.Root>
  );
});
