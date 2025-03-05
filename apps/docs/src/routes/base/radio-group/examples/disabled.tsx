import {component$, useSignal, useStyles$} from "@builder.io/qwik";
import { RadioGroup } from "@kunai-consulting/qwik";
import { LuCircle } from "@qwikest/icons/lucide";
import styles from "./radio-group-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  const isDisabled = useSignal(false);

  return (
    <div class="space-y-4">
      <button onClick$={() => isDisabled.value = !isDisabled.value}>
        Toggle Disabled
      </button>

      <RadioGroup.Root
        class="radio-group"
        disabled={isDisabled.value}
      >
        <RadioGroup.Label class="radio-group-label">Subscription Plan</RadioGroup.Label>

        {[
          { value: 'basic', label: 'Basic' },
          { value: 'pro', label: 'Pro' },
          { value: 'enterprise', label: 'Enterprise' }
        ].map((plan) => (
          <RadioGroup.Item
            class="radio-group-item"
            key={plan.value}
            value={plan.value}
          >
            <div class="flex items-center gap-2">
              <RadioGroup.Trigger class="radio-group-trigger" value={plan.value}>
                <RadioGroup.Indicator class="radio-group-indicator" value={plan.value}>
                  <LuCircle />
                </RadioGroup.Indicator>
              </RadioGroup.Trigger>
              <RadioGroup.Label>{plan.label}</RadioGroup.Label>
              </div>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </div>
  );
});