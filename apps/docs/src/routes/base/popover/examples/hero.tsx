import { component$ } from "@builder.io/qwik";
import { Popover } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <Popover.Root>
      <div style={{ height: "2000px" }} />
      <Popover.Anchor>Open Popover</Popover.Anchor>
      <Popover.Content>Popover Panel</Popover.Content>
      <div style={{ height: "2000px" }} />
    </Popover.Root>
  );
});
