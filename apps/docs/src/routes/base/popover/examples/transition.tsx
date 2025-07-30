import { Popover } from "@kunai-consulting/qwik";
import { component$, useStyles$ } from "@qwik.dev/core";

export default component$(() => {
  useStyles$(styles);

  return (
    <Popover.Root>
      <Popover.Trigger class="popover-trigger">Open Popover</Popover.Trigger>
      <Popover.Content class="popover-content popover-transition">
        Popover
      </Popover.Content>
    </Popover.Root>
  );
});

// internal styles
import styles from "./transition.css?inline";
