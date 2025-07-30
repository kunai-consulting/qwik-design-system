import { Popover } from "@kunai-consulting/qwik";
import { component$, useStyles$ } from "@qwik.dev/core";
import styles from "./popover.css?inline";

export default component$(() => {
  useStyles$(styles);

  return (
    <Popover.Root>
      <Popover.Trigger class="popover-trigger">Open Popover</Popover.Trigger>
      <Popover.Content class="popover-content">Popover Panel</Popover.Content>
    </Popover.Root>
  );
});
