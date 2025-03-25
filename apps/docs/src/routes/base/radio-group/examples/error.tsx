import { $, component$, useSignal } from "@builder.io/qwik";
import { RadioGroup } from "@kunai-consulting/qwik";

export default component$(() => {
  const isError = useSignal(true);

  return (
    <RadioGroup.Root
      class="radio-group-root"
      required
      isError={isError.value}
      onChange$={$(() => {
        isError.value = false;
      })}
    >
      <RadioGroup.Label>Choose option</RadioGroup.Label>

      {["Option 1", "Option 2"].map((value) => (
        <RadioGroup.Item value={value} key={value} class="radio-group-item">
          <RadioGroup.Trigger class="radio-group-trigger">
            <RadioGroup.Indicator class="radio-group-indicator" />
          </RadioGroup.Trigger>
          <RadioGroup.Label>{value}</RadioGroup.Label>
        </RadioGroup.Item>
      ))}

      {isError.value && (
        <RadioGroup.ErrorMessage class="radio-group-error-message">
          Please select an option
        </RadioGroup.ErrorMessage>
      )}
    </RadioGroup.Root>
  );
});
