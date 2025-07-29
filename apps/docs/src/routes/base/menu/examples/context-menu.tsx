import { Menu } from "@kunai-consulting/qwik";
import { component$, useSignal, useStyles$ } from "@qwik.dev/core";
import styles from "./menu-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  const selectedItem = useSignal<string | null>(null);

  return (
    <div>
      <Menu.Root>
        {/* Area that responds to right-clicks */}
        <Menu.ContextTrigger class="bg-qwik-blue-700 p-10">
          Right-click me!
        </Menu.ContextTrigger>

        {/* The menu content (shown on right-click) */}
        <Menu.Content>
          <Menu.Item
            value="1"
            onSelect$={(value) => (selectedItem.value = value ?? null)}
            class="menu-item"
          >
            <Menu.ItemLabel class="menu-item-label">Item 1</Menu.ItemLabel>
          </Menu.Item>
          <Menu.Item
            value="2"
            onSelect$={(value) => (selectedItem.value = value ?? null)}
            class="menu-item"
          >
            <Menu.ItemLabel class="menu-item-label">Item 2</Menu.ItemLabel>
          </Menu.Item>
        </Menu.Content>
      </Menu.Root>
      <div style="margin-top: 20px;">
        {selectedItem.value !== null && <span>Selected item: {selectedItem.value}</span>}
      </div>
    </div>
  );
});
