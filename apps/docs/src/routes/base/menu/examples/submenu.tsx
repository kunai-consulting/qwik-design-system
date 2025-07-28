import { $, component$, useSignal, useStyles$ } from "@qwik.dev/core";
import { Menu } from "@kunai-consulting/qwik";
import { LuChevronRight } from "@qwikest/icons/lucide";
import styles from "./menu-custom.css?inline";

// Menu data structure
export type MenuItemType = {
  id: string;
  label: string;
  value?: string;
  closeOnSelect?: boolean;
  children?: MenuItemType[];
};

const menuData: MenuItemType[] = [
  {
    id: "profile",
    label: "Profile",
    value: "profile"
  },
  {
    id: "settings",
    label: "Settings",
    children: [
      {
        id: "account",
        label: "Account Settings",
        value: "account-settings"
      },
      {
        id: "privacy",
        label: "Privacy Settings",
        value: "privacy-settings"
      },
      {
        id: "notifications",
        label: "Notification Preferences",
        value: "notification-preferences"
      }
    ]
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

  const handleChange = $((value: string) => {
    console.log("value", value);
    selectedItem.value = value;
  });

  return (
    <>
      {selectedItem.value !== null && <span>Selected item: {selectedItem.value}</span>}
      <div>
        <Menu.Root bind:open={open} onChange$={handleChange}>
          <Menu.Trigger class="bg-qwik-blue-700 p-1">Options</Menu.Trigger>
          <Menu.Content>{menuData.map((item) => renderMenuItem(item))}</Menu.Content>
        </Menu.Root>
      </div>
    </>
  );
});

function renderMenuItem(item: MenuItemType) {
  if (item.children && item.children.length > 0) {
    return (
      <Menu.Submenu key={item.id}>
        <Menu.SubmenuTrigger class="menu-item submenu-trigger">
          <Menu.ItemLabel class="menu-item-label">{item.label}</Menu.ItemLabel>
          <span>
            <LuChevronRight class="chevron" />
          </span>
        </Menu.SubmenuTrigger>
        <Menu.SubmenuContent>
          {item.children.map((child) => renderMenuItem(child))}
        </Menu.SubmenuContent>
      </Menu.Submenu>
    );
  }
  return (
    <Menu.Item
      key={item.id}
      value={item.value}
      class="menu-item"
      closeOnSelect={item.closeOnSelect}
    >
      <Menu.ItemLabel class="menu-item-label">{item.label}</Menu.ItemLabel>
    </Menu.Item>
  );
}
