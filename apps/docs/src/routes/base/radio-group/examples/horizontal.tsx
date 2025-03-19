import { component$ } from "@builder.io/qwik";
import { RadioGroup } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <RadioGroup.Root orientation="horizontal" class="radio-group-root">
      <RadioGroup.Label>Size</RadioGroup.Label>

      {["S", "M", "L", "XL"].map((size, index) => (
        <RadioGroup.Item value={size} key={size} class="radio-group-item">
          <RadioGroup.Label>{size}</RadioGroup.Label>
          <RadioGroup.Trigger value={size} _index={index} class="radio-group-trigger">
            <RadioGroup.Indicator value={size} class="radio-group-indicator" />
          </RadioGroup.Trigger>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
});
