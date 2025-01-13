import { component$, useStyles$ } from "@builder.io/qwik";
import { RadioGroup } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);

  return (
    <RadioGroup.Root>
      <RadioGroup.Trigger class="radio-group-trigger">
        <RadioGroup.Indicator class="radio-group-indicator">
          <LuCheck />
        </RadioGroup.Indicator>
      </RadioGroup.Trigger>
    </RadioGroup.Root>
  );
});

import { LuCheck } from "@qwikest/icons/lucide";
// example styles
import styles from "./radio-group.css?inline";
