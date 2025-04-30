import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Dropdown } from "@kunai-consulting/qwik";
import styles from "./dropdown-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  const selectedItem = useSignal(0);

  return (
    <div>
      <Dropdown.Root>
        <Dropdown.Trigger class="bg-qwik-blue-700 p-1">Open Menu</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item onSelect$={() => (selectedItem.value = 1)} class="dropdown-item">
            <Dropdown.ItemLabel class="dropdown-item-label">Item 1</Dropdown.ItemLabel>
          </Dropdown.Item>
          <Dropdown.Item onSelect$={() => (selectedItem.value = 2)} class="dropdown-item">
            <Dropdown.ItemLabel class="dropdown-item-label">Item 2</Dropdown.ItemLabel>
          </Dropdown.Item>
          <Dropdown.Item disabled class="dropdown-item">
            <Dropdown.ItemLabel class="dropdown-item-label">
              Item 3 (Disabled)
            </Dropdown.ItemLabel>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
      {selectedItem.value > 0 && <span>Selected item: {selectedItem.value}</span>}
    </div>
  );
});
