import {component$, useStyles$} from "@builder.io/qwik";
import { RadioGroup } from "@kunai-consulting/qwik";
import { LuCircle } from "@qwikest/icons/lucide";
import styles from "./radio-group-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <form>
      <RadioGroup.Root
        class="radio-group"
        name="shipping-method"
        required
      >
        <RadioGroup.Label class="radio-group-label">Shipping Method</RadioGroup.Label>
        <RadioGroup.Description>Select your preferred shipping method</RadioGroup.Description>

        {[
          { value: 'standard', label: 'Standard Shipping (5-7 days)' },
          { value: 'express', label: 'Express Shipping (2-3 days)' },
          { value: 'overnight', label: 'Overnight Shipping (1 day)' }
        ].map((option) => (
          <RadioGroup.Item class="radio-group-item" key={option.value} value={option.value}>
            <div class="flex items-center justify-between w-full">
              <RadioGroup.Label>{option.label}</RadioGroup.Label>
              <RadioGroup.Trigger class="radio-group-trigger" value={option.value}>
                <RadioGroup.Indicator class="radio-group-indicator" value={option.value}>
                  <LuCircle />
                </RadioGroup.Indicator>
              </RadioGroup.Trigger>
            </div>
          </RadioGroup.Item>
        ))}

        <RadioGroup.ErrorMessage class="text-red-500">
          Please select a shipping method
        </RadioGroup.ErrorMessage>
      </RadioGroup.Root>

      <button type="submit">Continue to Payment</button>
    </form>
  );
});

