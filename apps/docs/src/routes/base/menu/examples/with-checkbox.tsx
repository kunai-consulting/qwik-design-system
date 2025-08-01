import { Checkbox, Menu } from "@kunai-consulting/qwik";
import { $, component$, useSignal, useStyles$ } from "@qwik.dev/core";
import { LuCheck } from "@qwikest/icons/lucide";
import styles from "./menu-custom.css?inline";

export type MenuItemType = {
  id: string;
  label: string;
  value: string;
  closeOnSelect?: boolean;
};

const menuData: MenuItemType[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    value: "dashboard"
  },
  {
    id: "profile",
    label: "Profile",
    value: "profile"
  },
  {
    id: "settings",
    label: "Settings",
    value: "settings"
  },
  {
    id: "help",
    label: "Help Center",
    value: "help-center"
  },
  {
    id: "logout",
    label: "Log Out",
    value: "logout"
  }
];

export default component$(() => {
  useStyles$(styles);
  const selectedItem = useSignal<string | undefined>(undefined);
  const open = useSignal(false);
  const isChecked = useSignal(false);

  const handleChange = $((value: string) => {
    if (!value) {
      return;
    }

    selectedItem.value = value;
  });

  const handleCheckboxChange = $(() => {
    isChecked.value = !isChecked.value;
  });

  return (
    <div>
      {selectedItem.value !== undefined && (
        <span>Selected item: {selectedItem.value}</span>
      )}
      <Menu.Root bind:open={open} onChange$={handleChange}>
        <Menu.Trigger class="bg-qwik-blue-700 p-1">Options</Menu.Trigger>
        <Menu.Content>
          {menuData.map((item) => (
            <Menu.Item
              key={item.id}
              value={item.value}
              class="menu-item"
              closeOnSelect={item.closeOnSelect}
            >
              <Menu.ItemLabel class="menu-item-label">{item.label}</Menu.ItemLabel>
            </Menu.Item>
          ))}
          <Menu.Item
            asChild
            class="menu-item"
            closeOnSelect={false}
            onSelect$={handleCheckboxChange}
          >
            <Checkbox.Root bind:checked={isChecked}>
              <Checkbox.Trigger class="checkbox-trigger">
                <Checkbox.Indicator class="checkbox-indicator">
                  <LuCheck />
                </Checkbox.Indicator>
              </Checkbox.Trigger>
              <Checkbox.Label class="menu-item-label">Show All Options</Checkbox.Label>
            </Checkbox.Root>
          </Menu.Item>
        </Menu.Content>
      </Menu.Root>
    </div>
  );
});
