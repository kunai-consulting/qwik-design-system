import { component$ } from "@builder.io/qwik";
import { Popover } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <>
      <div style={{ height: "2000px" }} />
      <Popover.Root>
        <Popover.Anchor>Open Popover</Popover.Anchor>
        <Popover.Content>Popover Panel</Popover.Content>
      </Popover.Root>
      <div style={{ height: "2000px" }} />
    </>
  );
});
