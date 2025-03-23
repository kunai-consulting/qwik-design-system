import { component$, useStyles$ } from "@builder.io/qwik";
import { Popover } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);

  return (
    <Popover.Root>
      <Popover.Anchor>Open Popover</Popover.Anchor>
      <Popover.Content class="popover-panel">Popover Panel</Popover.Content>
    </Popover.Root>
  );
});

// internal styles
import styles from "./simple-transition.css?inline";
