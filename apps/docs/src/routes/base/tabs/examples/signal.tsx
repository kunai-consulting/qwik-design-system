import { component$, useSignal, useStyles$ } from "@qwik.dev/core";
import { Tabs } from "@kunai-consulting/qwik";
import tabsStyles from "./tabs.css?inline";

export default component$(() => {
  useStyles$(tabsStyles);

  const selectedTab = useSignal("overview");

  return (
    <>
      <Tabs.Root class="tabs-root" bind:value={selectedTab}>
        <Tabs.List>
          <Tabs.Trigger class="tabs-trigger" value="overview">
            Overview
          </Tabs.Trigger>
          <Tabs.Trigger class="tabs-trigger" value="settings">
            Settings
          </Tabs.Trigger>
          <Tabs.Trigger class="tabs-trigger" value="analytics">
            Analytics
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="analytics">
          View detailed analytics and reports about your account usage and performance.
        </Tabs.Content>
        <Tabs.Content value="settings">
          Manage your account settings, preferences, and notification options here.
        </Tabs.Content>
        <Tabs.Content value="overview">
          Welcome to your dashboard overview. Here you can see your key metrics and recent
          activity.
        </Tabs.Content>
      </Tabs.Root>

      <br />

      <button type="button" onClick$={() => (selectedTab.value = "settings")}>
        Set to settings
      </button>

      <div>
        <span>Selected tab: {selectedTab.value}</span>
      </div>
    </>
  );
});
