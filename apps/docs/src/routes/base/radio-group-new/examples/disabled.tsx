import { component$, useSignal } from "@builder.io/qwik";
import { RadioGroup } from "@kunai-consulting/qwik";

export default component$(() => {
  const isGroupDisabled = useSignal(false);

  return (
    <div class="space-y-4">
      <button
        onClick$={() => isGroupDisabled.value = !isGroupDisabled.value}
        class="mb-4"
      >
        {isGroupDisabled.value ? 'Enable' : 'Disable'} group
      </button>

      <RadioGroup.Root
        class="radio-group-root"
        disabled={isGroupDisabled.value}
      >
        <RadioGroup.Label>Choose option</RadioGroup.Label>

        <RadioGroup.Item value="option1" class="radio-group-item">
          <RadioGroup.Label>Option 1</RadioGroup.Label>
          <RadioGroup.Trigger value="option1" _index={0} class="radio-group-trigger">
            <RadioGroup.Indicator value="option1" class="radio-group-indicator"/>
          </RadioGroup.Trigger>
        </RadioGroup.Item>

        <RadioGroup.Item value="option2" class="radio-group-item">
          <RadioGroup.Label>Option 2 (Disabled)</RadioGroup.Label>
          <RadioGroup.Trigger
            value="option2"
            _index={1}
            class="radio-group-trigger"
            disabled
          >
            <RadioGroup.Indicator value="option2" class="radio-group-indicator"/>
          </RadioGroup.Trigger>
        </RadioGroup.Item>

        <RadioGroup.Item value="option3" class="radio-group-item">
          <RadioGroup.Label>Option 3</RadioGroup.Label>
          <RadioGroup.Trigger value="option3" _index={2} class="radio-group-trigger">
            <RadioGroup.Indicator value="option3" class="radio-group-indicator"/>
          </RadioGroup.Trigger>
        </RadioGroup.Item>
      </RadioGroup.Root>
    </div>
  );
});
