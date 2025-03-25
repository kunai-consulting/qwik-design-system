import { $, component$, useSignal } from "@builder.io/qwik";
import { RadioGroup } from "@kunai-consulting/qwik";

export default component$(() => {
  const isError = useSignal(false);
  const items = [
    { label: "Basic - $10/month", value: "basic" },
    { label: "Pro - $20/month", value: "pro" }
  ];
  const handleSubmit$ = $((e: SubmitEvent) => {
    const form = e.target as HTMLFormElement;
    if (!form.checkValidity()) {
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
        onChange$={$(() => {
          isError.value = false;
        })}
      >
        <RadioGroup.Label>Subscription Plan</RadioGroup.Label>
        <RadioGroup.Description>
          Choose your preferred subscription plan
        </RadioGroup.Description>

        {items.map((item) => (
          <RadioGroup.Item value={item.value} key={item.value} class="radio-group-item">
            <RadioGroup.Label>{item.label}</RadioGroup.Label>
            <RadioGroup.Trigger class="radio-group-trigger">
              <RadioGroup.Indicator class="radio-group-indicator" />
            </RadioGroup.Trigger>
            <RadioGroup.HiddenInput />
          </RadioGroup.Item>
        ))}

        {isError.value && (
          <RadioGroup.ErrorMessage class="radio-group-error-message">
            Please select a subscription plan
          </RadioGroup.ErrorMessage>
        )}
      </RadioGroup.Root>

      <button type="submit">Subscribe</button>
    </form>
  );
});
