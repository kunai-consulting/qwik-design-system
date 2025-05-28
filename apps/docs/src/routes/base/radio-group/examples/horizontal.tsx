import { component$ } from "@builder.io/qwik";
import { RadioGroup } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <RadioGroup.Root orientation="horizontal" class="radio-group-root">
      <RadioGroup.ItemLabel>Size</RadioGroup.ItemLabel>

      {["S", "M", "L", "XL"].map((size) => (
        <RadioGroup.Item value={size} key={size} class="radio-group-item">
          <RadioGroup.ItemLabel>{size}</RadioGroup.ItemLabel>
          <RadioGroup.ItemTrigger class="radio-group-trigger">
            <RadioGroup.ItemIndicator class="radio-group-indicator" />
          </RadioGroup.ItemTrigger>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
});
