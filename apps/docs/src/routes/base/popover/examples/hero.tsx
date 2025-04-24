import { component$, useStyles$ } from "@builder.io/qwik";
import { Popover } from "@kunai-consulting/qwik";
import styles from "./popover.css?inline";

export default component$(() => {
  useStyles$(styles);

  return (
    <Popover.Root>
      <Popover.Anchor class="popover-anchor">Open Popover</Popover.Anchor>
      <Popover.Content class="popover-content">Popover Panel</Popover.Content>
    </Popover.Root>
  );
});
