import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Menu } from "@kunai-consulting/qwik";
import styles from "./menu-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  const selectedItem = useSignal<string | null>(null);

  const open = useSignal(false);
  return (
    <div>
      {selectedItem.value !== null && <span>Selected item: {selectedItem.value}</span>}
      <Menu.Root bind:open={open}>
        <Menu.Trigger class="bg-qwik-blue-700 p-1">Options</Menu.Trigger>
        <Menu.Content>
          <Menu.Item
            value="Regular Item"
            onSelect$={() => (selectedItem.value = "Regular Item")}
            class="menu-item"
          >
            <Menu.ItemLabel class="menu-item-label">
              Regular Item
            </Menu.ItemLabel>
          </Menu.Item>
          <Menu.Submenu>
            <Menu.SubmenuTrigger class="menu-item">
              <Menu.ItemLabel class="menu-item-label">
                More Options
              </Menu.ItemLabel>
            </Menu.SubmenuTrigger>
            <Menu.SubmenuContent>
              <Menu.Item
                value="Submenu 2"
                onSelect$={() => (selectedItem.value = "Submenu 2")}
                class="menu-item"
              >
                <Menu.ItemLabel class="menu-item-label">
                  Submenu Item 1
                </Menu.ItemLabel>
              </Menu.Item>
              <Menu.Item
                value="Submenu 2"
                onSelect$={() => (selectedItem.value = "Submenu 2")}
                class="menu-item"
                closeOnSelect={false}
              >
                <Menu.ItemLabel class="menu-item-label">
                  Submenu Item 2 (closeOnSelect = false)
                </Menu.ItemLabel>
              </Menu.Item>
            </Menu.SubmenuContent>
          </Menu.Submenu>
          <Menu.Item
            value="Regular Item 2"
            onSelect$={() => (selectedItem.value = "Regular Item 2")}
            class="menu-item"
          >
            <Menu.ItemLabel class="menu-item-label">
              Regular Item 2
            </Menu.ItemLabel>
          </Menu.Item>
        </Menu.Content>
      </Menu.Root>
    </div>
  );
});
