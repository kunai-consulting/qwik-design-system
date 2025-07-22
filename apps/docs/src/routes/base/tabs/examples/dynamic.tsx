import { component$, useComputed$, useSignal, useStyles$ } from "@qwik.dev/core";
import { Tabs } from "@kunai-consulting/qwik";
import tabsStyles from "./tabs.css?inline";

export default component$(() => {
  useStyles$(tabsStyles);

  const count = useSignal(3);

  const tabs = useComputed$(() => {
    return Array.from({ length: count.value }, (_, i) => `Tab ${i + 1}`);
  });

  return (
    <>
      <Tabs.Root class="tabs-root">
        <Tabs.List>
          {tabs.value.map((tab) => (
            <Tabs.Trigger class="tabs-trigger" key={tab}>
              {tab}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {tabs.value.map((tab) => (
          <Tabs.Content key={tab}>Content {tab}</Tabs.Content>
        ))}
      </Tabs.Root>

      <br />

      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          type="button"
          onClick$={() => {
            count.value++;
          }}
        >
          Add Tab
        </button>

        <button
          type="button"
          onClick$={() => {
            count.value--;
          }}
        >
          Remove Tab
        </button>
      </div>
    </>
  );
});
