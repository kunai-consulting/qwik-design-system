import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Menu } from "@kunai-consulting/qwik";
import styles from "./menu-custom.css?inline";
import { LuChevronRight } from "@qwikest/icons/lucide";

export type MenuItemType = {
  id: string;
  label: string;
  value?: string;
  closeOnSelect?: boolean;
  children?: MenuItemType[];
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
    children: [
      {
        id: "account",
        label: "Account",
        value: "account-settings"
      },
      {
        id: "security",
        label: "Security",
        value: "security-settings"
      },
      {
        id: "preferences",
        label: "Preferences",
        children: [
          {
            id: "notifications",
            label: "Notification Preferences",
            value: "notification-preferences"
          },
          {
            id: "theme",
            label: "Theme",
            value: "theme-settings"
          }
        ]
      }
    ]
  },
  {
    id: "help",
    label: "Help Center",
    children: [
      {
        id: "docs",
        label: "Documentation",
        value: "documentation"
      },
      {
        id: "contact",
        label: "Contact Support",
        value: "contact-support"
      }
    ]
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
  return (
    <div>
      {selectedItem.value !== undefined && (
        <span>Selected item: {selectedItem.value}</span>
      )}
      <Menu.Root bind:open={open}>
        <Menu.Trigger class="bg-qwik-blue-700 p-1">Options</Menu.Trigger>
        <Menu.Content>
          {menuData.map((item) =>
            renderMenuItem(
              item,
              $((value: string) => {
                if (value !== undefined) selectedItem.value = value;
              })
            )
          )}
        </Menu.Content>
      </Menu.Root>
    </div>
  );
});

function renderMenuItem(item: MenuItemType, onSelect: (value: string) => void) {
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
          {item.children.map((child) => renderMenuItem(child, onSelect))}
        </Menu.SubmenuContent>
      </Menu.Submenu>
    );
  }
  return (
    <Menu.Item
      key={item.id}
      value={item.value}
      onSelect$={() => onSelect(item.value as string)}
      class="menu-item"
      closeOnSelect={item.closeOnSelect}
    >
      <Menu.ItemLabel class="menu-item-label">{item.label}</Menu.ItemLabel>
    </Menu.Item>
  );
}
