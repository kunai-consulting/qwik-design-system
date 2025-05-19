import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Menu } from "@kunai-consulting/qwik";
import styles from "./menu-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  const selectedItem = useSignal<string | null>(null);
  const isOpen = useSignal(false);

  return (
    <div>
      <p id="openChangeCallbackValue">Menu is {isOpen.value ? "opened" : "closed"}.</p>
      <Menu.Root
        bind:open={isOpen}
        onOpenChange$={(open: boolean) => {
          isOpen.value = open;
        }}
      >
        <Menu.Trigger class="bg-qwik-blue-700 p-1">Open Menu</Menu.Trigger>
        <Menu.Content>
          <Menu.Item onSelect$={() => (selectedItem.value = "1")} class="menu-item">
            <Menu.ItemLabel class="menu-item-label">Item 1</Menu.ItemLabel>
          </Menu.Item>
          <Menu.Item onSelect$={() => (selectedItem.value = "2")} class="menu-item">
            <Menu.ItemLabel class="menu-item-label">Item 2</Menu.ItemLabel>
          </Menu.Item>
          <Menu.Item disabled class="menu-item">
            <Menu.ItemLabel class="menu-item-label">Item 3 (Disabled)</Menu.ItemLabel>
          </Menu.Item>
        </Menu.Content>
      </Menu.Root>

      <div style="margin-top: 20px;">
        {selectedItem.value !== null && <span>Selected item: {selectedItem.value}</span>}
      </div>
    </div>
  );
});
