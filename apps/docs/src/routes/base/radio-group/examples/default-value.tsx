import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { RadioGroup } from "@kunai-consulting/qwik";
import styles from "./radio-group-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  const currentValue = useSignal("Option 1");

  return (
    <RadioGroup.Root
      value={currentValue.value}
      onValueChange$={(value: string) => {
        currentValue.value = value;
        console.log("Selected:", value);
      }}
      class="radio-group-root"
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
    </RadioGroup.Root>
  );
});
