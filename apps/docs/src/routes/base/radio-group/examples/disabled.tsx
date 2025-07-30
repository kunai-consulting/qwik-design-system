import { RadioGroup } from "@kunai-consulting/qwik";
import { component$, useSignal } from "@qwik.dev/core";

export default component$(() => {
  const isGroupDisabled = useSignal(false);

  return (
    <div class="space-y-4">
      <button
        onClick$={() => (isGroupDisabled.value = !isGroupDisabled.value)}
        class="mb-4"
        type="button"
      >
        {isGroupDisabled.value ? "Enable" : "Disable"} group
      </button>

      <RadioGroup.Root class="radio-group-root" disabled={isGroupDisabled.value}>
        <RadioGroup.Label>Choose option</RadioGroup.Label>

        <RadioGroup.Item value="option1" class="radio-group-item">
          <RadioGroup.ItemLabel>Option 1</RadioGroup.ItemLabel>
          <RadioGroup.ItemTrigger class="radio-group-trigger">
            <RadioGroup.ItemIndicator class="radio-group-indicator" />
          </RadioGroup.ItemTrigger>
        </RadioGroup.Item>

        <RadioGroup.Item value="option2" class="radio-group-item">
          <RadioGroup.ItemLabel>Option 2 (Disabled)</RadioGroup.ItemLabel>
          <RadioGroup.ItemTrigger class="radio-group-trigger" disabled>
            <RadioGroup.ItemIndicator class="radio-group-indicator" />
          </RadioGroup.ItemTrigger>
        </RadioGroup.Item>

        <RadioGroup.Item value="option3" class="radio-group-item">
          <RadioGroup.ItemLabel>Option 3</RadioGroup.ItemLabel>
          <RadioGroup.ItemTrigger class="radio-group-trigger">
            <RadioGroup.ItemIndicator class="radio-group-indicator" />
          </RadioGroup.ItemTrigger>
        </RadioGroup.Item>
      </RadioGroup.Root>
    </div>
  );
});
