import { component$ } from "@builder.io/qwik";
import { Checklist } from "@kunai-consulting/qwik-components";

export default component$(() => {
  const items = Array.from({ length: 4 });

  return (
    <Checklist.Root>
      {items.map((item) => (
        <Checklist.Item>
          <Checklist.Label>Item 1</Checklist.Label>
          <Checklist.Description>Item 1</Checklist.Description>
        </Checklist.Item>
      ))}
    </Checklist.Root>
  );
});
