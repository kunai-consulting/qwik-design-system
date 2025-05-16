import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Dropdown } from "@kunai-consulting/qwik";
import styles from "./dropdown-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  const selectedItem = useSignal<string | null>(null);

  return (
    <div>
      <Dropdown.Root>
        {/* Area that responds to right-clicks */}
        <Dropdown.ContextTrigger class="bg-qwik-blue-700 p-10">
          Right-click me!
        </Dropdown.ContextTrigger>

        {/* The menu content (shown on right-click) */}
        <Dropdown.Content>
          <Dropdown.Item
            value="1"
            onSelect$={(value) => (selectedItem.value = value ?? null)}
            class="dropdown-item"
          >
            <Dropdown.ItemLabel class="dropdown-item-label">Item 1</Dropdown.ItemLabel>
          </Dropdown.Item>
          <Dropdown.Item
            value="2"
            onSelect$={(value) => (selectedItem.value = value ?? null)}
            class="dropdown-item"
          >
            <Dropdown.ItemLabel class="dropdown-item-label">Item 2</Dropdown.ItemLabel>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
      <div style="margin-top: 20px;">
        {selectedItem.value !== null && <span>Selected item: {selectedItem.value}</span>}
      </div>
    </div>
  );
});
