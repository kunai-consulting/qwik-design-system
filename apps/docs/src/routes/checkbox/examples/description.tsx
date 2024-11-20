import { component$, useStyles$ } from "@builder.io/qwik";
import { Checkbox } from "@kunai-consulting/qwik-components";
import { LuCheck } from "@qwikest/icons/lucide";

export default component$(() => {
  useStyles$(styles);

  return (
    <Checkbox.Root>
      <Checkbox.Trigger class="checkbox-trigger">
        <Checkbox.Indicator class="checkbox-indicator">
          <LuCheck />
        </Checkbox.Indicator>
      </Checkbox.Trigger>
      <Checkbox.Label>I accept the Terms and Conditions</Checkbox.Label>
      <Checkbox.Description>
        By checking this box, you acknowledge that you have read, understood, and agree to
        our Terms of Service and Privacy Policy. This includes consent to process your
        personal data as described in our policies.
      </Checkbox.Description>
    </Checkbox.Root>
  );
});

// example styles
import styles from "./checkbox.css?inline";