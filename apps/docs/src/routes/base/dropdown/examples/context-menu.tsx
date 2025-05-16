import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Dropdown } from "@kunai-consulting/qwik";
import styles from "./dropdown-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  // const selectedItem = useSignal<string | null>(null);

  return (
    <div>
      <Dropdown.Root>
        {/* Area that responds to right-clicks */}
        <Dropdown.ContextTrigger class="bg-qwik-blue-700 p-1">
          Right-click me!
        </Dropdown.ContextTrigger>

        {/* The menu content (shown on right-click) */}
        <Dropdown.Content>
          <Dropdown.Item value="option1" class="dropdown-item">
            <Dropdown.ItemLabel class="dropdown-item-label">Option 1</Dropdown.ItemLabel>
          </Dropdown.Item>
          <Dropdown.Item value="option2" class="dropdown-item">
            <Dropdown.ItemLabel class="dropdown-item-label">Option 2</Dropdown.ItemLabel>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
      {/*<div style="margin-top: 20px;">*/}
      {/*  {selectedItem.value !== null && <span>Selected item: {selectedItem.value}</span>}*/}
      {/*</div>*/}
    </div>
  );
});
