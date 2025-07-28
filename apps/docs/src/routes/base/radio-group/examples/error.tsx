import { component$, useSignal } from "@qwik.dev/core";
import { RadioGroup } from "@kunai-consulting/qwik";

export default component$(() => {
  const isError = useSignal(true);

  return (
    <RadioGroup.Root
      class="radio-group-root"
      required
      isError={isError.value}
      onChange$={() => {
        isError.value = false;
      }}
    >
      <RadioGroup.Label>Choose option</RadioGroup.Label>

      {["Option 1", "Option 2"].map((value) => (
        <RadioGroup.Item value={value} key={value} class="radio-group-item">
          <RadioGroup.ItemTrigger class="radio-group-trigger">
            <RadioGroup.ItemIndicator class="radio-group-indicator" />
          </RadioGroup.ItemTrigger>
          <RadioGroup.ItemLabel>{value}</RadioGroup.ItemLabel>
        </RadioGroup.Item>
      ))}

      {isError.value && (
        <RadioGroup.Error class="radio-group-error">
          Please select an option
        </RadioGroup.Error>
      )}
    </RadioGroup.Root>
  );
});
