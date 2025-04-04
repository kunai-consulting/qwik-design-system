import { component$, useStyles$ } from "@builder.io/qwik";
import { Popover } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);

  return (
    <Popover.Root>
      <Popover.Anchor>Open Popover</Popover.Anchor>
      <Popover.Content class="popover-transition">Popover</Popover.Content>
    </Popover.Root>
  );
});

// internal styles
import styles from "./transition.css?inline";
