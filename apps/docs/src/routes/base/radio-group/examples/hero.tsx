import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { RadioGroup } from "@kunai-consulting/qwik";
import { LuCircle } from "@qwikest/icons/lucide";

export default component$(() => {
  useStyles$(styles);
  const items = Array.from({ length: 4 }, (_, i) => `Item ${i + 1}`);

  return (
    <RadioGroup.Root class="radio-group-root">
      <RadioGroup.Label class="radio-group-label">Items</RadioGroup.Label>
      {items.map((item) => (
        <RadioGroup.Item class="radio-group-item" key={item} value={item}>
          <RadioGroup.Label>{item}</RadioGroup.Label>
          <RadioGroup.Trigger class="radio-group-trigger" value={item}>
            <RadioGroup.Indicator class="radio-group-indicator" value={item}>
              <LuCircle />
            </RadioGroup.Indicator>
          </RadioGroup.Trigger>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
});

//  styles
import styles from "./radio-group-custom.css?inline";
