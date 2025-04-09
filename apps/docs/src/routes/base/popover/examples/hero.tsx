import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Popover } from "@kunai-consulting/qwik";

export default component$(() => {
  const anchorRef = useSignal<HTMLButtonElement>();
  useVisibleTask$(() => {
    console.log("ANCHOR OUTSIDE", anchorRef.value);
  });

  return (
    <Popover.Root>
      <Popover.Anchor ref={anchorRef}>Open Popover</Popover.Anchor>
      <Popover.Content>Popover Panel</Popover.Content>
    </Popover.Root>
  );
});
