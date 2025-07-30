import { Toggle } from "@kunai-consulting/qwik"; // Adjust import path
import { component$, useStyles$ } from "@qwik.dev/core";
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
