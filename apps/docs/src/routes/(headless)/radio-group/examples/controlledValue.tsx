import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { RadioGroup } from "@kunai-consulting/qwik";
import { LuCircle } from "@qwikest/icons/lucide";

export default component$(() => {
  useStyles$(styles);
  const items = Array.from({ length: 4 }, (_, i) => `Item ${i + 1}`);
  const value = useSignal<string | undefined>("Item 2");

  return (
    <RadioGroup.Root class="radio-group" value={value.value}>
      <RadioGroup.Label class="radio-group-label">Items</RadioGroup.Label>
      {items.map((item, index) => (
        <RadioGroup.Item class="radio-group-item" key={item} value={item}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <RadioGroup.Label>{item}</RadioGroup.Label>
            <RadioGroup.Trigger class="radio-group-trigger" value={item}>
              <RadioGroup.Indicator class="radio-group-indicator" value={item}>
                <LuCircle />
              </RadioGroup.Indicator>
            </RadioGroup.Trigger>
          </div>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
});

//  styles
import styles from "./radio-group.css?inline";
