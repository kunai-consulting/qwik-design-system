import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Dropdown } from "@kunai-consulting/qwik";
import styles from "./dropdown-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  const selectedItem = useSignal<string | null>(null);

  return (
    <div>
      <Dropdown.Root>
        <Dropdown.Trigger class="bg-qwik-blue-700 p-1">Open Menu</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item
            value="1"
            onSelect$={(value) => (selectedItem.value = value ?? null)}
            class="dropdown-item"
          >
            <Dropdown.ItemLabel class="dropdown-item-label">Item 1</Dropdown.ItemLabel>
          </Dropdown.Item>
          <Dropdown.Submenu>
            <Dropdown.SubmenuTrigger class="dropdown-item">
              Submenu
            </Dropdown.SubmenuTrigger>
            <Dropdown.SubmenuContent>
              <Dropdown.Item class="dropdown-item">
                <Dropdown.ItemLabel class="dropdown-item-label">
                  Submenu Item 1
                </Dropdown.ItemLabel>
              </Dropdown.Item>
              <Dropdown.Submenu>
                <Dropdown.SubmenuTrigger>Submenu 2</Dropdown.SubmenuTrigger>
                <Dropdown.SubmenuContent>
                  <Dropdown.Item class="dropdown-item">
                    <Dropdown.ItemLabel class="dropdown-item-label">
                      Submenu Item 1
                    </Dropdown.ItemLabel>
                  </Dropdown.Item>
                  <Dropdown.Submenu>
                    <Dropdown.SubmenuTrigger>Submenu 3</Dropdown.SubmenuTrigger>
                    <Dropdown.SubmenuContent>
                      <Dropdown.Item class="dropdown-item">
                        <Dropdown.ItemLabel class="dropdown-item-label">
                          Submenu Item 1
                        </Dropdown.ItemLabel>
                      </Dropdown.Item>
                      <Dropdown.Item class="dropdown-item">
                        <Dropdown.ItemLabel class="dropdown-item-label">
                          Submenu Item 2
                        </Dropdown.ItemLabel>
                      </Dropdown.Item>
                    </Dropdown.SubmenuContent>
                  </Dropdown.Submenu>
                </Dropdown.SubmenuContent>
              </Dropdown.Submenu>
            </Dropdown.SubmenuContent>
          </Dropdown.Submenu>
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

      <div style="margin-top: 20px;">
        {selectedItem.value !== null && <span>Selected item: {selectedItem.value}</span>}
      </div>
    </div>
  );
});
