import { component$ } from "@qwik.dev/core";
import { RadioGroup } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <RadioGroup.Root orientation="horizontal" class="radio-group-root">
      <RadioGroup.Label>Size</RadioGroup.Label>

      {["S", "M", "L", "XL"].map((size) => (
        <RadioGroup.Item value={size} key={size} class="radio-group-item">
          <RadioGroup.Label>{size}</RadioGroup.Label>
          <RadioGroup.Trigger class="radio-group-trigger">
            <RadioGroup.Indicator class="radio-group-indicator" />
          </RadioGroup.Trigger>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
});
