import { $, component$, useSignal } from "@builder.io/qwik";
import { RadioGroup } from "@kunai-consulting/qwik";

export default component$(() => {
  const isError = useSignal(true);

  return (
    <RadioGroup.Root
      class="radio-group-root"
      required
      isError={isError.value}
      onValueChange$={$(() => {
        isError.value = false;
      })}
    >
      <RadioGroup.Label>Choose option</RadioGroup.Label>

      <RadioGroup.Item value="option1" class="radio-group-item">
        <RadioGroup.Label>Option 1</RadioGroup.Label>
        <RadioGroup.Trigger value="option1" class="radio-group-trigger">
          <RadioGroup.Indicator value="option1" class="radio-group-indicator" />
        </RadioGroup.Trigger>
      </RadioGroup.Item>

      <RadioGroup.Item value="option2" class="radio-group-item">
        <RadioGroup.Label>Option 2</RadioGroup.Label>
        <RadioGroup.Trigger value="option2" class="radio-group-trigger">
          <RadioGroup.Indicator value="option2" class="radio-group-indicator" />
        </RadioGroup.Trigger>
      </RadioGroup.Item>

      {isError.value && (
        <RadioGroup.ErrorMessage class="radio-group-error-message">
          Please select an option
        </RadioGroup.ErrorMessage>
      )}
    </RadioGroup.Root>
  );
});
