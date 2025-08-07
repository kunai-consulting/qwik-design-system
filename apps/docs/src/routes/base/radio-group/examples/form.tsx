import { RadioGroup } from "@kunai-consulting/qwik";
import { $, component$, useSignal } from "@qwik.dev/core";

export default component$(() => {
  const isError = useSignal(false);
  const items = [
    { label: "Basic - $10/month", value: "basic" },
    { label: "Pro - $20/month", value: "pro" }
  ];
  const handleSubmit$ = $((e: SubmitEvent) => {
    const form = e.target as HTMLFormElement;
    if (!form.checkValidity()) {
      console.log("Form submitted with error");
      isError.value = true;
    } else {
      isError.value = false;
      console.log("Form submitted successfully");
    }
  });

  return (
    <form preventdefault:submit noValidate onSubmit$={handleSubmit$}>
      <RadioGroup.Root
        required
        isDescription
        isError={isError.value}
        name="subscription"
        class="radio-group-root"
        onChange$={() => {
          isError.value = false;
        }}
      >
        <RadioGroup.Label>Subscription Plan</RadioGroup.Label>
        <RadioGroup.Description>
          Choose your preferred subscription plan
        </RadioGroup.Description>

        {items.map((item) => (
          <RadioGroup.Item value={item.value} key={item.value} class="radio-group-item">
            <RadioGroup.ItemLabel>{item.label}</RadioGroup.ItemLabel>
            <RadioGroup.ItemTrigger class="radio-group-trigger">
              <RadioGroup.ItemIndicator class="radio-group-indicator" />
            </RadioGroup.ItemTrigger>
          </RadioGroup.Item>
        ))}

        <RadioGroup.HiddenInput />

        {isError.value && (
          <RadioGroup.Error class="radio-group-error">
            Please select a subscription plan
          </RadioGroup.Error>
        )}
      </RadioGroup.Root>

      <button type="submit">Subscribe</button>
    </form>
  );
});
