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
                value="Submenu 1"
                onSelect$={() => (selectedItem.value = "Submenu 1")}
                class="menu-item"
              >
                <Menu.ItemLabel class="menu-item-label">
                  Submenu Item 1
                </Menu.ItemLabel>
              </Menu.Item>
              <Menu.Submenu>
                <Menu.SubmenuTrigger class="menu-item">
                  <Menu.ItemLabel class="menu-item-label">
                    Even More Options
                  </Menu.ItemLabel>
                </Menu.SubmenuTrigger>
                <Menu.SubmenuContent>
                  <Menu.Item
                    value="Submenu 2-1"
                    onSelect$={() => (selectedItem.value = "Submenu 2-1")}
                    class="menu-item"
                  >
                    <Menu.ItemLabel class="menu-item-label">
                      Submenu 2 - Item 1
                    </Menu.ItemLabel>
                  </Menu.Item>
                  <Menu.Item
                    value="Submenu 2-2"
                    onSelect$={() => (selectedItem.value = "Submenu 2-2")}
                    class="menu-item"
                  >
                    <Menu.ItemLabel class="menu-item-label">
                      Submenu 2 - Item 2
                    </Menu.ItemLabel>
                  </Menu.Item>
                </Menu.SubmenuContent>
              </Menu.Submenu>
            </Menu.SubmenuContent>
          </Menu.Submenu>
        </Menu.Content>
      </Menu.Root>
    </div>
  );
});
