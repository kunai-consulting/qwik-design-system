import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Dropdown } from "@kunai-consulting/qwik";
import styles from "./dropdown-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  const selectedItem = useSignal("");

  return (
    <div>
      {selectedItem.value !== "" && <span>Selected item: {selectedItem.value}</span>}
      <Dropdown.Root>
        <Dropdown.Trigger class="bg-qwik-blue-700 p-1 w-70">Open Menu</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item
            closeOnSelect={false}
            onSelect$={() => (selectedItem.value = "1")}
            class="dropdown-item"
          >
            <Dropdown.ItemLabel class="dropdown-item-label">Item 1 (closeOnSelect = false)</Dropdown.ItemLabel>
          </Dropdown.Item>
          <Dropdown.Item
            onSelect$={() => (selectedItem.value = "2")}
            class="dropdown-item"
          >
            <Dropdown.ItemLabel class="dropdown-item-label">Item 2</Dropdown.ItemLabel>
          </Dropdown.Item>
          <Dropdown.Item disabled class="dropdown-item">
            <Dropdown.ItemLabel class="dropdown-item-label">
              Item 3 (Disabled)
            </Dropdown.ItemLabel>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </div>
  );
});
