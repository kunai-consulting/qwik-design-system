import { $, component$, useSignal } from "@builder.io/qwik";
import { RadioGroup } from "@kunai-consulting/qwik";

export default component$(() => {
  const isError = useSignal(false);

  return (
    <form
      preventdefault:submit
      noValidate
      onSubmit$={$((e) => {
        const form = e.target as HTMLFormElement;
        if (!form.checkValidity()) {
          isError.value = true;
        } else {
          isError.value = false;
          console.log("Form submitted successfully");
        }
      })}
    >
      <RadioGroup.Root
        required
        isDescription
        isError={isError.value}
        name="subscription"
        class="radio-group-root"
        onValueChange$={$(() => {
          isError.value = false;
        })}
      >
        <RadioGroup.Label>Subscription Plan</RadioGroup.Label>
        <RadioGroup.Description>
          Choose your preferred subscription plan
        </RadioGroup.Description>

        <RadioGroup.Item value="basic" class="radio-group-item">
          <RadioGroup.Label>Basic - $10/month</RadioGroup.Label>
          <RadioGroup.Trigger value="basic" class="radio-group-trigger">
            <RadioGroup.Indicator value="basic" class="radio-group-indicator" />
          </RadioGroup.Trigger>
          <RadioGroup.HiddenInput value="basic" />
        </RadioGroup.Item>

        <RadioGroup.Item value="pro" class="radio-group-item">
          <RadioGroup.Label>Pro - $20/month</RadioGroup.Label>
          <RadioGroup.Trigger value="pro" class="radio-group-trigger">
            <RadioGroup.Indicator value="pro" class="radio-group-indicator" />
          </RadioGroup.Trigger>
          <RadioGroup.HiddenInput value="pro" />
        </RadioGroup.Item>

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
