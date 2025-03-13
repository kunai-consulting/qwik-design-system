import { component$ } from "@builder.io/qwik";
import { RadioGroup } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <form>
      <RadioGroup.Root
        required
        isDescription
        name="subscription"
        class="radio-group-root"
      >
        <RadioGroup.Label>Subscription Plan</RadioGroup.Label>
        <RadioGroup.Description>
          Choose your preferred subscription plan
        </RadioGroup.Description>

        <RadioGroup.Item value="basic" class="radio-group-item">
          <RadioGroup.Label>Basic - $10/month</RadioGroup.Label>
          <RadioGroup.Trigger value="basic" _index={0} class="radio-group-trigger">
            <RadioGroup.Indicator value="basic" class="radio-group-indicator"/>
          </RadioGroup.Trigger>
          <RadioGroup.HiddenInput value="basic" _index={0} />
        </RadioGroup.Item>

        <RadioGroup.Item value="pro" class="radio-group-item">
          <RadioGroup.Label>Pro - $20/month</RadioGroup.Label>
          <RadioGroup.Trigger value="pro" _index={1} class="radio-group-trigger">
            <RadioGroup.Indicator value="pro" class="radio-group-indicator"/>
          </RadioGroup.Trigger>
          <RadioGroup.HiddenInput value="pro" _index={1} />
        </RadioGroup.Item>

        <RadioGroup.ErrorMessage class="radio-group-error-message">
          Please select a subscription plan
        </RadioGroup.ErrorMessage>
      </RadioGroup.Root>

      <button type="submit">Subscribe</button>
    </form>
  );
});
