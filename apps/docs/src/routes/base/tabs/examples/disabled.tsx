import { component$, useStyles$ } from "@qwik.dev/core";
import { Tabs } from "@kunai-consulting/qwik";
import tabsStyles from "./tabs.css?inline";

export default component$(() => {
  useStyles$(tabsStyles);

  return (
    <Tabs.Root class="tabs-root">
      <Tabs.List>
        <Tabs.Trigger class="tabs-trigger">Tab 1</Tabs.Trigger>
        <Tabs.Trigger class="tabs-trigger" disabled>
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger class="tabs-trigger">Tab 3</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content>Content 1</Tabs.Content>
      <Tabs.Content>Content 2</Tabs.Content>
      <Tabs.Content>Content 3</Tabs.Content>
    </Tabs.Root>
  );
});
