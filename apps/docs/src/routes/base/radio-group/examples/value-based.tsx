import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { RadioGroup } from "@kunai-consulting/qwik";
import styles from "./radio-group-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  const currentValue = useSignal("Option 1");
  const valueSelected$ = $((value: string) => {
    currentValue.value = value;
    console.log("Selected:", value);
  });

  return (
    <RadioGroup.Root
      value={currentValue.value}
      onChange$={valueSelected$}
      class="radio-group-root"
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
    </RadioGroup.Root>
  );
});
