import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Dropdown } from "@kunai-consulting/qwik";
import styles from "./dropdown-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  const selectedItem = useSignal<string | null>(null);

  const open = useSignal(false);
  return (
    <div>
      {selectedItem.value !== null && <span>Selected item: {selectedItem.value}</span>}
      <Dropdown.Root bind:open={open}>
        <Dropdown.Trigger class="bg-qwik-blue-700 p-1">Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item
            value="Regular Item"
            onSelect$={() => (selectedItem.value = "Regular Item")}
            class="dropdown-item"
          >
            <Dropdown.ItemLabel class="dropdown-item-label">
              Regular Item
            </Dropdown.ItemLabel>
          </Dropdown.Item>
          <Dropdown.Submenu>
            <Dropdown.SubmenuTrigger class="dropdown-item">
              <Dropdown.ItemLabel class="dropdown-item-label">
                More Options
              </Dropdown.ItemLabel>
            </Dropdown.SubmenuTrigger>
            <Dropdown.SubmenuContent>
              <Dropdown.Item
                value="Submenu 2"
                onSelect$={() => (selectedItem.value = "Submenu 2")}
                class="dropdown-item"
              >
                <Dropdown.ItemLabel class="dropdown-item-label">
                  Submenu Item 1
                </Dropdown.ItemLabel>
              </Dropdown.Item>
              <Dropdown.Item
                value="Submenu 2"
                onSelect$={() => (selectedItem.value = "Submenu 2")}
                class="dropdown-item"
                closeOnSelect={false}
              >
                <Dropdown.ItemLabel class="dropdown-item-label">
                  Submenu Item 2 (closeOnSelect = false)
                </Dropdown.ItemLabel>
              </Dropdown.Item>
            </Dropdown.SubmenuContent>
          </Dropdown.Submenu>
          <Dropdown.Item
            value="Regular Item 2"
            onSelect$={() => (selectedItem.value = "Regular Item 2")}
            class="dropdown-item"
          >
            <Dropdown.ItemLabel class="dropdown-item-label">
              Regular Item 2
            </Dropdown.ItemLabel>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </div>
  );
});
