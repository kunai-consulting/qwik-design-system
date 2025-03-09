import { component$, useStyles$ } from "@builder.io/qwik";
import { RadioGroup } from "@kunai-consulting/qwik";
import { LuCircle } from "@qwikest/icons/lucide";
import styles from "./radio-group-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <RadioGroup.Root class="radio-group-root" orientation="horizontal">
      <RadioGroup.Label class="radio-group-label">Size</RadioGroup.Label>

      {["S", "M", "L", "XL"].map((size) => (
        <RadioGroup.Item class="radio-group-item" key={size} value={size}>
          <div class="radio-group-item-content">
            <RadioGroup.Trigger class="radio-group-trigger" value={size}>
              <RadioGroup.Indicator class="radio-group-indicator" value={size}>
                <LuCircle />
              </RadioGroup.Indicator>
            </RadioGroup.Trigger>
            <RadioGroup.Label>{size}</RadioGroup.Label>
          </div>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
});
