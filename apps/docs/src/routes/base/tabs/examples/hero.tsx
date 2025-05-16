import { component$ } from "@builder.io/qwik";
import { Tabs } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <Tabs.Root>
      <Tabs.List>
        <Tabs.Trigger>Tab 1</Tabs.Trigger>
        <Tabs.Trigger>Tab 2</Tabs.Trigger>
        <Tabs.Trigger>Tab 3</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content>Content 1</Tabs.Content>
      <Tabs.Content>Content 2</Tabs.Content>
      <Tabs.Content>Content 3</Tabs.Content>
    </Tabs.Root>
  );
});
