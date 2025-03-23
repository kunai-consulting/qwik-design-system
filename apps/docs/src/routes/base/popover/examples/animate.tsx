import { component$, useStyles$ } from "@builder.io/qwik";
import { Popover } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);

  return (
    <Popover.Root>
      <Popover.Trigger>Open Popover</Popover.Trigger>
      <Popover.Panel class="popover-panel">Popover Panel</Popover.Panel>
    </Popover.Root>
  );
});

// internal styles
import styles from "./popover.css?inline";
