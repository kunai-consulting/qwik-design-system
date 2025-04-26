import { component$, useStyles$ } from "@builder.io/qwik";
import { Toggle } from "@kunai-consulting/qwik"; // Adjust import path
import styles from "./toggle.css?inline";

export default component$(() => {
  useStyles$(styles);

  return (
    <Toggle.Root class="toggle-root" aria-label="Toggle State">
      <Toggle.Indicator class="toggle-indicator" fallback={<span>Is Off</span>}>
        <span>Is On</span>
      </Toggle.Indicator>
    </Toggle.Root>
  );
});
