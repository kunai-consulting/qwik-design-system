import { $, component$, useSignal, useStyles$ } from "@qwik.dev/core";
import { Menu } from "@kunai-consulting/qwik";
import styles from "./menu-custom.css?inline";

export type MenuItemType = {
  id: string;
  label: string;
  value: string;
  closeOnSelect?: boolean;
  disabled?: boolean;
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
    value: "logout",
    disabled: true
  }
];

export default component$(() => {
  useStyles$(styles);
  const selectedItem = useSignal<string | undefined>(undefined);
  const open = useSignal(false);

  const handleChange = $((value: string) => {
    selectedItem.value = value;
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
              disabled={item.disabled}
            >
              <Menu.ItemLabel class="menu-item-label">{item.label}</Menu.ItemLabel>
            </Menu.Item>
          ))}
        </Menu.Content>
      </Menu.Root>
    </div>
  );
});
