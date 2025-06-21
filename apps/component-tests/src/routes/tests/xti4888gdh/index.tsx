
import { component$ } from "@builder.io/qwik";
import * as Checkbox from "../../../../../../libs/components/src/checkbox/index";

export default component$(() => {
  return (
    
      <Checkbox.Root>
        <Checkbox.Trigger data-testid="checkbox-trigger">
          <Checkbox.Indicator data-testid="checkbox-indicator">✓</Checkbox.Indicator>
        </Checkbox.Trigger>
      </Checkbox.Root>
    
  );
});
